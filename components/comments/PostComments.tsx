"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Reply, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  authorInitials,
  createPostComment,
  deletePostComment,
  fetchPostComments,
  type PostComment,
} from "@/lib/comments";
import { cn } from "@/lib/utils";

function CommentItem({
  comment,
  slug,
  currentUserId,
  onChanged,
  depth = 0,
}: {
  comment: PostComment;
  slug: string;
  currentUserId?: number;
  onChanged: () => void;
  depth?: number;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwn = currentUserId === comment.author.id;
  const canReply = depth === 0;

  const submitReply = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await createPostComment(slug, replyBody.trim(), comment.id);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setReplyBody("");
    setReplyOpen(false);
    onChanged();
  };

  const remove = async () => {
    if (!confirm("Delete this comment?")) return;
    setDeleting(true);
    const result = await deletePostComment(slug, comment.id);
    setDeleting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onChanged();
  };

  return (
    <div className={cn(depth > 0 && "ms-4 border-s-2 border-primary/15 ps-4 sm:ms-8 sm:ps-6")}>
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
          {authorInitials(comment.author.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-foreground">{comment.author.name}</span>
            <time className="text-xs text-muted" dateTime={comment.createdAt}>
              {comment.createdAtHuman}
            </time>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {comment.body}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {canReply ? (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </button>
            ) : null}
            {isOwn ? (
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-primary disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-xs text-primary">{error}</p> : null}
          {replyOpen ? (
            <form onSubmit={submitReply} className="mt-3 space-y-2">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                rows={3}
                required
                minLength={2}
                maxLength={2000}
                placeholder="Write a reply…"
                className="w-full resize-y rounded-xl border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || replyBody.trim().length < 2}
                  className="rounded-full bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary disabled:opacity-50"
                >
                  {submitting ? "Posting…" : "Post reply"}
                </button>
                <button
                  type="button"
                  onClick={() => setReplyOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <div key={reply.id} className="mt-4">
          <CommentItem
            comment={reply}
            slug={slug}
            currentUserId={currentUserId}
            onChanged={onChanged}
            depth={depth + 1}
          />
        </div>
      ))}
    </div>
  );
}

export default function PostComments({
  slug,
  initialCount = 0,
}: {
  slug: string;
  initialCount?: number;
}) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [count, setCount] = useState(initialCount);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await fetchPostComments(slug);
    setLoading(false);
    if (!result.ok) {
      setLoadError(result.message);
      return;
    }
    setComments(result.comments);
    setCount(result.count);
  }, [slug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);
    const result = await createPostComment(slug, body.trim());
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setBody("");
    await loadComments();
  };

  const loginHref = `/login?next=${encodeURIComponent(`/archive/${slug}`)}`;

  return (
    <section id="comments" className="mt-10 scroll-mt-24">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Discussion
          <span className="ms-2 text-base font-semibold text-muted">({count})</span>
        </h2>
      </div>

      <div className="mt-6 rounded-2xl border border-border/80 bg-surface/50 p-5 sm:p-6">
        {authLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-muted">
              Commenting as <span className="font-semibold text-foreground">{user.name}</span>
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              minLength={2}
              maxLength={2000}
              placeholder="Share your thoughts on this issue…"
              disabled={submitting}
              className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
            {error ? (
              <p className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting || body.trim().length < 2}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted">
            <Link href={loginHref} className="font-semibold text-primary hover:underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href={`/register?next=${encodeURIComponent(`/archive/${slug}`)}`} className="font-semibold text-primary hover:underline">
              create an account
            </Link>{" "}
            to join the discussion.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading comments…
          </div>
        ) : loadError ? (
          <p className="text-sm text-primary">{loadError}</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet. Be the first to share your take.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              currentUserId={user?.id}
              onChanged={loadComments}
            />
          ))
        )}
      </div>
    </section>
  );
}
