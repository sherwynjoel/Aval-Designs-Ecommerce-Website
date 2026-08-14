import "server-only";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
} from "@/lib/auth-constants";
import {
  signAdminSessionToken,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from "@/lib/session-token";

export type AdminSession = AdminSessionPayload;

export async function createAdminSession(session: AdminSession) {
  const token = await signAdminSessionToken(session);

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
