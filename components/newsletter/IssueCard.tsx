"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { NewsletterIssue } from "@/lib/types";

interface IssueCardProps {
  issue: NewsletterIssue;
  index?: number;
  layout?: "grid" | "list";
}

export default function IssueCard({
  issue,
  index = 0,
  layout = "grid",
}: IssueCardProps) {
  const href = `/archive/${issue.slug}`;

  if (layout === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          href={href}
          className="group flex gap-6 border-b border-white/[0.08] py-6 transition-colors hover:bg-white/[0.02]"
        >
          <span className="font-display text-3xl font-bold text-white/10 group-hover:text-primary/40">
            #{issue.issueNumber}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-medium text-primary">
                {issue.topic}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {issue.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {issue.readTime}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary">
              {issue.title}
            </h3>
            <p className="mt-2 text-sm text-muted line-clamp-2">{issue.excerpt}</p>
          </div>
          <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06 }}
      className="group"
    >
      <Link
        href={href}
        className="glass glass-hover flex h-full flex-col overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={issue.image}
            alt={issue.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-lg bg-background/80 px-2.5 py-1 font-display text-sm font-bold backdrop-blur-sm">
              #{issue.issueNumber}
            </span>
            {issue.free && (
              <span className="rounded-lg bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white">
                Free
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="text-xs font-medium text-primary">{issue.topic}</span>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
            {issue.title}
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">
            {issue.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>{issue.date}</span>
            <span className="flex items-center gap-1 font-medium text-primary">
              Read issue
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
