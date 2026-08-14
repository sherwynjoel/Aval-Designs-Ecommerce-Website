import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCard from "@/components/ui/ProductCard";
import FilterPanel, { type ShopFilterValues } from "@/components/shop/FilterPanel";
import SortSelect from "@/components/shop/SortSelect";
import MobileFilterSheet from "@/components/shop/MobileFilterSheet";
import { getCatalogProducts, getCatalogCategories, type CatalogFilters } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop — Aval Designs",
  description:
    "Shop bridal lehengas, sarees, gowns, and occasion wear — each piece available with custom tailoring to your exact measurements.",
};

const VALID_SORTS = ["featured", "newest", "price-asc", "price-desc"] as const;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    size?: string;
    maxPrice?: string;
    customizable?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const values: ShopFilterValues = {
    category: params.category ?? "",
    size: params.size ?? "",
    maxPrice: params.maxPrice ?? "",
    customizable: params.customizable === "1",
    sort: params.sort ?? "",
  };

  const sort = (VALID_SORTS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as CatalogFilters["sort"])
    : undefined;

  const [products, categories] = await Promise.all([
    getCatalogProducts({
      category: values.category || undefined,
      size: values.size || undefined,
      maxPrice: values.maxPrice ? Number(values.maxPrice) : undefined,
      customizable: values.customizable || undefined,
      sort,
    }),
    getCatalogCategories(),
  ]);

  const hasActiveFilters = Boolean(
    values.category || values.size || values.maxPrice || values.customizable
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
          Shop
        </h1>
        <p className="max-w-md text-charcoal-muted">
          Bridal and occasion wear, each piece available made to your exact
          measurements.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Suspense>
            <MobileFilterSheet>
              <FilterPanel
                categories={categories}
                values={values}
                hasActiveFilters={hasActiveFilters}
              />
            </MobileFilterSheet>
          </Suspense>
          <span className="text-sm text-charcoal-muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel
            categories={categories}
            values={values}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 xl:grid-cols-3 lg:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 py-16">
            <p className="font-display text-2xl text-charcoal-ink">
              Nothing matches those filters yet.
            </p>
            <p className="max-w-sm text-charcoal-muted">
              Try widening your selection — or tell us what you&apos;re looking
              for and we&apos;ll make it to measure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
