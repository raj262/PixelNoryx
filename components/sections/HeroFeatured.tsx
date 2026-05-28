import { newsletterIssues } from "@/lib/data";
import PostCard from "@/components/magazine/PostCard";

export default function HeroFeatured() {
  const [hero, ...sidePosts] = newsletterIssues.slice(0, 4);

  return (
    <section className="border-b border-border py-8">
      <div className="magazine-container">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-subtitle">Trending</p>
            <h2 className="section-title">Top Stories</h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-1">
          <PostCard post={hero} variant="hero" />
          <div className="flex flex-col border border-border bg-card lg:col-span-1">
            <div className="border-b border-border bg-surface px-4 py-3">
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
        </div>
      </div>
    </section>
  );
}
