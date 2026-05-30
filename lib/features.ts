export interface PlatformFeature {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

/** Site & reader experience features (static — newsletter benefits come from CMS). */
export const platformFeatures: PlatformFeature[] = [
  {
    icon: "BookOpen",
    title: "Topic Archive",
    description:
      "Browse every issue by React, Laravel, Next.js, SaaS, UI/UX, and more — filter with one click.",
    href: "/archive",
  },
  {
    icon: "Sparkles",
    title: "AI Assistant",
    description:
      "Ask about articles, trending topics, and how to subscribe — like a shopping helper, but for dev content.",
  },
  {
    icon: "Search",
    title: "Instant Search",
    description:
      "Find posts by title, topic, or keyword from the header — no digging through menus.",
  },
  {
    icon: "MessageSquare",
    title: "Reader Comments",
    description:
      "Discuss each article with signed-in readers. Share feedback and follow the conversation.",
  },
  {
    icon: "Share2",
    title: "One-Tap Sharing",
    description:
      "Share any post via native share, copy link, or social — built for mobile and desktop.",
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
    description: "Posts, categories, ads, SEO, mail, and AI — all managed from one Laravel admin.",
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
