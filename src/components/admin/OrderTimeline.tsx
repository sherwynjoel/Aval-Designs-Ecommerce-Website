const steps = [
  { key: "PROCESSING", label: "Processing" },
  { key: "CUSTOMIZATION", label: "Customization" },
  { key: "QUALITY_CHECK", label: "Quality Check" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

const terminalConfig: Record<string, string> = {
  CANCELLED: "This order was cancelled.",
  RETURNED: "This order was returned by the customer.",
  REFUNDED: "This order was refunded.",
};

export default function OrderTimeline({ status }: { status: string }) {
  if (terminalConfig[status]) {
    return (
      <div className="bg-rose-pale/40 px-4 py-3 text-sm text-rose-deep">
        {terminalConfig[status]}
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <ol className="flex flex-wrap gap-x-0 gap-y-4">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-2.5 w-2.5 rounded-full ${
                  done ? "bg-charcoal-ink" : "bg-charcoal-line"
                }`}
              />
              <span className={`text-xs ${done ? "text-charcoal-ink" : "text-charcoal-muted"} whitespace-nowrap`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`mx-2 h-px w-8 sm:w-12 ${done && i < currentIndex ? "bg-charcoal-ink" : "bg-charcoal-line"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
