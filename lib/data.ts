import type { NewsletterIssue, NewsletterTopic } from "./types";

export const siteConfig = {
  name: "PixelNoryx",
  tagline: "The Developer Dispatch",
  description:
    "A free weekly newsletter on React, Laravel, SaaS, and shipping digital products — read in 5 minutes.",
  subscriberCount: "12,400+",
  frequency: "Every Tuesday",
  author: {
    name: "Rajesh Verma",
    role: "Founder & Editor",
    bio: "Full-stack developer building ecommerce systems and teaching 25K+ developers how to ship faster.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
};

export const socialStats = [
  { label: "Facebook", count: "3K", href: "https://facebook.com" },
  { label: "Twitter", count: "3K", href: "https://twitter.com" },
  { label: "YouTube", count: "740", href: "https://youtube.com" },
  { label: "Instagram", count: "3K", href: "https://instagram.com" },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Categories", href: "/archive", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const newsletterTopics: NewsletterTopic[] = [
  "React.js",
  "Laravel",
  "UI/UX",
  "Ecommerce",
  "APIs",
  "SaaS",
  "Startup",
  "Frontend",
];

export const categoryNav = newsletterTopics.map((topic) => ({
  label: topic,
  href: `/archive?topic=${encodeURIComponent(topic)}`,
}));

export const subscribeBenefits = [
  {
    icon: "Zap",
    title: "5-Minute Reads",
    description: "Concise, actionable insights — no fluff, no endless scroll.",
  },
  {
    icon: "Code",
    title: "Real Code Snippets",
    description: "Copy-paste examples for React, Laravel, and modern APIs.",
  },
  {
    icon: "TrendingUp",
    title: "Ship Faster",
    description: "Templates, tools, and tactics used by top indie hackers.",
  },
  {
    icon: "Gift",
    title: "Free Forever",
    description: "No paywall on core issues. Premium extras optional later.",
  },
];

export const newsletterIssues: NewsletterIssue[] = [
  {
    id: 11,
    issueNumber: 45,
    slug: "php-november-2026-security-hack",
    title: "PHP Just Got Hit Hard: November 2026 RCE Flaws You Must Patch Now",
    excerpt:
      "Seven critical CVEs landed on 19 Nov 2026 — including PHP-FPM request smuggling that can mean unauthenticated remote code execution. Here is what broke, who is exposed, and how to patch.",
    preview:
      "If your servers still run unpatched PHP 8.2–8.5, treat this week like an incident — not a nice-to-have upgrade.",
    content:
      "Coverage of the November 2026 PHP security release: CVE-2026-129289 request smuggling, session/UAF RCEs, fixed versions, and a practical patch checklist for Laravel and PHP-FPM stacks.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    topic: "Laravel",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Nov 25, 2026",
    readTime: "10 min read",
    tags: ["PHP", "Security", "CVE", "Laravel", "DevOps"],
    featured: true,
    free: true,
    commentCount: 0,
    metaTitle: "PHP November 2026 Security Hack: Patch CVE-2026-129289 RCE Now",
    metaDescription:
      "November 2026 PHP advisory explained: PHP-FPM request smuggling RCE, critical CVEs, fixed versions (8.5.13 / 8.4.28 / 8.3.37 / 8.2.36), and a patch checklist for production servers.",
    metaKeywords: [
      "PHP security November 2026",
      "CVE-2026-129289",
      "PHP-FPM request smuggling",
      "PHP RCE patch",
      "Laravel PHP update",
    ],
  },
  {
    id: 10,
    issueNumber: 44,
    slug: "laravel-queues-production-guide",
    title: "Laravel Queues in Production: Retries, Timeouts, and Failed Jobs",
    excerpt:
      "A practical guide to queue workers, retry budgets, timeout tuning, and dead-letter handling so background jobs stay reliable under real traffic.",
    preview:
      "Your jobs work on localhost. Production is where retries, timeouts, and failed-job tables decide whether customers get emails — or silence.",
    content:
      "Learn how to run Laravel queues in production with clear retry policies, sensible timeouts, monitoring, and failed job recovery.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    topic: "Laravel",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Nov 18, 2026",
    readTime: "9 min read",
    tags: ["Laravel", "Queues", "DevOps", "PHP"],
    featured: false,
    free: true,
    commentCount: 0,
    metaTitle: "Laravel Queues in Production: Retries, Timeouts & Failed Jobs",

    metaDescription:
      "Ship reliable Laravel queue workers: retry budgets, timeout settings, failed jobs, Horizon tips, and a production checklist for background processing.",
    metaKeywords: [
      "Laravel queues",
      "Laravel failed jobs",
      "queue workers production",
      "Laravel Horizon",
      "PHP background jobs",
    ],
  },
  {
    id: 9,
    issueNumber: 43,
    slug: "saas-pricing-page-that-converts",
    title: "SaaS Pricing Pages That Convert: Structure, Copy, and Plan Limits",
    excerpt:
      "How to design a pricing page that answers objections fast — plan names, limit clarity, annual toggles, and CTAs that do not confuse buyers.",
    preview:
      "Most pricing pages fail because limits are vague and every plan looks the same. Here is a structure that converts without dark patterns.",
    content:
      "A conversion-focused SaaS pricing layout: packaging, copy formulas, limit tables, and trust signals that reduce sales calls.",
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
    topic: "SaaS",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Nov 11, 2026",
    readTime: "9 min read",
    tags: ["SaaS", "Pricing", "Conversion", "Startup"],
    featured: true,
    free: true,
    commentCount: 0,
    metaTitle: "SaaS Pricing Page That Converts: Layout, Copy & Plan Limits",
    metaDescription:
      "Build a SaaS pricing page that converts: clear plan tiers, honest limits, annual toggle UX, FAQ placement, and CTA patterns that reduce bounce.",
    metaKeywords: [
      "SaaS pricing page",
      "pricing page conversion",
      "SaaS plan limits",
      "startup pricing",
      "pricing page UX",
    ],
  },
  {
    id: 1,
    issueNumber: 42,
    slug: "multi-vendor-marketplace-playbook",
    title: "The Multi-Vendor Marketplace Playbook",
    excerpt:
      "How to architect vendor splits, commissions, and inventory without drowning in complexity.",
    preview:
      "Hey — this week we're breaking down the exact database schema and API patterns behind production multi-vendor stores...",
    content:
      "Multi-vendor marketplaces require careful separation between admin, vendor, and customer flows. This issue covers commission models, payout schedules, and inventory sync strategies that scale beyond MVP.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    topic: "Ecommerce",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "May 27, 2025",
    readTime: "5 min read",
    tags: ["Ecommerce", "Laravel", "Architecture"],
    featured: true,
    free: true,
    commentCount: 2,
    sponsored: true,
  },
  {
    id: 2,
    issueNumber: 41,
    slug: "react-laravel-stack-2025",
    title: "Why React + Laravel Still Wins in 2025",
    excerpt:
      "The stack agencies secretly use for 80% of client projects — and how to structure your API layer.",
    preview:
      "Every few months someone declares this stack dead. Meanwhile, agencies bill $50K+ projects with it. Here's why...",
    content:
      "React and Laravel remain the pragmatic choice for teams that need speed and hiring pool depth. We compare Sanctum vs Passport, Inertia vs SPA, and when to reach for Next.js instead.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    topic: "React.js",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "May 20, 2025",
    readTime: "4 min read",
    tags: ["React.js", "Laravel"],
    featured: true,
    free: true,
    commentCount: 2,
  },
  {
    id: 3,
    issueNumber: 40,
    slug: "dark-ui-that-converts",
    title: "Dark UI Patterns That Actually Convert",
    excerpt:
      "Glassmorphism is back — but only when you use these 4 rules for SaaS dashboards.",
    preview:
      "Your dark mode isn't ugly. Your hierarchy is. This issue fixes contrast, depth, and CTA placement...",
    content:
      "Premium dark interfaces need more than a color flip. Learn elevation tokens, border opacity scales, and micro-interactions that guide users to upgrade and checkout.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    topic: "UI/UX",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "May 13, 2025",
    readTime: "5 min read",
    tags: ["UI/UX", "SaaS", "Design"],
    featured: true,
    free: true,
    commentCount: 0,
  },
  {
    id: 4,
    issueNumber: 39,
    slug: "nextjs-15-cheat-sheet",
    title: "Next.js 15 Cheat Sheet for Busy Devs",
    excerpt:
      "Server components, caching, and metadata — the only diagram you need on your wall.",
    preview:
      "App Router mental model in one page. Bookmark this before your next sprint planning...",
    content:
      "Parallel routes, loading.tsx, and the new caching defaults confuse everyone at first. This issue distills the docs into a decision tree for your next feature.",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
    topic: "Frontend",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "May 6, 2025",
    readTime: "4 min read",
    tags: ["Next.js", "React.js"],
    free: true,
  },
  {
    id: 5,
    issueNumber: 38,
    slug: "api-auth-without-tears",
    title: "API Auth Without Tears (Laravel Edition)",
    excerpt:
      "Sanctum vs JWT vs Passport — pick wrong and you'll refactor for months.",
    preview:
      "Spent last weekend fixing token refresh bugs? This issue is for you...",
    content:
      "We map auth strategies to product stages: MVP, multi-tenant SaaS, and mobile apps. Includes middleware patterns and rate-limit recipes.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    topic: "APIs",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Apr 29, 2025",
    readTime: "6 min read",
    tags: ["Laravel", "APIs", "Security"],
    free: true,
  },
  {
    id: 6,
    issueNumber: 37,
    slug: "saas-launch-30-day-plan",
    title: "Your SaaS Launch: A 30-Day Email Plan",
    excerpt:
      "Stripe, onboarding, and the 3 emails that reduce churn in week one.",
    preview:
      "Launch week isn't about features. It's about activation. Here's the sequence...",
    content:
      "From waitlist to paid users: billing setup, trial logic, and transactional emails that don't sound like robots wrote them.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    topic: "SaaS",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Apr 22, 2025",
    readTime: "5 min read",
    tags: ["SaaS", "Startup"],
    free: true,
  },
  {
    id: 7,
    issueNumber: 36,
    slug: "indie-hacker-revenue-stack",
    title: "The Indie Hacker Revenue Stack",
    excerpt:
      "Newsletter + digital products + YouTube — how one dev hit $8K/mo.",
    preview:
      "No VC. No team of 20. Just systems. This issue breaks down the funnel...",
    content:
      "Content-led growth for developers: turn tutorials into products, products into demos, and demos into recurring revenue.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    topic: "Startup",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Apr 15, 2025",
    readTime: "5 min read",
    tags: ["Startup", "Business"],
    free: true,
  },
  {
    id: 8,
    issueNumber: 35,
    slug: "tailwind-at-scale",
    title: "Tailwind at Scale (Without the Mess)",
    excerpt:
      "Design tokens, component layers, and when to stop adding arbitrary values.",
    preview:
      "Your tailwind.config is 400 lines. Let's fix that...",
    content:
      "Patterns for design systems in Tailwind v4-era projects: cn(), variants, and documenting decisions for your team.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    topic: "Frontend",
    author: "Rajesh Verma",
    authorRole: "Founder, PixelNoryx",
    date: "Apr 8, 2025",
    readTime: "4 min read",
    tags: ["Tailwind", "Frontend"],
    free: true,
  },
];

/** Alias for archive/search components */
export const blogPosts = newsletterIssues;
export const blogCategories = newsletterTopics;

export const testimonials = [
  {
    name: "Alex Chen",
    role: "CTO, TechLaunch",
    content:
      "Best dev newsletter I subscribe to. I forward every issue to my team.",
    avatar: "AC",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Indie Hacker",
    content:
      "Tuesday mornings = PixelNoryx in my inbox. Short, sharp, and immediately useful.",
    avatar: "SM",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Agency Owner",
    content:
      "Finally a newsletter that respects my time. No 20-minute reads pretending to be quick.",
    avatar: "JR",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
  },
];

export const faqs = [
  {
    question: "How often do you send the newsletter?",
    answer:
      "Every Tuesday morning (UTC). Occasional bonus issues when we launch a major guide or product.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. Core issues are free forever. We may introduce optional paid deep-dives later — subscribers get first notice.",
  },
  {
    question: "Can I read past issues?",
    answer:
      "All published issues live in the Archive. Browse by topic or search any keyword.",
  },
  {
    question: "How do I unsubscribe?",
    answer:
      "One click at the bottom of every email. No guilt trips, no hoops.",
  },
  {
    question: "Do you sell my email?",
    answer:
      "Never. Your email is only used for PixelNoryx newsletter and rare product updates you opt into.",
  },
  {
    question: "Can I sponsor an issue?",
    answer:
      "We offer limited sponsor slots for dev tools and courses. Contact hello@pixelnoryx.com for rates.",
  },
];

export const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: "Twitter" },
  { label: "GitHub", href: "https://github.com", icon: "Github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
  { label: "YouTube", href: "https://youtube.com", icon: "Youtube" },
];

