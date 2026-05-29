import { apiUrl } from "@/lib/api-config";

const JSON_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/** Client-side JSON API request (uses proxy when enabled). */
export async function clientApiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...init?.headers,
    },
  });
}

/** Server-side JSON API request (always direct URL). */
export async function serverApiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(apiUrl(path, { server: true }), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });
}
