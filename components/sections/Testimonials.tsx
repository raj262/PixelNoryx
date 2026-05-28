"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="Testimonials"
          title="Trusted by Developers"
          description="What our community says about our blogs, products, and tutorials."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <GlassCard key={item.name} delay={index * 0.1}>
              <Quote className="mb-4 h-8 w-8 text-primary/30" />
              <p className="leading-relaxed text-foreground">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted">{item.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
