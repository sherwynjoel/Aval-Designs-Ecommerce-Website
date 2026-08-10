import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/products";

export default function ShopByCategory() {
  return (
    <section className="bg-ivory-deep px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
          Shop by Category
        </h2>
        <p className="mt-3 max-w-md text-charcoal-muted">
          Every category, tailored to your occasion and your fit.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-beige-surface"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-xl text-ivory">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
