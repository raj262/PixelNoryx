"use client";

import { useState } from "react";
import SubscribeForm from "./SubscribeForm";

export default function SubscribeWidget() {
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="sidebar-widget bg-surface">
      <h3 className="font-display text-xl font-bold leading-snug">
        Get the best stories into your inbox!
      </h3>
      <p className="mt-2 text-sm text-muted">
        Subscribe for weekly dev tips. No spam, unsubscribe anytime.
      </p>
      <div className="mt-5">
        <SubscribeForm variant="widget" />
      </div>
      <label className="mt-4 flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-primary"
        />
        I agree that my submitted data is being collected and stored.
      </label>
    </div>
  );
}
