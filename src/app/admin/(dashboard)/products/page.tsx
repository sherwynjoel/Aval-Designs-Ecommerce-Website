import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProductAction } from "@/actions/admin-products";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";

export const metadata = { title: "Products — Aval Designs Admin" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminProductsPage() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal-ink">Products</h1>
          <p className="mt-1 text-sm text-charcoal-muted">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto bg-ivory">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Price</th>
              <th className="px-5 py-3 font-medium text-right">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const images = JSON.parse(p.images) as string[];
              const sizes = JSON.parse(p.sizes) as Record<string, number>;
              const totalStock = Object.values(sizes).reduce((a, b) => a + b, 0);
              return (
                <tr key={p.id} className="border-b border-charcoal-line/60 last:border-0 hover:bg-ivory-deep">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {images[0] ? (
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden bg-beige-surface">
                          <Image src={images[0]} alt="" fill sizes="36px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-9 shrink-0 bg-beige-surface" />
                      )}
                      <Link href={`/admin/products/${p.id}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-charcoal-muted">{p.category}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">{inr.format(p.price)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums ${totalStock <= 3 ? "text-rose-deep" : "text-charcoal-ink"}`}>
                    {totalStock}
                  </td>
                  <td className="px-5 py-3 text-charcoal-muted">{p.status}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/products/${p.id}`} className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
                        Edit
                      </Link>
                      <form action={deleteProductAction.bind(null, p.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${p.name}"? This cannot be undone.`}
                          className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-rose-deep cursor-pointer"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-charcoal-muted">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
