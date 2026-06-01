import Link from "next/link";
import type { LegalPagePayload } from "@/lib/legal-pages";

interface LegalPageContentProps {
  page: LegalPagePayload;
}

export default function LegalPageContent({ page }: LegalPageContentProps) {
  return (
    <article className="magazine-container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{page.title}</span>
        </nav>

        <header className="mb-8 border-b border-border pb-6">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
        </header>

        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </article>
  );
}
