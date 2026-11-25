import { apiUrl } from "@/lib/api-config";
import { getPublicSiteUrl } from "@/lib/seo";
import type { PostSeoPayload, SeoPayload } from "@/lib/seo-types";

const defaultRevalidate = 60;

const FETCH_TIMEOUT_MS = 4000;

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(apiUrl(path, { server: true }), {
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

function splitKeywords(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

async function fetchSeoFromNeon(): Promise<SeoPayload | null> {
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.seoSetting.findUnique({ where: { id: 1 } });
    if (!row) return null;

    const siteUrl =
      row.siteUrl && !/localhost|127\.0\.0\.1/i.test(row.siteUrl)
        ? row.siteUrl.replace(/\/$/, "")
        : getPublicSiteUrl();

    return {
      siteUrl,
      defaultTitle: row.defaultTitle,
      defaultDescription: row.defaultDescription,
      defaultKeywords: splitKeywords(row.defaultKeywords),
      titleTemplate: row.titleTemplate,
      robots: row.robots || "index, follow",
      verification: {
        google: row.googleSiteVerification || null,
        bing: row.bingSiteVerification || null,
      },
      home: {
        title: row.homeTitle,
        description: row.homeDescription,
        keywords: splitKeywords(row.homeKeywords),
      },
      openGraph: {
        siteName: "PixelNoryx",
        image: row.ogImage || null,
        twitterHandle: row.twitterHandle || null,
      },
    };
  } catch {
    return null;
  }
}

export async function fetchSeo(): Promise<SeoPayload | null> {
  const fromNeon = await fetchSeoFromNeon();
  if (fromNeon) return fromNeon;
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