export const footerLinks = {
  newsletter: [
    { label: "Archive", href: "/archive" },
    { label: "Latest Issue", href: "/archive/multi-vendor-marketplace-playbook" },
    { label: "Subscribe", href: "/#subscribe" },
    { label: "About", href: "/about" },
  ],
  topics: [
    { label: "React.js", href: "/archive?topic=React.js" },
    { label: "Laravel", href: "/archive?topic=Laravel" },
    { label: "SaaS", href: "/archive?topic=SaaS" },
    { label: "UI/UX", href: "/archive?topic=UI/UX" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Contact", href: "/contact" },
  ],
};

export function getLatestIssue(): NewsletterIssue {
  return newsletterIssues[0];
}

export function getFeaturedIssues(): NewsletterIssue[] {
  return newsletterIssues.filter((i) => i.featured);
}

export function getIssueBySlug(slug: string): NewsletterIssue | undefined {
  return newsletterIssues.find((i) => i.slug === slug);
}

export function getPostsByCategory(topic: NewsletterTopic): NewsletterIssue[] {
  return newsletterIssues.filter((i) => i.topic === topic);
}

export function getPostBySlug(slug: string): NewsletterIssue | undefined {
  return getIssueBySlug(slug);
}

export function getFeaturedPosts(): NewsletterIssue[] {
  return getFeaturedIssues();
}
