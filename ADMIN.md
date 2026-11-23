# PixelNoryx Admin (Next.js)

Role-based CMS inside the Next.js app at **`/admin`** (Neon Postgres).

## Roles

| Role | Access |
|------|--------|
| **ADMIN** | Dashboard, Posts, SEO, Users |
| **EDITOR** | Dashboard, Posts, SEO |
| **USER** | No admin panel |

## Local setup

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open: [http://localhost:3000/admin](http://localhost:3000/admin)

### Seed logins

| Email | Password | Role |
|-------|----------|------|
| admin@pixelnoryx.com | admin123 | ADMIN |
| editor@pixelnoryx.com | editor123 | EDITOR |

## Database (Neon)

- **Postgres:** set `DATABASE_URL` (pooled) + `DIRECT_URL` (non-pooler) in `.env` / Vercel
- **Object Storage:** declare buckets in `neon.ts`, then `neon login` → `neon deploy` to provision and pull `AWS_*` vars
- Smoke test: `npm run neon:smoke` and `GET /api/health/neon`

## Features

- Posts CRUD with **meta title / description / keywords / OG / robots**
- Global **Site SEO** settings
- User management with role changes (ADMIN only)
- Cookie session auth (`pn_admin_session`)
