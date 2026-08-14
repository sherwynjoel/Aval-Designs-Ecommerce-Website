import { chromium } from "playwright";

const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push(`PASS  ${name}`);
  } catch (e) {
    results.push(`FAIL  ${name}: ${String(e).split("\n")[0]}`);
  }
}
const eq = (a, b, msg) => {
  if (a !== b) throw new Error(`${msg ?? "expected"} ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
};

const B = "http://localhost:3000";
// Credentials come from .env (never hardcoded in the repo).
import { readFileSync } from "node:fs";
const env = Object.fromEntries(
  readFileSync(new URL("../../.env", import.meta.url), "utf8")
    .split("
")
    .map((l) => l.match(/^([A-Z_]+)="?([^"]*)"?/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]])
);
const EMAIL = env.ADMIN_SEED_EMAIL;
const PASS = env.ADMIN_SEED_PASSWORD;

// DB ground truth (from prisma/test-expectations.ts)
const GT = {
  totalRevenue: "₹9,05,792",
  todaySales: "₹0",
  totalOrders: "28",
  pendingOrders: "15",
  customers: "12",
  lowStock: "7",
  deliveredOrders: 10,
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));

// ---------- AUTH ----------
await test("auth: wrong password shows error, no session", async () => {
  await page.goto(`${B}/admin/login`, { waitUntil: "networkidle" });
  await page.fill("#email", EMAIL);
  await page.fill("#password", "wrong-password-123");
  await page.click('button:has-text("Sign In")');
  await page.waitForSelector('p[role="alert"]', { timeout: 10000 });
  const err = await page.locator('p[role="alert"]').textContent();
  if (!err?.includes("Invalid")) throw new Error(`unexpected: ${err}`);
});
await test("auth: unknown email shows same generic error", async () => {
  await page.fill("#email", "nobody@example.com");
  await page.fill("#password", "whatever123");
  await page.click('button:has-text("Sign In")');
  await page.waitForSelector('p[role="alert"]');
  const err = await page.locator('p[role="alert"]').textContent();
  if (!err?.includes("Invalid")) throw new Error(`unexpected: ${err}`);
});
await test("auth: next-param deep link works after login", async () => {
  await page.goto(`${B}/admin/orders`, { waitUntil: "networkidle" }); // -> login?next=/admin/orders
  if (!page.url().includes("next=")) throw new Error("no next param on redirect");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASS);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL("**/admin/orders", { timeout: 10000 });
});
await test("auth: session cookie is httpOnly + lax", async () => {
  const cookies = await ctx.cookies();
  const c = cookies.find((c) => c.name === "aval_admin_session");
  if (!c) throw new Error("cookie missing");
  eq(c.httpOnly, true, "httpOnly");
  eq(c.sameSite, "Lax", "sameSite");
});
await test("auth: /admin/login redirects to /admin when already signed in", async () => {
  await page.goto(`${B}/admin/login`, { waitUntil: "networkidle" });
  if (!page.url().endsWith("/admin")) throw new Error(`still on ${page.url()}`);
});

// ---------- DASHBOARD vs DB ----------
await test("dashboard: all six stats match the database exactly", async () => {
  await page.goto(`${B}/admin`, { waitUntil: "networkidle" });
  const stat = async (label) =>
    (await page.locator(`div:has(> span:text-is("${label}")) > span:nth-child(2)`).textContent()).trim();
  eq(await stat("Total Revenue"), GT.totalRevenue, "revenue");
  eq(await stat("Today's Sales"), GT.todaySales, "today");
  eq(await stat("Total Orders"), GT.totalOrders, "orders");
  eq(await stat("Pending Orders"), GT.pendingOrders, "pending");
  eq(await stat("Customers"), GT.customers, "customers");
  eq(await stat("Low Stock Products"), GT.lowStock, "low stock");
});
await test("dashboard: sales chart renders with table toggle", async () => {
  await page.click('button:has-text("View as table")');
  await page.waitForSelector("table");
  const rows = await page.locator("table tbody tr").count();
  if (rows < 25) throw new Error(`expected ~30 rows, got ${rows}`);
  await page.click('button:has-text("View chart")');
  await page.waitForSelector("svg");
});

// ---------- ORDERS ----------
await test("orders: search finds AV-10005 exactly", async () => {
  await page.goto(`${B}/admin/orders?q=AV-10005`, { waitUntil: "networkidle" });
  const rows = await page.locator("tbody tr").count();
  eq(rows, 1, "row count");
  const num = await page.locator('tbody a[href^="/admin/orders/"]').textContent();
  eq(num.trim(), "AV-10005");
});
await test("orders: status filter DELIVERED matches DB (10)", async () => {
  await page.goto(`${B}/admin/orders?status=DELIVERED`, { waitUntil: "networkidle" });
  eq(await page.locator("tbody tr").count(), GT.deliveredOrders, "delivered count");
});
await test("orders: search by customer name works", async () => {
  await page.goto(`${B}/admin/orders?q=Kavya`, { waitUntil: "networkidle" });
  const rows = await page.locator("tbody tr").count();
  if (rows < 1) throw new Error("no rows for Kavya");
  const names = await page.locator("tbody tr td:nth-child(2)").allTextContents();
  if (!names.every((n) => n.includes("Kavya"))) throw new Error(`non-matching rows: ${names}`);
});
await test("orders: detail totals are internally consistent", async () => {
  await page.goto(`${B}/admin/orders?q=AV-10005`, { waitUntil: "networkidle" });
  await page.locator('tbody a[href^="/admin/orders/"]').click();
  await page.waitForURL("**/admin/orders/**");
  const grab = async (label) => {
    const t = await page.locator(`div:has(> span:text-is("${label}")) > span.tabular-nums`).last().textContent();
    return parseInt(t.replace(/[^0-9]/g, "")) || 0;
  };
  const subtotal = await grab("Subtotal");
  const tax = await grab("Tax");
  const total = await grab("Total");
  const shippingText = await page.locator('div:has(> span:text-is("Shipping"))').last().textContent();
  const shipping = shippingText.includes("Free") ? 0 : (parseInt(shippingText.replace(/[^0-9]/g, "")) || 0);
  let discount = 0;
  if (await page.locator('div:has(> span:text-is("Discount"))').count()) {
    discount = await grab("Discount");
  }
  eq(total, subtotal - discount + shipping + tax, "total = subtotal - discount + shipping + tax");
});
await test("orders: status update persists and timeline advances", async () => {
  const before = await page.locator('select[name="status"]').inputValue();
  await page.selectOption('select[name="status"]', "PACKED");
  await page.click('button:has-text("Save Status")');
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: "networkidle" });
  eq(await page.locator('select[name="status"]').inputValue(), "PACKED");
  // timeline: Packed step and everything before it should be dark
  const dots = await page.locator("ol li span.bg-charcoal-ink").count();
  if (dots < 4) throw new Error(`expected >=4 done steps, got ${dots}`);
  // restore
  await page.selectOption('select[name="status"]', before);
  await page.click('button:has-text("Save Status")');
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: "networkidle" });
  eq(await page.locator('select[name="status"]').inputValue(), before, "restored");
});
await test("orders: admin notes save and persist", async () => {
  const note = `test-note-${Date.now()}`;
  await page.fill('textarea[name="adminNotes"]', note);
  await page.click('button:has-text("Save Notes")');
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: "networkidle" });
  eq(await page.locator('textarea[name="adminNotes"]').inputValue(), note);
  // clean up
  await page.fill('textarea[name="adminNotes"]', "");
  await page.click('button:has-text("Save Notes")');
  await page.waitForTimeout(1000);
});

// ---------- PRODUCTS CRUD ----------
const SLUG = "e2e-test-product";
await test("products: create with invalid price shows error", async () => {
  await page.goto(`${B}/admin/products/new`, { waitUntil: "networkidle" });
  await page.fill("#name", "E2E Test Product");
  await page.fill("#category", "Test Category");
  await page.fill("#description", "e2e test");
  await page.evaluate(() => document.querySelector("#price").removeAttribute("required"));
  await page.fill("#slug", SLUG);
  await page.click('button:has-text("Create Product")');
  await page.waitForSelector('p[role="alert"]');
  const err = await page.locator('p[role="alert"]').textContent();
  if (!err?.includes("Price")) throw new Error(`unexpected: ${err}`);
});
await test("products: valid create appears in list", async () => {
  await page.fill("#price", "12345");
  await page.fill("#sizes", "S: 4\nM: 6");
  await page.click('button:has-text("Create Product")');
  await page.waitForURL(/\/admin\/products$/, { timeout: 15000 });
  if (!(await page.locator("text=E2E Test Product").first().isVisible())) throw new Error("not in list");
});
await test("products: storefront shows the new product immediately", async () => {
  await page.goto(`${B}/product/${SLUG}`, { waitUntil: "networkidle" });
  if (!(await page.locator('h1:has-text("E2E Test Product")').isVisible())) throw new Error("product page missing");
  if (!(await page.locator("text=₹12,345").first().isVisible())) throw new Error("price wrong");
});
await test("products: edit price persists to storefront", async () => {
  await page.goto(`${B}/admin/products`, { waitUntil: "networkidle" });
  await page.locator('tr:has-text("E2E Test Product") a:has-text("Edit")').click();
  await page.waitForURL("**/admin/products/**");
  await page.fill("#price", "23456");
  await page.click('button:has-text("Save Changes")');
  await page.waitForURL(/\/admin\/products$/, { timeout: 15000 });
  await page.goto(`${B}/product/${SLUG}`, { waitUntil: "networkidle" });
  if (!(await page.locator("text=₹23,456").first().isVisible())) throw new Error("edited price not shown");
});
await test("products: delete removes from admin and storefront 404s", async () => {
  await page.goto(`${B}/admin/products`, { waitUntil: "networkidle" });
  page.once("dialog", (d) => d.accept());
  await page.locator('tr:has-text("E2E Test Product") button:has-text("Delete")').click();
  await page.waitForTimeout(1500);
  eq(await page.locator("text=E2E Test Product").count(), 0, "still in admin list");
  const resp = await page.goto(`${B}/product/${SLUG}`, { waitUntil: "networkidle" });
  eq(resp.status(), 404, "storefront status");
});

// ---------- CUSTOMERS ----------
await test("customers: list shows all 12 with spend column", async () => {
  await page.goto(`${B}/admin/customers`, { waitUntil: "networkidle" });
  eq(await page.locator("tbody tr").count(), 12, "customer rows");
});
await test("customers: detail shows order history linking to orders", async () => {
  await page.locator('tbody a[href^="/admin/customers/"]').first().click();
  await page.waitForURL("**/admin/customers/**");
  const orderLinks = await page.locator('a[href^="/admin/orders/"]').count();
  if (orderLinks < 1) throw new Error("no order links on customer page");
});

// ---------- LOGOUT ----------
await test("logout: destroys session, admin locked again", async () => {
  await page.click('button:has-text("Log Out")');
  await page.waitForURL("**/admin/login", { timeout: 10000 });
  await page.goto(`${B}/admin`, { waitUntil: "networkidle" });
  if (!page.url().includes("/admin/login")) throw new Error(`not redirected: ${page.url()}`);
});

console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
console.log("page errors:", consoleErrors.length ? consoleErrors.slice(0, 5) : "none");
await browser.close();
