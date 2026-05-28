"use client";

import { useState, FormEvent } from "react";
import { Send, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

const WHATSAPP = "1234567890";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="Contact"
          title="Get in Touch"
          description="Sponsorships, guest posts, or just say hi."
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <GlassCard className="p-8">
            <h3 className="mb-6 font-semibold text-foreground">Send a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Message"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={sent}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-white disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {sent ? "Sent!" : "Send Message"}
              </button>
            </form>
          </GlassCard>

          <div>
            <h3 className="mb-4 font-semibold">Subscribe instead?</h3>
            <SubscribeForm variant="compact" />
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <p className="mt-6 text-sm text-muted">hello@pixelnoryx.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
