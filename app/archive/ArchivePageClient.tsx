"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { newsletterIssues, newsletterTopics } from "@/lib/data";
import type { NewsletterTopic } from "@/lib/types";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";
import { cn } from "@/lib/utils";

function ArchiveGrid() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") as NewsletterTopic | null;

  const filtered = useMemo(() => {
    if (!topicParam || !newsletterTopics.includes(topicParam)) {
      return newsletterIssues;
    }
    return newsletterIssues.filter((i) => i.topic === topicParam);
  }, [topicParam]);

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
        {newsletterTopics.map((t) => (
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

      <div className="grid gap-8 sm:grid-cols-2">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} variant="standard" />
        ))}
      </div>
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
