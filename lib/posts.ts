import { clientApiFetch } from "@/lib/api-fetch";
import { normalizeMediaUrl } from "@/lib/media";
import type { NewsletterIssue } from "@/lib/types";

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

/** Fresh published posts from the API (bypasses Next.js build cache). */
export async function fetchPublishedPosts(topic?: string): Promise<NewsletterIssue[]> {
  const params = new URLSearchParams({ per_page: "100" });
  if (topic?.trim()) {
    params.set("topic", topic.trim());
  }

  const res = await clientApiFetch(`/posts?${params.toString()}`);
  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as { data?: unknown[] };
  return (json.data ?? []).map(mapPost);
}
