// Catalog data changes as the admin edits products; refresh periodically.
export const revalidate = 300;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Collections — Aval Designs" };

export default async function CollectionsPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { category: true, images: true },
    orderBy: { createdAt: "asc" },
  });

  const collections = new Map<string, string>();
  for (const p of products) {
    if (!collections.has(p.category)) {
      const images = JSON.parse(p.images) as string[];
      if (images[0]) collections.set(p.category, images[0]);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
        Collections
      </h1>
      <p className="mt-3 max-w-md text-charcoal-muted">
        Every collection, tailored to your occasion and your fit.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {[...collections.entries()].map(([category, image]) => (
          <Link
            key={category}
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="group relative aspect-[3/4] overflow-hidden bg-beige-surface"
          >
            <Image
              src={image}
              alt={category}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/70 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-xl text-ivory">
              {category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
