# E2E Tests

Playwright-driven end-to-end suites against a running dev server.

```bash
npm run dev        # in one terminal
npm test           # in another
```

- `e2e/storefront.mjs` — homepage, shop filters (checked against seeded DB counts), product pages, cart math, mobile nav/filters
- `e2e/admin.mjs` — auth, dashboard stats vs DB, orders, product CRUD, customers, logout (reads admin credentials from `.env`)

Counts assume the seeded demo catalog (`npx prisma db seed`). First run: `npx playwright install chromium`.
