"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  BadgeCheck,
  Calendar,
  HelpCircle,
  MailX,
  Megaphone,
  Minus,
  Plus,
  Shield,
} from "lucide-react";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";
import AnimateIn from "@/components/ui/AnimateIn";

const faqMeta = [
  { icon: Calendar },
  { icon: BadgeCheck },
  { icon: Archive },
  { icon: MailX },
  { icon: Shield },
  { icon: Megaphone },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="magazine-container">
        <AnimateIn>
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-card">
            <div className="grid lg:grid-cols-12">
              {/* Intro panel */}
              <div className="relative border-b border-border/80 bg-gradient-to-br from-surface via-white to-primary/5 p-8 sm:p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
                <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <HelpCircle className="h-3.5 w-3.5" />
                    FAQ
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Common Questions
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Everything you need to know about the newsletter, archive,
                    privacy, and partnerships.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
                      {faqs.length} answers
                    </span>
                    <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted">
                      Updated regularly
                    </span>
                  </div>

                  <div className="mt-10 rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-foreground">
                      Still have questions?
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      We&apos;re happy to help — reach out anytime.
                    </p>
                    <Link
                      href="/#contact"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      Contact us →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <div className="lg:col-span-8">
                <ul className="divide-y divide-border/80">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    const Icon = faqMeta[index]?.icon ?? HelpCircle;
                    const num = String(index + 1).padStart(2, "0");

                    return (
                      <li key={faq.question}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full gap-4 px-6 py-5 text-left transition-colors sm:px-8 sm:py-6",
                            isOpen
                              ? "bg-primary/[0.04]"
                              : "hover:bg-surface/80"
                          )}
                          onClick={() =>
                            setOpenIndex(isOpen ? null : index)
                          }
                          aria-expanded={isOpen}
                        >
                          <span
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-colors",
                              isOpen
                                ? "border-primary/30 bg-primary text-white"
                                : "border-border bg-surface text-muted"
                            )}
                          >
                            {isOpen ? (
                              <Icon className="h-5 w-5" />
                            ) : (
                              num
                            )}
                          </span>

                          <span className="min-w-0 flex-1 pt-0.5">
                            <span
                              className={cn(
                                "block font-display text-base font-bold leading-snug sm:text-lg",
                                isOpen ? "text-primary" : "text-foreground"
                              )}
                            >
                              {faq.question}
                            </span>
                          </span>

                          <span
                            className={cn(
                              "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all",
                              isOpen
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-white text-muted"
                            )}
                          >
                            {isOpen ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </span>
                        </button>

                        <div
                          className={cn(
                            "grid transition-[grid-template-rows] duration-300 ease-out",
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="border-t border-primary/10 bg-gradient-to-b from-primary/[0.03] to-transparent px-6 pb-6 pl-[5.25rem] text-sm leading-relaxed text-muted sm:px-8 sm:pb-7 sm:pl-[5.75rem]">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
