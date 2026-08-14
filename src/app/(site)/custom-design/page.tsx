import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Custom Designs — Aval Designs",
  description:
    "Create a piece made specifically for you — your fabric, your design, your exact measurements.",
};

const steps = [
  {
    title: "Share Your Vision",
    body: "Send us reference images, fabrics you love, or a piece from our collection you'd like reimagined — over WhatsApp or in a consultation call.",
  },
  {
    title: "Your Measurements",
    body: "We guide you through taking measurements at home on a video call, or you visit us for a fitting. Every measurement is confirmed before fabric is cut.",
  },
  {
    title: "Fabric & Detailing",
    body: "Choose silk, georgette, velvet, or organza; pick neckline, sleeves, embroidery, and border work. We send progress photos as your piece takes shape.",
  },
  {
    title: "Final Fitting & Delivery",
    body: "A finishing check against your measurements, complimentary alterations on bridal orders, and careful packaging to your door.",
  },
];

export default function CustomDesignPage() {
  return (
    <div>
      <section className="relative flex h-[50svh] min-h-[360px] items-center overflow-hidden bg-espresso">
        <Image
          src="https://images.unsplash.com/photo-1572470176170-98fa8abcb741?w=1800&q=80&auto=format&fit=crop"
          alt="Fabric and embroidery details in the atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12">
          <h1 className="max-w-xl font-display text-4xl font-medium leading-tight text-ivory lg:text-6xl">
            Your Style. Your Measurements. Your Design.
          </h1>
          <p className="mt-5 max-w-md text-ivory/80">
            Create a piece that&apos;s made specifically for you — from first
            sketch to final fitting.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12">
        <h2 className="font-display text-3xl font-medium text-charcoal-ink lg:text-4xl">
          How It Works
        </h2>
        <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="font-display text-xl text-gold-deep">{i + 1}</span>
              <h3 className="font-display text-xl text-charcoal-ink">{step.title}</h3>
              <p className="leading-relaxed text-charcoal-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center gap-5 bg-ivory-deep px-8 py-10">
          <div className="flex-1 min-w-64">
            <h3 className="font-display text-2xl text-charcoal-ink">
              Ready to begin?
            </h3>
            <p className="mt-2 max-w-md text-charcoal-muted">
              Start with a conversation — no commitment, just your ideas and our
              atelier team&apos;s honest advice.
            </p>
          </div>
          <Button href="https://wa.me/919000000000">Start on WhatsApp</Button>
        </div>
      </section>
    </div>
  );
}
