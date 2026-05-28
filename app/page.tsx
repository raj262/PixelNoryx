import HeroFeatured from "@/components/sections/HeroFeatured";
import TrendingStrip from "@/components/sections/TrendingStrip";
import RecentPosts from "@/components/sections/RecentPosts";
import AboutSection from "@/components/sections/AboutSection";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroFeatured />
      <TrendingStrip />
      <RecentPosts />
      <AboutSection />
      <FAQ />
      <ContactSection />
    </>
  );
}
