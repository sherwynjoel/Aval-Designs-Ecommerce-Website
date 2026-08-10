import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Collections", href: "/collections" },
      { label: "Bridal Lehengas", href: "/collections/bridal-lehengas" },
      { label: "Sarees", href: "/collections/sarees" },
      { label: "Reception Gowns", href: "/collections/reception-gowns" },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Returns & Refunds", href: "/return-refund-policy" },
      { label: "FAQ", href: "/faq" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Custom Designs", href: "/custom-design" },
      { label: "Fashion Journal", href: "/blog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/return-refund-policy" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-ivory pb-6 lg:pb-0">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4 pr-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={53} height={40} className="h-10 w-auto" />
              <span className="font-display text-2xl font-semibold">Aval Designs</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ivory/65">
              Bridal and occasion wear made to your exact measurements, without
              sacrificing runway-level craftsmanship.
            </p>
            <div className="flex gap-4 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-xs font-medium uppercase tracking-[0.1em] text-ivory/70 transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-ivory/50">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ivory/80 transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Aval Designs. All rights reserved.</span>
          <span>Crafted with care, for your day.</span>
        </div>
      </div>
    </footer>
  );
}
