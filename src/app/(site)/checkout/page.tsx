import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Checkout — Aval Designs",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-24">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">
        Checkout
      </h1>
      <p className="leading-relaxed text-charcoal-muted">
        Online checkout is almost ready. Until then, we take orders personally —
        message us with your bag and measurements, and our atelier team will
        confirm your order, fabric, and delivery date directly.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button href="https://wa.me/919000000000">Order via WhatsApp</Button>
        <Button href="/cart" variant="secondary">
          Back to Bag
        </Button>
      </div>
    </div>
  );
}
