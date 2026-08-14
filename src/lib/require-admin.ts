import "server-only";
import { db } from "@/lib/db";
import { getAdminSession, type AdminSession } from "@/lib/auth";
import { passwordTag } from "@/lib/session-token";

/**
 * Strong check for server actions and layouts: the session must verify AND
 * its password tag must match the current hash in the database, so changing
 * the admin password immediately invalidates all previously issued sessions.
 */
export async function verifiedAdminSession(): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session) return null;

  const admin = await db.adminUser.findUnique({
    where: { id: session.adminId },
    select: { passwordHash: true },
  });
  if (!admin || passwordTag(admin.passwordHash) !== session.pwt) return null;

  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await verifiedAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}
