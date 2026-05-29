import { getStoredToken } from "@/lib/auth";

import { getApiBaseUrl } from "@/lib/api-config";

const API_BASE = getApiBaseUrl();

export type CommentAuthor = {
  id: number;
  name: string;
};

export type PostComment = {
  id: number;
  body: string;
  parentId: number | null;
  createdAt: string;
  createdAtHuman: string;
  author: CommentAuthor;
  replies?: PostComment[];
};

function authHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function parseError(json: { message?: string; errors?: Record<string, string[]> }, fallback: string) {
  if (json.errors) {
    const first = Object.values(json.errors)[0]?.[0];
    if (first) return first;
  }
  return json.message ?? fallback;
}

export async function fetchPostComments(slug: string): Promise<{
  ok: true;
  comments: PostComment[];
  count: number;
} | { ok: false; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}/comments`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: PostComment[];
      meta?: { count?: number };
      message?: string;
    };

    if (!res.ok) {
      return { ok: false, message: parseError(json, "Could not load comments.") };
    }

    return {
      ok: true,
      comments: json.data ?? [],
      count: json.meta?.count ?? json.data?.length ?? 0,
    };
  } catch {
    return { ok: false, message: "Network error loading comments." };
  }
}

export async function createPostComment(
  slug: string,
  body: string,
  parentId?: number
): Promise<
  | { ok: true; comment: PostComment; count: number }
  | { ok: false; message: string }
> {
  try {
    const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}/comments`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        body,
        ...(parentId ? { parent_id: parentId } : {}),
      }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: PostComment;
      meta?: { count?: number };
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (res.status === 401) {
      return { ok: false, message: "Please sign in to comment." };
    }

    if (!res.ok) {
      return { ok: false, message: parseError(json, "Could not post comment.") };
    }

    if (!json.data) {
      return { ok: false, message: "Invalid server response." };
    }

    return {
      ok: true,
      comment: json.data,
      count: json.meta?.count ?? 0,
    };
  } catch {
    return { ok: false, message: "Network error. Try again." };
  }
}

export async function deletePostComment(
  slug: string,
  commentId: number
): Promise<{ ok: true; count: number } | { ok: false; message: string }> {
  try {
    const res = await fetch(
      `${API_BASE}/posts/${encodeURIComponent(slug)}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      }
    );
    const json = (await res.json().catch(() => ({}))) as {
      meta?: { count?: number };
      message?: string;
    };

    if (res.status === 401) {
      return { ok: false, message: "Please sign in." };
    }

    if (!res.ok) {
      return { ok: false, message: json.message ?? "Could not delete comment." };
    }

    return { ok: true, count: json.meta?.count ?? 0 };
  } catch {
    return { ok: false, message: "Network error." };
  }
}

export function authorInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
