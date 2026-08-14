"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/actions/admin-products";

type ProductFormValues = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  colors: string[];
  sizes: Record<string, number>;
  badges: string[];
  customizable: boolean;
};

export default function ProductForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initialValues?: ProductFormValues;
  submitLabel: string;
}) {
  const v = initialValues;
  const [state, formAction, pending] = useActionState(action, {} as ProductFormState);

  const field = "w-full border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none";
  const label = "text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted";

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={v?.name} className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="slug">Slug (optional, auto-generated from name)</label>
            <input id="slug" name="slug" defaultValue={v?.slug} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="category">Category</label>
            <input id="category" name="category" required defaultValue={v?.category} className={field} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="description">Description</label>
          <textarea id="description" name="description" required rows={4} defaultValue={v?.description} className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="price">Price (INR)</label>
            <input id="price" name="price" type="number" min={0} required defaultValue={v?.price} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="originalPrice">Original Price (optional, for Sale)</label>
            <input id="originalPrice" name="originalPrice" type="number" min={0} defaultValue={v?.originalPrice ?? ""} className={field} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="images">Image URLs (one per line)</label>
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={v?.images.join("\n")}
            placeholder="https://images.unsplash.com/photo-..."
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="colors">Colors (comma-separated hex codes)</label>
          <input id="colors" name="colors" defaultValue={v?.colors.join(", ")} placeholder="#8a2432, #c9a24b" className={field} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="sizes">Sizes &amp; stock (one per line, &quot;Size: Quantity&quot;)</label>
          <textarea
            id="sizes"
            name="sizes"
            rows={4}
            defaultValue={
              v ? Object.entries(v.sizes).map(([s, q]) => `${s}: ${q}`).join("\n") : "S: 5\nM: 8\nL: 5"
            }
            className={field}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-ivory p-5">
          <h3 className={label}>Badges</h3>
          <div className="mt-3 flex flex-col gap-2">
            {["new", "bestseller", "limited", "sale"].map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm text-charcoal-ink capitalize">
                <input type="checkbox" name={`badge_${b}`} defaultChecked={v?.badges.includes(b)} />
                {b}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-ivory p-5">
          <label className="flex items-center gap-2 text-sm text-charcoal-ink">
            <input type="checkbox" name="customizable" defaultChecked={v?.customizable} />
            Customizable (customer can request measurements/design)
          </label>
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-rose-deep">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-charcoal-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
