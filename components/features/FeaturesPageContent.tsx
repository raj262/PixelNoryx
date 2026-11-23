"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Command } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import DynamicIcon from "@/components/ui/IconMap";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import { useAi, useSiteConfig, useSiteData } from "@/components/providers/SiteDataProvider";
import {
  editorHighlights,
  platformFeatures,
  readerJourney,
  type ReaderJourneyFeature,
} from "@/lib/features";
import { cn } from "@/lib/utils";

function FeatureCard({
  icon,
  title,
  description,
  href,
  className,
}: {
  icon: string;
  title: string;
  description: string;
  href?: string;
  className?: string;
}) {
  const inner = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <DynamicIcon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary">
          Learn more <ArrowRight className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </>
  );

  const cardClass = cn(
    "group rounded-2xl border border-border/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <article className={cardClass}>{inner}</article>;
}

function JourneyVisual({ accent }: { accent: ReaderJourneyFeature["accent"] }) {
  if (accent === "explore") {
    return (
      <div className="mt-8 space-y-2.5" aria-hidden>
        {["React.js", "Laravel", "SaaS", "UI/UX"].map((topic, i) => (
          <div
            key={topic}
            className={cn(
              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-transform",
              i === 0
                ? "border-primary/30 bg-primary/10 font-semibold text-foreground"
                : "border-white/10 bg-white/5 text-white/70"
            )}
            style={{ transform: `translateX(${i * 4}px)` }}
          >
            <span>{topic}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              {i === 0 ? "Active" : "Browse"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (accent === "search") {
    return (
      <div className="mt-8" aria-hidden>
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3.5 shadow-inner backdrop-blur-sm">
          <DynamicIcon name="Search" className="h-4 w-4 text-white/50" />
          <span className="flex-1 text-sm text-white/45">Search issues…</span>
          <span className="hidden items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60 sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {["Laravel Queues in Production", "SaaS Pricing Pages That Convert"].map(
            (hit) => (
              <div
                key={hit}
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white/80"
              >
                {hit}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-2.5" aria-hidden>
      {["Copy link", "Share", "X", "LinkedIn"].map((action, i) => (
        <span
          key={action}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider",
            i === 1
              ? "border-primary bg-primary text-white"
              : "border-white/15 bg-white/5 text-white/75"
          )}
        >
          {action}
        </span>
      ))}
      <div className="mt-2 w-full rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/55">
        Shared · ready for your team Slack
      </div>
    </div>
  );
}

function JourneyPanel({
  feature,
  index,
}: {
  feature: ReaderJourneyFeature;
  index: number;
}) {
  const panel = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-6 sm:p-8",
        "bg-gradient-to-br text-white shadow-card-hover transition-transform duration-500 hover:-translate-y-1",
        feature.accent === "explore" &&
          "border-rose-500/20 from-[#1a1214] via-[#2a161c] to-[#E63946]/80",
        feature.accent === "search" &&
          "border-slate-500/20 from-[#0f172a] via-[#1e293b] to-[#334155]",
        feature.accent === "share" &&
          "border-cyan-500/20 from-[#0c1a1d] via-[#123039] to-[#0891b2]/70",
        index === 0 && "lg:min-h-[420px]",
        index > 0 && "lg:min-h-[200px]"
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
              {feature.eyebrow}
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-[1.7rem]">
              {feature.title}
            </h3>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
            <DynamicIcon name={feature.icon} className="h-5 w-5" />
          </span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-[15px]">
          {feature.description}
        </p>

        <ul className="mt-5 space-y-2">
          {feature.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              {point}
            </li>
          ))}
        </ul>

        <JourneyVisual accent={feature.accent} />

        {feature.cta && feature.href ? (
          <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-white">
            {feature.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </div>
  );

  if (feature.href) {
    return (
      <Link href={feature.href} className="block h-full">
        {panel}
      </Link>
    );
  }

  return panel;
}

export default function FeaturesPageContent() {
  const siteConfig = useSiteConfig();
  const { settings } = useSiteData();
  const ai = useAi();
  const benefits = settings.subscribeBenefits;

  const visiblePlatform = platformFeatures
    .map((f) => (f.icon === "Sparkles" && !ai.enabled ? null : f))
    .filter(Boolean) as typeof platformFeatures;

  const [explore, search, share] = readerJourney;

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-white/50 py-14 sm:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-slate-400/10 blur-3xl" />
        <div className="magazine-container relative">
          <AnimateIn>
            <p className="section-subtitle">Features</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Everything you get with{" "}
              <span className="text-primary">PixelNoryx</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {siteConfig.description} Built for developers who want practical reads,
              a searchable archive, and tools that respect your time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#subscribe" className="btn-modern">
                Subscribe free
              </Link>
              <Link href="/archive" className="btn-outline-modern">
                Browse archive
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {siteConfig.subscriberCount} subscribers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {siteConfig.frequency}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {settings.communitySize} community
              </li>
            </ul>
          </AnimateIn>
        </div>
      </section>

      {/* Newsletter benefits (from CMS) */}
      <section className="py-14 sm:py-20">
        <div className="magazine-container">
          <AnimateIn>
            <p className="section-subtitle">Newsletter</p>
            <h2 className="section-title mt-2">Built for busy developers</h2>
            <p className="mt-3 max-w-2xl text-muted">
              No noise. No engagement bait. Just practical tech you can use on Monday.
            </p>
          </AnimateIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, index) => (
              <AnimateIn key={item.title} delay={index * 0.06}>
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Explore / Search / Share */}
      <section className="relative overflow-hidden border-y border-border/60 bg-[#f6f3ef] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-slate-400/15 blur-3xl" />

        <div className="magazine-container relative">
          <AnimateIn>
            <div className="max-w-2xl">
              <p className="section-subtitle">Reader experience</p>
              <h2 className="section-title mt-2">
                Explore, search, and share
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                Three moves that make the magazine feel fast: browse by topic, find
                anything instantly, then pass a post to your team.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <AnimateIn className="lg:col-span-5" delay={0.05}>
              <JourneyPanel feature={explore} index={0} />
            </AnimateIn>

            <div className="grid gap-5 lg:col-span-7 lg:gap-6">
              <AnimateIn delay={0.1}>
                <JourneyPanel feature={search} index={1} />
              </AnimateIn>
              <AnimateIn delay={0.15}>
                <JourneyPanel feature={share} index={2} />
              </AnimateIn>
            </div>
          </div>

          {visiblePlatform.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {visiblePlatform.map((item, index) => (
                <AnimateIn key={item.title} delay={0.08 + index * 0.05}>
                  <FeatureCard {...item} className="h-full border-border/60 bg-white/80 backdrop-blur-sm" />
                </AnimateIn>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Platform / admin highlights */}
      <section className="py-14 sm:py-20">
        <div className="magazine-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <AnimateIn className="lg:col-span-5">
              <p className="section-subtitle">Platform</p>
              <h2 className="section-title mt-2">Powered by a real CMS</h2>
              <p className="mt-4 text-muted leading-relaxed">
                PixelNoryx pairs a Next.js magazine frontend with a built-in
                /admin CMS on Neon — posts, SEO, users, and media in one place.
              </p>
              <Link
                href="/archive"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                See it live in the archive <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimateIn>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {editorHighlights.map((item, index) => (
                <AnimateIn key={item.title} delay={index * 0.05}>
                  <FeatureCard {...item} className="h-full bg-surface/50" />
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16">
        <div className="magazine-container">
          <AnimateIn>
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-foreground via-foreground to-foreground/95 p-8 text-white shadow-card-hover sm:p-12">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Get started
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                    Join {siteConfig.subscriberCount} developers
                  </h2>
                  <p className="mt-3 text-sm text-white/70">
                    Free weekly issues — unsubscribe anytime. No credit card required.
                  </p>
                </div>
                <div className="min-w-0 rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                  <SubscribeForm variant="inline" />
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
