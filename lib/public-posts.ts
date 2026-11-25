import { enrichPostContent } from "@/lib/article-bodies";
import { newsletterIssues } from "@/lib/data";
import { parseTags } from "@/lib/admin-posts";
import { normalizeMediaUrl } from "@/lib/media";
import type { NewsletterIssue } from "@/lib/types";

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function localPosts(): NewsletterIssue[] {
  return newsletterIssues.map((post) => enrichPostContent({ ...post }));
}

async function neonPublishedPosts(): Promise<NewsletterIssue[]> {
  try {
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: { author: { select: { name: true } } },
    });

    return rows.map((row) =>
      enrichPostContent({
        id: Number.parseInt(String(row.id).replace(/\D/g, "").slice(-6), 10) || 0,
        issueNumber: row.issueNumber ?? undefined,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        preview: row.preview,
        content: row.content,
        image: normalizeMediaUrl(row.image),
        topic: row.topic,
        author: row.author?.name ?? "PixelNoryx",
        authorRole: "Editor",
        date: formatDate(row.publishedAt ?? row.createdAt),
        readTime: row.readTime,
        tags: parseTags(row.tags),
        featured: row.featured,
        free: row.free,
        sponsored: row.sponsored,
        commentCount: row.commentCount,
        metaTitle: row.metaTitle ?? undefined,
        metaDescription: row.metaDescription ?? undefined,
        metaKeywords: row.metaKeywords
          ? row.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
          : undefined,
      })
    );
  } catch {
    return [];
  }
}

/** Published posts for the public site (Neon + local articles). */
export async function getPublishedPosts(topic?: string): Promise<NewsletterIssue[]> {
  const bySlug = new Map<string, NewsletterIssue>();

  for (const post of await neonPublishedPosts()) {
    bySlug.set(post.slug, post);
  }
  for (const post of localPosts()) {
    if (!bySlug.has(post.slug)) {
      bySlug.set(post.slug, post);
    } else {
      // Prefer richer local body when Neon content is thin
      const existing = bySlug.get(post.slug)!;
      if ((existing.content?.length ?? 0) < 200 && (post.content?.length ?? 0) > 200) {
        bySlug.set(post.slug, { ...existing, content: post.content });
      }
    }
  }

  let posts = Array.from(bySlug.values()).sort(
    (a, b) => (b.issueNumber ?? 0) - (a.issueNumber ?? 0)
  );

  if (topic?.trim()) {
    const t = topic.trim().toLowerCase();
    posts = posts.filter((p) => p.topic.toLowerCase() === t);
  }

  return posts;
}
