"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { sendContactMessage } from "@/lib/api-client";
import { useSiteConfig, useSiteData } from "@/components/providers/SiteDataProvider";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import AnimateIn from "@/components/ui/AnimateIn";

export default function ContactSection() {
  const siteConfig = useSiteConfig();
  const { settings } = useSiteData();
  const socialStats = settings.socialStats;
  const contactEmail = settings.contactEmail;

  const contactPoints = [
    {
      icon: Mail,
      label: "Email us",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: Clock,
      label: "Response time",
      value: "Within 24 hours",
    },
    {
      icon: MessageCircle,
      label: "Newsletter",
      value: siteConfig.frequency,
      href: "/#subscribe",
    },
  ];

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="magazine-container">
        <AnimateIn>
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-card">
            <div className="grid lg:grid-cols-5">
              {/* Left panel — fills width, no empty gutters */}
              <div className="relative overflow-hidden bg-foreground p-8 text-white sm:p-10 lg:col-span-2 lg:p-12">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />

                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Contact
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    Get in Touch
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                    Questions about sponsorship, guest posts, or partnerships?
                    We&apos;d love to hear from you.
                  </p>

                  <ul className="mt-10 space-y-4">
                    {contactPoints.map((item) => {
                      const Icon = item.icon;
                      const cardClass =
                        "flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10";
                      const content = (
                        <>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                              {item.label}
                            </p>
                            <p className="mt-0.5 font-medium text-white">
                              {item.value}
                            </p>
                          </div>
                          {item.href && (
                            <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-white/40" />
                          )}
                        </>
                      );

                      return (
                        <li key={item.label}>
                          {item.href ? (
                            <Link href={item.href} className={cardClass}>
                              {content}
                            </Link>
                          ) : (
                            <div className={cardClass}>{content}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-10 border-t border-white/10 pt-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Follow us
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {socialStats.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-primary/50 hover:bg-primary/20 hover:text-white"
                        >
                          {s.label}
                          <span className="ml-1.5 text-white/40">{s.count}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel — form */}
              <div className="p-8 sm:p-10 lg:col-span-3 lg:p-12">
                <p className="text-sm font-medium text-muted">
                  Send a message and we&apos;ll get back to you soon.
                </p>

                <form
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                  onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setError(null);
                    setSending(true);
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    const result = await sendContactMessage({
                      name: String(fd.get("name") ?? ""),
                      email: String(fd.get("email") ?? ""),
                      message: String(fd.get("message") ?? ""),
                    });
                    setSending(false);
                    if (result.ok) {
                      setSent(true);
                      form.reset();
                    } else {
                      setError(result.message ?? "Could not send message.");
                    }
                  }}
                >
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your project or question..."
                      className="w-full resize-none rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    {error && (
                      <p className="mb-3 text-sm text-primary">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={sending || sent}
                      className="btn-modern inline-flex w-full items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 sm:w-auto"
                    >
                      {sent ? (
                        "Message sent — thank you!"
                      ) : sending ? (
                        "Sending…"
                      ) : (
                        <>
                          Send message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-10 rounded-2xl border border-dashed border-border bg-gradient-to-br from-surface to-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Prefer the newsletter?
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Join {siteConfig.subscriberCount} readers — {siteConfig.frequency}.
                    </p>
                  </div>
                  <div className="mt-4 shrink-0 sm:mt-0 sm:min-w-[280px] sm:flex-1 sm:max-w-md">
                    <SubscribeForm variant="inline" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
