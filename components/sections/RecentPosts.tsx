"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { newsletterIssues } from "@/lib/data";
import { adPlacements } from "@/lib/ads";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import AnimateIn from "@/components/ui/AnimateIn";

const PAGE_SIZE = 6;

export default function RecentPosts() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const posts = newsletterIssues.slice(0, visible);
  const hasMore = visible < newsletterIssues.length;

  return (
    <section id="recent" className="py-14">
      <div className="magazine-container">
        <AnimateIn>
          <p className="section-subtitle">Stay up-to-date</p>
          <h2 className="section-title mt-2">Recent Posts</h2>
        </AnimateIn>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="grid gap-8 sm:grid-cols-2">
              {posts.map((post, index) => (
                <Fragment key={post.slug}>
                  <AnimateIn delay={(index % 2) * 0.05}>
                    <PostCard post={post} variant="standard" />
                  </AnimateIn>
                  {index === 1 && (
                    <div className="sm:col-span-2">
                      <p className="ad-slot-label">Promoted</p>
                      <AdSlot ad={adPlacements.inlineFeed} animate={false} />
                    </div>
                  )}
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

            <AnimateIn delay={0.1} className="mt-16">
              <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-surface to-white p-8 sm:p-10">
                <p className="section-subtitle">Editor&apos;s Choice</p>
                <h2 className="section-title mb-8 mt-2">Featured Articles</h2>
                <div className="space-y-6">
                  {newsletterIssues
                    .filter((i) => i.featured)
                    .slice(0, 3)
                    .map((post) => (
                      <PostCard key={post.slug} post={post} variant="horizontal" />
                    ))}
                </div>
                <Link
                  href="/archive"
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
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
