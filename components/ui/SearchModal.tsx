"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/components/providers/SiteDataProvider";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const newsletterIssues = usePosts();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return newsletterIssues.slice(0, 6);
    const q = query.toLowerCase();
    return newsletterIssues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(q) ||
        issue.excerpt.toLowerCase().includes(q) ||
        issue.topic.toLowerCase().includes(q)
    );
  }, [query, newsletterIssues]);

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
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-24"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full max-w-xl border border-border bg-white shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-4">
              <Search className="h-5 w-5 text-muted" />
              <input
                type="search"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 focus:outline-none"
                autoFocus
              />
              <button type="button" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              {results.map((issue) => (
                <Link
                  key={issue.slug}
                  href={`/archive/${issue.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0 hover:bg-surface"
                >
                  <div>
                    <p className="text-xs font-bold text-primary">#{issue.issueNumber}</p>
                    <p className="font-medium line-clamp-1">{issue.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
