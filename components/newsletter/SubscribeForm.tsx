"use client";

import { useState, FormEvent } from "react";
import { subscribeNewsletter } from "@/lib/api-client";
import { useSiteData } from "@/components/providers/SiteDataProvider";
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
  const { settings } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const email = new FormData(e.currentTarget).get("email");
    if (!email || typeof email !== "string") return;

    setLoading(true);
    const result = await subscribeNewsletter(email);
    setLoading(false);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message ?? "Subscription failed.");
    }
  };

  const isWidget = variant === "widget" || variant === "popup";
  const isHero = variant === "hero";
  const stacksOnNarrow =
    isWidget || isHero || variant === "inline" || variant === "footer";

  return (
    <form id={id} onSubmit={handleSubmit} className={cn("w-full min-w-0", className)}>
      <div
        className={cn(
          "flex w-full min-w-0 gap-2",
          stacksOnNarrow ? "flex-col sm:flex-row sm:gap-0" : "flex-row"
        )}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          disabled={submitted || loading}
          className={cn(
            "min-w-0 flex-1 border border-border bg-white px-4 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            isWidget || isHero ? "py-3" : "py-2.5 text-sm",
            stacksOnNarrow && "w-full sm:rounded-none"
          )}
        />
        <button
          type="submit"
          disabled={submitted || loading}
          className={cn(
            "shrink-0 bg-primary px-6 font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:opacity-70",
            isWidget || isHero ? "py-3" : "py-2.5 text-sm",
            stacksOnNarrow && "w-full sm:w-auto"
          )}
        >
          {submitted ? "Subscribed!" : loading ? "…" : "Subscribe"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-primary">{error}</p>}
      {submitted && (
        <p className="mt-2 text-xs text-muted">
          Check your inbox (and spam folder). Welcome mail comes from{" "}
          <span className="font-medium text-foreground">{settings.contactEmail}</span>.
        </p>
      )}
    </form>
  );
}
