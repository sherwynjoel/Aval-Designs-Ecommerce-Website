"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export type ProductFormState = {
  error?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseColors(value: string) {
  return value
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

type ParseResult =
  | { ok: true; data: ReturnType<typeof buildData> }
  | { ok: false; error: string };

function buildData(formData: FormData, price: number, originalPrice: number | null, sizes: Record<string, number>, slug: string) {
  const customizable = formData.get("customizable") === "on";
  const badges: string[] = [];
  for (const b of ["new", "bestseller", "limited", "sale"]) {
    if (formData.get(`badge_${b}`) === "on") badges.push(b);
  }
  if (customizable) badges.push("customizable");

  return {
    name: String(formData.get("name") ?? "").trim(),
    slug,
    category: String(formData.get("category") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price,
    originalPrice,
    images: JSON.stringify(parseLines(String(formData.get("images") ?? ""))),
    colors: JSON.stringify(parseColors(String(formData.get("colors") ?? ""))),
    sizes: JSON.stringify(sizes),
    badges: JSON.stringify(badges),
    customizable,
  };
}

function parseProductForm(formData: FormData): ParseResult {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Product name is required." };

  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = Number(priceRaw);
  if (!priceRaw || !Number.isInteger(price) || price < 0) {
    return { ok: false, error: "Price must be a whole number of rupees (0 or more)." };
  }

  const originalPriceRaw = String(formData.get("originalPrice") ?? "").trim();
  let originalPrice: number | null = null;
  if (originalPriceRaw) {
    originalPrice = Number(originalPriceRaw);
    if (!Number.isInteger(originalPrice) || originalPrice < 0) {
      return { ok: false, error: "Original price must be a whole number of rupees (0 or more)." };
    }
  }

  const sizes: Record<string, number> = {};
  for (const line of parseLines(String(formData.get("sizes") ?? ""))) {
    const [size, qtyRaw] = line.split(":").map((s) => s.trim());
    if (!size) continue;
    const qty = Number(qtyRaw);
    if (!Number.isInteger(qty) || qty < 0) {
      return {
        ok: false,
        error: `Stock for size "${size}" must be a whole number (0 or more).`,
      };
    }
    sizes[size] = qty;
  }

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { ok: false, error: "Could not derive a valid URL slug from the name." };

  return { ok: true, data: buildData(formData, price, originalPrice, sizes, slug) };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const existing = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: `A product with the slug "${parsed.data.slug}" already exists.` };
  }

  await db.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = parseProductForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const existing = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== productId) {
    return { error: `A product with the slug "${parsed.data.slug}" already exists.` };
  }

  await db.product.update({ where: { id: productId }, data: parsed.data });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
}
