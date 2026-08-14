import Link from "next/link";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { customerLogoutAction } from "@/actions/customer-auth";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import AuthForms from "./AuthForms";

export const metadata = { title: "Account — Aval Designs" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AccountPage() {
  const session = await getCustomerSession();

  if (!session) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-16">
        <div>
          <h1 className="font-display text-4xl font-medium text-charcoal-ink">Your Account</h1>
          <p className="mt-3 text-charcoal-muted">
            Sign in to see your orders, or create an account in seconds.
          </p>
        </div>
        <AuthForms />
      </div>
    );
  }

  const customer = await db.customer.findUnique({
    where: { id: session.customerId },
    include: {
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
    },
  });

  if (!customer) {
    // Session references a deleted customer; show the signed-out view.
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-16">
        <h1 className="font-display text-4xl font-medium text-charcoal-ink">Your Account</h1>
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-medium text-charcoal-ink">
            Hello, {customer.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">{customer.email}</p>
          {customer.phone && <p className="text-sm text-charcoal-muted">{customer.phone}</p>}
        </div>
        <form action={customerLogoutAction}>
          <button
            type="submit"
            className="border border-charcoal-ink px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-charcoal-ink hover:bg-charcoal-ink hover:text-ivory cursor-pointer"
          >
            Sign Out
          </button>
        </form>
      </div>

      <h2 className="mt-12 font-display text-2xl text-charcoal-ink">Your Orders</h2>
      {customer.orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p className="text-charcoal-muted">No orders yet — your story with us starts here.</p>
          <Link
            href="/shop"
            className="bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso"
          >
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-charcoal-line/60">
          {customer.orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
              <div>
                <Link
                  href={`/order/${order.orderNumber}`}
                  className="font-medium text-charcoal-ink hover:text-rose-deep"
                >
                  {order.orderNumber}
                </Link>
                <p className="mt-0.5 text-sm text-charcoal-muted">
                  {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <OrderStatusBadge status={order.status} />
                <span className="tabular-nums text-charcoal-ink">{inr.format(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
