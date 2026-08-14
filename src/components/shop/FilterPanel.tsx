import Link from "next/link";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const PRICE_STEPS = [
  { value: "15000", label: "Under ₹15,000" },
  { value: "25000", label: "Under ₹25,000" },
  { value: "35000", label: "Under ₹35,000" },
  { value: "50000", label: "Under ₹50,000" },
];

export type ShopFilterValues = {
  category: string;
  size: string;
  maxPrice: string;
  customizable: boolean;
  sort: string;
};

export default function FilterPanel({
  categories,
  values,
  hasActiveFilters,
}: {
  categories: string[];
  values: ShopFilterValues;
  hasActiveFilters: boolean;
}) {
  const legend = "text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted";
  const option = "flex items-center gap-2.5 text-sm text-charcoal-ink cursor-pointer";

  return (
    <form method="get" action="/shop" className="flex flex-col gap-8">
      {/* keep current sort when applying filters */}
      {values.sort && <input type="hidden" name="sort" value={values.sort} />}

      <fieldset className="flex flex-col gap-3">
        <legend className={`${legend} mb-3`}>Category</legend>
        <label className={option}>
          <input type="radio" name="category" value="" defaultChecked={!values.category} />
          All
        </label>
        {categories.map((c) => (
          <label key={c} className={option}>
            <input type="radio" name="category" value={c} defaultChecked={values.category === c} />
            {c}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${legend} mb-3`}>Size</legend>
        <label className={option}>
          <input type="radio" name="size" value="" defaultChecked={!values.size} />
          Any
        </label>
        {SIZES.map((s) => (
          <label key={s} className={option}>
            <input type="radio" name="size" value={s} defaultChecked={values.size === s} />
            {s}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${legend} mb-3`}>Price</legend>
        <label className={option}>
          <input type="radio" name="maxPrice" value="" defaultChecked={!values.maxPrice} />
          Any
        </label>
        {PRICE_STEPS.map((p) => (
          <label key={p.value} className={option}>
            <input
              type="radio"
              name="maxPrice"
              value={p.value}
              defaultChecked={values.maxPrice === p.value}
            />
            {p.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${legend} mb-3`}>Tailoring</legend>
        <label className={option}>
          <input type="checkbox" name="customizable" value="1" defaultChecked={values.customizable} />
          Customizable only
        </label>
      </fieldset>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-200 hover:bg-espresso cursor-pointer"
        >
          Apply
        </button>
        {hasActiveFilters && (
          <Link
            href="/shop"
            className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted hover:text-charcoal-ink"
          >
            Clear All
          </Link>
        )}
      </div>
    </form>
  );
}
