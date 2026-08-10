import Image from "next/image";

export default function EditorialBanner() {
  return (
    <section className="relative flex h-[70svh] min-h-[420px] items-center justify-center overflow-hidden bg-espresso-deep">
      <Image
        src="https://images.unsplash.com/photo-1605712776874-fc7dea449fe8?w=1800&q=80&auto=format&fit=crop"
        alt="Hands finishing hand embroidery on silk fabric"
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-espresso-deep/30" />
      <blockquote className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-3xl font-medium leading-snug text-ivory sm:text-4xl lg:text-5xl">
          &ldquo;Every stitch is placed by hand, and every hem is measured
          against you — not an average.&rdquo;
        </p>
        <span className="mt-6 inline-block text-xs font-medium uppercase tracking-[0.16em] text-gold">
          Our Craftsmanship
        </span>
      </blockquote>
    </section>
  );
}
