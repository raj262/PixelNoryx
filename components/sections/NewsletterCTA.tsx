"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import { siteConfig } from "@/lib/data";

export default function NewsletterCTA() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-newsletter-gradient p-8 sm:p-14"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Never miss an issue
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Join {siteConfig.subscriberCount} developers who get {siteConfig.tagline}{" "}
              {siteConfig.frequency.toLowerCase()}.
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <SubscribeForm variant="inline" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
