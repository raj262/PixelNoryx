"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useAds, usePosts } from "@/components/providers/SiteDataProvider";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import AnimateIn from "@/components/ui/AnimateIn";

const PAGE_SIZE = 6;

export default function RecentPosts() {
  const allPosts = usePosts();
  const adPlacements = useAds();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const posts = allPosts.slice(0, visible);
  const hasMore = visible < allPosts.length;

  return (
    <section id="recent" className="py-14">
      <div className="magazine-container">
        <AnimateIn>
          <p className="section-subtitle">Stay up-to-date</p>
          <h2 className="section-title mt-2">Recent Posts</h2>
        </AnimateIn>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="grid gap-8 sm:grid-cols-2">
              {posts.map((post, index) => (
                <Fragment key={post.slug}>
                  <AnimateIn delay={(index % 2) * 0.05}>
                    <PostCard post={post} variant="standard" />
                  </AnimateIn>
                  {index === 1 && adPlacements.inlineFeed ? (
                    <div className="sm:col-span-2">
                      <p className="ad-slot-label">Promoted</p>
                      <AdSlot ad={adPlacements.inlineFeed} animate={false} />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>

            {hasMore && (
              <AnimateIn className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="btn-outline-modern"
                >
                  Load more
                </button>
              </AnimateIn>
            )}

            <AnimateIn delay={0.1} className="mt-16 min-w-0">
              <div className="min-w-0 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-surface to-white p-5 sm:p-8 lg:p-10">
                <p className="section-subtitle">Editor&apos;s Choice</p>
                <h2 className="section-title mb-6 mt-2 sm:mb-8">Featured Articles</h2>
                <div className="grid min-w-0 gap-5 sm:gap-6">
                  {allPosts
                    .filter((i) => i.featured)
                    .slice(0, 3)
                    .map((post) => (
                      <PostCard key={post.slug} post={post} variant="horizontal" />
                    ))}
                </div>
                <Link
                  href="/archive"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline sm:mt-8 sm:text-base"
                >
                  View all articles →
                </Link>
              </div>
            </AnimateIn>
          </div>

          <Sidebar />
        </div>
      </div>
    </section>
  );
}
