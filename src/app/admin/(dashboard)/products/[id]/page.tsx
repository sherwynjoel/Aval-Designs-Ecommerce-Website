import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "@/actions/admin-products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const updateProduct = updateProductAction.bind(null, product.id);

  return (
    <div className="px-8 py-8">
      <Link href="/admin/products" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
        &larr; All Products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-charcoal-ink">{product.name}</h1>

      <div className="mt-8">
        <ProductForm
          action={updateProduct}
          submitLabel="Save Changes"
          initialValues={{
            name: product.name,
            slug: product.slug,
            category: product.category,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            images: JSON.parse(product.images),
            colors: JSON.parse(product.colors),
            sizes: JSON.parse(product.sizes),
            badges: JSON.parse(product.badges),
            customizable: product.customizable,
          }}
        />
      </div>
    </div>
  );
}
