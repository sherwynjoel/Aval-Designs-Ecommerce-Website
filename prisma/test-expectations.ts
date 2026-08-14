// Prints ground-truth numbers from the DB for test comparison. Not shipped code.
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const db = new PrismaClient({ adapter });

const ACTIVE = ["PROCESSING", "CUSTOMIZATION", "QUALITY_CHECK", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY"];

async function main() {
  const orders = await db.order.findMany({ select: { total: true, status: true, paymentStatus: true, createdAt: true } });
  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const products = await db.product.findMany({ select: { sizes: true, price: true, customizable: true, category: true, slug: true } });

  const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const out = {
    totalRevenue: inr(paid.reduce((s, o) => s + o.total, 0)),
    todaySales: inr(paid.filter((o) => { const d = new Date(o.createdAt); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); }).reduce((s, o) => s + o.total, 0)),
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => ACTIVE.includes(o.status)).length,
    customers: await db.customer.count(),
    lowStock: products.filter((p) => Object.values(JSON.parse(p.sizes) as Record<string, number>).some((q) => q <= 3)).length,
    deliveredOrders: orders.filter((o) => o.status === "DELIVERED").length,
    productsTotal: products.length,
    shopBridalLehenga: products.filter((p) => p.category === "Bridal Lehenga").length,
    shopXS: products.filter((p) => ((JSON.parse(p.sizes) as Record<string, number>)["XS"] ?? 0) > 0).length,
    shopUnder25k: products.filter((p) => p.price <= 25000).length,
    shopCustomizable: products.filter((p) => p.customizable).length,
    cheapestSlug: products.reduce((min, p) => (p.price < min.price ? p : min)).slug,
  };
  console.log(JSON.stringify(out, null, 2));
}

main().finally(() => db.$disconnect());
