export type NewsletterTopic =
  | "React.js"
  | "Laravel"
  | "UI/UX"
  | "Ecommerce"
  | "APIs"
  | "SaaS"
  | "Startup"
  | "Frontend";

export interface NewsletterIssue {
  id: number;
  issueNumber: number;
  slug: string;
  title: string;
  excerpt: string;
  preview: string;
  content: string;
  image: string;
  topic: NewsletterTopic;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  free?: boolean;
  commentCount?: number;
  sponsored?: boolean;
  /** Optional SEO overrides (used when CMS meta fields are empty). */
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

/** @deprecated Use NewsletterIssue — kept for gradual migration */
export type BlogCategory = NewsletterTopic;
export type BlogPost = NewsletterIssue;
