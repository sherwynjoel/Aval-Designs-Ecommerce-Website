type BadgeKind = "new" | "bestseller" | "limited" | "sale" | "customizable";

const kindClasses: Record<BadgeKind, string> = {
  new: "bg-charcoal-ink text-ivory border border-charcoal-ink",
  bestseller: "bg-charcoal-ink text-ivory border border-charcoal-ink",
  limited: "bg-charcoal-ink text-ivory border border-charcoal-ink",
  sale: "bg-charcoal-ink text-ivory border border-charcoal-ink",
  customizable: "bg-ivory/90 text-rose-deep border border-rose-deep",
};

const labels: Record<BadgeKind, string> = {
  new: "New",
  bestseller: "Bestseller",
  limited: "Limited",
  sale: "Sale",
  customizable: "Customizable",
};

export default function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span
      className={`inline-block px-3 py-[6px] text-[0.65rem] font-medium uppercase tracking-[0.12em] ${kindClasses[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}
