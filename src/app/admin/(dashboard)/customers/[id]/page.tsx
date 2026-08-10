import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="px-8 py-8">
      <Link href="/admin/customers" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
        &larr; All Customers
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal-ink">{customer.name}</h1>
          <p className="mt-1 text-sm text-charcoal-muted">{customer.email}</p>
          <p className="text-sm text-charcoal-muted">{customer.phone}</p>
          <p className="text-sm text-charcoal-muted">{customer.city}</p>
        </div>
        <div className="flex gap-8">
          <div>
            <span className="block text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">Orders</span>
            <span className="text-xl font-semibold text-charcoal-ink">{customer.orders.length}</span>
          </div>
          <div>
            <span className="block text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">Total Spent</span>
            <span className="text-xl font-semibold text-charcoal-ink">{inr.format(totalSpent)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.map((order) => (
              <tr key={order.id} className="border-b border-charcoal-line/60 last:border-0 hover:bg-ivory-deep">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-charcoal-muted">
                  {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">{inr.format(order.total)}</td>
                <td className="px-5 py-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
            {customer.orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-charcoal-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
