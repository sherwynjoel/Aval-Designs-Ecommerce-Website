import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Account — Aval Designs" };

export default function AccountPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-20">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Your Account</h1>
      <p className="leading-relaxed text-charcoal-muted">
        Customer accounts — with order history, saved measurements, and saved
        addresses — are almost ready. Until then, you can track any order with
        its order number, and our team is one message away for anything else.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button href="/track-order">Track an Order</Button>
        <Button href="/contact" variant="secondary">Contact Us</Button>
      </div>
    </div>
  );
}
