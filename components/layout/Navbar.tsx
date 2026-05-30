"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ui/ClientOnly";
import { Menu, X, Search, ChevronDown, Sparkles } from "lucide-react";
import { openAiChat } from "@/lib/ai-chat-events";
import { useAi, useCategoryNav, useSiteData } from "@/components/providers/SiteDataProvider";
import SearchModal from "@/components/ui/SearchModal";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteData();
  const navLinks = settings.navLinks;
  const categoryNav = useCategoryNav();
  const ai = useAi();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/80 bg-white/85 shadow-sm backdrop-blur-xl"
            : "bg-white/70 backdrop-blur-md"
        )}
      >
        <div className="magazine-container">
          <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <span className="font-display text-2xl font-black tracking-tight transition-transform group-hover:scale-[1.02] lg:text-3xl">
                Pixel
                <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                  Noryx
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {ai.enabled ? (
                <button
                  type="button"
                  onClick={() => openAiChat()}
                  className="hidden rounded-full border border-primary/20 bg-primary/5 p-2.5 text-primary transition-colors hover:bg-primary/10 active:scale-95 sm:inline-flex"
                  aria-label="Open AI chat"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="rounded-full p-2.5 text-muted transition-colors hover:bg-surface hover:text-primary active:scale-95"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/#subscribe"
                className="hidden rounded-full bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-all hover:scale-[1.04] hover:bg-primary active:scale-[0.98] sm:inline-flex"
              >
                Subscribe
              </Link>
            </div>
          </div>

          <nav className="hidden border-t border-border/60 lg:block">
            <ul className="flex items-center justify-center gap-1 py-2">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    <button type="button" className="nav-link flex items-center gap-1 rounded-lg px-4 py-2">
                      {link.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")} />
                    </button>
                    {catOpen && (
                      <div className="absolute left-1/2 top-full z-50 mt-1 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-white py-2 shadow-card-hover animate-fade-up">
                        {categoryNav.map((cat) => (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            className="block px-4 py-2.5 text-sm transition-colors hover:bg-surface hover:text-primary"
                          >
                            {cat.label}
                          </Link>
                        ))}
                        <Link
                          href="/archive"
                          className="block border-t border-border px-4 py-2.5 text-sm font-semibold text-primary"
                        >
                          View All →
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "nav-link rounded-lg px-4 py-2",
                        (pathname === link.href ||
                          (link.href === "/features" && pathname.startsWith("/features"))) &&
                          "nav-link-active bg-primary/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {isOpen && (
          <div className="overflow-hidden border-t border-border lg:hidden">
            <div className="px-4 py-4">
              {ai.enabled ? (
                <button
                  type="button"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-rose-500 py-3 text-sm font-bold text-white"
                  onClick={() => {
                    setIsOpen(false);
                    openAiChat();
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  {ai.label ?? "AI Chat"}
                </button>
              ) : null}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg py-3 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <ClientOnly>
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </ClientOnly>
    </>
  );
}
