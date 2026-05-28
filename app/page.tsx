import HeroFeatured from "@/components/sections/HeroFeatured";
import TrendingStrip from "@/components/sections/TrendingStrip";
import AdShowcase from "@/components/sections/AdShowcase";
import RecentPosts from "@/components/sections/RecentPosts";
import AboutSection from "@/components/sections/AboutSection";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroFeatured />
      <TrendingStrip />
      <AdShowcase placementKey="midPage" />
      <RecentPosts />
      <AboutSection />
      <AdShowcase placementKey="footerBanner" label="Partner with us" />
      <FAQ />
      <ContactSection />
    </>
  );
}
