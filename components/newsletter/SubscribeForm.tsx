"use client";

import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface SubscribeFormProps {
  variant?: "hero" | "inline" | "compact" | "footer" | "widget" | "popup";
  className?: string;
  id?: string;
}

export default function SubscribeForm({
  variant = "inline",
  className,
  id = "subscribe",
}: SubscribeFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isWidget = variant === "widget" || variant === "popup";
  const isHero = variant === "hero";

  return (
    <form id={id} onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className={cn("flex gap-0", isWidget ? "flex-col gap-2" : "flex-row")}>
        <input
          type="email"
          required
          placeholder="Your email address"
          disabled={submitted}
          className={cn(
            "flex-1 border border-border bg-white px-4 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            isWidget || isHero ? "py-3" : "py-2.5 text-sm"
          )}
        />
        <button
          type="submit"
          disabled={submitted}
          className={cn(
            "shrink-0 bg-primary px-6 font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:opacity-70",
            isWidget || isHero ? "py-3" : "py-2.5 text-sm"
          )}
        >
          {submitted ? "Subscribed!" : "Subscribe"}
        </button>
      </div>
    </form>
  );
}
