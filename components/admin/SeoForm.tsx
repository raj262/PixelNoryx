"use client";

import { FormEvent, useState } from "react";

type SeoValues = {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  titleTemplate: string;
  homeTitle: string;
  homeDescription: string;
  homeKeywords: string;
  ogImage: string;
  twitterHandle: string;
  robots: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
};

export default function SeoForm({ initial }: { initial: SeoValues }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SeoValues>(key: K, value: SeoValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(json.message ?? "Save failed");
        return;
      }
      setMessage("SEO settings saved.");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-card sm:p-6">
      {(
        [
          ["siteUrl", "Site URL"],
          ["titleTemplate", "Title template (%s = page title)"],
          ["defaultTitle", "Default title"],
          ["defaultDescription", "Default description"],
          ["defaultKeywords", "Default keywords"],
          ["homeTitle", "Home title"],
          ["homeDescription", "Home description"],
          ["homeKeywords", "Home keywords"],
          ["ogImage", "Default OG image URL"],
          ["twitterHandle", "Twitter handle"],
          ["robots", "Robots"],
          ["googleSiteVerification", "Google site verification"],
          ["bingSiteVerification", "Bing site verification"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-sm font-semibold">
          {label}
          {key.includes("Description") ? (
            <textarea
              className="admin-input mt-1.5 min-h-[80px]"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          ) : (
            <input
              className="admin-input mt-1.5"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          )}
        </label>
      ))}

      {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-semibold text-primary">{error}</p> : null}

      <button type="submit" className="btn-modern" disabled={saving}>
        {saving ? "Saving…" : "Save SEO settings"}
      </button>
    </form>
  );
}
