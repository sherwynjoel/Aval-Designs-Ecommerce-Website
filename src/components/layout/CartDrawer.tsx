"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-espresso-deep/50 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-ivory shadow-modal-scrim transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal-line px-6 py-5">
          <h2 className="font-display text-xl text-charcoal-ink">Your Bag</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted hover:text-charcoal-ink cursor-pointer"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <p className="text-charcoal-muted">Your bag is waiting for something beautiful.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="flex flex-col divide-y divide-charcoal-line/60">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 py-5">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={onClose}
                      className="relative block aspect-[3/4] w-16 shrink-0 overflow-hidden bg-beige-surface"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={onClose}
                        className="truncate text-sm font-medium text-charcoal-ink hover:text-rose-deep"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-charcoal-muted">Size {item.size}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-charcoal-line">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setCartQuantity(item, item.quantity - 1)}
                            className="px-2.5 py-1 text-sm text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
                          >
                            −
                          </button>
                          <span className="min-w-7 text-center text-xs text-charcoal-ink">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setCartQuantity(item, item.quantity + 1)}
                            className="px-2.5 py-1 text-sm text-charcoal-ink hover:bg-ivory-deep cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm tabular-nums text-charcoal-ink">
                            {inr.format(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item)}
                            aria-label={`Remove ${item.name}`}
                            className="text-xs text-charcoal-muted hover:text-rose-deep cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-charcoal-line px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="font-medium tabular-nums text-charcoal-ink">
                  {inr.format(cartSubtotal(items))}
                </span>
              </div>
              <p className="mt-1 text-xs text-charcoal-muted">
                Shipping, taxes, and coupons at checkout.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex-1 border border-charcoal-ink py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-charcoal-ink hover:bg-charcoal-ink hover:text-ivory"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex-1 bg-charcoal-ink py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
