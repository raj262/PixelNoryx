/**
 * Laravel API base URL (includes /api/v1).
 * Browser and server both call NEXT_PUBLIC_API_URL directly unless proxy is enabled.
 */

const DEFAULT_API = "https://admin.rajeshcodes.in/api/v1";

export function getServerApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
  return raw.replace(/\/$/, "");
}

/** Same-origin Next.js rewrite proxy — opt-in only via NEXT_PUBLIC_USE_API_PROXY=true */
export function shouldUseApiProxy(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true" ||
    process.env.NEXT_PUBLIC_USE_API_PROXY === "1"
  );
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
