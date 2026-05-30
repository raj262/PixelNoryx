export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ArchivePageClient from "./ArchivePageClient";
import { fetchSeo } from "@/lib/api";
import { buildSiteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeo();

  return buildSiteMetadata(seo, {
    title: "Archive | PixelNoryx",
    description:
      seo?.defaultDescription ??
      "Browse all past PixelNoryx newsletter issues — free to read.",
    path: "/archive",
  });
}

export default function ArchivePage() {
  return <ArchivePageClient />;
}
