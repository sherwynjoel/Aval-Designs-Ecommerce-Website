import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Our Story — Aval Designs",
  description:
    "Aval Designs is a bridal and occasion-wear atelier where every piece is made against your measurements, not an average.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] tracking-[0.18em] text-gold-deep">
            Our Story
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-charcoal-ink lg:text-5xl">
            Made against you, not an average.
          </h1>
          <p className="mt-6 leading-relaxed text-charcoal-muted">
            Aval Designs began with a simple frustration: the most important
            outfits of a woman&apos;s life are so often bought off a rack, sized
            to a chart that fits no one exactly. We believed occasion wear —
            especially bridal wear — deserved the opposite: a piece designed
            around one person, her measurements, her taste, her day.
          </p>
          <p className="mt-4 leading-relaxed text-charcoal-muted">
            Today our atelier combines hand embroidery and considered fabric
            sourcing with a fitting process you can complete from anywhere in
            India. Every hem is measured against you.
          </p>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden bg-beige-surface">
          <Image
            src="https://images.unsplash.com/photo-1605712776874-fc7dea449fe8?w=1200&q=80&auto=format&fit=crop"
            alt="Hands finishing embroidery on silk"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-ivory-deep px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            {
              title: "Craftsmanship",
              body: "Hand-placed embroidery, French seams, linings chosen for how they feel against skin — details you notice for years.",
            },
            {
              title: "Fabric First",
              body: "Silks and georgettes sourced for drape and photograph, not just how they look on a hanger.",
            },
            {
              title: "A Personal Atelier",
              body: "You work with the same team from first sketch to final fitting — never a ticket queue.",
            },
          ].map((v) => (
            <div key={v.title} className="flex flex-col gap-3">
              <h2 className="font-display text-xl text-charcoal-ink">{v.title}</h2>
              <p className="leading-relaxed text-charcoal-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-6 px-6 py-16 lg:px-12">
        <p className="flex-1 min-w-64 font-display text-2xl text-charcoal-ink">
          See what we&apos;re making this season.
        </p>
        <Button href="/shop">Shop Collection</Button>
      </section>
    </div>
  );
}
