"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscribeFormProps {
  variant?: "hero" | "inline" | "compact" | "footer";
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

  const isHero = variant === "hero";
  const isCompact = variant === "compact" || variant === "footer";

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        isHero && "max-w-xl",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-2",
          isHero ? "flex-col sm:flex-row" : "flex-row",
          isCompact && "flex-col sm:flex-row"
        )}
      >
        <div className="relative flex-1">
          <Mail
            className={cn(
              "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted",
              isCompact && "left-3"
            )}
          />
          <input
            type="email"
            required
            placeholder="you@company.com"
            disabled={submitted}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-card pl-11 text-foreground placeholder:text-muted/50 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
              isHero ? "py-4 text-base" : "py-3 text-sm",
              isCompact && "py-2.5 pl-10 text-sm"
            )}
          />
        </div>
        <motion.button
          type="submit"
          disabled={submitted}
          whileHover={{ scale: submitted ? 1 : 1.02 }}
          whileTap={{ scale: submitted ? 1 : 0.98 }}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-glow transition-opacity hover:opacity-95 disabled:opacity-80",
            isHero ? "px-8 py-4" : "px-6 py-3",
            isCompact && "px-5 py-2.5 text-sm"
          )}
        >
          {submitted ? (
            <>
              <Check className="h-4 w-4" />
              Subscribed!
            </>
          ) : (
            <>
              Subscribe free
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
      {!submitted && (
        <p
          className={cn(
            "mt-3 text-muted",
            isHero ? "text-sm" : "text-xs",
            isCompact && "text-center sm:text-left"
          )}
        >
          Join 12,400+ developers. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
