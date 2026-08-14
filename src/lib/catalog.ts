import "server-only";
import { db } from "@/lib/db";
import type { Product as CardProduct } from "@/lib/products";

export type CatalogFilters = {
  category?: string;
  size?: string;
  customizable?: boolean;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
};

export type CatalogProduct = CardProduct & {
  id: string;
  sizes: Record<string, number>;
  description: string;
  customizable: boolean;
};

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string;
  colors: string;
  sizes: string;
  badges: string;
  customizable: boolean;
};

export function toCatalogProduct(p: DbProduct): CatalogProduct {
  const images = JSON.parse(p.images) as string[];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    colors: JSON.parse(p.colors) as string[],
    badges: JSON.parse(p.badges) as CardProduct["badges"],
    image: images[0] ?? "",
    hoverImage: images[1] ?? images[0] ?? "",
    sizes: JSON.parse(p.sizes) as Record<string, number>,
    customizable: p.customizable,
  };
}

export async function getCatalogProducts(filters: CatalogFilters = {}) {
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.customizable ? { customizable: true } : {}),
      ...(filters.maxPrice ? { price: { lte: filters.maxPrice } } : {}),
    },
    orderBy:
      filters.sort === "newest"
        ? { createdAt: "desc" }
        : filters.sort === "price-asc"
          ? { price: "asc" }
          : filters.sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "asc" },
  });

  let result = products.map(toCatalogProduct);

  if (filters.size) {
    result = result.filter((p) => (p.sizes[filters.size!] ?? 0) > 0);
  }

  return result;
}

export async function getCatalogCategories() {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product || product.status !== "ACTIVE") return null;
  return { ...toCatalogProduct(product), images: JSON.parse(product.images) as string[] };
}
