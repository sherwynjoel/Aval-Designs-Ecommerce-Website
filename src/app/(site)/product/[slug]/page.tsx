import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import ProductGallery from "@/components/product/ProductGallery";
import PurchasePanel from "@/components/product/PurchasePanel";
import ReviewsSection from "@/components/product/ReviewsSection";
import { getProductBySlug } from "@/lib/catalog";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const totalStock = Object.values(product.sizes).reduce((a, b) => a + b, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-[0.1em] text-charcoal-muted">
        <Link href="/shop" className="hover:text-charcoal-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-6 lg:max-w-md">
          <div className="flex flex-col gap-3">
            {product.badges.length > 0 && (
              <div className="flex gap-2">
                {product.badges.map((b) => (
                  <Badge key={b} kind={b} />
                ))}
              </div>
            )}
            <span className="text-xs uppercase tracking-[0.12em] text-charcoal-muted">
              {product.category}
            </span>
            <h1 className="font-display text-3xl font-medium text-charcoal-ink lg:text-4xl">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-xl text-charcoal-ink">{inr.format(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-charcoal-muted line-through">
                  {inr.format(product.originalPrice)}
                </span>
              )}
            </div>
            {totalStock <= 5 && totalStock > 0 && (
              <p className="text-sm text-rose-deep">
                Only {totalStock} left across all sizes.
              </p>
            )}
          </div>

          <p className="leading-relaxed text-charcoal-muted">{product.description}</p>

          <PurchasePanel
            slug={product.slug}
            name={product.name}
            image={product.image}
            price={product.price}
            colors={product.colors}
            sizes={product.sizes}
            customizable={product.customizable}
          />

          <div className="flex flex-col gap-2 border-t border-charcoal-line pt-5 text-sm text-charcoal-muted">
            <p>Dispatch in 2–3 weeks for made-to-order pieces.</p>
            <p>Complimentary alterations on all bridal orders.</p>
            <p>Easy returns within 7 days for ready-size pieces.</p>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} productSlug={product.slug} />
    </div>
  );
}
