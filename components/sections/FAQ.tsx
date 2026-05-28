"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-border bg-surface py-16">
      <div className="magazine-container max-w-3xl">
        <p className="section-subtitle">FAQ</p>
        <h2 className="section-title">Common Questions</h2>

        <div className="mt-8 space-y-2">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="border border-border bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-surface"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <p className="border-t border-border px-5 py-4 text-sm text-muted leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
