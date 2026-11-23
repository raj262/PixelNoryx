import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import { fetchSeo } from "@/lib/cms";
import { buildSiteMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeo();

  return buildSiteMetadata(seo, {
    title: "Contact",
    description:
      "Contact PixelNoryx for sponsorships, partnerships, feedback, or support. We usually reply within 1–2 business days.",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <div className="pb-8 pt-4">
      <ContactSection />
    </div>
  );
}
