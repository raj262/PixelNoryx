const FALLBACK_POST_IMAGE =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80";

const FALLBACK_AUTHOR_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";

/** Author portrait when admin image is empty. */
export function normalizeAuthorImage(url?: string | null): string {
  if (!url?.trim()) {
    return FALLBACK_AUTHOR_IMAGE;
  }
  return normalizeMediaUrl(url);
}

/** Same-origin path for Laravel public media routes (proxied in next.config.ts). */
export function toStoragePath(url: string): string | null {
  if (url.startsWith("/storage/")) {
    return url.replace(/^\/storage\//, "/media/");
  }

  if (url.startsWith("/media/")) {
    return url;
  }

  if (url.startsWith("storage/")) {
    return `/${url.replace(/^storage\//, "media/")}`;
  }

  if (url.startsWith("media/")) {
    return `/${url}`;
  }

  const match = url.match(/^https?:\/\/[^/]+(\/(?:storage|media)\/(?!https?:\/).*)$/i);
  if (match) {
    return match[1].replace(/^\/storage\//, "/media/");
  }

  return null;
}

/**
 * Normalize post/media URLs for next/image.
 * Laravel storage files are served via same-origin /storage/* or /media/*.
 */
export function normalizeMediaUrl(url?: string | null): string {
  if (!url?.trim()) {
    return FALLBACK_POST_IMAGE;
  }

  const trimmed = url.trim();

  // Legacy broken API shape: http://host/storage/https://cdn.example/...
  const brokenStorage = trimmed.match(/^https?:\/\/[^/]+\/storage\/(https?:\/\/.+)$/i);
  if (brokenStorage) {
    return brokenStorage[1];
  }

  const storagePath = toStoragePath(trimmed);

  if (storagePath) {
    return storagePath;
  }

  return trimmed;
}

export { FALLBACK_AUTHOR_IMAGE, FALLBACK_POST_IMAGE };
