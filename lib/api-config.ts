/**
 * Laravel API base URL (includes /api/v1).
 *
 * Browser on Vercel / local with proxy → same-origin /api-proxy/v1 (no CORS)
 * Server / SSR → always direct NEXT_PUBLIC_API_URL
 */

const DEFAULT_API = "https://admin.rajeshcodes.in/api/v1";

export function getServerApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
  return raw.replace(/\/$/, "");
}

/** Use Next.js rewrite proxy in the browser (avoids CORS). Auto-on for Vercel. */
export function shouldUseApiProxy(): boolean {
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "false") {
    return false;
  }
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "true") {
    return true;
  }
  // Vercel sets VERCEL=1 — enable proxy so you don't need a .env file for CORS
  return process.env.VERCEL === "1";
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && shouldUseApiProxy()) {
    return "/api-proxy/v1";
  }

  return getServerApiBaseUrl();
}

/** Build full URL for an API path (e.g. `/subscribe`). */
export function apiUrl(path: string, options?: { server?: boolean }): string {
  const base = options?.server ? getServerApiBaseUrl() : getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Target host for Next.js rewrite (server-side only). */
export function getApiProxyTarget(): string {
  const raw =
    process.env.API_PROXY_TARGET ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
    "https://admin.rajeshcodes.in";
  return raw.replace(/\/$/, "");
}
