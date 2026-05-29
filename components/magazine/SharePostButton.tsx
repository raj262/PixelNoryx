"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SharePostButtonProps = {
  title: string;
  url: string;
  text?: string;
};

export default function SharePostButton({ title, url, text }: SharePostButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const shareText = text?.trim() || title;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
  ];

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setStatus("Link copied!");
      setTimeout(() => {
        setCopied(false);
        setStatus(null);
      }, 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
    setMenuOpen(false);
  }, [url]);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setStatus(null);
  }, []);

  const handleShare = async () => {
    const shareData = { title, text: shareText, url };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        if (navigator.canShare && !navigator.canShare(shareData)) {
          openMenu();
          return;
        }
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    openMenu();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <Share2 className="h-4 w-4" />
        {copied ? "Copied!" : "Share"}
      </button>

      {status && !menuOpen ? (
        <span className="absolute start-0 top-full mt-1 text-xs font-medium text-primary">
          {status}
        </span>
      ) : null}

      {menuOpen ? (
        <div
          className="absolute start-0 top-full z-20 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-surface"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            Copy link
          </button>
          <div className="my-1 border-t border-border" />
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-sm text-foreground hover:bg-surface hover:text-primary"
              )}
            >
              Share on {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
