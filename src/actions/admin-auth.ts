"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

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
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
