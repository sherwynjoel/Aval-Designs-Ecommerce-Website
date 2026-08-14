"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackOrderPage() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 px-6 py-20">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">Track Your Order</h1>
      <p className="text-charcoal-muted">
        Enter the order number from your confirmation (it looks like AV-123456).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = value.trim().toUpperCase();
          if (trimmed) router.push(`/order/${trimmed}`);
        }}
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="order-number" className="sr-only">Order number</label>
        <input
          id="order-number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="AV-123456"
          required
          className="w-full border-b border-charcoal-line bg-transparent px-1 py-3 text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso cursor-pointer"
        >
          Track
        </button>
      </form>
    </div>
  );
}
