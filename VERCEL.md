# Deploy PixelNoryx on Vercel

You **do not** upload `.env` to Git or Vercel. Set variables in the Vercel dashboard.

## 1. Vercel environment variables

**Project → Settings → Environment Variables** → add for **Production** (and Preview if you want):

| Name | Value | Required |
|------|--------|----------|
| `NEXT_PUBLIC_API_URL` | `https://admin.rajeshcodes.in/api/v1` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://pixelnoryx.com/` or custom domain | Yes |
| `NEXT_PUBLIC_GA_ID` | `G-15PBQ74TNC` | Optional (Google Analytics) |
| `NEXT_PUBLIC_CLARITY_ID` | `wyzy74qijw` | Optional (Microsoft Clarity) |
| `API_PROXY_TARGET` | `https://admin.rajeshcodes.in` | Optional (defaults to same host as API URL) |

### CORS / subscribe (why it broke)

The browser cannot read server-only `VERCEL=1`. Without env vars, the app called `admin.rajeshcodes.in` directly, and the **live Laravel server did not allow `*.vercel.app` origins** → CORS error.

**Fixed in code:** the browser auto-uses `/api-proxy/v1` when the API host ≠ your site host (e.g. Vercel → rajeshcodes.in).

After redeploy, Network tab should show:

`https://your-app.vercel.app/api-proxy/v1/subscribe`

not `admin.rajeshcodes.in`.

**Also deploy** updated `backend/config/cors.php` to Hostinger (adds `*.vercel.app` pattern) and run `php artisan config:clear`.

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
