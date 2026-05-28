"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { newsletterIssues, newsletterTopics } from "@/lib/data";
import type { NewsletterTopic } from "@/lib/types";
import IssueCard from "@/components/newsletter/IssueCard";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ArchiveContent() {
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
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/archive"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            !topicParam
              ? "bg-gradient-to-r from-primary to-accent text-white"
              : "glass text-muted hover:text-foreground"
          )}
        >
          All
        </Link>
        {newsletterTopics.map((t) => (
          <Link
            key={t}
            href={`/archive?topic=${encodeURIComponent(t)}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              topicParam === t
                ? "bg-gradient-to-r from-primary to-accent text-white"
                : "glass text-muted hover:text-foreground"
            )}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((issue, i) => (
          <IssueCard key={issue.slug} issue={issue} index={i} layout="grid" />
        ))}
      </div>
    </>
  );
}

export default function ArchivePageClient() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="section-padding mx-auto max-w-7xl pt-0">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              Archive
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              All Issues
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Every edition of The Developer Dispatch — free to read, filter by
              topic.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 lg:sticky lg:top-28">
            <h2 className="font-semibold">Get new issues by email</h2>
            <p className="mt-2 text-sm text-muted">
              Subscribe and never miss a Tuesday send.
            </p>
            <div className="mt-4">
              <SubscribeForm variant="compact" />
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass h-72 animate-pulse rounded-2xl" />
              ))}
            </div>
          }
        >
          <ArchiveContent />
        </Suspense>
      </div>
    </div>
  );
}
