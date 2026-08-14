"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-2 text-sm text-charcoal-muted">
      <span className="hidden sm:inline text-xs font-medium uppercase tracking-[0.1em]">
        Sort
      </span>
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "featured") {
            params.delete("sort");
          } else {
            params.set("sort", e.target.value);
          }
          router.push(`/shop${params.size ? `?${params}` : ""}`);
        }}
        className="border-b border-charcoal-line bg-transparent py-1.5 pr-1 text-sm text-charcoal-ink focus:border-charcoal-ink focus:outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
