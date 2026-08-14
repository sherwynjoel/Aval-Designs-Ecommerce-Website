"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createCustomerSession,
  destroyCustomerSession,
} from "@/lib/customer-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type CustomerAuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function customerSignupAction(
  _prev: CustomerAuthState,
  formData: FormData
): Promise<CustomerAuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !phone || !password) {
    return { error: "Please fill in every field." };
  }
  if (!EMAIL_RE.test(email)) return { error: "That email doesn't look right." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const ip = await clientIp();
  if (!rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return { error: "Too many sign-ups from this connection. Try again later." };
  }

  const existing = await db.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return { error: "An account with this email already exists — sign in instead." };
  }

  const passwordHash = await hashPassword(password);
  const customer = existing
    ? // Guest who ordered before: claim the record (with its order history).
      await db.customer.update({
        where: { id: existing.id },
        data: { passwordHash, name, phone },
      })
    : await db.customer.create({
        data: { name, email, phone, city: "", passwordHash },
      });

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });
  redirect("/account");
}

export async function customerLoginAction(
  _prev: CustomerAuthState,
  formData: FormData
): Promise<CustomerAuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const ip = await clientIp();
  const windowMs = 15 * 60 * 1000;
  if (
    !rateLimit(`clogin:email:${email}`, { limit: 5, windowMs }) ||
    !rateLimit(`clogin:ip:${ip}`, { limit: 20, windowMs })
  ) {
    return { error: "Too many attempts. Please try again in 15 minutes." };
  }

  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash || !(await verifyPassword(password, customer.passwordHash))) {
    console.warn(`[auth] failed customer login for ${email} from ${ip}`);
    return { error: "Invalid email or password." };
  }

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });
  redirect("/account");
}

export async function customerLogoutAction() {
  await destroyCustomerSession();
  redirect("/account");
}
