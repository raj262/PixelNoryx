"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { AI_CHAT_OPEN_EVENT } from "@/lib/ai-chat-events";
import { sendAiChat, type ChatMessage } from "@/lib/ai";
import { useAi, useWhatsApp } from "@/components/providers/SiteDataProvider";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  "What topics do you cover?",
  "Recommend a React article",
  "How do I subscribe?",
  "Latest featured posts?",
];

const WELCOME =
  "Hi! I'm your PixelNoryx assistant. Ask about articles, topics, the newsletter, or how to get in touch.";

function formatMessage(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) {
      const href = md[2];
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link key={i} href={href} className="font-semibold underline underline-offset-2">
            {md[1]}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          {md[1]}
        </a>
      );
    }
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-2"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AiChatWidget() {
  const ai = useAi();
  const whatsapp = useWhatsApp();
  const fabBottom = whatsapp.enabled ? "bottom-24" : "bottom-6";
  const chatLabel = ai.label ?? "PixelNoryx AI";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, scrollToBottom]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
  }, []);

  const resetChat = () => {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setError(null);
    setInput("");
  };

  if (!ai.enabled) {
    return null;
  }

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");

    const historyForApi = messages
      .filter((m, idx) => !(idx === 0 && m.role === "assistant"))
      .slice(-10);

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const result = await sendAiChat(trimmed, historyForApi);

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
  };

  return (
    <>
      {/* Floating launcher */}
      <div className={cn("fixed end-4 z-50 flex flex-col items-end gap-2 sm:end-6", fabBottom)}>
        {!open ? (
          <span className="hidden rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-white shadow-md sm:block">
            {chatLabel}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-rose-500 to-indigo-600 text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105",
            open && "scale-0 opacity-0 pointer-events-none"
          )}
          aria-label={`Open ${chatLabel}`}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -end-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
        </button>
      </div>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-white transition-all duration-300 sm:inset-auto sm:end-6 sm:w-[min(100vw-2rem,420px)] sm:rounded-2xl sm:border sm:border-border/80 sm:shadow-2xl",
          whatsapp.enabled ? "sm:bottom-24" : "sm:bottom-6",
          "sm:max-h-[min(680px,calc(100dvh-3rem))]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0 sm:translate-y-8"
        )}
        role="dialog"
        aria-modal={open}
        aria-label={chatLabel}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-rose-50 via-white to-violet-50 px-4 py-3 sm:rounded-t-2xl">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary">
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-foreground">{chatLabel}</p>
              <p className="flex items-center gap-1 text-[10px] text-muted">
                <Sparkles className="h-3 w-3 text-primary" />
                {ai.model ?? "AI"} · Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              className="rounded-full p-2 text-muted hover:bg-surface hover:text-foreground"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-muted hover:bg-surface hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-white to-surface/40 p-4"
        >
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {msg.role === "assistant" ? (
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-ee-sm"
                    : "border border-border/60 bg-white text-foreground shadow-sm rounded-es-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{formatMessage(msg.content)}</p>
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2 ps-9 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Thinking…
            </div>
          ) : null}
          {error ? (
            <p className="mx-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
              {error}
            </p>
          ) : null}
        </div>

        {messages.length <= 1 ? (
          <div className="flex gap-2 overflow-x-auto border-t border-border/60 px-4 py-2.5 scrollbar-none">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                disabled={loading}
                className="shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="safe-area-pb flex gap-2 border-t border-border bg-white p-4 sm:rounded-b-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about articles, topics, subscribe…"
            disabled={loading}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-rose-500 text-white shadow-md disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-black/20 sm:hidden"
          aria-label="Close chat overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
