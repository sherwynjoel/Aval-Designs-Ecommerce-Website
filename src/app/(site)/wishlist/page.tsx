"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
  readWishlist,
  removeFromWishlist,
  WISHLIST_EVENT,
  type WishlistItem,
} from "@/lib/wishlist";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(readWishlist());
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, []);

  if (items === null) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="h-8 w-40 animate-pulse bg-beige-surface" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-20">
        <h1 className="font-display text-4xl font-medium text-charcoal-ink">Wishlist</h1>
        <p className="text-charcoal-muted">Your wishlist is waiting for something beautiful.</p>
        <Button href="/shop">Shop Collection</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-14 lg:px-12">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Wishlist</h1>
      <p className="mt-2 text-charcoal-muted">{items.length} saved {items.length === 1 ? "piece" : "pieces"}</p>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.slug} className="group">
            <Link href={`/product/${item.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-beige-surface">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-col gap-1 pt-3">
              <span className="text-xs uppercase tracking-[0.1em] text-charcoal-muted">{item.category}</span>
              <Link href={`/product/${item.slug}`} className="font-medium text-charcoal-ink hover:text-rose-deep">
                {item.name}
              </Link>
              <span className="text-charcoal-ink">{inr.format(item.price)}</span>
              <button
                type="button"
                onClick={() => removeFromWishlist(item.slug)}
                className="mt-1 w-fit text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-rose-deep cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
