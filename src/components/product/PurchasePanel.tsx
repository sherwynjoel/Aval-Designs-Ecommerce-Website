"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "@/lib/toast";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const SIZE_CHART = [
  { size: "XS", bust: "32", waist: "26", hip: "35" },
  { size: "S", bust: "34", waist: "28", hip: "37" },
  { size: "M", bust: "36", waist: "30", hip: "39" },
  { size: "L", bust: "38", waist: "32", hip: "41" },
  { size: "XL", bust: "40", waist: "34", hip: "43" },
  { size: "XXL", bust: "42", waist: "36", hip: "45" },
];

export default function PurchasePanel({
  slug,
  name,
  image,
  price,
  colors,
  sizes,
  customizable,
}: {
  slug: string;
  name: string;
  image: string;
  price: number;
  colors: string[];
  sizes: Record<string, number>;
  customizable: boolean;
}) {
  const sizeNames = Object.keys(sizes);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeNames.length === 1 ? sizeNames[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleAdd() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({
      slug,
      name,
      image,
      price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setFeedback("Added to your bag.");
    toast({ message: `${name} added to your bag`, actionLabel: "View Bag", actionHref: "/cart" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
            Size{selectedSize ? ` — ${selectedSize}` : ""}
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted underline underline-offset-4 hover:text-charcoal-ink cursor-pointer"
          >
            View Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeNames.map((s) => {
            const inStock = sizes[s] > 0;
            const active = selectedSize === s;
            return (
              <button
                key={s}
                type="button"
                disabled={!inStock}
                onClick={() => {
                  setSelectedSize(s);
                  setSizeError(false);
                }}
                className={`min-w-12 border px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  active
                    ? "border-charcoal-ink bg-charcoal-ink text-ivory"
                    : inStock
                      ? "border-charcoal-line text-charcoal-ink hover:border-charcoal-ink"
                      : "cursor-not-allowed border-charcoal-line text-charcoal-line line-through"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {sizeError && (
          <p role="alert" className="mt-2 text-sm text-rose-deep">
            Please select a size first.
          </p>
        )}
      </div>

      {colors.length > 0 && (
        <div>
          <span className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
            Color
          </span>
          <div className="flex gap-2.5">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                aria-label={`Select color ${c}`}
                aria-pressed={selectedColor === c}
                style={{ backgroundColor: c }}
                className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-ivory transition-shadow cursor-pointer ${
                  selectedColor === c ? "ring-2 ring-charcoal-ink" : "ring-1 ring-charcoal-line"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
          Quantity
        </span>
        <div className="flex w-fit items-center border border-charcoal-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-2.5 text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm text-charcoal-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="px-4 py-2.5 text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {customizable && (
        <div className="bg-rose-pale/30 px-4 py-3.5 text-sm text-charcoal-ink">
          <span className="text-xs font-medium uppercase tracking-[0.1em] text-rose-deep">
            Need a custom fit?
          </span>
          <p className="mt-1">
            This piece can be tailored to your exact measurements — share them
            with us after ordering, or{" "}
            <Link href="/custom-design" className="underline underline-offset-2 hover:text-rose-deep">
              create a fully custom design
            </Link>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-charcoal-ink px-11 py-[18px] text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-200 hover:bg-espresso cursor-pointer"
        >
          Add to Bag — {inr.format(price * quantity)}
        </button>
        {feedback && (
          <p className="text-sm text-charcoal-ink">
            {feedback}{" "}
            <Link href="/cart" className="underline underline-offset-2 hover:text-rose-deep">
              View bag
            </Link>
          </p>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Size guide"
        className="m-auto w-full max-w-md bg-ivory p-8 shadow-modal-scrim backdrop:bg-espresso-deep/50"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-charcoal-ink">Size Guide</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted hover:text-charcoal-ink cursor-pointer"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-charcoal-muted">
          All measurements in inches. Between sizes? Choose the larger one, or
          go custom-fit.
        </p>
        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Bust</th>
              <th className="py-2 font-medium">Waist</th>
              <th className="py-2 font-medium">Hip</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.size} className="border-b border-charcoal-line/50 last:border-0">
                <td className="py-2 font-medium text-charcoal-ink">{row.size}</td>
                <td className="py-2 tabular-nums text-charcoal-ink">{row.bust}</td>
                <td className="py-2 tabular-nums text-charcoal-ink">{row.waist}</td>
                <td className="py-2 tabular-nums text-charcoal-ink">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </div>
  );
}
