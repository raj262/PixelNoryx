"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import {
  dismissPushPrompt,
  fetchPushConfig,
  getPushPermission,
  isPushDismissed,
  isPushSubscribedLocally,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push-notifications";
import { cn } from "@/lib/utils";

export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) return;
    if (isPushDismissed() || isPushSubscribedLocally()) return;
    if (getPushPermission() === "granted") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    void fetchPushConfig().then((config) => {
      if (cancelled || !config.enabled || !config.publicKey) return;
      timer = setTimeout(() => setVisible(true), 6000);
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const close = () => {
    dismissPushPrompt();
    setVisible(false);
  };

  const enable = async () => {
    setLoading(true);
    setMessage(null);
    const result = await subscribeToPush();
    setLoading(false);

    if (result.ok) {
      setVisible(false);
      return;
    }

    setMessage(result.message ?? "Could not enable notifications.");
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-24 left-4 right-4 z-[190] mx-auto max-w-md",
        "animate-fade-up rounded-2xl border border-border/80 bg-white p-4 shadow-card-hover sm:left-6 sm:right-auto"
      )}
      role="dialog"
      aria-label="Enable push notifications"
    >
      <button
        type="button"
        onClick={close}
        className="absolute right-3 top-3 text-muted hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Push alerts
          </p>
          <p className="mt-1 font-display text-sm font-bold text-foreground">
            Get notified when we publish
          </p>
          <p className="mt-1 text-xs text-muted">
            New articles and newsletter issues — no spam.
          </p>
          {message ? <p className="mt-2 text-xs text-primary">{message}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void enable()}
              disabled={loading}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary disabled:opacity-60"
            >
              {loading ? "Enabling…" : "Enable"}
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-foreground"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
