/**
 * Laravel API base URL (includes /api/v1).
 *
 * Browser: use /api-proxy/v1 when API is on another host (fixes Vercel CORS).
 * Server / SSR: always calls NEXT_PUBLIC_API_URL directly.
 */

const DEFAULT_API = "https://admin.rajeshcodes.in/api/v1";

export function getServerApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
  return raw.replace(/\/$/, "");
}

function apiHostFromEnv(): string | null {
  try {
    return new URL(getServerApiBaseUrl()).host;
  } catch {
    return null;
  }
}

/**
 * Use same-origin Next.js rewrite proxy (no browser CORS).
 * VERCEL is only set on the server — also detect cross-origin API host in the browser.
 */
export function shouldUseApiProxy(): boolean {
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "false") {
    return false;
  }
  if (
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true" ||
    process.env.NEXT_PUBLIC_USE_API_PROXY === "1"
  ) {
    return true;
  }

  if (typeof window !== "undefined") {
    const apiHost = apiHostFromEnv();
    if (apiHost && window.location.host && apiHost !== window.location.host) {
      return true;
    }
  }

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
