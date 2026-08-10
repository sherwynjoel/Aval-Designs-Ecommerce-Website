import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = { title: "Customers — Aval Designs Admin" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminCustomersPage() {
  const customers = await db.customer.findMany({
    include: { orders: { select: { total: true, paymentStatus: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = customers
    .map((c) => {
      const paid = c.orders.filter((o) => o.paymentStatus === "PAID");
      const totalSpent = paid.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = c.orders.reduce<Date | null>(
        (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
        null
      );
      return { ...c, orderCount: c.orders.length, totalSpent, lastOrder };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-medium text-charcoal-ink">Customers</h1>
      <p className="mt-1 text-sm text-charcoal-muted">{customers.length} customers</p>

      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">City</th>
              <th className="px-5 py-3 font-medium text-right">Orders</th>
              <th className="px-5 py-3 font-medium text-right">Total Spent</th>
              <th className="px-5 py-3 font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-charcoal-line/60 last:border-0 hover:bg-ivory-deep">
                <td className="px-5 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                    {c.name}
                  </Link>
                  <div className="text-xs text-charcoal-muted">{c.email}</div>
                </td>
                <td className="px-5 py-3 text-charcoal-muted">{c.city}</td>
                <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">{c.orderCount}</td>
                <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">{inr.format(c.totalSpent)}</td>
                <td className="px-5 py-3 text-charcoal-muted">
                  {c.lastOrder
                    ? c.lastOrder.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
