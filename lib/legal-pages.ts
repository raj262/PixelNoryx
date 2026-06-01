import { apiUrl } from "@/lib/api-config";

const REVALIDATE = 60;
const TIMEOUT_MS = 8000;

export type LegalPageSlug = "privacy-policy" | "disclaimer" | "terms-and-conditions";

export interface LegalPagePayload {
  slug: LegalPageSlug;
  title: string;
  path: string;
  metaDescription: string;
  content: string;
}

export interface LegalPageIndexItem {
  slug: LegalPageSlug;
  title: string;
  path: string;
}

const FALLBACK_PAGES: Record<LegalPageSlug, LegalPagePayload> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    path: "/privacy-policy",
    metaDescription: "How PixelNoryx collects, uses, and protects your personal information.",
    content:
      "<p>PixelNoryx respects your privacy. Contact hello@pixelnoryx.com for questions about this policy.</p>",
  },
  disclaimer: {
    slug: "disclaimer",
    title: "Disclaimer",
    path: "/disclaimer",
    metaDescription: "Disclaimer for PixelNoryx content, tutorials, and newsletter materials.",
    content:
      "<p>Information on PixelNoryx is provided for educational purposes only and does not constitute professional advice.</p>",
  },
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    path: "/terms-and-conditions",
    metaDescription: "Terms and conditions for using PixelNoryx and subscribing to our newsletter.",
    content:
      "<p>By using PixelNoryx, you agree to our terms. Contact hello@pixelnoryx.com with any questions.</p>",
  },
};

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(apiUrl(path, { server: true }), {
      next: { revalidate: REVALIDATE },
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

export function getLegalPageFallback(slug: LegalPageSlug): LegalPagePayload {
  return FALLBACK_PAGES[slug];
}

export function fetchLegalPage(slug: LegalPageSlug): Promise<LegalPagePayload | null> {
  return apiGet<LegalPagePayload>(`/legal-pages/${slug}`);
}

export async function getLegalPage(slug: LegalPageSlug): Promise<LegalPagePayload> {
  const page = await fetchLegalPage(slug);
  return page ?? getLegalPageFallback(slug);
}

export function fetchLegalPagesIndex(): Promise<LegalPageIndexItem[] | null> {
  return apiGet<LegalPageIndexItem[]>("/legal-pages");
}
