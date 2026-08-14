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
  // After a validation error the browser resets the form (React 19 form
  // actions), so re-fill from the echoed submission when present.
  const sv = state.values;
  const key = state.error ?? "initial";

  const field = "w-full border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none";
  const label = "text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted";

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="name">Name</label>
          <input key={key} id="name" name="name" required defaultValue={sv?.name ?? v?.name} className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="slug">Slug (optional, auto-generated from name)</label>
            <input key={key} id="slug" name="slug" defaultValue={sv?.slug ?? v?.slug} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="category">Category</label>
            <input key={key} id="category" name="category" required defaultValue={sv?.category ?? v?.category} className={field} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="description">Description</label>
          <textarea key={key} id="description" name="description" required rows={4} defaultValue={sv?.description ?? v?.description} className={field} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="price">Price (INR)</label>
            <input key={key} id="price" name="price" type="number" min={0} required defaultValue={sv?.price ?? v?.price} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="originalPrice">Original Price (optional, for Sale)</label>
            <input key={key} id="originalPrice" name="originalPrice" type="number" min={0} defaultValue={sv?.originalPrice ?? v?.originalPrice ?? ""} className={field} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="images">Image URLs (one per line)</label>
          <textarea
            key={key}
            id="images"
            name="images"
            rows={3}
            defaultValue={sv?.images ?? v?.images.join("\n")}
            placeholder="https://images.unsplash.com/photo-..."
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="colors">Colors (comma-separated hex codes)</label>
          <input key={key} id="colors" name="colors" defaultValue={sv?.colors ?? v?.colors.join(", ")} placeholder="#8a2432, #c9a24b" className={field} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="sizes">Sizes &amp; stock (one per line, &quot;Size: Quantity&quot;)</label>
          <textarea
            key={key}
            id="sizes"
            name="sizes"
            rows={4}
            defaultValue={
              sv?.sizes ??
              (v ? Object.entries(v.sizes).map(([s, q]) => `${s}: ${q}`).join("\n") : "S: 5\nM: 8\nL: 5")
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
                <input key={key} type="checkbox" name={`badge_${b}`} defaultChecked={sv ? sv[`badge_${b}`] === "on" : v?.badges.includes(b)} />
                {b}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-ivory p-5">
          <label className="flex items-center gap-2 text-sm text-charcoal-ink">
            <input key={key} type="checkbox" name="customizable" defaultChecked={sv ? sv.customizable === "on" : v?.customizable} />
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
