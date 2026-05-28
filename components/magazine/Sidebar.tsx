"use client";

import Link from "next/link";
import Image from "next/image";
import { newsletterIssues, socialStats, siteConfig, socialLinks } from "@/lib/data";
import { adPlacements } from "@/lib/ads";
import SubscribeWidget from "@/components/newsletter/SubscribeWidget";
import PostCard from "./PostCard";
import AdSlot from "@/components/ads/AdSlot";
import DynamicIcon from "@/components/ui/IconMap";
import AnimateIn from "@/components/ui/AnimateIn";

export default function Sidebar() {
  const trending = newsletterIssues.slice(0, 5);
  const editorsChoice = newsletterIssues.filter((i) => i.featured).slice(0, 4);

  return (
    <aside className="space-y-8 lg:w-[340px] lg:shrink-0">
      <AnimateIn direction="left" delay={0.1}>
        <p className="ad-slot-label">Sponsored</p>
        <AdSlot ad={adPlacements.sidebarTop} animate={false} />
      </AnimateIn>

      <AnimateIn direction="left" delay={0.15}>
        <SubscribeWidget />
      </AnimateIn>

      <AnimateIn direction="left" delay={0.2}>
        <div className="sidebar-widget">
          <h3 className="font-display text-xl font-bold">Trending Posts</h3>
          <div className="mt-5 space-y-0">
            {trending.map((post) => (
              <PostCard key={post.slug} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </AnimateIn>

      <AnimateIn direction="left" delay={0.25}>
        <div className="sidebar-widget">
          <h3 className="font-display text-xl font-bold">Follow Us</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {socialStats.map((stat) => (
              <a
                key={stat.label}
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl border border-border bg-surface py-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
              >
                <span className="font-display text-xl font-bold">{stat.count}</span>
                <span className="mt-1 text-xs text-muted">{stat.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all hover:border-primary hover:bg-primary hover:text-white"
                aria-label={s.label}
              >
                <DynamicIcon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </AnimateIn>

      <AnimateIn direction="left" delay={0.3}>
        <p className="ad-slot-label">Advertisement</p>
        <div className="lg:sticky lg:top-28">
          <AdSlot ad={adPlacements.sidebarSticky} animate={false} />
        </div>
      </AnimateIn>

      <AnimateIn direction="left" delay={0.35}>
        <div className="sidebar-widget">
          <p className="section-subtitle">Editor&apos;s Choice</p>
          <h3 className="font-display mt-1 text-xl font-bold">Featured</h3>
          <div className="mt-5 space-y-4">
            {editorsChoice.map((post) => (
              <Link
                key={post.slug}
                href={`/archive/${post.slug}`}
                className="group flex gap-3"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={post.image} alt="" fill className="object-cover transition-transform group-hover:scale-105" sizes="80px" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold leading-snug group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="meta-line mt-1">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/archive" className="mt-4 inline-block text-sm font-semibold text-primary">
            More →
          </Link>
        </div>
      </AnimateIn>

      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
        <p className="text-sm text-muted">
          <strong className="text-foreground">{siteConfig.subscriberCount}</strong> readers ·{" "}
          {siteConfig.frequency}
        </p>
      </div>
    </aside>
  );
}
