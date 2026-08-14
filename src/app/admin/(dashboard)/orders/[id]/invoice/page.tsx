import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PrintButton from "./PrintButton";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const metadata = { title: "Invoice — Aval Designs Admin" };

export default async function InvoicePage({
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

  return (
    <div className="min-h-svh bg-ivory px-8 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/admin/orders/${order.id}`}
            className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink"
          >
            &larr; Back to Order
          </Link>
          <PrintButton />
        </div>

        <div className="border border-charcoal-line bg-white p-10 print:border-0 print:p-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-charcoal-ink">
                Aval Designs
              </h1>
              <p className="mt-1 text-sm text-charcoal-muted">
                Bridal &amp; Occasion Wear · hello@avaldesigns.in
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
                Invoice
              </p>
              <p className="mt-1 font-medium text-charcoal-ink">{order.orderNumber}</p>
              <p className="text-charcoal-muted">
                {order.createdAt.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">
                Billed To
              </p>
              <p className="mt-1.5 font-medium text-charcoal-ink">{order.customer.name}</p>
              <p className="text-charcoal-muted">{order.customer.email}</p>
              <p className="text-charcoal-muted">{order.shippingPhone}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">
                Ship To
              </p>
              <p className="mt-1.5 whitespace-pre-line text-charcoal-muted">
                {order.shippingName}
                {"\n"}
                {order.shippingAddress}
                {"\n"}
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
              </p>
            </div>
          </div>

          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
                <th className="py-2.5 pr-3 font-medium">Item</th>
                <th className="py-2.5 pr-3 font-medium">Size</th>
                <th className="py-2.5 pr-3 text-right font-medium">Qty</th>
                <th className="py-2.5 pr-3 text-right font-medium">Unit Price</th>
                <th className="py-2.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-charcoal-line/50">
                  <td className="py-3 pr-3 text-charcoal-ink">{item.productName}</td>
                  <td className="py-3 pr-3 text-charcoal-muted">{item.size}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-charcoal-ink">{item.quantity}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-charcoal-ink">{inr.format(item.unitPrice)}</td>
                  <td className="py-3 text-right tabular-nums text-charcoal-ink">{inr.format(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 ml-auto flex max-w-60 flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-charcoal-muted">
              <span>Subtotal</span><span className="tabular-nums">{inr.format(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Discount</span><span className="tabular-nums">&minus;{inr.format(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-muted">
              <span>Shipping</span><span className="tabular-nums">{order.shipping === 0 ? "Free" : inr.format(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Tax</span><span className="tabular-nums">{inr.format(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal-line pt-2 text-base font-semibold text-charcoal-ink">
              <span>Total</span><span className="tabular-nums">{inr.format(order.total)}</span>
            </div>
            <p className="mt-1 text-xs text-charcoal-muted">
              {order.paymentMethod} · Payment {order.paymentStatus.toLowerCase()}
            </p>
          </div>

          <p className="mt-10 border-t border-charcoal-line pt-5 text-xs text-charcoal-muted">
            Thank you for choosing Aval Designs. Complimentary alterations on all
            bridal orders — contact hello@avaldesigns.in with your order number.
          </p>
        </div>
      </div>
    </div>
  );
}
