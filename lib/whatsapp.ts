import type { WhatsAppPayload } from "@/lib/cms-types";

/** Strip to digits for wa.me (country code required, no leading +). */
export function normalizeWhatsAppNumber(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  return digits;
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const digits = normalizeWhatsAppNumber(number);
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function isWhatsAppActive(
  whatsapp?: WhatsAppPayload | null
): whatsapp is WhatsAppPayload & { url: string } {
  return Boolean(whatsapp?.enabled && whatsapp?.url);
}
