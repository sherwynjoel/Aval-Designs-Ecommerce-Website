"use client";

import Link from "next/link";

const items = [
  {
    label: "Home",
    href: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 11.5 12 5l8 6.5M6 10v9h12v-9"
      />
    ),
  },
  {
    label: "Shop",
    href: "/shop",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />,
  },
  {
    label: "Search",
    href: "/search",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" strokeLinecap="round" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.5-4.6-10-9.2C.4 7.8 2 4 5.7 4c2 0 3.6 1.1 4.3 2.8C10.7 5.1 12.3 4 14.3 4 18 4 19.6 7.8 22 11.3 19.5 15.9 12 20.5 12 20.5z"
      />
    ),
  },
  {
    label: "Account",
    href: "/account",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" strokeLinecap="round" />
        <path d="M4 20c1.6-4 5-6 8-6s6.4 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-charcoal-line bg-ivory/95 backdrop-blur-sm py-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-1 px-2 py-1 text-charcoal-muted transition-colors hover:text-charcoal-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {item.icon}
          </svg>
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.08em]">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
