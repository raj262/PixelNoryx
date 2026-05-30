"use client";

import AiChatWidget from "@/components/ai/AiChatWidget";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import PushNotificationPrompt from "@/components/notifications/PushNotificationPrompt";
import WhatsAppChat from "@/components/social/WhatsAppChat";

export default function ClientShell() {
  return (
    <>
      <NewsletterPopup />
      <PushNotificationPrompt />
      <WhatsAppChat />
      <AiChatWidget />
    </>
  );
}
