import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";
import {
  getDashboardStats,
  getSalesOverTime,
  getTopProducts,
  getLowStockProducts,
} from "@/lib/admin-data";

export const metadata = { title: "Dashboard — Aval Designs Admin" };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function AdminDashboardPage() {
  const [stats, sales, topProducts, lowStock] = await Promise.all([
    getDashboardStats(),
    getSalesOverTime(30),
    getTopProducts(5),
    getLowStockProducts(),
  ]);

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-medium text-charcoal-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal-muted">
        An overview of Aval Designs&apos; sales, orders, and inventory.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-px bg-charcoal-line lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Revenue" value={inr.format(stats.totalRevenue)} />
        <StatCard label="Today's Sales" value={inr.format(stats.todaySales)} />
        <StatCard label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard label="Pending Orders" value={String(stats.pendingOrders)} />
        <StatCard label="Customers" value={String(stats.totalCustomers)} />
        <StatCard
          label="Low Stock Products"
          value={String(stats.lowStockCount)}
          tone={stats.lowStockCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={sales} />
        </div>

        <div className="bg-ivory p-5">
          <h3 className="text-sm font-medium text-charcoal-ink">Top Products</h3>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name} className="border-b border-charcoal-line/60 last:border-0">
                  <td className="py-2.5 pr-2 text-charcoal-muted">{i + 1}</td>
                  <td className="py-2.5 pr-2 text-charcoal-ink">{p.name}</td>
                  <td className="py-2.5 text-right tabular-nums text-charcoal-ink">
                    {inr.format(p.revenue)}
                  </td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td className="py-4 text-charcoal-muted">No sales yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-6 bg-ivory p-5">
          <h3 className="text-sm font-medium text-charcoal-ink">Low Stock Alerts</h3>
          <p className="mt-1 text-xs text-charcoal-muted">
            3 units or fewer remaining in at least one size.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <Link href={`/admin/products/${p.id}`} className="text-charcoal-ink hover:text-rose-deep">
                  {p.name}
                </Link>
                <span className="text-charcoal-muted">
                  {p.lowSizes.map(([size, qty]) => `${size}: ${qty}`).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
