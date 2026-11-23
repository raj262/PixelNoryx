import type { Post, PostStatus } from "@prisma/client";

export type PostInput = {
  title: string;
  slug: string;
  excerpt?: string;
  preview?: string;
  content?: string;
  image?: string;
  topic?: string;
  tags?: string[];
  readTime?: string;
  status?: PostStatus;
  featured?: boolean;
  free?: boolean;
  sponsored?: boolean;
  issueNumber?: number | null;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string;
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

export function serializeTags(tags: string[] | undefined) {
  return JSON.stringify(tags ?? []);
}

export function toPostDto(post: Post) {
  return {
    ...post,
    tags: parseTags(post.tags),
  };
}

export function normalizePostInput(body: Partial<PostInput>) {
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? slugify(title)).trim() || slugify(title);
  if (!title) {
    throw new Error("Title is required");
  }
  if (!slug) {
    throw new Error("Slug is required");
  }

  const status = (body.status ?? "DRAFT") as PostStatus;
  const publishedAt =
    status === "PUBLISHED"
      ? body.publishedAt
        ? new Date(body.publishedAt)
        : new Date()
      : body.publishedAt
        ? new Date(body.publishedAt)
        : null;

  return {
    title,
    slug,
    excerpt: String(body.excerpt ?? "").trim(),
    preview: String(body.preview ?? "").trim(),
    content: String(body.content ?? ""),
    image: String(body.image ?? "").trim(),
    topic: String(body.topic ?? "Frontend").trim() || "Frontend",
    tags: serializeTags(body.tags),
    readTime: String(body.readTime ?? "5 min read").trim() || "5 min read",
    status,
    featured: Boolean(body.featured),
    free: body.free !== false,
    sponsored: Boolean(body.sponsored),
    issueNumber:
      body.issueNumber === null || body.issueNumber === undefined
        ? null
        : Number(body.issueNumber),
    publishedAt,
    metaTitle: body.metaTitle?.trim() || null,
    metaDescription: body.metaDescription?.trim() || null,
    metaKeywords: body.metaKeywords?.trim() || null,
    ogImage: body.ogImage?.trim() || null,
    canonicalUrl: body.canonicalUrl?.trim() || null,
    robots: String(body.robots ?? "index, follow").trim() || "index, follow",
  };
}
