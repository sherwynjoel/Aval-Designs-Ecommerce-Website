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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e}`));
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });

const B = "http://localhost:3000";
const pieces = async () => {
  const t = await page.locator("span:has-text('piece')").first().textContent();
  return parseInt(t);
};

// ---------- HOMEPAGE ----------
await test("homepage: all sections render", async () => {
  await page.goto(B, { waitUntil: "networkidle" });
  for (const text of ["Timeless Elegance", "New Arrivals", "Shop by Category", "Your Style. Your", "Why Aval Designs", "From Our Brides", "@AvalDesigns", "Be the first to discover"]) {
    if (!(await page.locator(`text=${text}`).first().isVisible())) throw new Error(`section missing: ${text}`);
  }
});
await test("homepage: no broken images", async () => {
  await page.waitForTimeout(1500);
  const broken = await page.locator("img").evaluateAll((els) => els.filter((e) => e.complete && e.naturalWidth === 0).map((e) => e.src));
  eq(broken.length, 0, "broken image count");
});
await test("homepage: New Arrivals cards link to products", async () => {
  const href = await page.locator('h3 a[href^="/product/"]').first().getAttribute("href");
  if (!href?.startsWith("/product/")) throw new Error("no product link");
});

// ---------- SHOP FILTERS (against DB ground truth) ----------
await test("shop: default shows 10 pieces", async () => {
  await page.goto(`${B}/shop`, { waitUntil: "networkidle" });
  eq(await pieces(), 10);
});
await test("shop: category filter (Bridal Lehenga = 2)", async () => {
  await page.goto(`${B}/shop?category=Bridal+Lehenga`, { waitUntil: "networkidle" });
  eq(await pieces(), 2);
});
await test("shop: size filter (XS = 7)", async () => {
  await page.goto(`${B}/shop?size=XS`, { waitUntil: "networkidle" });
  eq(await pieces(), 7);
});
await test("shop: price filter (under 25k = 5)", async () => {
  await page.goto(`${B}/shop?maxPrice=25000`, { waitUntil: "networkidle" });
  eq(await pieces(), 5);
});
await test("shop: customizable filter (= 7)", async () => {
  await page.goto(`${B}/shop?customizable=1`, { waitUntil: "networkidle" });
  eq(await pieces(), 7);
});
await test("shop: combined category+price (Bridal Lehenga under 40k = 1)", async () => {
  await page.goto(`${B}/shop?category=Bridal+Lehenga&maxPrice=40000`, { waitUntil: "networkidle" });
  eq(await pieces(), 1);
});
await test("shop: sort price-asc puts cheapest first (sana-bridal-blouse)", async () => {
  await page.goto(`${B}/shop?sort=price-asc`, { waitUntil: "networkidle" });
  const href = await page.locator('h3 a[href^="/product/"]').first().getAttribute("href");
  eq(href, "/product/sana-bridal-blouse");
});
await test("shop: sort price-desc puts priciest first (rukmini 42000)", async () => {
  await page.goto(`${B}/shop?sort=price-desc`, { waitUntil: "networkidle" });
  const href = await page.locator('h3 a[href^="/product/"]').first().getAttribute("href");
  eq(href, "/product/rukmini-velvet-lehenga");
});
await test("shop: empty state (Sharara Set + customizable = 0)", async () => {
  await page.goto(`${B}/shop?category=Sharara+Set&customizable=1`, { waitUntil: "networkidle" });
  if (!(await page.locator("text=Nothing matches").isVisible())) throw new Error("empty state not shown");
});
await test("shop: Clear All resets filters", async () => {
  await page.goto(`${B}/shop?category=Bridal+Lehenga`, { waitUntil: "networkidle" });
  await page.locator('aside a:has-text("Clear All")').click();
  await page.waitForURL(`${B}/shop`, { timeout: 10000 });
  eq(await pieces(), 10);
});

// ---------- ALL PRODUCT PAGES ----------
await test("all 10 product pages render with price and sizes", async () => {
  await page.goto(`${B}/shop`, { waitUntil: "networkidle" });
  const hrefs = await page.locator('h3 a[href^="/product/"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  eq(hrefs.length, 10, "product link count");
  for (const href of hrefs) {
    await page.goto(`${B}${href}`, { waitUntil: "networkidle" });
    if (!(await page.locator("h1").isVisible())) throw new Error(`${href}: no h1`);
    if (!(await page.locator("text=₹").first().isVisible())) throw new Error(`${href}: no price`);
    if (!(await page.locator('button:has-text("Add to Bag")').isVisible())) throw new Error(`${href}: no add button`);
  }
});

// ---------- PRODUCT INTERACTIONS + CART ----------
await test("product: size guide modal opens and closes", async () => {
  await page.goto(`${B}/product/anaya-bridal-lehenga`, { waitUntil: "networkidle" });
  await page.click('button:has-text("View Size Guide")');
  if (!(await page.locator("dialog[open]").isVisible())) throw new Error("modal did not open");
  await page.click('dialog button:has-text("Close")');
  if (await page.locator("dialog[open]").isVisible()) throw new Error("modal did not close");
});
await test("product: add without size shows error", async () => {
  await page.click('button:has-text("Add to Bag")');
  const err = await page.locator('p[role="alert"]').textContent();
  if (!err?.includes("select a size")) throw new Error(`unexpected: ${err}`);
});
await test("product: out-of-stock size (XXL) is disabled", async () => {
  const disabled = await page.locator('button.min-w-12:has-text("XXL")').isDisabled();
  eq(disabled, true);
});
await test("cart: add two products, badge shows 2", async () => {
  await page.locator('button.min-w-12:has-text("M")').first().click();
  await page.click('button:has-text("Add to Bag")');
  await page.waitForSelector("text=Added to your bag");
  await page.goto(`${B}/product/sana-bridal-blouse`, { waitUntil: "networkidle" });
  await page.locator('button.min-w-12:has-text("S")').first().click();
  await page.click('button:has-text("Add to Bag")');
  await page.waitForSelector("text=Added to your bag");
  const badge = await page.locator('a[aria-label="Cart"] span').textContent();
  eq(badge, "2");
});
await test("cart: subtotal = sum of line items (38500 + 9800)", async () => {
  await page.goto(`${B}/cart`, { waitUntil: "networkidle" });
  const sub = await page.locator("text=Subtotal >> xpath=following-sibling::span").textContent();
  eq(sub.trim(), "₹48,300");
});
await test("cart: quantity + updates subtotal (38500*2 + 9800 = 86800)", async () => {
  await page.locator('button[aria-label="Increase quantity"]').first().click();
  await page.waitForTimeout(400);
  const sub = await page.locator("text=Subtotal >> xpath=following-sibling::span").textContent();
  eq(sub.trim(), "₹86,800");
});
await test("cart: badge reflects quantity (3)", async () => {
  const badge = await page.locator('a[aria-label="Cart"] span').textContent();
  eq(badge, "3");
});
await test("cart: remove item works", async () => {
  await page.locator('button:has-text("Remove")').first().click();
  await page.waitForTimeout(400);
  const sub = await page.locator("text=Subtotal >> xpath=following-sibling::span").textContent();
  eq(sub.trim(), "₹9,800");
});
await test("cart: empty state after removing all", async () => {
  await page.locator('button:has-text("Remove")').first().click();
  await page.waitForSelector("text=waiting for something beautiful");
});
await test("checkout: placeholder page reachable", async () => {
  await page.goto(`${B}/checkout`, { waitUntil: "networkidle" });
  if (!(await page.locator("text=Checkout").first().isVisible())) throw new Error("no checkout heading");
});

// ---------- MOBILE ----------
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
mob.on("pageerror", (e) => consoleErrors.push(`mobile pageerror: ${e}`));
await test("mobile: bottom nav present on homepage", async () => {
  await mob.goto(B, { waitUntil: "networkidle" });
  if (!(await mob.locator("nav.fixed").isVisible())) throw new Error("no bottom nav");
});
await test("mobile: hamburger menu opens and navigates", async () => {
  await mob.locator('button[aria-label="Open menu"]').click();
  await mob.waitForTimeout(500);
  await mob.locator('a.font-display:has-text("Shop")').first().click();
  await mob.waitForURL("**/shop", { timeout: 10000 });
});
await test("mobile: filter sheet opens and applies", async () => {
  await mob.click('button:has-text("Filters")');
  await mob.waitForTimeout(500);
  const sheet = mob.locator('[role="dialog"][aria-label="Product filters"]');
  if (!(await sheet.isVisible())) throw new Error("sheet not visible");
  await sheet.locator('input[name="category"][value="Silk Saree"]').check();
  await sheet.locator('button:has-text("Apply")').click();
  await mob.waitForURL("**category=Silk+Saree**", { timeout: 10000 });
});

console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("PASS")).length}/${results.length} passed`);
console.log("console errors:", consoleErrors.length ? consoleErrors.slice(0, 5) : "none");
await browser.close();
