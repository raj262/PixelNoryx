import Link from "next/link";
import type { LegalPagePayload } from "@/lib/legal-pages";
import { CANONICAL_LEGAL_PAGES } from "@/lib/legal-nav";

interface LegalPageContentProps {
  page: LegalPagePayload;
}

export default function LegalPageContent({ page }: LegalPageContentProps) {
  const relatedPages = CANONICAL_LEGAL_PAGES.filter((item) => item.slug !== page.slug);

  return (
    <article className="magazine-container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{page.title}</span>
        </nav>

        <header className="mb-8 border-b border-border pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            Questions?{" "}
            <a href="mailto:hello@pixelnoryx.com" className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline">
              hello@pixelnoryx.com
            </a>
          </p>
        </header>

        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {relatedPages.length > 0 && (
          <nav
            className="mt-12 rounded-2xl border border-border bg-surface/60 p-6"
            aria-label="Related legal pages"
          >
            <h2 className="mb-4 font-display text-lg font-bold text-foreground">
              Related pages
            </h2>
            <ul className="space-y-2">
              {relatedPages.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.path}
                    className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
