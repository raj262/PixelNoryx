import type { PostSeoPayload, SeoPayload } from "@/lib/seo-types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001/api/v1";

const defaultRevalidate = 60;

const FETCH_TIMEOUT_MS = 4000;

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: defaultRevalidate },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = (await res.json()) as { data: T };
    return json.data;
  } catch {
    return null;
  }
}

export function fetchSeo(): Promise<SeoPayload | null> {
  return apiGet<SeoPayload>("/seo");
}

export function fetchPostBySlug(slug: string): Promise<{
  seo: PostSeoPayload;
  title: string;
  excerpt: string;
  image: string;
} | null> {
  return apiGet(`/posts/${slug}`);
}
