"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTopicColor } from "@/lib/topic-colors";

export type CategoryNavItem = { label: string; href: string };

const SEARCH_THRESHOLD = 8;
const TWO_COLUMN_THRESHOLD = 7;
const THREE_COLUMN_THRESHOLD = 16;

function columnCount(total: number): number {
  if (total <= TWO_COLUMN_THRESHOLD) return 1;
  if (total <= THREE_COLUMN_THRESHOLD) return 2;
  return 3;
}

interface CategoryNavMenuProps {
  items: CategoryNavItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
  className?: string;
}

export default function CategoryNavMenu({
  items,
  viewAllHref = "/archive",
  viewAllLabel = "View all categories",
  variant = "dropdown",
  onNavigate,
  className,
}: CategoryNavMenuProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const cols = columnCount(items.length);
  const showSearch = items.length >= SEARCH_THRESHOLD;
  const isEmpty = filtered.length === 0;
  const isDropdown = variant === "dropdown";

  const gridClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const handleNavigate = () => {
    setQuery("");
    onNavigate?.();
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        isDropdown
          ? cn(
              "rounded-2xl border border-border bg-white shadow-card-hover animate-fade-up",
              cols === 1 && "w-56",
              cols === 2 && "w-[min(26rem,92vw)]",
              cols === 3 && "w-[min(36rem,94vw)]"
            )
          : "rounded-xl border border-border/80 bg-white",
        className
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-border/60 bg-gradient-to-r from-surface/80 to-white px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutGrid className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground">Topics</p>
          <p className="text-[11px] text-muted">
            {items.length} {items.length === 1 ? "category" : "categories"}
          </p>
        </div>
      </div>

      {showSearch ? (
        <div className="border-b border-border/60 px-3 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter topics…"
              className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              aria-label="Filter categories"
            />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "overflow-y-auto overscroll-contain",
          items.length > 20
            ? "max-h-[min(70vh,28rem)]"
            : isDropdown
              ? "max-h-[min(60vh,22rem)]"
              : "max-h-64"
        )}
      >
        {isEmpty ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No topics match your search.</p>
        ) : (
          <div className={cn("grid gap-0.5 p-2", gridClass)}>
            {filtered.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavigate}
                className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-surface hover:text-primary"
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full bg-current opacity-60 transition-opacity group-hover:opacity-100",
                    getTopicColor(item.label)
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        href={viewAllHref}
        onClick={handleNavigate}
        className="group flex items-center justify-between border-t border-border bg-surface/40 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface"
      >
        {viewAllLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
