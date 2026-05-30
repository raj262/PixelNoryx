const DEFAULT_API_ORIGIN = "https://admin.rajeshcodes.in";

const FALLBACK_POST_IMAGE =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80";

/** Rewrite localhost storage URLs to the live admin origin. */
export function normalizeMediaUrl(url?: string | null): string {
  if (!url?.trim()) {
    return FALLBACK_POST_IMAGE;
  }

  const trimmed = url.trim();

  const apiOrigin = (
    process.env.NEXT_PUBLIC_API_URL ?? `${DEFAULT_API_ORIGIN}/api/v1`
  )
    .replace(/\/api\/v1\/?$/, "")
    .replace(/\/$/, "");

  const localhostMatch = trimmed.match(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/.*)$/i);
  if (localhostMatch) {
    return `${apiOrigin}${localhostMatch[3]}`;
  }

  if (trimmed.startsWith("/storage/")) {
    return `${apiOrigin}${trimmed}`;
  }

  if (trimmed.startsWith("storage/")) {
    return `${apiOrigin}/${trimmed}`;
  }

  return trimmed;
}

export { FALLBACK_POST_IMAGE };
