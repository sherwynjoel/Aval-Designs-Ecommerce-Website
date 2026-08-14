"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { passwordTag } from "@/lib/session-token";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // Brute-force protection: 5 attempts / 15 min per email, 20 per IP.
  const ip = await clientIp();
  const windowMs = 15 * 60 * 1000;
  if (
    !rateLimit(`login:email:${email}`, { limit: 5, windowMs }) ||
    !rateLimit(`login:ip:${ip}`, { limit: 20, windowMs })
  ) {
    return { error: "Too many attempts. Please try again in 15 minutes." };
  }

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin) {
    console.warn(`[auth] failed admin login (unknown email) from ${ip}`);
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    console.warn(`[auth] failed admin login for ${email} from ${ip}`);
    return { error: "Invalid email or password." };
  }

  await createAdminSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    pwt: passwordTag(admin.passwordHash),
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export type ChangePasswordState = {
  error?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const { requireAdmin } = await import("@/lib/require-admin");
  const { hashPassword } = await import("@/lib/password");
  const session = await requireAdmin();

  const current = String(formData.get("current") ?? "");
  const next1 = String(formData.get("new1") ?? "");
  const next2 = String(formData.get("new2") ?? "");

  if (!current || !next1 || !next2) {
    return { error: "Fill in all three fields." };
  }
  if (next1 !== next2) {
    return { error: "New passwords don't match." };
  }
  if (next1.length < 10) {
    return { error: "New password must be at least 10 characters." };
  }
  if (next1 === current) {
    return { error: "New password must be different from the current one." };
  }

  const ip = await clientIp();
  if (!rateLimit(`pwchange:${session.adminId}`, { limit: 5, windowMs: 15 * 60 * 1000 })) {
    return { error: "Too many attempts. Please try again in 15 minutes." };
  }

  const admin = await db.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    console.warn(`[auth] failed password change for ${session.email} from ${ip}`);
    return { error: "Current password is incorrect." };
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(next1) },
  });

  // The password tag changed, so every existing session (this one included)
  // is now invalid. Clear the cookie and require a fresh sign-in.
  await destroyAdminSession();
  redirect("/admin/login?changed=1");
}
