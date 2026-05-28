"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { newsletterIssues } from "@/lib/data";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return newsletterIssues.slice(0, 6);
    const q = query.toLowerCase();
    return newsletterIssues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(q) ||
        issue.excerpt.toLowerCase().includes(q) ||
        issue.tags.some((t) => t.toLowerCase().includes(q)) ||
        issue.topic.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="glass w-full max-w-xl overflow-hidden rounded-2xl shadow-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Search className="h-5 w-5 text-muted" />
              <input
                type="search"
                placeholder="Search newsletter issues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted/60 focus:outline-none"
                autoFocus
              />
              <button type="button" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  No issues found.
                </p>
              ) : (
                results.map((issue) => (
                  <Link
                    key={issue.slug}
                    href={`/archive/${issue.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-white/5"
                  >
                    <div>
                      <p className="text-xs text-primary">#{issue.issueNumber}</p>
                      <p className="font-medium line-clamp-1">{issue.title}</p>
                      <p className="text-xs text-muted">
                        {issue.topic} · {issue.readTime}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
