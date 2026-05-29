/**
 * Laravel API base URL (includes /api/v1).
 *
 * Browser + NEXT_PUBLIC_USE_API_PROXY=true → same-origin /api-proxy/v1 (no CORS)
 * Server / SSR → always direct NEXT_PUBLIC_API_URL
 */
export function getServerApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? "https://admin.rajeshcodes.in/api/v1";
  return raw.replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true"
  ) {
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
