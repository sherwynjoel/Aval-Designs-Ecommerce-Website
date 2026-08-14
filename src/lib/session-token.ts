import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_DURATION_SECONDS } from "@/lib/auth-constants";

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  name: string;
  // Tag derived from the password hash; changing the password rotates the
  // tag, which invalidates every previously issued session token.
  pwt: string;
};

export function passwordTag(passwordHash: string) {
  return passwordHash.slice(-16);
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

// Environment-agnostic (no next/headers): usable from Server Actions/Components and Proxy/Middleware alike.
export async function signAdminSessionToken(payload: AdminSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
      pwt: (payload.pwt as string) ?? "",
    };
  } catch {
    return null;
  }
}
