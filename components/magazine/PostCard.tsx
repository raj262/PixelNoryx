import Image from "next/image";
import Link from "next/link";
import type { NewsletterIssue } from "@/lib/types";
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

  if (variant === "hero") {
    return (
      <article className="post-card group relative col-span-1 lg:col-span-2 lg:row-span-2">
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[480px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              {post.sponsored && (
                <span className="mb-2 inline-block bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Sponsored
                </span>
              )}
              <span
                className={`category-badge mb-3 block text-white ${getTopicColor(post.topic)}`}
              >
                {post.topic}
              </span>
              <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {post.title}
              </h2>
              {showExcerpt && (
                <p className="mt-3 line-clamp-2 text-sm text-white/80 sm:text-base">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 text-xs">
                <PostMeta post={post} showTopic={false} light />
              </div>
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
            src={post.image}
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
              src={post.image}
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
      <article className="post-card group flex gap-4 border border-border p-4">
        <Link href={href} className="relative h-32 w-40 shrink-0 overflow-hidden sm:h-36 sm:w-48">
          <Image src={post.image} alt="" fill className="object-cover" sizes="192px" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <Link
            href={`/archive?topic=${encodeURIComponent(post.topic)}`}
            className={`category-badge ${getTopicColor(post.topic)}`}
          >
            {post.topic}
          </Link>
          <Link href={href}>
            <h3 className="mt-1 font-display text-xl font-bold group-hover:text-primary">
              {post.title}
            </h3>
          </Link>
          {showExcerpt && (
            <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
          )}
          <div className="mt-3">
            <PostMeta post={post} showTopic={false} />
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
            <Image src={post.image} alt="" fill className="object-cover" sizes="64px" />
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
            src={post.image}
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
