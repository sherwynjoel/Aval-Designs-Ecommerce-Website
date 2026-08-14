"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/admin-auth";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4V4zm9 0h7v4h-7V4zm0 8h7v8h-7v-8zM4 15h7v5H4v-5z" />
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2" />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7l8-4 8 4-8 4-8-4zm0 0v10l8 4m0-10v10m8-14v10l-8 4"
      />
    ),
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" strokeLinecap="round" />
        <path d="M3 20c1.2-3.4 3.8-5 6-5s4.8 1.6 6 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 5.2a3.2 3.2 0 0 1 0 6.2M17 20c-.5-2-1.6-3.6-3-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col overflow-y-auto bg-espresso text-ivory">
      <div className="px-6 py-8">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={53} height={40} className="h-7 w-auto" />
          <span className="font-display text-lg font-semibold">Aval Designs</span>
        </Link>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-ivory/50">
          Admin
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-ivory/10 text-ivory"
                  : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ivory/10 px-6 py-5">
        <p className="truncate text-sm text-ivory/80">{adminName}</p>
        <Link
          href="/admin/settings"
          className="mt-1 block text-xs font-medium uppercase tracking-[0.12em] text-ivory/50 transition-colors hover:text-ivory"
        >
          Settings
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-ivory/50 transition-colors hover:text-ivory cursor-pointer"
          >
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
