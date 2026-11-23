# PixelNoryx

Magazine-style developer newsletter — **Next.js** app with built-in **`/admin`** CMS on **Neon Postgres**.

## Project structure

```
PixelNoryx/
├── app/                 # Public site + /admin
├── components/
├── lib/
├── prisma/              # Neon Postgres schema
└── neon.ts              # Neon services (Postgres + Object Storage)
```

See **[ADMIN.md](ADMIN.md)** for admin setup and **[VERCEL.md](VERCEL.md)** for deploy env vars.

## What it is

**The Developer Dispatch** — a free weekly newsletter on React, Laravel, SaaS, and shipping digital products.

## Features

- Subscribe-first hero, archive, search, about/contact
- Role-based admin at `/admin` (posts + SEO + users)
- Neon Postgres + optional Object Storage

## Run

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin  
  (`admin@pixelnoryx.com` / `admin123`)

## Build

```bash
npm run build
npm start
```
