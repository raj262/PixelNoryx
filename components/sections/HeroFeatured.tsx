"use client";

import { newsletterIssues } from "@/lib/data";
import { adPlacements } from "@/lib/ads";
import PostCard from "@/components/magazine/PostCard";
import AdSlot from "@/components/ads/AdSlot";
import AnimateIn from "@/components/ui/AnimateIn";

export default function HeroFeatured() {
  const [hero, ...sidePosts] = newsletterIssues.slice(0, 4);

  return (
    <section className="relative overflow-hidden pb-4 pt-6">
      <div className="magazine-container">
        <AnimateIn>
          <p className="ad-slot-label">Sponsored</p>
          <AdSlot ad={adPlacements.header} animate={false} />
        </AnimateIn>

        <AnimateIn delay={0.1} className="mb-8 mt-10">
          <p className="section-subtitle">Trending Now</p>
          <h2 className="section-title mt-2">Top Stories</h2>
        </AnimateIn>

        <AnimateIn delay={0.15} className="grid gap-6 lg:grid-cols-3">
          <PostCard post={hero} variant="hero" />
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card lg:col-span-1">
            <div className="border-b border-border bg-gradient-to-r from-surface to-white px-4 py-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                Latest Headlines
              </h3>
            </div>
            <div className="flex-1 px-4">
              {sidePosts.map((post) => (
                <PostCard key={post.slug} post={post} variant="side" />
              ))}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2} className="mt-8">
          <p className="ad-slot-label">Advertisement</p>
          <AdSlot ad={adPlacements.heroBelow} index={1} animate={false} />
        </AnimateIn>
      </div>
    </section>
  );
}
