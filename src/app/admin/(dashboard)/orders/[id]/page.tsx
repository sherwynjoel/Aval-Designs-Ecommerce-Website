import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PaymentStatusBadge, ORDER_STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/admin/OrderTimeline";
import { updateOrderStatusAction, updateOrderNotesAction } from "@/actions/admin-orders";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });

  if (!order) notFound();

  const updateStatus = updateOrderStatusAction.bind(null, order.id);
  const updateNotes = updateOrderNotesAction.bind(null, order.id);

  return (
    <div className="px-8 py-8">
      <Link href="/admin/orders" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
        &larr; All Orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-charcoal-muted">
            Placed{" "}
            {order.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <div className="mt-8 bg-ivory p-6">
        <OrderTimeline status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="bg-ivory p-6">
            <h2 className="text-sm font-medium text-charcoal-ink">Items</h2>
            <div className="mt-4 flex flex-col divide-y divide-charcoal-line/60">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal-ink">{item.productName}</span>
                    <span className="tabular-nums text-charcoal-ink">{inr.format(item.total)}</span>
                  </div>
                  <span className="text-sm text-charcoal-muted">
                    Size {item.size} &middot; Color {item.color} &middot; Qty {item.quantity}
                  </span>
                  {item.customization && (
                    <div className="mt-2 bg-rose-pale/30 px-3 py-2 text-sm text-charcoal-ink">
                      <span className="text-xs font-medium uppercase tracking-[0.08em] text-rose-deep">
                        Customization
                      </span>
                      <p className="mt-1">{JSON.parse(item.customization).note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-1.5 border-t border-charcoal-line pt-4 text-sm">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">{inr.format(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-charcoal-muted">
                  <span>Discount</span>
                  <span className="tabular-nums">&minus;{inr.format(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-muted">
                <span>Shipping</span>
                <span className="tabular-nums">{order.shipping === 0 ? "Free" : inr.format(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Tax</span>
                <span className="tabular-nums">{inr.format(order.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-medium text-charcoal-ink">
                <span>Total</span>
                <span className="tabular-nums">{inr.format(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-ivory p-6">
            <h2 className="text-sm font-medium text-charcoal-ink">Shipping Address</h2>
            <div className="mt-3 text-sm text-charcoal-ink">
              <p>{order.shippingName}</p>
              <p className="text-charcoal-muted">{order.shippingPhone}</p>
              <p className="mt-2 text-charcoal-muted">
                {order.shippingAddress}
                <br />
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
              </p>
            </div>
            <div className="mt-4 border-t border-charcoal-line pt-4 text-sm">
              <span className="text-charcoal-muted">Payment method: </span>
              <span className="text-charcoal-ink">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-ivory p-6">
            <h2 className="text-sm font-medium text-charcoal-ink">Update Status</h2>
            <form action={updateStatus} className="mt-3 flex flex-col gap-3">
              <select
                name="status"
                defaultValue={order.status}
                className="border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink focus:border-charcoal-ink focus:outline-none"
              >
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <button
                type="submit"
                className="bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso cursor-pointer"
              >
                Save Status
              </button>
            </form>
          </div>

          <div className="bg-ivory p-6">
            <h2 className="text-sm font-medium text-charcoal-ink">Customer</h2>
            <div className="mt-3 text-sm">
              <Link href={`/admin/customers/${order.customer.id}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                {order.customer.name}
              </Link>
              <p className="mt-1 text-charcoal-muted">{order.customer.email}</p>
              <p className="text-charcoal-muted">{order.customer.phone}</p>
            </div>
          </div>

          <div className="bg-ivory p-6">
            <h2 className="text-sm font-medium text-charcoal-ink">Admin Notes</h2>
            <form action={updateNotes} className="mt-3 flex flex-col gap-3">
              <textarea
                name="adminNotes"
                defaultValue={order.adminNotes ?? ""}
                rows={4}
                placeholder="Internal notes, not visible to the customer"
                className="border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
              />
              <button
                type="submit"
                className="border border-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-charcoal-ink hover:bg-charcoal-ink hover:text-ivory cursor-pointer"
              >
                Save Notes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
