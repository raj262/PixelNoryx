"use client";

import { cn } from "@/lib/utils";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds — matches previous Framer delay prop */
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

/** SSR-safe scroll reveal — CSS only, same markup on server and client. */
export default function AnimateIn({
  children,
  className,
  delay = 0,
}: AnimateInProps) {
  return (
    <div
      className={cn("animate-fade-up motion-reduce:animate-none", className)}
      style={
        delay > 0
          ? { animationDelay: `${delay}s`, animationFillMode: "both" }
          : { animationFillMode: "both" }
      }
    >
      {children}
    </div>
  );
}
