"use client";

import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export function trackNewsletterSubscribe(email?: string) {
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    sendGTMEvent({
      event: "newsletter_subscribe",
      method: "form",
    });
    return;
  }

  if (process.env.NEXT_PUBLIC_GA_ID) {
    sendGAEvent("event", "newsletter_subscribe", {
      method: "form",
      ...(email ? { email_domain: email.split("@")[1] ?? "" } : {}),
    });
  }
}
