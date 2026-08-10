import Link from "next/link";
import { db } from "@/lib/db";
import { OrderStatusBadge, PaymentStatusBadge, ORDER_STATUS_OPTIONS } from "@/components/admin/StatusBadge";

export const metadata = { title: "Orders — Aval Designs Admin" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "";
  const q = params.q?.trim() ?? "";

  const orders = await db.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { customer: { name: { contains: q } } },
              { customer: { email: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-medium text-charcoal-ink">Orders</h1>
      <p className="mt-1 text-sm text-charcoal-muted">{orders.length} orders</p>

      <form className="mt-6 flex flex-wrap items-end gap-4" method="get">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="q" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Order #, customer name or email"
            className="w-64 border-b border-charcoal-line bg-transparent px-1 py-2 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="border-b border-charcoal-line bg-transparent px-1 py-2 text-sm text-charcoal-ink focus:border-charcoal-ink focus:outline-none"
          >
            <option value="">All statuses</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso cursor-pointer"
        >
          Filter
        </button>
        {(status || q) && (
          <Link href="/admin/orders" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-charcoal-line/60 last:border-0 hover:bg-ivory-deep">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-charcoal-ink">{order.customer.name}</td>
                <td className="px-5 py-3 text-charcoal-muted">
                  {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-3 text-charcoal-muted">{order.items.length}</td>
                <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">{inr.format(order.total)}</td>
                <td className="px-5 py-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-charcoal-muted">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
