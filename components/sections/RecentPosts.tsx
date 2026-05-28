"use client";

import { useState } from "react";
import Link from "next/link";
import { newsletterIssues } from "@/lib/data";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";

const PAGE_SIZE = 6;

export default function RecentPosts() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const posts = newsletterIssues.slice(0, visible);
  const hasMore = visible < newsletterIssues.length;

  return (
    <section id="recent" className="py-12">
      <div className="magazine-container">
        <div className="mb-8">
          <p className="section-subtitle">Stay up-to-date</p>
          <h2 className="section-title">Recent Posts</h2>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="grid gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} variant="standard" />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="border-2 border-foreground bg-transparent px-10 py-3 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-foreground hover:text-white"
                >
                  Load more
                </button>
              </div>
            )}

            <div className="mt-12 border-t border-border pt-12">
              <p className="section-subtitle">Editor&apos;s Choice</p>
              <h2 className="section-title mb-8">Featured Articles</h2>
              <div className="space-y-6">
                {newsletterIssues
                  .filter((i) => i.featured)
                  .slice(0, 3)
                  .map((post) => (
                    <PostCard
                      key={post.slug}
                      post={post}
                      variant="horizontal"
                    />
                  ))}
              </div>
              <Link
                href="/archive"
                className="mt-6 inline-block font-semibold text-primary hover:underline"
              >
                More →
              </Link>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </section>
  );
}
