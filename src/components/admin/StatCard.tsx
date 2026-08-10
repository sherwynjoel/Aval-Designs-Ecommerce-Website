export default function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className="flex flex-col gap-2 bg-ivory p-5">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted">
        {label}
      </span>
      <span
        className={`text-2xl font-semibold ${
          tone === "warning" ? "text-rose-deep" : "text-charcoal-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
