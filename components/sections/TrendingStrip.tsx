"use client";

import { usePosts } from "@/components/providers/SiteDataProvider";
import PostCard from "@/components/magazine/PostCard";
import AnimateIn from "@/components/ui/AnimateIn";

export default function TrendingStrip() {
  const trending = usePosts().slice(0, 6);

  return (
    <section className="border-y border-border/80 bg-white/60 py-10 backdrop-blur-sm">
      <div className="magazine-container">
        <AnimateIn>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="section-subtitle">Hot Topics</p>
              <h2 className="section-title mt-1 text-2xl sm:text-3xl">Trending</h2>
            </div>
          </div>
        </AnimateIn>

        <div className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:thin]">
          {trending.map((post) => (
            <div key={post.slug} className="shrink-0">
              <PostCard post={post} variant="trending" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
