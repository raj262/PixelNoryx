"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@pixelnoryx.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.user) {
          router.replace("/admin");
        }
      })
      .catch(() => undefined);
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const raw = await res.text();
      let json: { message?: string } = {};
      if (contentType.includes("application/json") && raw) {
        try {
          json = JSON.parse(raw) as { message?: string };
        } catch {
          json = {};
        }
      }

      if (res.status === 404) {
        setError(
          "Admin API not found (404). Deploy the latest build on Vercel and set DATABASE_URL + ADMIN_SESSION_SECRET."
        );
        return;
      }

      if (!res.ok) {
        setError(json.message ?? `Login failed (${res.status}).`);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(
        "Cannot reach server. Start the app with npm run dev, or check your connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          Sign in to PixelNoryx
        </h1>
        <p className="mt-2 text-sm text-muted">
          Role-based CMS — posts, SEO, and users.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-modern w-full disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="font-semibold text-foreground hover:text-primary">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
