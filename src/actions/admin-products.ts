"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

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

function parseSizes(value: string) {
  const sizes: Record<string, number> = {};
  for (const line of parseLines(value)) {
    const [size, qty] = line.split(":").map((s) => s.trim());
    if (size) sizes[size] = Number(qty) || 0;
  }
  return sizes;
}

function parseColors(value: string) {
  return value
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

function buildProductData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const customizable = formData.get("customizable") === "on";
  const badges: string[] = [];
  for (const b of ["new", "bestseller", "limited", "sale"]) {
    if (formData.get(`badge_${b}`) === "on") badges.push(b);
  }
  if (customizable) badges.push("customizable");

  const originalPriceRaw = String(formData.get("originalPrice") ?? "").trim();

  return {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    category: String(formData.get("category") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    originalPrice: originalPriceRaw ? Number(originalPriceRaw) : null,
    images: JSON.stringify(parseLines(String(formData.get("images") ?? ""))),
    colors: JSON.stringify(parseColors(String(formData.get("colors") ?? ""))),
    sizes: JSON.stringify(parseSizes(String(formData.get("sizes") ?? ""))),
    badges: JSON.stringify(badges),
    customizable,
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const data = buildProductData(formData);
  await db.product.create({ data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();
  const data = buildProductData(formData);
  await db.product.update({ where: { id: productId }, data });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
}
