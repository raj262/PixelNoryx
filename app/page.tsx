import Hero from "@/components/sections/Hero";
import LatestIssue from "@/components/sections/LatestIssue";
import WhySubscribe from "@/components/sections/WhySubscribe";
import NewsletterArchive from "@/components/sections/NewsletterArchive";
import AboutAuthor from "@/components/sections/AboutAuthor";
import NewsletterCTA from "@/components/sections/NewsletterCTA";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <LatestIssue />
      <WhySubscribe />
      <NewsletterArchive limit={6} />
      <AboutAuthor />
      <Testimonials />
      <NewsletterCTA />
      <FAQ />
      <Contact />
    </>
  );
}
