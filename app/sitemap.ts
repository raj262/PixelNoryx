import type { MetadataRoute } from "next";
import { newsletterIssues, newsletterTopics } from "@/lib/data";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pixelnoryx.com"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/archive`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = newsletterTopics.map((topic) => ({
    url: `${SITE_URL}/archive?topic=${encodeURIComponent(topic)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const slugs = new Set(newsletterIssues.map((p) => p.slug));

  try {
    const { prisma } = await import("@/lib/db");
    const dbPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    for (const post of dbPosts) {
      if (post.slug) slugs.add(post.slug);
    }
  } catch {
    // Neon unavailable at build — local articles still cover the sitemap.
  }

  const articlePages: MetadataRoute.Sitemap = [...slugs].map((slug) => {
    const local = newsletterIssues.find((p) => p.slug === slug);
    return {
      url: `${SITE_URL}/archive/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: local?.featured ? 0.9 : 0.8,
    };
  });

  return [...staticPages, ...topicPages, ...articlePages];
}
