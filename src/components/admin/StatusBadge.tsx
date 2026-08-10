const orderStatusConfig: Record<string, { label: string; dot: string }> = {
  PROCESSING: { label: "Processing", dot: "bg-charcoal-muted" },
  CUSTOMIZATION: { label: "Customization", dot: "bg-charcoal-muted" },
  QUALITY_CHECK: { label: "Quality Check", dot: "bg-charcoal-muted" },
  PACKED: { label: "Packed", dot: "bg-charcoal-muted" },
  SHIPPED: { label: "Shipped", dot: "bg-gold-deep" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", dot: "bg-gold-deep" },
  DELIVERED: { label: "Delivered", dot: "bg-[oklch(0.6_0.11_150)]" },
  CANCELLED: { label: "Cancelled", dot: "bg-rose-deep" },
  RETURNED: { label: "Returned", dot: "bg-rose-deep" },
  REFUNDED: { label: "Refunded", dot: "bg-rose-deep" },
};

const paymentStatusConfig: Record<string, { label: string; dot: string }> = {
  PAID: { label: "Paid", dot: "bg-[oklch(0.6_0.11_150)]" },
  PENDING: { label: "Pending", dot: "bg-gold-deep" },
  FAILED: { label: "Failed", dot: "bg-rose-deep" },
  REFUNDED: { label: "Refunded", dot: "bg-charcoal-muted" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusConfig[status] ?? { label: status, dot: "bg-charcoal-muted" };
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-charcoal-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentStatusConfig[status] ?? { label: status, dot: "bg-charcoal-muted" };
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-charcoal-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export const ORDER_STATUS_OPTIONS = Object.keys(orderStatusConfig);
