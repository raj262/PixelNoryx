"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import type { AdPlacement, AdSize } from "@/lib/ads";
import { adGradientClasses } from "@/lib/ad-gradients";
import { cn } from "@/lib/utils";

const sizeStyles: Record<
  AdSize,
  { wrapper: string; minH: string; title: string; padding: string }
> = {
  leaderboard: {
    wrapper: "w-full",
    minH: "min-h-[90px] sm:min-h-[100px]",
    title: "text-lg sm:text-xl",
    padding: "p-5 sm:p-6",
  },
  billboard: {
    wrapper: "w-full",
    minH: "min-h-[200px] sm:min-h-[250px]",
    title: "text-2xl sm:text-3xl",
    padding: "p-8 sm:p-10",
  },
  rectangle: {
    wrapper: "w-full",
    minH: "min-h-[250px]",
    title: "text-xl",
    padding: "p-6",
  },
  skyscraper: {
    wrapper: "w-full",
    minH: "min-h-[400px] sm:min-h-[500px]",
    title: "text-2xl",
    padding: "p-8",
  },
  banner: {
    wrapper: "w-full",
    minH: "min-h-[120px]",
    title: "text-lg",
    padding: "p-5",
  },
  native: {
    wrapper: "w-full",
    minH: "min-h-[140px]",
    title: "text-lg sm:text-xl",
    padding: "p-6 sm:p-8",
  },
};

interface AdSlotProps {
  ad: AdPlacement;
  className?: string;
  animate?: boolean;
  index?: number;
}

export default function AdSlot({
  ad,
  className,
  animate = false,
  index = 0,
}: AdSlotProps) {
  const styles = sizeStyles[ad.size];
  const gradient =
    ad.gradient != null
      ? adGradientClasses[ad.gradient]
      : adGradientClasses.brand;

  const content = (
    <div
      className={cn(
        "ad-slot group relative overflow-hidden rounded-2xl border border-white/10 shadow-lg",
        styles.wrapper,
        styles.minH,
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-95 transition-transform duration-700 group-hover:scale-105",
          gradient
        )}
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div
        className={cn(
          "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-opacity group-hover:opacity-30"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20 blur-3xl"
        )}
      />

      <div
        className={cn(
          "relative flex h-full flex-col justify-between text-white",
          styles.padding
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            {ad.sponsor ?? "Ad"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/50">
            Advertisement
          </span>
        </div>

        <div className="my-4">
          <h3
            className={cn(
              "font-display font-bold leading-tight tracking-tight",
              styles.title
            )}
          >
            {ad.title}
          </h3>
          {ad.subtitle && (
            <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
              {ad.subtitle}
            </p>
          )}
        </div>

        {ad.cta && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-md transition-transform group-hover:scale-105">
            {ad.cta}
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );

  const inner = ad.href ? (
    <Link href={ad.href} className="block">
      {content}
    </Link>
  ) : (
    content
  );

  if (!animate) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {inner}
    </motion.div>
  );
}
