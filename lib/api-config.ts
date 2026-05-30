/**
 * Laravel API base URL (includes /api/v1).
 * Browser and server both call NEXT_PUBLIC_API_URL directly unless proxy is enabled.
 */

const DEFAULT_API = "https://admin.rajeshcodes.in/api/v1";

export function getServerApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
  return raw.replace(/\/$/, "");
}

function isApiProxyForcedOff(): boolean {
  const flag = process.env.NEXT_PUBLIC_USE_API_PROXY;
  return flag === "false" || flag === "0";
}

function isApiProxyForcedOn(): boolean {
  const flag = process.env.NEXT_PUBLIC_USE_API_PROXY;
  return flag === "true" || flag === "1";
}

/** True when the browser should call same-origin /api-proxy (avoids CORS). */
export function shouldUseApiProxy(): boolean {
  if (isApiProxyForcedOff()) {
    return false;
  }

  if (isApiProxyForcedOn()) {
    return true;
  }

  // Default in the browser: proxy when API host differs from the page (e.g. pixelnoryx.com → admin.rajeshcodes.in)
  if (typeof window !== "undefined") {
    try {
      const apiHost = new URL(getServerApiBaseUrl()).host;
      return apiHost !== window.location.host;
    } catch {
      return false;
    }
  }

  return false;
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
