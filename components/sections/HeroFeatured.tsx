"use client";

import { useAds, usePosts } from "@/components/providers/SiteDataProvider";
import PostCard from "@/components/magazine/PostCard";
import LatestHeadlines from "@/components/magazine/LatestHeadlines";
import AdSlot from "@/components/ads/AdSlot";
import AnimateIn from "@/components/ui/AnimateIn";

export default function HeroFeatured() {
  const posts = usePosts();
  const adPlacements = useAds();
  const [hero, ...sidePosts] = posts.slice(0, 4);

  return (
    <section className="relative overflow-hidden pb-4 pt-6">
      <div className="magazine-container">
        {adPlacements.header ? (
          <AnimateIn>
            <p className="ad-slot-label">Sponsored</p>
            <AdSlot ad={adPlacements.header} animate={false} />
          </AnimateIn>
        ) : null}

        <AnimateIn delay={0.1} className="mb-8 mt-10">
          <p className="section-subtitle">Trending Now</p>
          <h2 className="section-title mt-2">Top Stories</h2>
        </AnimateIn>

        <AnimateIn delay={0.15} className="grid items-stretch gap-6 lg:grid-cols-3">
          <PostCard post={hero} variant="hero" />
          <LatestHeadlines posts={sidePosts} />
        </AnimateIn>

        {adPlacements.heroBelow ? (
          <AnimateIn delay={0.2} className="mt-8">
            <p className="ad-slot-label">Advertisement</p>
            <AdSlot ad={adPlacements.heroBelow} index={1} animate={false} />
          </AnimateIn>
        ) : null}
      </div>
    </section>
  );
}
