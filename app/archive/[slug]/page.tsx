import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBootstrap, getPostBySlug, fetchSeo } from "@/lib/cms";
import SharePostButton from "@/components/magazine/SharePostButton";
import { buildPostMetadata } from "@/lib/seo";
import PostCard from "@/components/magazine/PostCard";
import Sidebar from "@/components/magazine/Sidebar";
import PostMeta from "@/components/magazine/PostMeta";
import { getTopicColor } from "@/lib/topic-colors";
import PostComments from "@/components/comments/PostComments";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { posts } = await getBootstrap();
  return posts.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [seo, issue] = await Promise.all([fetchSeo(), getPostBySlug(slug)]);

  if (!issue) return { title: "Not Found" };

  const siteUrl = seo?.siteUrl ?? "http://localhost:3000";

  return buildPostMetadata(
    seo,
    {
      title: issue.title,
      description: issue.excerpt,
      keywords: issue.tags ?? [],
      canonical: `${siteUrl}/archive/${slug}`,
      robots: seo?.robots ?? "index, follow",
      openGraph: {
        title: issue.title,
        description: issue.excerpt,
        image: issue.image,
        url: `${siteUrl}/archive/${slug}`,
        type: "article",
      },
    },
    { title: issue.title, description: issue.excerpt, image: issue.image }
  );
}

export default async function IssuePage({ params }: PageProps) {
  const { slug } = await params;
  const { posts } = await getBootstrap();
  const issue = await getPostBySlug(slug);
  if (!issue) notFound();

  const related = posts.filter((i) => i.slug !== slug).slice(0, 2);
  const seo = await fetchSeo();
  const siteUrl = seo?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const postUrl = `${siteUrl.replace(/\/$/, "")}/archive/${slug}`;

  return (
    <div className="py-10">
      <div className="magazine-container">
        <div className="flex flex-col gap-10 lg:flex-row">
          <article className="min-w-0 flex-1">
            <Link
              href="/archive"
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Back to archive
            </Link>

            {issue.sponsored && (
              <span className="mt-4 inline-block bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                Sponsored
              </span>
            )}

            <Link
              href={`/archive?topic=${encodeURIComponent(issue.topic)}`}
              className={`category-badge mt-4 block ${getTopicColor(issue.topic)}`}
            >
              {issue.topic}
            </Link>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {issue.title}
            </h1>

            <div className="mt-4">
              <PostMeta post={issue} showTopic={false} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <SharePostButton
                title={issue.title}
                url={postUrl}
                text={issue.excerpt}
              />
            </div>

            <div className="relative mt-8 aspect-[21/9] overflow-hidden">
              <Image
                src={issue.image}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            <div className="prose-article mt-10">
              <p className="text-xl font-medium text-foreground">{issue.preview}</p>
              <p>{issue.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: issue.content }} />
            </div>

            <PostComments slug={slug} initialCount={issue.commentCount ?? 0} />

            <div className="mt-10 border border-border bg-surface p-8">
              <h2 className="font-display text-xl font-bold">Enjoyed this post?</h2>
              <p className="mt-2 text-sm text-muted">Subscribe for weekly issues.</p>
              <div className="mt-4 max-w-md">
                <SubscribeForm variant="inline" />
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="section-title mb-6 text-xl">Related Posts</h2>
                <div className="space-y-6">
                  {related.map((p) => (
                    <PostCard key={p.slug} post={p} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </article>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
