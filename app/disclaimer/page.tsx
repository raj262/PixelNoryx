import type { Metadata } from "next";
import LegalPageContent from "@/components/legal/LegalPageContent";
import { fetchSeo } from "@/lib/cms";
import { getLegalPage } from "@/lib/legal-pages";
import { buildSiteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, page] = await Promise.all([fetchSeo(), getLegalPage("disclaimer")]);

  return buildSiteMetadata(seo, {
    title: page.title,
    description: page.metaDescription,
    path: page.path,
  });
}

export default async function DisclaimerPage() {
  const page = await getLegalPage("disclaimer");

  return <LegalPageContent page={page} />;
}
