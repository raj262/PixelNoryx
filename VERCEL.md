# Deploy PixelNoryx on Vercel

Do **not** commit `.env` files. Set variables in the Vercel dashboard.

## Required environment variables

| Name | Example / notes |
|------|------------------|
| `DATABASE_URL` | Neon **pooled** URL + `&connect_timeout=15&pool_timeout=15` |
| `DIRECT_URL` | Neon **direct** (no `-pooler`) URL + `&connect_timeout=15` |
| `ADMIN_SESSION_SECRET` | Long random string |
| `NEXT_PUBLIC_SITE_URL` | `https://www.pixelnoryx.com` |

## Optional

| Name | Notes |
|------|--------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Defaults in code if unset |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_ENDPOINT_URL_S3` / `AWS_REGION` | After `neon login` + `neon deploy` |

## After changing env

**Deployments → Redeploy.** Env vars apply only on the next deployment.

## Admin

- URL: `https://www.pixelnoryx.com/admin`
- Seed login: `admin@pixelnoryx.com` / `admin123` (change after first login)

Health check: `https://www.pixelnoryx.com/api/health/neon`
