import type { NewsletterTopic } from "./types";

export const topicColors: Record<NewsletterTopic, string> = {
  "React.js": "text-category-react",
  Laravel: "text-category-laravel",
  "UI/UX": "text-category-uiux",
  Ecommerce: "text-category-ecommerce",
  APIs: "text-category-apis",
  SaaS: "text-category-saas",
  Startup: "text-category-startup",
  Frontend: "text-category-frontend",
};

export function getTopicColor(topic: NewsletterTopic): string {
  return topicColors[topic] ?? "text-primary";
}
