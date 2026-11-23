import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import { fetchSeo } from "@/lib/cms";
import { buildSiteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeo();

  return buildSiteMetadata(seo, {
    title: "About",
    description:
      "Meet Rajesh Verma and PixelNoryx — a free weekly developer newsletter on React, Laravel, SaaS, and shipping digital products.",
    path: "/about",
  });
}

export default function AboutPage() {
  return (
    <div className="pb-8 pt-4">
      <AboutSection />
    </div>
  );
}
