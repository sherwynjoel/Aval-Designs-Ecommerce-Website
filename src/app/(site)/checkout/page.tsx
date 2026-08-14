"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { readCart, cartSubtotal, CART_EVENT, type CartItem } from "@/lib/cart";
import { placeOrderAction } from "@/actions/checkout";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const FREE_SHIPPING_THRESHOLD = 15000;
const SHIPPING_CHARGE = 250;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, []);

  if (items === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-8 w-40 animate-pulse bg-beige-surface" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-20">
        <h1 className="font-display text-4xl font-medium text-charcoal-ink">Checkout</h1>
        <p className="text-charcoal-muted">Your bag is empty.</p>
        <Button href="/shop">Shop Collection</Button>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const result = await placeOrderAction({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      address: String(data.get("address") ?? ""),
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      pincode: String(data.get("pincode") ?? ""),
      measurementNotes: String(data.get("measurementNotes") ?? ""),
      items: items!.map((i) => ({
        slug: i.slug,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
    });

    if (result.ok) {
      window.localStorage.removeItem("aval_cart");
      window.dispatchEvent(new Event(CART_EVENT));
      router.push(`/order/${result.orderNumber}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const field =
    "w-full border-b border-charcoal-line bg-transparent px-1 py-3 text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none";
  const label = "text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted";

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-14 lg:px-12">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <section className="flex flex-col gap-5">
            <h2 className="font-display text-xl text-charcoal-ink">Contact</h2>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={label}>Full Name</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={label}>Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className={label}>Phone</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" className={field} />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="font-display text-xl text-charcoal-ink">Delivery Address</h2>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className={label}>Address</label>
              <input id="address" name="address" required autoComplete="street-address" className={field} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className={label}>City</label>
                <input id="city" name="city" required autoComplete="address-level2" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="state" className={label}>State</label>
                <input id="state" name="state" required autoComplete="address-level1" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pincode" className={label}>Pincode</label>
                <input id="pincode" name="pincode" required inputMode="numeric" pattern="\d{6}" className={field} />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl text-charcoal-ink">
              Measurements &amp; Notes{" "}
              <span className="text-sm font-normal text-charcoal-muted">(optional)</span>
            </h2>
            <textarea
              name="measurementNotes"
              rows={4}
              maxLength={2000}
              placeholder="For custom-fit pieces: bust, waist, hip, length — or anything our atelier should know. We'll confirm every measurement with you before stitching."
              className="border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl text-charcoal-ink">Payment</h2>
            <label className="flex items-center gap-3 border border-charcoal-ink px-4 py-3.5 text-sm text-charcoal-ink">
              <input type="radio" name="payment" value="cod" defaultChecked readOnly />
              Cash on Delivery
            </label>
            <p className="text-sm text-charcoal-muted">
              Online payment (UPI, cards) is coming soon — for now, pay when your
              piece arrives.
            </p>
          </section>

          {error && (
            <p role="alert" className="text-sm text-rose-deep">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-charcoal-ink px-11 py-[18px] text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-200 hover:bg-espresso disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Placing Order..." : `Place Order — ${inr.format(total)}`}
          </button>
        </form>

        <aside className="h-fit bg-ivory-deep p-6">
          <h2 className="text-sm font-medium text-charcoal-ink">Order Summary</h2>
          <div className="mt-4 flex flex-col divide-y divide-charcoal-line/60">
            {items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex justify-between gap-3 py-3 text-sm">
                <span className="text-charcoal-ink">
                  {item.name}
                  <span className="block text-xs text-charcoal-muted">
                    Size {item.size} · Qty {item.quantity}
                  </span>
                </span>
                <span className="tabular-nums text-charcoal-ink">{inr.format(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-charcoal-line pt-4 text-sm">
            <div className="flex justify-between text-charcoal-muted"><span>Subtotal</span><span className="tabular-nums">{inr.format(subtotal)}</span></div>
            <div className="flex justify-between text-charcoal-muted"><span>Shipping</span><span className="tabular-nums">{shipping === 0 ? "Free" : inr.format(shipping)}</span></div>
            <div className="flex justify-between text-charcoal-muted"><span>Tax (5%)</span><span className="tabular-nums">{inr.format(tax)}</span></div>
            <div className="flex justify-between pt-2 text-base font-medium text-charcoal-ink"><span>Total</span><span className="tabular-nums">{inr.format(total)}</span></div>
          </div>
          <Link href="/cart" className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink">
            &larr; Edit Bag
          </Link>
        </aside>
      </div>
    </div>
  );
}
