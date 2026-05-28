"use client";

import { useState, FormEvent } from "react";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-16">
      <div className="magazine-container max-w-2xl">
        <p className="section-subtitle">Contact</p>
        <h2 className="section-title">Get in Touch</h2>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            required
            placeholder="Name"
            className="w-full border border-border px-4 py-3 focus:border-primary focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full border border-border px-4 py-3 focus:border-primary focus:outline-none"
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            className="w-full resize-none border border-border px-4 py-3 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary px-8 py-3 font-bold uppercase text-white hover:bg-primary-hover"
          >
            {sent ? "Sent!" : "Send"}
          </button>
        </form>
        <div className="mt-12 border-t border-border pt-12">
          <h3 className="font-display text-xl font-bold">Subscribe</h3>
          <div className="mt-4">
            <SubscribeForm variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
}
