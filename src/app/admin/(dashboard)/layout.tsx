import { redirect } from "next/navigation";
import { verifiedAdminSession } from "@/lib/require-admin";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifiedAdminSession();
  if (!session) {
    // Clears any stale-but-signed cookie to avoid a proxy redirect loop.
    redirect("/admin/session-expired");
  }

  return (
    <div className="flex min-h-svh bg-ivory-deep">
      <Sidebar adminName={session.name} />
      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
