# QuickEats

A food delivery demo app built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, and MongoDB.

## What's actually implemented

- Browse restaurants by delivery zone, view a menu, add items to a cart,
  and place an order — all persisted in MongoDB (cart is tracked via an
  anonymous cookie id; there's no user auth system yet).
- A surge-pricing engine that computes a delivery-fee multiplier per zone
  from live order/partner counts, with an admin page to set custom
  per-zone thresholds.
- An analytics dashboard computed from real order data in MongoDB
  (revenue, order trend, zone performance, recent orders) — nothing on
  this page is hardcoded.
- A delivery-partners directory page.

## What's not implemented

- No authentication/accounts — the cart and "recent orders" aren't tied
  to a specific person, just an anonymous cookie.
- No payments — placing an order just records it as `pending`.
- No real-time updates (no WebSockets) — the surge dashboard polls every
  15 seconds instead.
- UI is functional but not yet visually redesigned.

## Getting started

### 1. Get a MongoDB connection string

Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com) (or use
any MongoDB instance), then grab its connection string.

### 2. Configure environment

```bash
cp .env.example .env.local
# then edit .env.local and set MONGODB_URI
```

### 3. Install dependencies and seed the database

```bash
npm install
npm run db:seed   # loads zones/restaurants/partners + 12 days of sample orders
```

### 4. Run it

```bash
npm run dev
```

Visit http://localhost:3000.

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # Route handlers (zones, restaurants, partners,
│   │                       #   cart, orders, surge, analytics)
│   ├── restaurant/[id]/    # Menu + add-to-cart
│   ├── cart/                # Cart + checkout
│   ├── analytics/           # Analytics dashboard
│   ├── surge/                # Live surge dashboard
│   └── admin/surge-policies/ # Per-zone surge policy config
├── models/                 # Mongoose schemas (Zone, Restaurant,
│                            #   DeliveryPartner, SurgePolicy, Cart, Order,
│                            #   analytics event types)
├── lib/
│   ├── mongodb.ts           # Cached DB connection (safe for serverless)
│   ├── queries.ts           # Shared server-only data access
│   ├── surgeEngine.ts       # Surge multiplier calculation (server-only)
│   ├── cartSession.ts       # Anonymous cart-id cookie handling
│   └── rateLimit.ts         # In-memory rate limiting for write endpoints
└── entities/mockData.ts     # Seed data (zones/restaurants/partners)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:seed` | Reset and reseed MongoDB with sample data |
| `npm run test` | Run Jest unit tests |
| `npm run test:playwright` | Run Playwright end-to-end tests |
| `npm run type-check` | TypeScript check with no output |

## Deploying

This is a standard Next.js app — deploy it to Vercel (or any Node host) and
set `MONGODB_URI` in your hosting provider's environment variables. There's
no custom server; everything runs through Next.js's own server/route
handlers.
