"use client";

export type WishlistItem = {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
};

const STORAGE_KEY = "aval_wishlist";
export const WISHLIST_EVENT = "aval-wishlist-changed";

export function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: WishlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function isWishlisted(slug: string) {
  return readWishlist().some((i) => i.slug === slug);
}

export function toggleWishlist(item: WishlistItem): boolean {
  const items = readWishlist();
  if (items.some((i) => i.slug === item.slug)) {
    write(items.filter((i) => i.slug !== item.slug));
    return false;
  }
  write([...items, item]);
  return true;
}

export function removeFromWishlist(slug: string) {
  write(readWishlist().filter((i) => i.slug !== slug));
}
