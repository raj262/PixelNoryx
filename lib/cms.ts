import type { AdGradientKey } from "@/lib/ad-gradients";
import type { AdPlacement } from "@/lib/ads";
import type { SiteBootstrap } from "@/lib/cms-types";
import { adPlacements as fallbackAds } from "@/lib/ads";
import {
  faqs as fallbackFaqs,
  footerLinks as fallbackFooterLinks,
  navLinks as fallbackNavLinks,
  newsletterIssues as fallbackPosts,
  newsletterTopics as fallbackTopics,
  siteConfig as fallbackSiteConfig,
  socialLinks as fallbackSocialLinks,
  socialStats as fallbackSocialStats,
  subscribeBenefits as fallbackSubscribeBenefits,
  testimonials as fallbackTestimonials,
  getIssueBySlug as fallbackGetIssueBySlug,
} from "@/lib/data";
import type { NewsletterIssue } from "@/lib/types";

import { apiUrl } from "@/lib/api-config";
import { normalizeMediaUrl } from "@/lib/media";

const REVALIDATE = 60;
const TIMEOUT_MS = 8000;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): NewsletterIssue {
  return {
    id: raw.id,
    issueNumber: raw.issueNumber ?? raw.issue_number,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? "",
    preview: raw.preview ?? "",
    content: raw.content ?? "",
    image: normalizeMediaUrl(raw.image ?? ""),
    topic: raw.topic ?? raw.category ?? "Frontend",
    author: raw.author ?? "PixelNoryx",
    authorRole: raw.authorRole ?? raw.author_role ?? "Editor",
    date: raw.date ?? "",
    readTime: raw.readTime ?? raw.read_time ?? "5 min read",
    tags: raw.tags ?? [],
    featured: Boolean(raw.featured ?? raw.is_featured),
    free: raw.free !== false,
    sponsored: Boolean(raw.sponsored ?? raw.is_sponsored),
    commentCount: raw.commentCount ?? raw.comment_count ?? 0,
  };
}

function mapAds(raw?: Record<string, AdPlacement>): Record<string, AdPlacement> {
  if (!raw || Object.keys(raw).length === 0) {
    return { ...fallbackAds };
  }

  const mapped: Record<string, AdPlacement> = {};
  for (const [key, ad] of Object.entries(raw)) {
    mapped[key] = {
      id: ad.id ?? key,
      size: ad.size as AdPlacement["size"],
      title: ad.title,
      subtitle: ad.subtitle,
      cta: ad.cta,
      href: ad.href,
      sponsor: ad.sponsor,
      gradient: (ad.gradient ?? "brand") as AdGradientKey,
    };
  }
  return mapped;
}

export function buildFallbackBootstrap(): SiteBootstrap {
  return {
    settings: {
      name: fallbackSiteConfig.name,
      tagline: fallbackSiteConfig.tagline,
      description: fallbackSiteConfig.description,
      subscriberCount: fallbackSiteConfig.subscriberCount,
      frequency: fallbackSiteConfig.frequency,
      contactEmail: "designer.rajesh567@gmail.com",
      communitySize: "25K+",
      author: { ...fallbackSiteConfig.author },
      socialStats: [...fallbackSocialStats],
      socialLinks: [...fallbackSocialLinks],
      navLinks: [...fallbackNavLinks],
      footerLinks: { ...fallbackFooterLinks },
      subscribeBenefits: [...fallbackSubscribeBenefits],
    },
    categories: fallbackTopics.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\./g, ""),
      href: `/archive?topic=${encodeURIComponent(name)}`,
    })),
    topics: [...fallbackTopics],
    posts: [...fallbackPosts],
    faqs: [...fallbackFaqs],
    testimonials: [...fallbackTestimonials],
    ads: mapAds(undefined),
    ai: { enabled: false, configured: false, ready: false, label: "PixelNoryx AI" },
    whatsapp: {
      enabled: false,
      number: "",
      displayNumber: "",
      message: "",
      url: null,
    },
  };
}

export async function getBootstrap(): Promise<SiteBootstrap> {
  const data = await apiGet<SiteBootstrap>("/bootstrap");
  if (!data) return buildFallbackBootstrap();

  return {
    ...data,
    posts: (data.posts ?? []).map(mapPost),
    settings: {
      ...data.settings,
      author: {
        ...data.settings.author,
        image: normalizeMediaUrl(data.settings.author?.image ?? ""),
      },
    },
    testimonials: (data.testimonials ?? []).map((t) => ({
      ...t,
      image: t.image ? normalizeMediaUrl(t.image) : t.image,
    })),
    ads: mapAds(data.ads),
    ai: data.ai ?? { enabled: false, configured: false, ready: false, label: "PixelNoryx AI" },
    whatsapp: data.whatsapp ?? {
      enabled: false,
      number: "",
      displayNumber: "",
      message: "",
      url: null,
    },
  };
}

export async function getPostBySlug(slug: string): Promise<NewsletterIssue | null> {
  const raw = await apiGet<NewsletterIssue>(`/posts/${slug}`);
  if (raw) return mapPost(raw);
  return fallbackGetIssueBySlug(slug) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const { posts } = await getBootstrap();
  return posts.map((p) => p.slug);
}

export function getSiteConfigFromBootstrap(data: SiteBootstrap) {
  const { settings } = data;
  return {
    name: settings.name,
    tagline: settings.tagline,
    description: settings.description,
    subscriberCount: settings.subscriberCount,
    frequency: settings.frequency,
    author: settings.author,
  };
}

export function getCategoryNav(data: SiteBootstrap) {
  return data.categories.map((c) => ({
    label: c.name,
    href: c.href,
  }));
}

export { fetchSeo } from "@/lib/api";
