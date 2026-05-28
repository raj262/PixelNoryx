"use client";

import { subscribeBenefits } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import DynamicIcon from "@/components/ui/IconMap";

export default function WhySubscribe() {
  return (
    <section id="subscribe" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          badge="Why Subscribe"
          title="Built for Busy Developers"
          description="No noise. No engagement bait. Just practical tech you can use on Monday."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subscribeBenefits.map((item, index) => (
            <GlassCard key={item.title} delay={index * 0.08}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <DynamicIcon name={item.icon} className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
