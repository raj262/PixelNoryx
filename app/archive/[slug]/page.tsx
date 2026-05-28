import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { newsletterIssues, getIssueBySlug, siteConfig } from "@/lib/data";
import IssueCard from "@/components/newsletter/IssueCard";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsletterIssues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return { title: "Issue Not Found" };

  return {
    title: `Issue #${issue.issueNumber}: ${issue.title}`,
    description: issue.excerpt,
    openGraph: {
      title: issue.title,
      description: issue.excerpt,
      images: [{ url: issue.image }],
      type: "article",
    },
  };
}

export default async function IssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) notFound();

  const related = newsletterIssues
    .filter((i) => i.slug !== slug && i.topic === issue.topic)
    .slice(0, 3);

  return (
    <article className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/archive"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to archive
        </Link>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-primary/20 px-3 py-1 font-display text-sm font-bold text-primary">
            Issue #{issue.issueNumber}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-sm text-muted">
            {issue.topic}
          </span>
          {issue.free && (
            <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
              Free read
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {issue.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{issue.author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {issue.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {issue.readTime}
          </span>
        </div>

        <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl">
          <Image
            src={issue.image}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="768px"
          />
        </div>

        {/* Newsletter-style body */}
        <div className="newsletter-body mt-12">
          <p className="text-xl leading-relaxed text-foreground/95">
            Hey — welcome to <strong>{siteConfig.tagline}</strong>.
          </p>
          <p className="newsletter-quote mt-8 border-l-2 border-primary pl-5 text-lg italic text-foreground/90">
            {issue.preview}
          </p>
          <div className="prose-blog mt-8 space-y-4 text-lg">
            <p>{issue.excerpt}</p>
            <p>{issue.content}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
            Share issue
          </button>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/30 bg-newsletter-gradient p-8">
          <h2 className="font-display text-2xl font-bold">
            Enjoyed this issue?
          </h2>
          <p className="mt-2 text-muted">
            Get the next one in your inbox {siteConfig.frequency.toLowerCase()}.
          </p>
          <div className="mt-6 max-w-md">
            <SubscribeForm variant="compact" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-padding mx-auto mt-16 max-w-7xl border-t border-white/[0.08]">
          <h2 className="mb-8 font-display text-2xl font-bold">More on {issue.topic}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((i, idx) => (
              <IssueCard key={i.slug} issue={i} index={idx} layout="grid" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
