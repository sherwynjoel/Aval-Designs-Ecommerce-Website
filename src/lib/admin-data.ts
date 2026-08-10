import "server-only";
import { db } from "@/lib/db";

const ACTIVE_STATUSES = [
  "PROCESSING",
  "CUSTOMIZATION",
  "QUALITY_CHECK",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
];

const LOW_STOCK_THRESHOLD = 3;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getDashboardStats() {
  const [orders, customerCount, products] = await Promise.all([
    db.order.findMany({
      select: { total: true, status: true, paymentStatus: true, createdAt: true },
    }),
    db.customer.count(),
    db.product.findMany({ select: { sizes: true } }),
  ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const today = startOfDay(new Date());
  const todaySales = paidOrders
    .filter((o) => startOfDay(o.createdAt).getTime() === today.getTime())
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  const lowStockCount = products.filter((p) => {
    const sizes = JSON.parse(p.sizes) as Record<string, number>;
    return Object.values(sizes).some((qty) => qty <= LOW_STOCK_THRESHOLD);
  }).length;

  return {
    totalRevenue,
    todaySales,
    totalOrders: orders.length,
    pendingOrders,
    totalCustomers: customerCount,
    lowStockCount,
  };
}

export async function getSalesOverTime(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "PAID" },
    select: { total: true, createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    const key = startOfDay(order.createdAt).toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + order.total);
  }

  return Array.from(buckets.entries()).map(([date, revenue]) => ({ date, revenue }));
}

export async function getTopProducts(limit = 5) {
  const items = await db.orderItem.findMany({
    select: { productName: true, quantity: true, total: true, productId: true },
  });

  const byProduct = new Map<string, { name: string; units: number; revenue: number }>();
  for (const item of items) {
    const key = item.productId ?? item.productName;
    const existing = byProduct.get(key) ?? { name: item.productName, units: 0, revenue: 0 };
    existing.units += item.quantity;
    existing.revenue += item.total;
    byProduct.set(key, existing);
  }

  return Array.from(byProduct.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getLowStockProducts() {
  const products = await db.product.findMany({
    select: { id: true, name: true, slug: true, sizes: true },
  });

  return products
    .map((p) => {
      const sizes = JSON.parse(p.sizes) as Record<string, number>;
      const lowSizes = Object.entries(sizes).filter(([, qty]) => qty <= LOW_STOCK_THRESHOLD);
      return { ...p, lowSizes };
    })
    .filter((p) => p.lowSizes.length > 0);
}
