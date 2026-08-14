import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  isOrderStatus,
} from "@/lib/order-status";

const orderStatusDots: Record<string, string> = {
  PROCESSING: "bg-charcoal-muted",
  CUSTOMIZATION: "bg-charcoal-muted",
  QUALITY_CHECK: "bg-charcoal-muted",
  PACKED: "bg-charcoal-muted",
  SHIPPED: "bg-gold-deep",
  OUT_FOR_DELIVERY: "bg-gold-deep",
  DELIVERED: "bg-[oklch(0.6_0.11_150)]",
  CANCELLED: "bg-rose-deep",
  RETURNED: "bg-rose-deep",
  REFUNDED: "bg-rose-deep",
};

const paymentStatusConfig: Record<string, { label: string; dot: string }> = {
  PAID: { label: "Paid", dot: "bg-[oklch(0.6_0.11_150)]" },
  PENDING: { label: "Pending", dot: "bg-gold-deep" },
  FAILED: { label: "Failed", dot: "bg-rose-deep" },
  REFUNDED: { label: "Refunded", dot: "bg-charcoal-muted" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const label = isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;
  const dot = orderStatusDots[status] ?? "bg-charcoal-muted";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-charcoal-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
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

export const ORDER_STATUS_OPTIONS = ORDER_STATUSES;
