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

- **Storefront homepage** — hero, new arrivals, shop by category, custom-design CTA, editorial banner, testimonials, Instagram gallery, newsletter, footer
- **Admin panel** (`/admin`) — dashboard (revenue, sales trend, top products, low-stock alerts), order management with status timeline, product CRUD, customer list/detail

## Project docs

- `PRODUCT.md` — strategic brief (audience, positioning, brand personality)
- `DESIGN.md` — visual design system (colors, typography, components)

## Not yet built

Shop listing/filters, product detail pages, cart, checkout, payments, customer accounts, saved measurements, custom-design uploads, coupons, shipping/tax config, and the rest of the admin analytics surface.
