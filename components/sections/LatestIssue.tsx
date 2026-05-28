"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getLatestIssue } from "@/lib/data";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import SectionHeading from "@/components/ui/SectionHeading";

export default function LatestIssue() {
  const issue = getLatestIssue();

  return (
    <section className="section-padding border-y border-white/[0.06] bg-card/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="Latest Issue"
          title={`Issue #${issue.issueNumber}`}
          description="Read the full edition below or get the next one in your inbox."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[360px]"
          >
            <Image
              src={issue.image}
              alt={issue.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <span className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1 font-display text-sm font-bold">
              #{issue.issueNumber}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary">{issue.topic}</span>
            <h3 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              {issue.title}
            </h3>
            <p className="mt-4 text-lg text-muted">{issue.excerpt}</p>

            <blockquote className="newsletter-quote mt-6 border-l-2 border-primary pl-4 text-foreground/90 italic">
              &ldquo;{issue.preview}&rdquo;
            </blockquote>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {issue.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {issue.readTime}
              </span>
            </div>

            <Link
              href={`/archive/${issue.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
            >
              Read full issue
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="mb-4 text-sm font-medium text-foreground">
                Missed it? Subscribe for the next one.
              </p>
              <SubscribeForm variant="compact" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
