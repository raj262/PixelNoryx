"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="magazine-container py-20 text-center text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="magazine-container py-12 sm:py-16">
      <div className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-white shadow-card">
        <div className="border-b border-border bg-gradient-to-r from-primary/10 via-white to-indigo-50 px-8 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-white">
            <User className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
          {user.roles.length > 0 ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
              {user.roles.join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="space-y-4 p-8">
          <p className="text-sm leading-relaxed text-muted">
            You&apos;re signed in. Browse the{" "}
            <Link href="/archive" className="font-semibold text-primary hover:underline">
              archive
            </Link>{" "}
            or subscribe to the newsletter from the homepage.
          </p>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
