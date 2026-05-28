import type { AdPlacement } from "@/lib/ads";
import type { NewsletterIssue } from "@/lib/types";

export interface SiteSettingsPayload {
  name: string;
  tagline: string;
  description: string;
  subscriberCount: string;
  frequency: string;
  contactEmail: string;
  communitySize: string;
  author: {
    name: string;
    role: string;
    bio: string;
    image: string;
  };
  socialStats: { label: string; count: string; href: string }[];
  socialLinks: { label: string; href: string; icon: string }[];
  navLinks: { label: string; href: string; hasDropdown?: boolean }[];
  footerLinks: {
    newsletter: { label: string; href: string }[];
    topics: { label: string; href: string }[];
    legal: { label: string; href: string }[];
  };
  subscribeBenefits: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface CategoryPayload {
  name: string;
  slug: string;
  href: string;
}

export interface FaqPayload {
  question: string;
  answer: string;
}

export interface TestimonialPayload {
  name: string;
  role: string | null;
  content: string;
  image: string | null;
  avatar: string;
  rating: number;
}

export interface AiStatusPayload {
  enabled: boolean;
  configured?: boolean;
  model?: string;
  provider?: string;
  label?: string;
}

export interface WhatsAppPayload {
  enabled: boolean;
  number: string;
  displayNumber: string;
  message: string;
  url: string | null;
}

export interface SiteBootstrap {
  settings: SiteSettingsPayload;
  categories: CategoryPayload[];
  topics: string[];
  posts: NewsletterIssue[];
  faqs: FaqPayload[];
  testimonials: TestimonialPayload[];
  ads: Record<string, AdPlacement>;
  ai?: AiStatusPayload;
  whatsapp?: WhatsAppPayload;
}
