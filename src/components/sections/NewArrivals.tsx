import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { getCatalogProducts } from "@/lib/catalog";

export default async function NewArrivals() {
  const products = (await getCatalogProducts({ sort: "newest" })).slice(0, 6);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
            New Arrivals
          </h2>
          <p className="mt-3 max-w-md text-charcoal-muted">
            Discover the latest pieces from our newest bridal and occasion
            collection.
          </p>
        </div>
        <Button href="/shop?sort=newest" variant="secondary" className="shrink-0">
          View All
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
