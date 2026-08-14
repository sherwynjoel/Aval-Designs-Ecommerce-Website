// Catalog data changes as the admin edits products; refresh periodically.
export const revalidate = 300;

import type { Metadata } from "next";
import ProductCard from "@/components/ui/ProductCard";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Best Sellers — Aval Designs" };

export default async function BestSellersPage() {
  const products = (await getCatalogProducts()).filter((p) =>
    p.badges.includes("bestseller")
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
        Best Sellers
      </h1>
      <p className="mt-3 max-w-md text-charcoal-muted">
        The pieces our brides come back for — most-loved, most-ordered.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-8">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
