export const ORDER_STATUSES = [
  "PROCESSING",
  "CUSTOMIZATION",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PROCESSING: "Processing",
  CUSTOMIZATION: "Customization",
  QUALITY_CHECK: "Quality Check",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};
