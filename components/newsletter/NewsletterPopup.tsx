"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ClientOnly from "@/components/ui/ClientOnly";
import SubscribeForm from "./SubscribeForm";

function NewsletterPopupInner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("px-newsletter-popup");
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("px-newsletter-popup", "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md border-4 border-primary bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 text-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Newsletter
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              Get stories in your inbox
            </h2>
            <p className="mt-2 text-sm text-muted">
              Join 12,400+ developers. Free weekly issues.
            </p>
            <div className="mt-6">
              <SubscribeForm variant="popup" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NewsletterPopup() {
  return (
    <ClientOnly>
      <NewsletterPopupInner />
    </ClientOnly>
  );
}
