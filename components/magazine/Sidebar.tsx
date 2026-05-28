import Link from "next/link";
import Image from "next/image";
import { newsletterIssues, socialStats, siteConfig } from "@/lib/data";
import SubscribeWidget from "@/components/newsletter/SubscribeWidget";
import PostCard from "./PostCard";
import DynamicIcon from "@/components/ui/IconMap";
import { socialLinks } from "@/lib/data";

export default function Sidebar() {
  const trending = newsletterIssues.slice(0, 5);
  const editorsChoice = newsletterIssues.filter((i) => i.featured).slice(0, 4);

  return (
    <aside className="space-y-8 lg:w-[340px] lg:shrink-0">
      <SubscribeWidget />

      <div className="sidebar-widget">
        <h3 className="section-title text-xl">Trending Posts</h3>
        <div className="mt-5 space-y-0">
          {trending.map((post) => (
            <PostCard key={post.slug} post={post} variant="compact" />
          ))}
        </div>
      </div>

      <div className="sidebar-widget">
        <h3 className="section-title text-xl">Follow Us</h3>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {socialStats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center border border-border bg-surface py-4 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="font-display text-xl font-bold text-foreground">
                {stat.count}
              </span>
              <span className="mt-1 text-xs text-muted">{stat.label}</span>
            </a>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted transition-colors hover:border-primary hover:text-primary"
              aria-label={s.label}
            >
              <DynamicIcon name={s.icon} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="sidebar-widget">
        <p className="section-subtitle">Editor&apos;s Choice</p>
        <h3 className="section-title mt-1 text-xl">Featured Articles</h3>
        <div className="mt-5 space-y-4">
          {editorsChoice.map((post) => (
            <Link key={post.slug} href={`/archive/${post.slug}`} className="group flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden">
                <Image src={post.image} alt="" fill className="object-cover" sizes="80px" />
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
        <Link
          href="/archive"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          More →
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">
          {siteConfig.subscriberCount} readers get {siteConfig.tagline}{" "}
          {siteConfig.frequency.toLowerCase()}.
        </p>
      </div>
    </aside>
  );
}
