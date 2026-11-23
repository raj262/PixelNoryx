"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Users,
} from "lucide-react";
import type { AdminSessionUser } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/posts", label: "Posts", icon: FileText, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/seo", label: "SEO", icon: Search, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["ADMIN"] },
];

export default function AdminShell({
  user,
  children,
}: {
  user: AdminSessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const items = nav.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#f4f1ec] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-[#111827] text-white md:flex md:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/admin" className="font-display text-xl font-black tracking-tight">
              Pixel<span className="text-primary">Noryx</span>
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
              Admin · {user.role}
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border/70 bg-white/80 px-4 py-3 backdrop-blur md:px-8">
            <div className="md:hidden">
              <Link href="/admin" className="font-display text-lg font-black">
                Pixel<span className="text-primary">Noryx</span>
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-muted">
              <Link href="/" className="font-semibold hover:text-primary" target="_blank">
                View site
              </Link>
              <span className="hidden rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground sm:inline">
                {user.role}
              </span>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-border/60 bg-white px-4 py-2 md:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
                  pathname.startsWith(item.href)
                    ? "bg-primary text-white"
                    : "bg-surface text-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
