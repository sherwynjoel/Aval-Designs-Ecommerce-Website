import "server-only";
import { getAdminSession, type AdminSession } from "@/lib/auth";

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}
