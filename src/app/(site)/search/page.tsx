import type { Metadata } from "next";
import ProductCard from "@/components/ui/ProductCard";
import { db } from "@/lib/db";
import { toCatalogProduct } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search — Aval Designs" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? (
        await db.product.findMany({
          where: {
            status: "ACTIVE",
            OR: [
              { name: { contains: query } },
              { category: { contains: query } },
              { description: { contains: query } },
            ],
          },
        })
      ).map(toCatalogProduct)
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Search</h1>

      <form method="get" action="/search" className="mt-8 flex max-w-md gap-3">
        <label htmlFor="q" className="sr-only">Search products</label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Try “silk”, “lehenga”, “gown”..."
          className="w-full border-b border-charcoal-line bg-transparent px-1 py-3 text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso cursor-pointer"
        >
          Search
        </button>
      </form>

      {query && (
        <p className="mt-8 text-charcoal-muted">
          {products.length} {products.length === 1 ? "result" : "results"} for
          &ldquo;{query}&rdquo;
        </p>
      )}

      {products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {query && products.length === 0 && (
        <p className="mt-4 max-w-sm text-charcoal-muted">
          Nothing found — try a different word, or browse the full collection in
          the shop.
        </p>
      )}
    </div>
  );
}
