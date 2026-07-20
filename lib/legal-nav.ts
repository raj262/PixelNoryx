import type { LegalPageIndexItem, LegalPageSlug } from "@/lib/legal-pages";

export const CANONICAL_LEGAL_PAGES: LegalPageIndexItem[] = [
  { slug: "privacy-policy", title: "Privacy Policy", path: "/privacy-policy" },
  { slug: "disclaimer", title: "Disclaimer", path: "/disclaimer" },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    path: "/terms-and-conditions",
  },
];

export interface LegalNavLink {
  label: string;
  href: string;
  slug?: LegalPageSlug;
}

/** Prefer API legal pages; ignore stale footer `#` links from old admin data. */
export function resolveLegalNavLinks(
  legalPages?: LegalPageIndexItem[],
  footerLegal?: LegalNavLink[]
): LegalNavLink[] {
  if (legalPages?.length) {
    return legalPages.map((page) => ({
      label: page.title,
      href: page.path,
      slug: page.slug,
    }));
  }

  const canonicalByLabel = new Map(
    CANONICAL_LEGAL_PAGES.map((page) => [page.title.toLowerCase(), page])
  );

  if (footerLegal?.length) {
    const normalized: LegalNavLink[] = [];

    for (const link of footerLegal) {
      const href =
        link.href === "#" || link.href === ""
          ? canonicalByLabel.get(link.label.toLowerCase())?.path ?? link.href
          : link.href;

      if (!href || href === "#") continue;

      normalized.push({
        label: link.label,
        href,
        slug: CANONICAL_LEGAL_PAGES.find((page) => page.path === href)?.slug,
      });
    }

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return CANONICAL_LEGAL_PAGES.map((page) => ({
    label: page.title,
    href: page.path,
    slug: page.slug,
  }));
}
