"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { navLinks, categoryNav } from "@/lib/data";
import SearchModal from "@/components/ui/SearchModal";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <div className="magazine-container">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-display text-2xl font-black uppercase tracking-tighter lg:static lg:translate-x-0 lg:text-3xl"
            >
              Pixel<span className="text-primary">Noryx</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted hover:text-primary"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/#subscribe"
                className="hidden bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-hover sm:inline-block"
              >
                Subscribe
              </Link>
            </div>
          </div>

          <nav className="hidden border-t border-border lg:block">
            <ul className="flex items-center justify-center gap-8 py-3">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    <button
                      type="button"
                      className="nav-link flex items-center gap-1"
                    >
                      {link.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {catOpen && (
                      <div className="absolute left-1/2 top-full z-50 mt-0 w-56 -translate-x-1/2 border border-border bg-white py-2 shadow-card-hover">
                        {categoryNav.map((cat) => (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-surface hover:text-primary"
                          >
                            {cat.label}
                          </Link>
                        ))}
                        <Link
                          href="/archive"
                          className="block border-t border-border px-4 py-2 text-sm font-semibold text-primary"
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
                        "nav-link",
                        pathname === link.href && "text-primary"
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
          <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block border-b border-border py-3 font-semibold uppercase"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="mb-2 mt-4 text-xs font-bold uppercase text-muted">Categories</p>
            {categoryNav.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="block py-2 text-sm text-muted"
                onClick={() => setIsOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
