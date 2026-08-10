"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnnouncementBar from "./AnnouncementBar";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Custom Designs", href: "/custom-design" },
  { label: "About", href: "/about" },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" strokeLinecap="round" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" strokeLinecap="round" />
      <path d="M4 20c1.6-4 5-6 8-6s6.4 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.5-4.6-10-9.2C.4 7.8 2 4 5.7 4c2 0 3.6 1.1 4.3 2.8C10.7 5.1 12.3 4 14.3 4 18 4 19.6 7.8 22 11.3 19.5 15.9 12 20.5 12 20.5z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 13H7L6 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div
        className={`flex items-center justify-between bg-ivory/95 backdrop-blur-sm transition-[padding] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          scrolled ? "px-6 py-4 lg:px-12 lg:py-4" : "px-6 py-6 lg:px-12 lg:py-8"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo-dark.png" alt="" width={53} height={40} className="h-9 w-auto" priority />
          <span className="font-display text-lg font-semibold tracking-wide text-charcoal-ink">
            Aval Designs
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-transparent pb-1 text-xs font-medium uppercase tracking-[0.14em] text-charcoal-muted transition-colors duration-150 hover:border-gold hover:text-charcoal-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-charcoal-ink">
          <button type="button" aria-label="Search" className="hidden sm:inline-flex cursor-pointer hover:text-rose-deep transition-colors">
            <SearchIcon />
          </button>
          <Link href="/account" aria-label="Account" className="hidden sm:inline-flex hover:text-rose-deep transition-colors">
            <AccountIcon />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:inline-flex hover:text-rose-deep transition-colors">
            <HeartIcon />
          </Link>
          <Link href="/cart" aria-label="Cart" className="inline-flex hover:text-rose-deep transition-colors">
            <BagIcon />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden flex flex-col gap-1.5 cursor-pointer"
          >
            <span className={`h-px w-5 bg-charcoal-ink transition-transform duration-200 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-charcoal-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-5 bg-charcoal-ink transition-transform duration-200 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 top-0 bottom-0 z-30 bg-ivory transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-start justify-center gap-6 px-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl text-charcoal-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
