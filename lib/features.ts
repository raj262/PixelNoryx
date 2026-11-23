export interface PlatformFeature {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export interface ReaderJourneyFeature extends PlatformFeature {
  eyebrow: string;
  cta?: string;
  accent: "explore" | "search" | "share";
  points: string[];
}

/** Hero trio for the Features “Explore, search, and share” section. */
export const readerJourney: ReaderJourneyFeature[] = [
  {
    eyebrow: "01 — Explore",
    accent: "explore",
    icon: "BookOpen",
    title: "Topic Archive",
    description:
      "Browse every issue by React, Laravel, SaaS, UI/UX, and more. Filter once — keep reading.",
    href: "/archive",
    cta: "Open archive",
    points: ["Topic filters", "Featured issues", "Reading time on every card"],
  },
  {
    eyebrow: "02 — Search",
    accent: "search",
    icon: "Search",
    title: "Instant Search",
    description:
      "Jump to any post by title, topic, or keyword from the header. No menu digging.",
    points: ["Cmd / Ctrl + K style speed", "Title + topic match", "Works on mobile"],
  },
  {
    eyebrow: "03 — Share",
    accent: "share",
    icon: "Share2",
    title: "One-Tap Sharing",
    description:
      "Share any article with native share, copy link, or social — built for phone and desktop.",
    points: ["Native share sheet", "Copy link", "Social-ready titles"],
  },
];

/** Supporting reader tools shown under the journey trio. */
export const platformFeatures: PlatformFeature[] = [
  {
    icon: "Sparkles",
    title: "AI Assistant",
    description:
      "Ask about articles, trending topics, and how to subscribe — a helper for busy readers.",
  },
  {
    icon: "MessageSquare",
    title: "Reader Comments",
    description:
      "Discuss each article with signed-in readers. Share feedback and follow the thread.",
  },
  {
    icon: "ShieldCheck",
    title: "Free Core Issues",
    description:
      "Every published issue is free to read. Subscribe for delivery — not for a paywall.",
    href: "/#subscribe",
  },
];

export const editorHighlights: PlatformFeature[] = [
  {
    icon: "Layers",
    title: "Admin CMS",
    description: "Posts, SEO, and users — managed from the Next.js /admin panel on Neon.",
  },
  {
    icon: "TrendingUp",
    title: "Featured & Sponsored",
    description: "Highlight hero stories and run sponsor slots across header, sidebar, and mid-page.",
  },
  {
    icon: "Mail",
    title: "Newsletter Pipeline",
    description: "Subscribe forms, welcome emails, and subscriber management built in.",
  },
  {
    icon: "User",
    title: "Reader Accounts",
    description: "Register, login, and comment — Sanctum-powered auth for your community.",
  },
];
