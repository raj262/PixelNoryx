"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/admin-posts";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  preview: string;
  content: string;
  image: string;
  topic: string;
  tags: string[];
  readTime: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  free: boolean;
  sponsored: boolean;
  issueNumber: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
};

const empty: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  preview: "",
  content: "",
  image: "",
  topic: "Frontend",
  tags: [],
  readTime: "9 min read",
  status: "DRAFT",
  featured: false,
  free: true,
  sponsored: false,
  issueNumber: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: "",
  canonicalUrl: "",
  robots: "index, follow",
};

export default function PostForm({ initial }: { initial?: Partial<PostFormValues> }) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormValues>({ ...empty, ...initial });
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?.id);

  const seoTitle = useMemo(
    () => form.metaTitle.trim() || form.title.trim() || "Untitled",
    [form.metaTitle, form.title]
  );

  function set<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      issueNumber: form.issueNumber ? Number(form.issueNumber) : null,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = (await res.json()) as { message?: string; data?: { id: string } };
      if (!res.ok) {
        setError(json.message ?? "Save failed");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-lg font-bold">Content</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Title">
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                set("title", title);
                if (!isEdit || !form.slug) set("slug", slugify(title));
              }}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug">
              <input
                className="admin-input"
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                required
              />
            </Field>
            <Field label="Topic">
              <input
                className="admin-input"
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Excerpt">
            <textarea
              className="admin-input min-h-[80px]"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </Field>
          <Field label="Preview (lede)">
            <textarea
              className="admin-input min-h-[70px]"
              value={form.preview}
              onChange={(e) => set("preview", e.target.value)}
            />
          </Field>
          <Field label="Content (HTML allowed)">
            <textarea
              className="admin-input min-h-[220px] font-mono text-xs"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Image URL">
              <input
                className="admin-input"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </Field>
            <Field label="Tags (comma separated)">
              <input
                className="admin-input"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Status">
              <select
                className="admin-input"
                value={form.status}
                onChange={(e) => set("status", e.target.value as "DRAFT" | "PUBLISHED")}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </Field>
            <Field label="Read time">
              <input
                className="admin-input"
                value={form.readTime}
                onChange={(e) => set("readTime", e.target.value)}
              />
            </Field>
            <Field label="Issue #">
              <input
                className="admin-input"
                value={form.issueNumber}
                onChange={(e) => set("issueNumber", e.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.free}
                onChange={(e) => set("free", e.target.checked)}
              />
              Free
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.sponsored}
                onChange={(e) => set("sponsored", e.target.checked)}
              />
              Sponsored
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-lg font-bold">SEO</h2>
        <p className="mt-1 text-sm text-muted">
          Search title preview: <span className="font-semibold text-foreground">{seoTitle}</span>
        </p>
        <div className="mt-4 grid gap-4">
          <Field label="Meta title">
            <input
              className="admin-input"
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder={form.title || "Defaults to post title"}
            />
          </Field>
          <Field label="Meta description">
            <textarea
              className="admin-input min-h-[90px]"
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              placeholder={form.excerpt || "Defaults to excerpt"}
            />
          </Field>
          <Field label="Meta keywords">
            <input
              className="admin-input"
              value={form.metaKeywords}
              onChange={(e) => set("metaKeywords", e.target.value)}
              placeholder="laravel, queues, production"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="OG image URL">
              <input
                className="admin-input"
                value={form.ogImage}
                onChange={(e) => set("ogImage", e.target.value)}
              />
            </Field>
            <Field label="Canonical URL">
              <input
                className="admin-input"
                value={form.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Robots">
            <input
              className="admin-input"
              value={form.robots}
              onChange={(e) => set("robots", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {error ? (
        <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-modern" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          className="btn-outline-modern"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
