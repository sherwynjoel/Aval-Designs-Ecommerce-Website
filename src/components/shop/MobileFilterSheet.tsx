"use client";

import { useEffect, useState } from "react";

export default function MobileFilterSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-charcoal-ink px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-charcoal-ink cursor-pointer"
      >
        Filters
      </button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-espresso-deep/50 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        // Filter submission and "Clear All" both navigate; close the sheet as they fire.
        onSubmit={() => setOpen(false)}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto bg-ivory px-6 pb-10 pt-5 shadow-modal-scrim transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal-ink">Filters</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted cursor-pointer"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
