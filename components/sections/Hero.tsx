"use client";

import { motion } from "framer-motion";
import { Users, Mail } from "lucide-react";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import FloatingGradients from "@/components/ui/FloatingGradients";
import { siteConfig, getLatestIssue } from "@/lib/data";
import Link from "next/link";

export default function Hero() {
  const latest = getLatestIssue();

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-accent-glow" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <FloatingGradients />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <Mail className="h-4 w-4" />
          {siteConfig.frequency} · Free
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {siteConfig.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 flex justify-center"
        >
          <SubscribeForm variant="hero" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted"
        >
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <strong className="text-foreground">{siteConfig.subscriberCount}</strong>{" "}
            subscribers
          </span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <Link
            href={`/archive/${latest.slug}`}
            className="text-primary hover:underline"
          >
            Read Issue #{latest.issueNumber} →
          </Link>
        </motion.div>

        {/* Newsletter preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative mx-auto mt-16 max-w-lg"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/25 to-accent/25 blur-2xl" />
          <div className="glass relative rounded-2xl border border-white/10 p-6 text-left shadow-glass">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    PixelNoryx
                  </p>
                  <p className="text-[10px] text-muted">Issue #{latest.issueNumber}</p>
                </div>
              </div>
              <span className="text-xs text-muted">Tue, 9:00 AM</span>
            </div>
            <p className="font-display text-lg font-bold text-foreground">
              {latest.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
              {latest.preview}
            </p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
            <p className="mt-2 text-xs text-muted">{latest.readTime} remaining</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
