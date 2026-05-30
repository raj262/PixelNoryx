"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import DynamicIcon from "@/components/ui/IconMap";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import { useAi, useSiteConfig, useSiteData } from "@/components/providers/SiteDataProvider";
import { editorHighlights, platformFeatures } from "@/lib/features";
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

export default function FeaturesPageContent() {
  const siteConfig = useSiteConfig();
  const { settings } = useSiteData();
  const ai = useAi();
  const benefits = settings.subscribeBenefits;

  const visiblePlatform = platformFeatures.map((f) =>
    f.icon === "Sparkles" && !ai.enabled ? null : f
  ).filter(Boolean) as typeof platformFeatures;

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-white/50 py-14 sm:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
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

      {/* Reader experience */}
      <section className="border-y border-border/60 bg-surface/40 py-14 sm:py-20">
        <div className="magazine-container">
          <AnimateIn>
            <p className="section-subtitle">Reader experience</p>
            <h2 className="section-title mt-2">Explore, search, and share</h2>
            <p className="mt-3 max-w-2xl text-muted">
              The frontend is a full magazine — not just a blog list. Every feature
              is wired to the Laravel admin you control.
            </p>
          </AnimateIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlatform.map((item, index) => (
              <AnimateIn key={item.title} delay={index * 0.05}>
                <FeatureCard {...item} />
              </AnimateIn>
            ))}
          </div>
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
                PixelNoryx pairs a Next.js magazine frontend with a Filament admin
                backend — posts, ads, SEO, mail, AI chat, and subscribers in one place.
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
