import { db } from "@/lib/db";
import { toggleCouponAction, deleteCouponAction } from "@/actions/admin-coupons";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import CouponForm from "./CouponForm";

export const metadata = { title: "Coupons — Aval Designs Admin" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-medium text-charcoal-ink">Coupons</h1>
      <p className="mt-1 text-sm text-charcoal-muted">{coupons.length} coupons</p>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto bg-ivory">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Discount</th>
                <th className="px-5 py-3 font-medium">Min Order</th>
                <th className="px-5 py-3 font-medium text-right">Used</th>
                <th className="px-5 py-3 font-medium">Expires</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-charcoal-line/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-charcoal-ink">{c.code}</td>
                  <td className="px-5 py-3 text-charcoal-ink">
                    {c.kind === "PERCENT" ? `${c.value}%` : inr.format(c.value)}
                  </td>
                  <td className="px-5 py-3 text-charcoal-muted">
                    {c.minSubtotal > 0 ? inr.format(c.minSubtotal) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-charcoal-ink">
                    {c.usedCount}{c.usageLimit !== null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-5 py-3 text-charcoal-muted">
                    {c.expiresAt
                      ? c.expiresAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={c.active ? "text-charcoal-ink" : "text-charcoal-muted"}>
                      {c.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-4">
                      <form action={toggleCouponAction.bind(null, c.id)}>
                        <button type="submit" className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-charcoal-ink cursor-pointer">
                          {c.active ? "Pause" : "Activate"}
                        </button>
                      </form>
                      <form action={deleteCouponAction.bind(null, c.id)}>
                        <ConfirmSubmitButton
                          confirmMessage={`Delete coupon ${c.code}?`}
                          className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted hover:text-rose-deep cursor-pointer"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-charcoal-muted">
                    No coupons yet — create your first on the right.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-fit bg-ivory p-6">
          <h2 className="text-sm font-medium text-charcoal-ink">New Coupon</h2>
          <div className="mt-4">
            <CouponForm />
          </div>
        </div>
      </div>
    </div>
  );
}
