"use client";

import { useActionState } from "react";
import { createCouponAction, type CouponFormState } from "@/actions/admin-coupons";

const field =
  "w-full border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none";
const label = "text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted";

export default function CouponForm() {
  const [state, formAction, pending] = useActionState(createCouponAction, {} as CouponFormState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className={label}>Code</label>
        <input id="code" name="code" required placeholder="FESTIVE10" className={`${field} uppercase`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="kind" className={label}>Type</label>
          <select id="kind" name="kind" className={field}>
            <option value="PERCENT">Percent off</option>
            <option value="FIXED">Fixed ₹ off</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="value" className={label}>Value</label>
          <input id="value" name="value" type="number" min={1} required placeholder="10" className={field} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="minSubtotal" className={label}>Minimum Order (₹, optional)</label>
        <input id="minSubtotal" name="minSubtotal" type="number" min={0} placeholder="0" className={field} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="usageLimit" className={label}>Usage Limit</label>
          <input id="usageLimit" name="usageLimit" type="number" min={1} placeholder="Unlimited" className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiresAt" className={label}>Expires</label>
          <input id="expiresAt" name="expiresAt" type="date" className={field} />
        </div>
      </div>

      {state.error && <p role="alert" className="text-sm text-rose-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso disabled:opacity-50 cursor-pointer"
      >
        {pending ? "Creating..." : "Create Coupon"}
      </button>
    </form>
  );
}
