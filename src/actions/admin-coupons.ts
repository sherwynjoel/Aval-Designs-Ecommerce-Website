"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export type CouponFormState = { error?: string };

export async function createCouponAction(
  _prev: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  await requireAdmin();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const kind = String(formData.get("kind") ?? "PERCENT");
  const value = Number(formData.get("value"));
  const minSubtotal = Number(formData.get("minSubtotal") || 0);
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!/^[A-Z0-9-]{3,24}$/.test(code)) {
    return { error: "Code must be 3–24 letters, numbers, or dashes." };
  }
  if (kind !== "PERCENT" && kind !== "FIXED") return { error: "Pick a discount type." };
  if (!Number.isInteger(value) || value < 1 || (kind === "PERCENT" && value > 100)) {
    return { error: kind === "PERCENT" ? "Percent must be 1–100." : "Amount must be a positive whole number." };
  }
  if (!Number.isInteger(minSubtotal) || minSubtotal < 0) {
    return { error: "Minimum order must be 0 or more." };
  }
  const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;
  if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 1)) {
    return { error: "Usage limit must be a positive whole number, or blank for unlimited." };
  }
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return { error: "Expiry date is invalid." };
  }

  if (await db.coupon.findUnique({ where: { code } })) {
    return { error: `Coupon "${code}" already exists.` };
  }

  await db.coupon.create({
    data: { code, kind, value, minSubtotal, usageLimit, expiresAt },
  });
  revalidatePath("/admin/coupons");
  return {};
}

export async function toggleCouponAction(id: string) {
  await requireAdmin();
  const c = await db.coupon.findUnique({ where: { id } });
  if (c) {
    await db.coupon.update({ where: { id }, data: { active: !c.active } });
    revalidatePath("/admin/coupons");
  }
}

export async function deleteCouponAction(id: string) {
  await requireAdmin();
  await db.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
