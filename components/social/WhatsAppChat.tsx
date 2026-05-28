"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useWhatsApp } from "@/components/providers/SiteDataProvider";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppChat() {
  const whatsapp = useWhatsApp();
  const [peek, setPeek] = useState(false);

  if (!whatsapp.enabled || !whatsapp.url) {
    return null;
  }

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3">
      {peek ? (
        <div className="w-[min(100vw-3rem,280px)] rounded-2xl border border-border/80 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-bold text-foreground">
                Chat on WhatsApp
              </p>
              <p className="mt-1 text-xs text-muted">
                {whatsapp.displayNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPeek(false)}
              className="rounded-full p-1 text-muted hover:bg-surface"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 line-clamp-3 rounded-lg bg-surface px-3 py-2 text-xs text-muted">
            &ldquo;{whatsapp.message}&rdquo;
          </p>
          <a
            href={whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Open WhatsApp
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setPeek((v) => !v)}
        onDoubleClick={() => {
          window.open(whatsapp.url!, "_blank", "noopener,noreferrer");
        }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-105 hover:bg-[#20bd5a]"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#25D366] shadow">
          1
        </span>
        <span className="pointer-events-none absolute end-full top-1/2 me-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          WhatsApp us
        </span>
      </button>
    </div>
  );
}
