/**
 * Laravel API base URL (includes /api/v1).
 *
 * - NEXT_PUBLIC_API_URL — direct API (cross-origin; needs CORS on Laravel)
 * - NEXT_PUBLIC_USE_API_PROXY=true — browser calls same-origin /api-proxy/v1 (no CORS)
 */
export function getApiBaseUrl(): string {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true"
  ) {
    return "/api-proxy/v1";
  }

  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? "https://admin.rajeshcodes.in/api/v1";
  return raw.replace(/\/$/, "");
}

/** Target host for Next.js rewrite (server-side only). */
export function getApiProxyTarget(): string {
  const raw =
    process.env.API_PROXY_TARGET ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
    "https://admin.rajeshcodes.in";
  return raw.replace(/\/$/, "");
}
