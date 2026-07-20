"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function TopBar() {
  const { user, loading, logout } = useAuth();
  return (
    <div className="hidden border-b border-border bg-surface md:block">
      <div className="magazine-container flex h-10 items-center justify-end text-xs">
        <div className="flex items-center gap-4 text-muted">
          {loading ? (
            <span className="text-border">…</span>
          ) : user ? (
            <>
              <Link href="/account" className="font-semibold text-foreground hover:text-primary">
                {user.name.split(" ")[0]}
              </Link>
              <span className="text-border">|</span>
              <button
                type="button"
                onClick={() => logout()}
                className="hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary">
                Login
              </Link>
              <span className="text-border">|</span>
              <Link href="/register" className="font-semibold text-foreground hover:text-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
