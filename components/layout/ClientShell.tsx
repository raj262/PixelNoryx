"use client";

import AiChatWidget from "@/components/ai/AiChatWidget";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import WhatsAppChat from "@/components/social/WhatsAppChat";

export default function ClientShell() {
  return (
    <>
      <NewsletterPopup />
      <WhatsAppChat />
      <AiChatWidget />
    </>
  );
}
