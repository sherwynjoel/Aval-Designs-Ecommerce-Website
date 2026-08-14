import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Button from "@/components/ui/Button";
import OrderTimeline from "@/components/admin/OrderTimeline";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const metadata = { title: "Your Order — Aval Designs" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const firstName = order.shippingName.split(" ")[0];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold-deep">
        Order Confirmed
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium text-charcoal-ink">
        Thank you, {firstName}.
      </h1>
      <p className="mt-4 leading-relaxed text-charcoal-muted">
        Your order <span className="font-medium text-charcoal-ink">{order.orderNumber}</span> is
        confirmed. We&apos;ve sent the details to your email, and our atelier
        team will reach out before stitching begins. Keep your order number to
        track progress any time.
      </p>

      <div className="mt-10 bg-ivory-deep p-6">
        <OrderTimeline status={order.status} />
      </div>

      <div className="mt-8 bg-ivory-deep p-6">
        <h2 className="text-sm font-medium text-charcoal-ink">Order Summary</h2>
        <div className="mt-3 flex flex-col divide-y divide-charcoal-line/60">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 py-3 text-sm">
              <span className="text-charcoal-ink">
                {item.productName}
                <span className="block text-xs text-charcoal-muted">
                  Size {item.size} · Qty {item.quantity}
                </span>
              </span>
              <span className="tabular-nums text-charcoal-ink">{inr.format(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-charcoal-line pt-4 text-sm">
          <div className="flex justify-between text-charcoal-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{inr.format(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal-muted">
            <span>Shipping</span>
            <span className="tabular-nums">{order.shipping === 0 ? "Free" : inr.format(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-charcoal-muted">
            <span>Tax</span>
            <span className="tabular-nums">{inr.format(order.tax)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium text-charcoal-ink">
            <span>Total ({order.paymentMethod})</span>
            <span className="tabular-nums">{inr.format(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-charcoal-muted">
          Delivering to {order.shippingCity}, {order.shippingState}.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/shop">Continue Shopping</Button>
        <Button href="/track-order" variant="secondary">Track Order</Button>
      </div>
    </div>
  );
}
