# Aval Designs

A premium bridal & occasion-wear boutique e-commerce site, built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Database:** SQLite via Prisma (driver adapter: `@prisma/adapter-better-sqlite3`)
- **Admin auth:** signed session cookie (jose/JWT) + bcrypt-hashed password, protected by middleware

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in real values, see below
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard (log in with the `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` you set in `.env`).

### Environment variables

See `.env.example`. You'll need:

- `DATABASE_URL` — SQLite file path, defaults to `file:./dev.db`
- `ADMIN_SESSION_SECRET` — random secret used to sign admin session cookies; generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — credentials for the admin account created by `prisma db seed`

Never commit `.env`.

## What's built

- **Storefront** — homepage, shop with filters/sorting (mobile bottom-sheet filters), product pages with size guide and stock states, wishlist, search, cart, and a working Cash-on-Delivery checkout that creates real orders (with stock decrement), order confirmation, and order tracking
- **Content pages** — collections, new arrivals, best sellers, custom-design, about, contact, FAQ, size guide, and policies
- **Admin panel** (`/admin`) — dashboard (revenue, sales trend, top products, low-stock alerts), paginated order management with status timeline, product CRUD, customer list/detail

## Project docs

- `PRODUCT.md` — strategic brief (audience, positioning, brand personality)
- `DESIGN.md` — visual design system (colors, typography, components)

## Not yet built

Online payments (Razorpay/Stripe — checkout is COD-only today), invoice PDFs, customer accounts, saved measurements, custom-design uploads, reviews, coupons, shipping/tax config, notifications, and blog content. The database is local SQLite — move to hosted Postgres before deploying.
