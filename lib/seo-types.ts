export interface SeoPayload {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  titleTemplate: string;
  robots: string;
  verification: {
    google: string | null;
    bing: string | null;
  };
  home: {
    title: string;
    description: string;
    keywords: string[];
  };
  openGraph: {
    siteName: string;
    image: string | null;
    twitterHandle: string | null;
  };
}

export interface PostSeoPayload {
  title: string;
  description: string | null;
  keywords: string[];
  canonical: string;
  robots: string;
  openGraph: {
    title: string;
    description: string | null;
    image: string | null;
    url: string;
    type: string;
  };
}
