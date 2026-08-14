"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso cursor-pointer"
    >
      Print / Save as PDF
    </button>
  );
}
