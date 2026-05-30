# Deploy PixelNoryx on Vercel

You **do not** upload `.env` to Git or Vercel. Set variables in the Vercel dashboard.

## 1. Vercel environment variables

**Project → Settings → Environment Variables** → add for **Production** (and Preview if you want):

| Name | Value | Required |
|------|--------|----------|
| `NEXT_PUBLIC_API_URL` | `https://admin.rajeshcodes.in/api/v1` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://www.pixelnoryx.com` (no trailing slash) | Yes — used by `next-sitemap` for sitemap & robots.txt |
| `NEXT_PUBLIC_GA_ID` | `G-15PBQ74TNC` | Optional (Google Analytics) |
| `NEXT_PUBLIC_CLARITY_ID` | `wyzy74qijw` | Optional (Microsoft Clarity) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | *(from `php artisan push:vapid-keys`)* | Optional (web push) |
| `API_PROXY_TARGET` | `https://admin.rajeshcodes.in` | Optional (defaults to same host as API URL) |

Do **not** set `NEXT_PUBLIC_USE_API_PROXY=false` on Vercel unless Laravel CORS allows `https://www.pixelnoryx.com`. When unset, the browser automatically calls `/api-proxy/v1/...` (same origin, no CORS).

### CORS / register / subscribe

If the browser calls `admin.rajeshcodes.in` directly from `www.pixelnoryx.com`, Laravel must allow that origin. Deploy updated `backend/config/cors.php` (includes `*.pixelnoryx.com`) and set on Hostinger:

```env
FRONTEND_URL=https://www.pixelnoryx.com
CORS_ALLOWED_ORIGINS=https://www.pixelnoryx.com,https://pixelnoryx.com
```

Then run `php artisan config:clear`.

**Recommended:** leave `NEXT_PUBLIC_USE_API_PROXY` unset on Vercel. After redeploy, Network tab should show:

`https://www.pixelnoryx.com/api-proxy/v1/auth/register`

not `admin.rajeshcodes.in`.

## 2. Redeploy after adding variables

Environment variables apply on the **next deployment** only:

- **Deployments** → … → **Redeploy**, or push a new commit.

## 3. Backend (Laravel on Hostinger)

SSR on Vercel still calls `NEXT_PUBLIC_API_URL` from Vercel’s servers (server-to-server, no browser CORS).

Optional: add your Vercel URL to Laravel `CORS_ALLOWED_ORIGINS` on `admin.rajeshcodes.in` if you disable the proxy later.

## 4. Local development

Copy `.env.example` to `.env.local` (gitignored):

```env
NEXT_PUBLIC_API_URL=https://admin.rajeshcodes.in/api/v1
NEXT_PUBLIC_USE_API_PROXY=true
API_PROXY_TARGET=https://admin.rajeshcodes.in
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

## 5. Checklist if subscribe still fails

1. `NEXT_PUBLIC_API_URL` is set in Vercel and you **redeployed**.
2. Browser Network tab: request should be `/api-proxy/v1/subscribe`, not `admin.rajeshcodes.in`.
3. Laravel API is up: open `https://admin.rajeshcodes.in/api/v1/bootstrap` in a tab.
