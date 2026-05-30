import type { Metadata } from "next";
import FeaturesPageContent from "@/components/features/FeaturesPageContent";
import { fetchSeo } from "@/lib/api";
import { buildSiteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeo();

  return buildSiteMetadata(seo, {
    title: "Features",
    description:
      "Explore PixelNoryx — free weekly newsletter, topic archive, AI assistant, search, comments, and more for developers.",
    path: "/features",
  });
}

export default function FeaturesPage() {
  return <FeaturesPageContent />;
}
