"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List } from "lucide-react";
import { newsletterIssues, newsletterTopics } from "@/lib/data";
import type { NewsletterTopic } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import IssueCard from "@/components/newsletter/IssueCard";
import { cn } from "@/lib/utils";

interface NewsletterArchiveProps {
  limit?: number;
  showHeading?: boolean;
}

export default function NewsletterArchive({
  limit,
  showHeading = true,
}: NewsletterArchiveProps) {
  const [topic, setTopic] = useState<NewsletterTopic | "All">("All");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const issues =
      topic === "All"
        ? newsletterIssues
        : newsletterIssues.filter((i) => i.topic === topic);
    return limit ? issues.slice(0, limit) : issues;
  }, [topic, limit]);

  return (
    <section id="archive" className="section-padding">
      <div className="mx-auto max-w-7xl">
        {showHeading && (
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              badge="Archive"
              title="Past Issues"
              description="Every edition, free to read. Filter by topic."
              align="left"
              className="mb-0"
            />
            <div className="flex items-center gap-3">
              <Link
                href="/archive"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                Full archive
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex rounded-lg border border-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  className={cn(
                    "rounded-md p-2",
                    layout === "grid" ? "bg-white/10 text-foreground" : "text-muted"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  className={cn(
                    "rounded-md p-2",
                    layout === "list" ? "bg-white/10 text-foreground" : "text-muted"
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopic("All")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              topic === "All"
                ? "bg-gradient-to-r from-primary to-accent text-white"
                : "glass text-muted hover:text-foreground"
            )}
          >
            All
          </button>
          {newsletterTopics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                topic === t
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "glass text-muted hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {layout === "grid" ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue, i) => (
              <IssueCard key={issue.slug} issue={issue} index={i} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl px-6">
            {filtered.map((issue, i) => (
              <IssueCard key={issue.slug} issue={issue} index={i} layout="list" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
