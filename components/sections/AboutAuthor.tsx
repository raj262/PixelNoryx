"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

export default function AboutAuthor() {
  const { author } = siteConfig;

  return (
    <section id="about" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="glass grid gap-10 overflow-hidden rounded-3xl p-8 sm:p-12 lg:grid-cols-[280px_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl ring-2 ring-primary/30"
          >
            <Image
              src={author.image}
              alt={author.name}
              fill
              className="object-cover"
              sizes="280px"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary">About the author</span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Hi, I&apos;m {author.name}
            </h2>
            <p className="mt-1 text-muted">{author.role}</p>
            <p className="mt-6 text-lg leading-relaxed text-muted">{author.bio}</p>
            <p className="mt-4 text-muted">
              I started PixelNoryx to share what I learn building ecommerce platforms
              and SaaS products — without the 3,000-word essays. If it doesn&apos;t
              help you ship, it doesn&apos;t go in the newsletter.
            </p>
            <div className="mt-8 max-w-md">
              <SubscribeForm variant="compact" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
