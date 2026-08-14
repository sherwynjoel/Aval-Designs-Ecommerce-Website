"use client";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

const STORAGE_KEY = "aval_cart";
export const CART_EVENT = "aval-cart-changed";

function emitChange() {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

function keyOf(item: Pick<CartItem, "slug" | "size" | "color">) {
  return `${item.slug}__${item.size}__${item.color}`;
}

export function addToCart(item: CartItem) {
  const items = readCart();
  const existing = items.find((i) => keyOf(i) === keyOf(item));
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }
  writeCart(items);
}

export function removeFromCart(item: Pick<CartItem, "slug" | "size" | "color">) {
  writeCart(readCart().filter((i) => keyOf(i) !== keyOf(item)));
}

export function setCartQuantity(
  item: Pick<CartItem, "slug" | "size" | "color">,
  quantity: number
) {
  const items = readCart();
  const existing = items.find((i) => keyOf(i) === keyOf(item));
  if (!existing) return;
  existing.quantity = Math.max(1, quantity);
  writeCart(items);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
