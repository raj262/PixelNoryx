import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import type { PostSeoPayload, SeoPayload } from "@/lib/seo-types";

const fallbackSeo: SeoPayload = {
  siteUrl: "http://localhost:3000",
  defaultTitle: `PixelNoryx | ${siteConfig.tagline}`,
  defaultDescription: siteConfig.description,
  defaultKeywords: ["tech magazine", "developer blog", "newsletter", "react", "laravel"],
  titleTemplate: "%s | PixelNoryx",
  robots: "index, follow",
  verification: { google: null, bing: null },
  home: {
    title: `PixelNoryx | ${siteConfig.tagline}`,
    description: siteConfig.description,
    keywords: ["tech magazine", "developer blog", "newsletter", "react", "laravel"],
  },
  openGraph: {
    siteName: "PixelNoryx",
    image: null,
    twitterHandle: null,
  },
};

export function resolveSeo(seo: SeoPayload | null): SeoPayload {
  return seo ?? fallbackSeo;
}

function robotsMeta(robots: string): Metadata["robots"] {
  const noindex = robots.toLowerCase().includes("noindex");
  const nofollow = robots.toLowerCase().includes("nofollow");

  return {
    index: !noindex,
    follow: !nofollow,
  };
}

export function buildSiteMetadata(seo: SeoPayload | null, page?: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string | null;
  robots?: string;
}): Metadata {
  const config = resolveSeo(seo);
  const title = page?.title ?? config.home.title;
  const description = page?.description ?? config.home.description;
  const keywords = page?.keywords ?? config.home.keywords;
  const image = page?.image ?? config.openGraph.image;
  const url = page?.path ? `${config.siteUrl}${page.path}` : config.siteUrl;

  const metadata: Metadata = {
    title: page?.title
      ? { default: title, template: config.titleTemplate.includes("%s") ? config.titleTemplate : `%s | PixelNoryx` }
      : title,
    description,
    keywords,
    metadataBase: new URL(config.siteUrl),
    robots: robotsMeta(page?.robots ?? config.robots),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: config.openGraph.siteName,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
      ...(config.openGraph.twitterHandle
        ? { creator: config.openGraph.twitterHandle }
        : {}),
    },
  };

  if (config.verification.google) {
    metadata.verification = { google: config.verification.google };
  }

  return metadata;
}

export function buildPostMetadata(
  seo: SeoPayload | null,
  postSeo: PostSeoPayload,
  fallback?: { title: string; description: string; image: string }
): Metadata {
  const config = resolveSeo(seo);
  const title = postSeo.title;
  const description = postSeo.description ?? fallback?.description ?? "";
  const image = postSeo.openGraph.image ?? fallback?.image;

  return {
    title,
    description,
    keywords: postSeo.keywords.length ? postSeo.keywords : undefined,
    robots: robotsMeta(postSeo.robots),
    alternates: { canonical: postSeo.canonical },
    openGraph: {
      type: "article",
      url: postSeo.openGraph.url,
      title: postSeo.openGraph.title,
      description: description || undefined,
      siteName: config.openGraph.siteName,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: postSeo.openGraph.title,
      description: description || undefined,
      ...(image ? { images: [image] } : {}),
    },
  };
}
