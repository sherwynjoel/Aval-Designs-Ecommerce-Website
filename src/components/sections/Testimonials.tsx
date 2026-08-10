import Image from "next/image";
import { testimonials } from "@/lib/products";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-gold-deep"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z"
      />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-ivory-deep px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
          From Our Brides &amp; Guests
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col gap-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < t.rating} />
                ))}
              </div>
              <blockquote className="text-charcoal-ink leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-charcoal-ink">
                    {t.name}, {t.location}
                  </span>
                  <span className="text-xs text-charcoal-muted">{t.product}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
