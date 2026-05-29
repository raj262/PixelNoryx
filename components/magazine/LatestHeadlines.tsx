"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import type { NewsletterIssue } from "@/lib/types";
import { getTopicColor } from "@/lib/topic-colors";
import { cn } from "@/lib/utils";

interface LatestHeadlinesProps {
  posts: NewsletterIssue[];
  className?: string;
}

export default function LatestHeadlines({ posts, className }: LatestHeadlinesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card lg:col-span-1",
        className
      )}
    >
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-foreground via-foreground to-foreground/95 px-5 py-4">
        <div className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-primary/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 start-0 h-20 w-20 rounded-full bg-indigo-500/20 blur-xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/90 text-white shadow-md shadow-primary/30">
              <Newspaper className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-white">
                Latest Headlines
              </h3>
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                Fresh from the desk
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>
      </div>

      <ol className="flex flex-1 flex-col divide-y divide-border/70">
        {posts.map((post, index) => {
          const rank = String(index + 2).padStart(2, "0");
          const href = `/archive/${post.slug}`;

          return (
            <li key={post.slug}>
              <Link
                href={href}
                className="group relative flex gap-3 px-4 py-4 transition-colors hover:bg-gradient-to-r hover:from-primary/[0.04] hover:to-transparent sm:gap-4 sm:px-5"
              >
                <span
                  className="absolute start-0 top-3 bottom-3 w-0.5 scale-y-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-y-100"
                  aria-hidden
                />

                <span className="font-display text-2xl font-bold leading-none text-border/80 transition-colors group-hover:text-primary/40 sm:text-3xl">
                  {rank}
                </span>

                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-border/60 shadow-sm sm:h-20 sm:w-20">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="80px"
                  />
                  {post.issueNumber ? (
                    <span className="absolute bottom-0 start-0 rounded-se-lg bg-foreground/85 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      #{post.issueNumber}
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 py-0.5">
                  <span
                    className={cn(
                      "inline-block rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      getTopicColor(post.topic)
                    )}
                  >
                    {post.topic}
                  </span>
                  <h4 className="mt-1.5 font-display text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="meta-line mt-1.5 flex flex-wrap items-center gap-x-1.5">
                    <time dateTime={post.date}>{post.date}</time>
                    <span className="text-border">·</span>
                    <span>{post.readTime}</span>
                  </p>
                </div>

                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-border opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-border/80 bg-gradient-to-r from-surface/80 to-white px-5 py-3.5">
        <Link
          href="/archive"
          className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:text-primary"
        >
          All headlines
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
