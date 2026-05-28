import { newsletterIssues } from "@/lib/data";
import PostCard from "@/components/magazine/PostCard";

export default function TrendingStrip() {
  const trending = newsletterIssues.slice(0, 6);

  return (
    <section className="border-b border-border bg-surface py-8">
      <div className="magazine-container">
        <h2 className="section-title mb-6 text-xl">Trending</h2>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin">
          {trending.map((post) => (
            <PostCard key={post.slug} post={post} variant="trending" />
          ))}
        </div>
      </div>
    </section>
  );
}
