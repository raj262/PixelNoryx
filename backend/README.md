# PixelNoryx Backend (Laravel)

Role-based Laravel API + Filament admin panel for managing the PixelNoryx newsletter/magazine site.

## Stack

- **Laravel 13**
- **Filament 4** — Admin at `/admin` (root `/` redirects to login)
- **Spatie Laravel Permission** — Roles & permissions
- **Laravel Sanctum** — API authentication

## Folder structure

```
backend/
├── app/
│   ├── Filament/Resources/   # Admin CRUD (Posts, Categories, Users, etc.)
│   ├── Http/Controllers/Api/   # REST API for Next.js frontend
│   └── Models/
├── database/migrations/
├── database/seeders/
└── routes/api.php
```

## Setup (MAMP / phpMyAdmin)

### 1. Create database in phpMyAdmin

- Open phpMyAdmin (MAMP: http://localhost:8888/phpMyAdmin)
- Create database: **PixelNoryx**
- Collation: `utf8mb4_unicode_ci`

### 2. Configure `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=8889
DB_DATABASE=PixelNoryx
DB_USERNAME=root
DB_PASSWORD=root
```

> MAMP default MySQL port is **8889**. If yours is **3306**, change `DB_PORT` accordingly.

### 3. Install & migrate

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

- **Admin login:** http://127.0.0.1:8001/ → `/admin/login`  
- **Admin dashboard:** http://127.0.0.1:8001/admin  
- **API base:** http://127.0.0.1:8001/api/v1  

Run on port 8001: `php artisan serve --port=8001`

### Default accounts (after seed)

| Role   | Email                   | Password   | Admin access |
|--------|-------------------------|------------|--------------|
| Admin  | admin@pixelnoryx.demo   | admin123   | Yes          |
| Editor | editor@pixelnoryx.demo  | editor123  | Yes          |
| Vendor | vendor@pixelnoryx.demo  | vendor123  | No (API only)|
| User   | user@pixelnoryx.demo    | user123    | No (API only)|

## Roles

- **admin** — Full access: users, posts, categories, subscribers, FAQs, testimonials, contacts
- **editor** — Content, marketing, and SEO settings (no user management)
- **vendor** — Read-only API (extend for products later)
- **user** — Read-only API

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/posts` | List published posts (`?topic=`, `?featured=`, `?search=`) |
| GET | `/api/v1/posts/{slug}` | Single post |
| GET | `/api/v1/categories` | Categories |
| GET | `/api/v1/settings` | Site settings |
| GET | `/api/v1/seo` | Global SEO (titles, OG, robots, verification) |
| GET | `/api/v1/bootstrap` | Full site payload (posts, settings, ads, FAQs, etc.) |
| GET | `/api/v1/faqs` | FAQs |
| GET | `/api/v1/testimonials` | Testimonials |
| POST | `/api/v1/subscribe` | Newsletter subscribe |
| POST | `/api/v1/contact` | Contact form |
| POST | `/api/v1/auth/login` | API login (returns token) |
| GET | `/api/v1/auth/me` | Current user (Bearer token) |

## CORS

Set in `.env`:

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Manage frontend content (admin)

| Admin section | What it controls on localhost:3000 |
|---------------|--------------------------------------|
| **Posts / Issues** | Home hero, trending, archive, single post pages |
| **Categories** | Topic filters & nav dropdown |
| **Ad placements** | All sponsored / ad blocks |
| **Site content** (Settings) | Author, nav, footer, social stats, subscribe benefits |
| **SEO** (Settings) | Meta tags & Open Graph |
| **FAQs** | Common Questions section |
| **Testimonials** | Testimonial blocks (if used) |
| **Subscribers / Contact** | Form submissions from the site |

The Next.js app calls `GET /api/v1/bootstrap` on each page load (cached 60s). If the API is down, it falls back to static `lib/data.ts`.

## SEO management (admin)

1. Log in at **Settings → SEO** (`/admin/manage-seo`).
2. Configure **site URL**, default/home meta tags, OG image, robots, and Search Console verification.
3. Per post: edit any **Post / Issue** → **SEO** section (meta title, description, keywords, OG image, canonical, robots).

The Next.js site reads SEO from `GET /api/v1/seo` and per-post `seo` in `GET /api/v1/posts/{slug}`.

Set `FRONTEND_URL` in `backend/.env` (e.g. `http://localhost:3000`) so canonical URLs are correct.

## Connect Next.js frontend

Add to frontend `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

SEO metadata is loaded from the API (revalidates every 60s). Posts still fall back to static `lib/data.ts` if the API is unavailable.
