"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePosts, useSiteData } from "@/components/providers/SiteDataProvider";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";
import { fetchPublishedPosts } from "@/lib/posts";
import type { NewsletterIssue } from "@/lib/types";
import { cn } from "@/lib/utils";

function ArchiveGrid() {
  const searchParams = useSearchParams();
  const bootstrapPosts = usePosts();
  const { topics } = useSiteData();
  const topicParam = searchParams.get("topic");

  const activeTopic =
    topicParam && topics.includes(topicParam) ? topicParam : undefined;

  const [posts, setPosts] = useState<NewsletterIssue[]>(bootstrapPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const live = await fetchPublishedPosts(activeTopic);
      if (cancelled) return;
      setPosts(live);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeTopic]);

  const filtered = useMemo(() => {
    if (!activeTopic) {
      return posts;
    }
    return posts.filter((i) => i.topic === activeTopic);
  }, [activeTopic, posts]);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/archive"
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-wide",
            !topicParam
              ? "bg-primary text-white"
              : "border border-border bg-white hover:border-primary"
          )}
        >
          All
        </Link>
        {topics.map((t) => (
          <Link
            key={t}
            href={`/archive?topic=${encodeURIComponent(t)}`}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wide",
              topicParam === t
                ? "bg-primary text-white"
                : "border border-border bg-white hover:border-primary"
            )}
          >
            {t}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} variant="standard" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-surface/50 px-6 py-10 text-center text-sm text-muted">
          {activeTopic ? (
            <>
              <p>No published posts in “{activeTopic}” yet.</p>
              <p className="mt-3 text-xs">
                In admin → <strong>Posts</strong>, open your post, set{" "}
                <strong>Category</strong> to “{activeTopic}”, set{" "}
                <strong>Status</strong> to <strong>Published</strong>, then save.
                Draft posts never appear on the site.
              </p>
            </>
          ) : (
            <p>No published posts yet.</p>
          )}
        </div>
      )}
    </>
  );
}

export default function ArchivePageClient() {
  return (
    <div className="py-10">
      <div className="magazine-container">
        <p className="section-subtitle">Archive</p>
        <h1 className="section-title">Latest Posts</h1>
        <p className="mt-2 text-muted">Stay up-to-date with all published issues.</p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Suspense
              fallback={
                <div className="grid gap-8 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-80 animate-pulse bg-surface" />
                  ))}
                </div>
              }
            >
              <ArchiveGrid />
            </Suspense>
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
