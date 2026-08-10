"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import Badge from "./Badge";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-beige-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0"
        />
        <Image
          src={product.hoverImage}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badges.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setWishlisted((w) => !w)}
          aria-pressed={wishlisted}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center bg-ivory/90 text-charcoal-ink transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={wishlisted ? "text-rose-deep" : "text-charcoal-ink"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.6-10-9.2C.4 7.8 2 4 5.7 4c2 0 3.6 1.1 4.3 2.8C10.7 5.1 12.3 4 14.3 4 18 4 19.6 7.8 22 11.3 19.5 15.9 12 20.5 12 20.5z"
            />
          </svg>
        </button>

        <button
          type="button"
          className="absolute inset-x-3 bottom-3 translate-y-3 bg-charcoal-ink py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory opacity-0 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
        >
          Quick Add
        </button>
      </div>

      <div className="flex flex-col gap-1.5 pt-4">
        <span className="text-xs uppercase tracking-[0.1em] text-charcoal-muted">
          {product.category}
        </span>
        <h3 className="font-medium text-charcoal-ink">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-charcoal-ink">{inr.format(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-charcoal-muted line-through">
              {inr.format(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((c) => (
            <span
              key={c}
              style={{ backgroundColor: c }}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-charcoal-line ring-offset-1 ring-offset-ivory"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
