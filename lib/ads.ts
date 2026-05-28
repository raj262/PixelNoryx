import type { AdGradientKey } from "./ad-gradients";

export type AdSize =
  | "leaderboard"
  | "billboard"
  | "rectangle"
  | "skyscraper"
  | "banner"
  | "native";

export interface AdPlacement {
  id: string;
  size: AdSize;
  title: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  sponsor?: string;
  gradient?: AdGradientKey;
}

export const adPlacements: Record<string, AdPlacement> = {
  header: {
    id: "header-leaderboard",
    size: "leaderboard",
    title: "Ship 10x Faster with NovaCommerce",
    subtitle: "Multi-vendor ecommerce · React + Laravel",
    cta: "View Demo",
    href: "#",
    sponsor: "Sponsored",
    gradient: "violetSunset",
  },
  heroBelow: {
    id: "hero-billboard",
    size: "billboard",
    title: "Premium Admin Dashboards for SaaS Teams",
    subtitle: "50+ components · Dark mode · Lifetime updates",
    cta: "Shop Now",
    href: "#",
    sponsor: "Advertisement",
    gradient: "slateHero",
  },
  sidebarTop: {
    id: "sidebar-rect-1",
    size: "rectangle",
    title: "APIForge Laravel",
    subtitle: "Production-ready REST APIs",
    cta: "Learn More",
    href: "#",
    sponsor: "Ad",
    gradient: "ocean",
  },
  sidebarSticky: {
    id: "sidebar-sky",
    size: "skyscraper",
    title: "Developer Tools Week",
    subtitle: "Save 40% on all digital products",
    cta: "Get Offer",
    href: "#",
    sponsor: "Sponsored",
    gradient: "brand",
  },
  inlineFeed: {
    id: "inline-native",
    size: "native",
    title: "SaaSify Starter Kit",
    subtitle: "Auth, billing & teams built-in",
    cta: "Explore",
    href: "#",
    sponsor: "Promoted",
    gradient: "indigo",
  },
  midPage: {
    id: "mid-billboard",
    size: "billboard",
    title: "Join 12,400+ Developers",
    subtitle: "Weekly tips on React, Laravel & shipping products",
    cta: "Subscribe Free",
    href: "/#subscribe",
    sponsor: "PixelNoryx",
    gradient: "editorial",
  },
  footerBanner: {
    id: "footer-leaderboard",
    size: "leaderboard",
    title: "Your Ad Could Be Here",
    subtitle: "Reach developers & indie hackers · Contact us",
    cta: "Advertise",
    href: "/#contact",
    sponsor: "Advertisement",
    gradient: "zinc",
  },
};
