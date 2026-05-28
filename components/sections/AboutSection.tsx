"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Code2, Mail, PenLine, Users } from "lucide-react";
import { useSiteConfig, useSiteData } from "@/components/providers/SiteDataProvider";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import AnimateIn from "@/components/ui/AnimateIn";

export default function AboutSection() {
  const siteConfig = useSiteConfig();
  const { settings } = useSiteData();
  const { author } = siteConfig;
  const socialStats = settings.socialStats;
  const firstName = author.name.split(" ")[0] ?? author.name;

  const highlights = [
    {
      icon: Code2,
      label: "Stack",
      value: "React · Laravel · SaaS",
    },
    {
      icon: Users,
      label: "Community",
      value: `${settings.communitySize} developers`,
    },
    {
      icon: BookOpen,
      label: "Newsletter",
      value: siteConfig.frequency,
    },
  ];

  return (
    <section id="about" className="overflow-x-hidden py-14 sm:py-20">
      <div className="magazine-container">
        <AnimateIn>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-card sm:rounded-3xl">
            <div className="grid min-w-0 lg:grid-cols-12">
              {/* Portrait panel */}
              <div className="relative min-h-[min(72vw,360px)] w-full bg-foreground sm:min-h-[400px] lg:col-span-5 lg:min-h-[560px]">
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  className="object-cover object-center opacity-90"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/25" />
                <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
                <div className="pointer-events-none absolute -right-8 top-6 h-40 w-40 rounded-full bg-primary/25 blur-3xl sm:-right-12 sm:top-8 sm:h-48 sm:w-48" />

                <div className="relative flex min-h-[min(72vw,360px)] flex-col justify-end p-6 sm:min-h-[400px] sm:p-10 lg:min-h-[560px]">
                  <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    <PenLine className="h-3 w-3 shrink-0 text-primary" />
                    Editor-in-Chief
                  </span>
                  <p className="mt-4 break-words font-display text-2xl font-bold leading-tight text-white sm:mt-6 sm:text-3xl lg:text-4xl">
                    {author.name}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">{author.role}</p>

                  <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                    {socialStats.slice(0, 3).map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/20"
                      >
                        {s.label}{" "}
                        <span className="text-white/50">{s.count}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story + subscribe */}
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-12">
                <span className="section-subtitle">About</span>
                <h2 className="section-title mt-2 break-words">
                  Meet <span className="text-primary">{firstName}</span>
                </h2>

                <p className="mt-5 text-base leading-relaxed text-muted sm:mt-6">
                  {author.bio}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted/90">
                  {siteConfig.description}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.label}
                        className="min-w-0 rounded-2xl border border-border/80 bg-surface/80 p-4 transition-colors hover:border-primary/25 hover:bg-white"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                          {item.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 min-w-0 rounded-2xl border border-dashed border-border bg-gradient-to-br from-surface to-white p-5 sm:mt-10 sm:p-8">
                  <div className="flex min-w-0 flex-col gap-5">
                    <div className="min-w-0">
                      <p className="font-display text-base font-bold text-foreground sm:text-lg">
                        Join {siteConfig.subscriberCount} readers
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Free weekly issues — no spam, unsubscribe anytime.
                      </p>
                    </div>
                    <div className="w-full min-w-0">
                      <SubscribeForm variant="inline" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 text-sm font-semibold sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                  <Link
                    href="/archive"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    Browse the archive →
                  </Link>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    Work with us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
