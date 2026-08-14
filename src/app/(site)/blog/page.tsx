import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Fashion Journal — Aval Designs" };

export default function BlogPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-20">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Fashion Journal</h1>
      <p className="leading-relaxed text-charcoal-muted">
        Styling notes, fabric guides, and stories from the atelier are on their
        way. Until the journal opens, our newest work is the best place to
        start.
      </p>
      <Button href="/new-arrivals">See New Arrivals</Button>
    </div>
  );
}
