"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
  readCart,
  removeFromCart,
  setCartQuantity,
  cartSubtotal,
  CART_EVENT,
  type CartItem,
} from "@/lib/cart";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (items === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-8 w-40 animate-pulse bg-beige-surface" />
        <div className="mt-8 h-28 animate-pulse bg-beige-surface" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-6 py-20">
        <h1 className="font-display text-4xl font-medium text-charcoal-ink">Your Bag</h1>
        <p className="text-charcoal-muted">
          Your bag is waiting for something beautiful.
        </p>
        <Button href="/shop">Shop Collection</Button>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Your Bag</h1>

      <div className="mt-8 flex flex-col divide-y divide-charcoal-line/60">
        {items.map((item) => (
          <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-5 py-6">
            <Link
              href={`/product/${item.slug}`}
              className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden bg-beige-surface"
            >
              <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium text-charcoal-ink hover:text-rose-deep"
              >
                {item.name}
              </Link>
              <span className="flex items-center gap-2 text-sm text-charcoal-muted">
                Size {item.size} ·{" "}
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-charcoal-line"
                  style={{ backgroundColor: item.color }}
                />
              </span>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center border border-charcoal-line">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setCartQuantity(item, item.quantity - 1)}
                    className="px-3 py-1.5 text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm text-charcoal-ink">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setCartQuantity(item, item.quantity + 1)}
                    className="px-3 py-1.5 text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="tabular-nums text-charcoal-ink">
                    {inr.format(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item)}
                    className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-rose-deep cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-charcoal-line pt-6">
        <div className="flex justify-between text-base">
          <span className="text-charcoal-muted">Subtotal</span>
          <span className="font-medium tabular-nums text-charcoal-ink">{inr.format(subtotal)}</span>
        </div>
        <p className="text-sm text-charcoal-muted">
          Shipping, taxes, and customization charges are calculated at checkout.
        </p>
        <div className="mt-3">
          <Button href="/checkout">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}
