"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { footerLinks, socialLinks, siteConfig } from "@/lib/data";
import DynamicIcon from "@/components/ui/IconMap";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-card/40">
      <div className="section-padding mx-auto max-w-7xl pt-12 pb-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Pixel<span className="text-primary">Noryx</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted">
              {siteConfig.tagline}. {siteConfig.description}
            </p>
            <div className="mt-6 max-w-sm">
              <SubscribeForm variant="footer" id="footer-subscribe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h4 className="mb-4 text-sm font-semibold">Newsletter</h4>
              <ul className="space-y-2.5">
                {footerLinks.newsletter.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Topics</h4>
              <ul className="space-y-2.5">
                {footerLinks.topics.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg glass text-muted hover:text-foreground"
                    aria-label={s.label}
                  >
                    <DynamicIcon name={s.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-white/[0.08] pt-8 text-center text-sm text-muted">
          © {year} PixelNoryx · {siteConfig.frequency}
        </p>
      </div>
    </footer>
  );
}
