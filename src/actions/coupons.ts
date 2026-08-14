"use server";

import { db } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type CouponCheck =
  | { ok: true; code: string; kind: string; value: number; discount: number }
  | { ok: false; error: string };

export async function validateCoupon(
  codeRaw: string,
  subtotal: number
): Promise<CouponCheck> {
  const ip = await clientIp();
  if (!rateLimit(`coupon:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 })) {
    return { ok: false, error: "Too many attempts — try again shortly." };
  }

  const code = codeRaw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a coupon code." };

  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) {
    return { ok: false, error: "That coupon code isn't valid." };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { ok: false, error: "That coupon has expired." };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "That coupon has been fully redeemed." };
  }
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `This coupon needs a minimum order of ₹${coupon.minSubtotal.toLocaleString("en-IN")}.`,
    };
  }

  const discount =
    coupon.kind === "PERCENT"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return { ok: true, code, kind: coupon.kind, value: coupon.value, discount };
}
