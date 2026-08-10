import Image from "next/image";
import { instagramFeed } from "@/lib/products";

export default function InstagramGallery() {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
            @AvalDesigns
          </h2>
          <a
            href="#"
            className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal-muted transition-colors hover:text-rose-deep"
          >
            Follow Us on Instagram
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
          {instagramFeed.map((src, i) => (
            <a
              key={src}
              href="#"
              className="group relative aspect-square overflow-hidden bg-beige-surface"
            >
              <Image
                src={src}
                alt={`Aval Designs on Instagram, photo ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
