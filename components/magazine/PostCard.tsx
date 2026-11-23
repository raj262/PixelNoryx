import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsletterIssue } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/media";
import PostMeta from "./PostMeta";
import { getTopicColor } from "@/lib/topic-colors";

type CardVariant = "hero" | "side" | "standard" | "compact" | "trending" | "horizontal";

interface PostCardProps {
  post: NewsletterIssue;
  variant?: CardVariant;
  showExcerpt?: boolean;
}

export default function PostCard({
  post,
  variant = "standard",
  showExcerpt = true,
}: PostCardProps) {
  const href = `/archive/${post.slug}`;
  const imageSrc = normalizeMediaUrl(post.image);

  if (variant === "hero") {
    return (
      <article className="post-card group relative flex h-full min-h-0 flex-col overflow-hidden lg:col-span-2">
        <Link href={href} className="flex h-full min-h-0 flex-col">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[2/1] lg:aspect-auto lg:min-h-[280px] lg:flex-1">
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
              {post.sponsored ? (
                <span className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Sponsored
                </span>
              ) : null}
              <span
                className={`rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm ${getTopicColor(post.topic)}`}
              >
                {post.topic}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 bg-white p-5 sm:gap-4 sm:p-6 lg:p-7">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl lg:text-[2rem]">
                {post.title}
              </h2>
              {showExcerpt ? (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted sm:text-[15px]">
                  {post.excerpt}
                </p>
              ) : null}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <PostMeta post={post} showTopic={false} />
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Read story
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "side") {
    return (
      <article className="post-card group flex gap-4 border-b border-border py-4 last:border-0">
        <Link href={href} className="relative h-24 w-28 shrink-0 overflow-hidden sm:h-28 sm:w-36">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="144px"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/archive?topic=${encodeURIComponent(post.topic)}`}
            className={`category-badge ${getTopicColor(post.topic)}`}
          >
            {post.topic}
          </Link>
          <Link href={href}>
            <h3 className="mt-1 font-display text-base font-bold leading-snug text-foreground group-hover:text-primary sm:text-lg">
              {post.title}
            </h3>
          </Link>
          <div className="mt-2">
            <PostMeta post={post} showTopic={false} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "trending") {
    return (
      <article className="group shrink-0">
        <Link href={href} className="block w-48 sm:w-56">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="224px"
            />
          </div>
          <h4 className="mt-2 font-display text-sm font-bold leading-snug group-hover:text-primary line-clamp-2">
            {post.title}
          </h4>
          <p className="meta-line mt-1">{post.date}</p>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="post-card group overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Link
            href={href}
            className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:min-h-[140px] sm:w-36 md:w-44"
          >
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 176px"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
            <Link
              href={`/archive?topic=${encodeURIComponent(post.topic)}`}
              className={`category-badge ${getTopicColor(post.topic)}`}
            >
              {post.topic}
            </Link>
            <Link href={href}>
              <h3 className="mt-1 font-display text-lg font-bold leading-snug group-hover:text-primary sm:text-xl">
                {post.title}
              </h3>
            </Link>
            {showExcerpt && (
              <p className="mt-2 text-sm text-muted line-clamp-2 sm:line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <div className="mt-3">
              <PostMeta post={post} showTopic={false} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group border-b border-border py-3 last:border-0">
        <Link href={href} className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden">
            <Image src={imageSrc} alt="" fill className="object-cover" sizes="64px" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-sm font-bold leading-snug group-hover:text-primary line-clamp-2">
              {post.title}
            </h4>
            <p className="meta-line mt-1">{post.date}</p>
          </div>
        </Link>
      </article>
    );
  }

  // standard
  return (
    <article className="post-card group border border-border">
      <Link href={href}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <span className={`category-badge ${getTopicColor(post.topic)}`}>
            {post.topic}
          </span>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-primary sm:text-xl">
            {post.title}
          </h3>
          {showExcerpt && (
            <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
          )}
          <div className="mt-4">
            <PostMeta post={post} showTopic={false} />
          </div>
        </div>
      </Link>
    </article>
  );
}
