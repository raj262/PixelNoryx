"use client";

import { createContext, useContext } from "react";
import type { SiteBootstrap } from "@/lib/cms-types";

const SiteDataContext = createContext<SiteBootstrap | null>(null);

export function SiteDataProvider({
  data,
  children,
}: {
  data: SiteBootstrap;
  children: React.ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteBootstrap {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}

export function useSiteConfig() {
  const { settings } = useSiteData();
  return {
    name: settings.name,
    tagline: settings.tagline,
    description: settings.description,
    subscriberCount: settings.subscriberCount,
    frequency: settings.frequency,
    author: settings.author,
  };
}

export function useCategoryNav() {
  const { categories } = useSiteData();
  return categories.map((c) => ({ label: c.name, href: c.href }));
}

export function useAds() {
  return useSiteData().ads;
}

export function useAi() {
  return (
    useSiteData().ai ?? {
      enabled: false,
      configured: false,
      label: "PixelNoryx AI",
    }
  );
}

export function useWhatsApp() {
  return (
    useSiteData().whatsapp ?? {
      enabled: false,
      number: "",
      displayNumber: "",
      message: "",
      url: null,
    }
  );
}

export function usePosts() {
  return useSiteData().posts;
}
