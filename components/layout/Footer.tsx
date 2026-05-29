"use client";

import Link from "next/link";
import Image from "next/image";
import { usePosts, useSiteConfig, useSiteData } from "@/components/providers/SiteDataProvider";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import DynamicIcon from "@/components/ui/IconMap";

export default function Footer() {
  const posts = usePosts();
  const siteConfig = useSiteConfig();
  const { settings } = useSiteData();
  const { footerLinks, socialLinks } = settings;
  const recent = posts.slice(0, 2);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-4 border-primary bg-surface-dark text-white">
      <div className="magazine-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-black uppercase">
              Pixel<span className="text-primary">Noryx</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-white/50 hover:text-primary"
                  aria-label={s.label}
                >
                  <DynamicIcon name={s.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Recent Posts
            </h4>
            <ul className="space-y-4">
              {recent.map((post) => (
                <li key={post.slug}>
                  <Link href={`/archive/${post.slug}`} className="group flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                      <Image src={post.image} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-white/50">{post.date}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              {footerLinks.topics.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-white/60">
              Get {siteConfig.tagline} in your inbox.
            </p>
            <SubscribeForm variant="footer" id="footer-subscribe" />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>© {year} {siteConfig.name}. All Rights Reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://rajeshcodes.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 transition-colors hover:text-primary"
            >
              Rajesh
            </a>
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
