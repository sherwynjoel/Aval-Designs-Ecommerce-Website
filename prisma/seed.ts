import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const hashPassword = (password: string) => bcrypt.hash(password, 12);

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const db = new PrismaClient({ adapter });

// Deterministic PRNG so re-running the seed produces the same demo data.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260810);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) =>
  Math.floor(min + rand() * (max - min + 1));

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

async function main() {
  console.log("Seeding database...");

  // --- Admin ---
  // Real credentials belong in .env (gitignored), never as literals here.
  // See .env.example for the expected shape.
  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env before seeding (see .env.example)."
    );
  }
  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Aval Designs Admin",
      passwordHash: await hashPassword(adminPassword),
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  // --- Customers ---
  const customerSeed = [
    { name: "Ritika Menon", email: "ritika.menon@example.com", phone: "+91 98450 11223", city: "Bengaluru" },
    { name: "Farah Sheikh", email: "farah.sheikh@example.com", phone: "+91 90000 22334", city: "Hyderabad" },
    { name: "Priya Krishnan", email: "priya.krishnan@example.com", phone: "+91 98765 33445", city: "Chennai" },
    { name: "Ananya Reddy", email: "ananya.reddy@example.com", phone: "+91 99887 44556", city: "Hyderabad" },
    { name: "Meera Nair", email: "meera.nair@example.com", phone: "+91 97654 55667", city: "Kochi" },
    { name: "Sneha Iyer", email: "sneha.iyer@example.com", phone: "+91 96543 66778", city: "Coimbatore" },
    { name: "Kavya Pillai", email: "kavya.pillai@example.com", phone: "+91 95432 77889", city: "Trivandrum" },
    { name: "Divya Rao", email: "divya.rao@example.com", phone: "+91 94321 88990", city: "Bengaluru" },
    { name: "Nandini Suresh", email: "nandini.suresh@example.com", phone: "+91 93210 99001", city: "Chennai" },
    { name: "Zara Khan", email: "zara.khan@example.com", phone: "+91 92109 00112", city: "Hyderabad" },
    { name: "Lakshmi Venkatesh", email: "lakshmi.venkatesh@example.com", phone: "+91 91098 11223", city: "Madurai" },
    { name: "Ishita Kapoor", email: "ishita.kapoor@example.com", phone: "+91 90987 22334", city: "Bengaluru" },
  ];

  const customers = [];
  for (const c of customerSeed) {
    customers.push(
      await db.customer.upsert({
        where: { email: c.email },
        update: {},
        create: c,
      })
    );
  }
  console.log(`${customers.length} customers ready`);

  // --- Products ---
  const productSeed = [
    {
      slug: "anaya-bridal-lehenga",
      name: "Anaya Bridal Lehenga",
      category: "Bridal Lehenga",
      description:
        "Hand-embroidered bridal lehenga in deep red silk with gold zardozi work, a fitted blouse, and a flowing dupatta. Fully customizable to your measurements.",
      price: 38500,
      originalPrice: null,
      images: [unsplash("photo-1503160865267-af4660ce7bf2"), unsplash("photo-1610047614256-023d7c028d0b")],
      colors: ["#8a2432", "#c9a24b"],
      sizes: { XS: 2, S: 5, M: 6, L: 4, XL: 2, XXL: 0 },
      badges: ["new", "customizable"],
      customizable: true,
    },
    {
      slug: "meherunisa-silk-saree",
      name: "Meherunisa Silk Saree",
      category: "Silk Saree",
      description:
        "A rich Kanjivaram-inspired silk saree with a contrast pallu, woven in deep maroon and forest green, paired with an unstitched blouse piece.",
      price: 24500,
      originalPrice: null,
      images: [unsplash("photo-1617627143750-d86bc21e42bb"), unsplash("photo-1646979200020-941e1deb2670")],
      colors: ["#7a1f2b", "#2c3e2d"],
      sizes: { "Free Size": 18 },
      badges: ["bestseller", "customizable"],
      customizable: true,
    },
    {
      slug: "ivory-rose-reception-gown",
      name: "Ivory Rose Reception Gown",
      category: "Reception Gown",
      description:
        "A soft ivory reception gown with delicate gold thread detailing along the neckline and hem, cut for a flattering silhouette.",
      price: 32000,
      originalPrice: 38000,
      images: [unsplash("photo-1717350917430-e9eea6474594"), unsplash("photo-1735052711950-c31c729c2a4e")],
      colors: ["#f3ece2", "#c9a24b"],
      sizes: { XS: 1, S: 3, M: 4, L: 3, XL: 1, XXL: 0 },
      badges: ["sale"],
      customizable: false,
    },
    {
      slug: "zaira-embroidered-anarkali",
      name: "Zaira Embroidered Anarkali",
      category: "Anarkali",
      description:
        "Floor-length Anarkali with fine thread embroidery across the bodice, in a deep olive base with maroon accents. Comes with matching dupatta and churidar.",
      price: 21500,
      originalPrice: null,
      images: [unsplash("photo-1630267693092-2ea1f7dcc9a5"), unsplash("photo-1660669996485-f4713e9c8f01")],
      colors: ["#4a5240", "#8a2432"],
      sizes: { XS: 3, S: 6, M: 7, L: 5, XL: 3, XXL: 1 },
      badges: ["new", "customizable"],
      customizable: true,
    },
    {
      slug: "noor-sharara-set",
      name: "Noor Sharara Set",
      category: "Sharara Set",
      description:
        "A three-piece sharara set in soft gold and ivory, with a short kurti, flared sharara pants, and a lightly embellished dupatta. Limited production run.",
      price: 19800,
      originalPrice: null,
      images: [unsplash("photo-1668371459824-094a960a227d"), unsplash("photo-1707576618343-26a1b377ca7a")],
      colors: ["#c9a24b", "#f3ece2"],
      sizes: { XS: 1, S: 2, M: 2, L: 1, XL: 0, XXL: 0 },
      badges: ["limited"],
      customizable: false,
    },
    {
      slug: "kiran-reception-saree",
      name: "Kiran Reception Saree",
      category: "Designer Saree",
      description:
        "A designer reception saree in forest green georgette with hand-placed sequin embroidery and a contrast maroon blouse.",
      price: 27500,
      originalPrice: null,
      images: [unsplash("photo-1677691257363-eebd2abeafec"), unsplash("photo-1570212773364-e30cd076539e")],
      colors: ["#2c3e2d", "#8a2432"],
      sizes: { "Free Size": 14 },
      badges: ["bestseller", "customizable"],
      customizable: true,
    },
    {
      slug: "rukmini-velvet-lehenga",
      name: "Rukmini Velvet Lehenga",
      category: "Bridal Lehenga",
      description:
        "Winter-weight velvet bridal lehenga in oxblood red with heavy gold gota-patti border work, built for a grand entrance.",
      price: 42000,
      originalPrice: null,
      images: [unsplash("photo-1629118477133-b8b1499f2b8a"), unsplash("photo-1622207691293-5cd80466dab3")],
      colors: ["#5c1a22", "#c9a24b"],
      sizes: { XS: 1, S: 2, M: 3, L: 2, XL: 1, XXL: 1 },
      badges: ["bestseller", "customizable"],
      customizable: true,
    },
    {
      slug: "amara-organza-saree",
      name: "Amara Organza Saree",
      category: "Designer Saree",
      description:
        "A featherlight organza saree with hand-embroidered floral motifs scattered across the body, in a dusty rose colourway.",
      price: 18500,
      originalPrice: 21000,
      images: [unsplash("photo-1610047520958-b42ebcd2f6cb"), unsplash("photo-1614940685083-c5409b57da6e")],
      colors: ["#c98a8f", "#f3ece2"],
      sizes: { "Free Size": 9 },
      badges: ["sale", "customizable"],
      customizable: true,
    },
    {
      slug: "sana-bridal-blouse",
      name: "Sana Bridal Blouse",
      category: "Bridal Blouse",
      description:
        "A structured bridal blouse in deep maroon with heavy hand embroidery, designed to pair with any of our bridal sarees or lehengas.",
      price: 9800,
      originalPrice: null,
      images: [unsplash("photo-1707576618343-26a1b377ca7a"), unsplash("photo-1614940685083-c5409b57da6e")],
      colors: ["#7a1f2b"],
      sizes: { XS: 4, S: 7, M: 8, L: 6, XL: 4, XXL: 2 },
      badges: ["customizable"],
      customizable: true,
    },
    {
      slug: "meira-engagement-gown",
      name: "Meira Engagement Gown",
      category: "Reception Gown",
      description:
        "A fitted engagement gown in blush pink with a subtle shimmer finish and a soft trailing hemline for evening events.",
      price: 26500,
      originalPrice: null,
      images: [unsplash("photo-1622207691293-5cd80466dab3"), unsplash("photo-1717350917430-e9eea6474594")],
      colors: ["#e8b4bc", "#c9a24b"],
      sizes: { XS: 2, S: 4, M: 5, L: 3, XL: 1, XXL: 0 },
      badges: ["new"],
      customizable: false,
    },
  ];

  const products = [];
  for (const p of productSeed) {
    products.push(
      await db.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice ?? undefined,
          images: JSON.stringify(p.images),
          colors: JSON.stringify(p.colors),
          sizes: JSON.stringify(p.sizes),
          badges: JSON.stringify(p.badges),
          customizable: p.customizable,
        },
      })
    );
  }
  console.log(`${products.length} products ready`);

  // --- Orders ---
  const existingOrders = await db.order.count();
  if (existingOrders > 0) {
    console.log(`${existingOrders} orders already exist, skipping order seed`);
  } else {
    const statuses = [
      "PROCESSING",
      "CUSTOMIZATION",
      "QUALITY_CHECK",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "DELIVERED",
      "DELIVERED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ] as const;
    const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"];
    const states = [
      { city: "Bengaluru", state: "Karnataka", pincode: "560034" },
      { city: "Chennai", state: "Tamil Nadu", pincode: "600028" },
      { city: "Hyderabad", state: "Telangana", pincode: "500032" },
      { city: "Kochi", state: "Kerala", pincode: "682020" },
      { city: "Coimbatore", state: "Tamil Nadu", pincode: "641037" },
      { city: "Madurai", state: "Tamil Nadu", pincode: "625002" },
    ];

    const now = Date.now();
    const orderCount = 28;

    for (let i = 0; i < orderCount; i++) {
      const customer = pick(customers);
      const itemCount = int(1, 2);
      const daysAgo =
        i < orderCount * 0.7 ? int(3, 75) : int(0, 3); // most orders older, a handful very recent (feeds "today's sales")
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - int(0, 23) * 60 * 60 * 1000);

      const status = daysAgo <= 1 ? pick(["PROCESSING", "CUSTOMIZATION"]) : pick(statuses);
      const paymentStatus =
        status === "CANCELLED" ? "REFUNDED" : status === "RETURNED" ? "REFUNDED" : pick(["PAID", "PAID", "PAID", "PENDING"]);

      let subtotal = 0;
      const itemsData = [];
      const chosenProducts = new Set<string>();
      for (let j = 0; j < itemCount; j++) {
        let product = pick(products);
        let attempts = 0;
        while (chosenProducts.has(product.id) && attempts < 5) {
          product = pick(products);
          attempts++;
        }
        chosenProducts.add(product.id);

        const sizes = Object.keys(JSON.parse(product.sizes));
        const colors = JSON.parse(product.colors) as string[];
        const quantity = 1;
        const unitPrice = product.price;
        const total = unitPrice * quantity;
        subtotal += total;

        itemsData.push({
          productId: product.id,
          productName: product.name,
          size: pick(sizes),
          color: pick(colors),
          customization:
            product.customizable && rand() > 0.5
              ? JSON.stringify({ note: "Please adjust sleeve length to 3/4th and reinforce the waist seam." })
              : null,
          quantity,
          unitPrice,
          total,
        });
      }

      const discount = rand() > 0.75 ? Math.round(subtotal * 0.1) : 0;
      const shipping = subtotal >= 15000 ? 0 : 250;
      const tax = Math.round((subtotal - discount) * 0.05);
      const total = subtotal - discount + shipping + tax;
      const location = pick(states);

      await db.order.create({
        data: {
          orderNumber: `AV-${10000 + i}`,
          customerId: customer.id,
          status,
          paymentStatus,
          paymentMethod: pick(paymentMethods),
          subtotal,
          discount,
          shipping,
          tax,
          total,
          shippingName: customer.name,
          shippingPhone: customer.phone,
          shippingAddress: `${int(1, 199)}, ${pick(["Lake View Road", "MG Road", "Anna Nagar 2nd St", "Church Street", "Residency Road", "Brigade Road"])}`,
          shippingCity: location.city,
          shippingState: location.state,
          shippingPincode: location.pincode,
          customizationNotes: itemsData.some((it) => it.customization)
            ? "Customer requested video call fitting confirmation before stitching."
            : null,
          adminNotes: status === "CANCELLED" ? "Customer requested cancellation, fabric not yet cut." : null,
          createdAt,
          updatedAt: createdAt,
          items: { create: itemsData },
        },
      });
    }
    console.log(`${orderCount} orders created`);
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
