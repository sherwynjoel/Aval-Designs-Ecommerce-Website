import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/actions/admin-products";

export const metadata = { title: "Add Product — Aval Designs Admin" };

export default function NewProductPage() {
  return (
    <div className="px-8 py-8">
      <Link href="/admin/products" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
        &larr; All Products
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-charcoal-ink">Add Product</h1>

      <div className="mt-8">
        <ProductForm action={createProductAction} submitLabel="Create Product" />
      </div>
    </div>
  );
}
