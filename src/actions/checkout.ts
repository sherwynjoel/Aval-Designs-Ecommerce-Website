"use server";

import { db } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type CheckoutItem = {
  slug: string;
  size: string;
  color: string;
  quantity: number;
};

export type CheckoutPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  measurementNotes?: string;
  items: CheckoutItem[];
};

export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

const FREE_SHIPPING_THRESHOLD = 15000;
const SHIPPING_CHARGE = 250;
const TAX_RATE = 0.05;

function randomOrderNumber() {
  return `AV-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function placeOrderAction(payload: CheckoutPayload): Promise<CheckoutResult> {
  // COD order spam protection: 5 orders per hour per IP.
  const ip = await clientIp();
  if (!rateLimit(`order:ip:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return {
      ok: false,
      error: "Too many orders from this connection — please try again later or contact us on WhatsApp.",
    };
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const phone = payload.phone?.trim();
  const address = payload.address?.trim();
  const city = payload.city?.trim();
  const state = payload.state?.trim();
  const pincode = payload.pincode?.trim();

  if (!name || !email || !phone || !address || !city || !state || !pincode) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }
  if (!/^\d{6}$/.test(pincode)) {
    return { ok: false, error: "Pincode should be 6 digits." };
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }
  for (const item of payload.items) {
    if (
      typeof item.slug !== "string" ||
      typeof item.size !== "string" ||
      typeof item.color !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 10
    ) {
      return { ok: false, error: "Something in your bag looks invalid — please re-add it." };
    }
  }

  // Load products fresh from the DB; never trust client-side prices.
  const slugs = [...new Set(payload.items.map((i) => i.slug))];
  const products = await db.product.findMany({
    where: { slug: { in: slugs }, status: "ACTIVE" },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  let subtotal = 0;
  const itemsData: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[] = [];
  const stockUpdates: { id: string; sizes: Record<string, number> }[] = [];

  for (const item of payload.items) {
    const product = bySlug.get(item.slug);
    if (!product) {
      return { ok: false, error: `A piece in your bag is no longer available.` };
    }
    const sizes = JSON.parse(product.sizes) as Record<string, number>;
    if (!(item.size in sizes)) {
      return { ok: false, error: `${product.name} isn't offered in size ${item.size}.` };
    }
    if (sizes[item.size] < item.quantity) {
      return {
        ok: false,
        error: `${product.name} (size ${item.size}) has only ${sizes[item.size]} left in stock.`,
      };
    }
    sizes[item.size] -= item.quantity;
    stockUpdates.push({ id: product.id, sizes });

    const total = product.price * item.quantity;
    subtotal += total;
    itemsData.push({
      productId: product.id,
      productName: product.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: product.price,
      total,
    });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const customer = await db.customer.upsert({
    where: { email },
    update: { name, phone, city },
    create: { name, email, phone, city },
  });

  // Retry on the rare random order-number collision.
  for (let attempt = 0; attempt < 3; attempt++) {
    const orderNumber = randomOrderNumber();
    try {
      await db.$transaction([
        db.order.create({
          data: {
            orderNumber,
            customerId: customer.id,
            status: "PROCESSING",
            paymentStatus: "PENDING",
            paymentMethod: "Cash on Delivery",
            subtotal,
            discount: 0,
            shipping,
            tax,
            total,
            shippingName: name,
            shippingPhone: phone,
            shippingAddress: address,
            shippingCity: city,
            shippingState: state,
            shippingPincode: pincode,
            customizationNotes: payload.measurementNotes?.trim().slice(0, 2000) || null,
            items: { create: itemsData },
          },
        }),
        ...stockUpdates.map((u) =>
          db.product.update({
            where: { id: u.id },
            data: { sizes: JSON.stringify(u.sizes) },
          })
        ),
      ]);
      return { ok: true, orderNumber };
    } catch (err) {
      const isUniqueCollision =
        err instanceof Error && err.message.includes("Unique constraint");
      if (!isUniqueCollision) throw err;
    }
  }
  return { ok: false, error: "Could not place the order — please try again." };
}
