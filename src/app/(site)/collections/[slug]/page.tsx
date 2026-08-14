import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function CollectionRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { category: true },
    distinct: ["category"],
  });

  // Footer links use plural slugs ("bridal-lehengas"); categories are singular.
  const target = rows.find((r) => {
    const cat = slugify(r.category);
    return cat === slug || `${cat}s` === slug || cat === slug.replace(/s$/, "");
  });

  if (target) {
    redirect(`/shop?category=${encodeURIComponent(target.category)}`);
  }
  // Ambiguous slugs (e.g. "sarees" spans two categories) fall back to search.
  redirect(`/search?q=${encodeURIComponent(slug.replace(/-/g, " ").replace(/s$/, ""))}`);
}
