"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  Minus,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { AI_CHAT_OPEN_EVENT } from "@/lib/ai-chat-events";
import { sendAiChat, type ChatMessage } from "@/lib/ai";
import { useAi, useWhatsApp } from "@/components/providers/SiteDataProvider";
import { cn } from "@/lib/utils";

const TEASER_STORAGE_KEY = "pixelnoryx-ai-teaser-dismissed";

const WELCOME =
  "Hello! I'm your PixelNoryx assistant — like Amazon's shopping helper, but for design, dev, and creative articles. How can I help you today?";

const STARTER_PROMPTS = [
  "What topics do you cover?",
  "Recommend a React article",
  "How do I subscribe?",
  "What's featured this week?",
];

const QUICK_ACTIONS = [
  { label: "Browse archive", prompt: "Show me popular articles in the archive", icon: BookOpen },
  { label: "Subscribe", prompt: "How do I subscribe to the newsletter?", icon: Mail },
  { label: "Trending topics", prompt: "What topics are trending on PixelNoryx?", icon: TrendingUp },
  { label: "Get in touch", prompt: "How can I contact the team?", icon: Sparkles },
] as const;

type ViewState = "closed" | "open" | "minimized";

function formatMessage(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) {
      const href = md[2];
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={i}
            href={href}
            className="font-semibold text-[#007185] underline underline-offset-2 hover:text-[#c7511f]"
          >
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
          className="font-semibold text-[#007185] underline underline-offset-2 hover:text-[#c7511f]"
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
          className="break-all text-[#007185] underline underline-offset-2"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 ps-11">
      <div className="flex gap-1 rounded-2xl border border-[#d5d9d9] bg-[#f0f2f2] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[#565959] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatHeader({
  chatLabel,
  modelLabel,
  apiReady,
  onMinimize,
  onClose,
  onClear,
  compact,
}: {
  chatLabel: string;
  modelLabel: string;
  apiReady: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onClear: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 bg-[#131921] px-4 py-3 text-white sm:rounded-t-xl">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#232f3e] ring-2 ring-[#ff9900]/80">
          <Bot className="h-5 w-5 text-[#ff9900]" />
          <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-[#131921] bg-emerald-400" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm">{chatLabel}</p>
          <p className="text-[11px] text-white/60">
            {apiReady ? `Virtual assistant · ${modelLabel}` : "Offline — API not configured"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        {!compact ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            New chat
          </button>
        ) : null}
        <button
          type="button"
          onClick={onMinimize}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
          aria-label={compact ? "Expand chat" : "Minimize chat"}
          title={compact ? "Expand" : "Minimize"}
        >
          {compact ? <ChevronUp className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function AiChatWidget() {
  const ai = useAi();
  const whatsapp = useWhatsApp();
  const chatLabel = ai.label ?? "PixelNoryx AI";
  const modelLabel = ai.model ?? "AI";

  const fabOffset = whatsapp.enabled ? "bottom-24" : "bottom-5";
  const panelOffset = whatsapp.enabled ? "sm:bottom-24" : "sm:bottom-5";

  const [view, setView] = useState<ViewState>("closed");
  const [showTeaser, setShowTeaser] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = view === "open";
  const minimized = view === "minimized";
  const isFreshChat = messages.length <= 1;

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
  }, [open, messages, loading, scrollToBottom]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onOpen = () => setView("open");
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!ai.enabled || view !== "closed") return;
    try {
      if (localStorage.getItem(TEASER_STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    const showTimer = setTimeout(() => setShowTeaser(true), 2500);
    return () => clearTimeout(showTimer);
  }, [ai.enabled, view]);

  const dismissTeaser = () => {
    setShowTeaser(false);
    try {
      localStorage.setItem(TEASER_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: WELCOME }]);
    setError(null);
    setInput("");
  };

  if (!ai.enabled) {
    return null;
  }

  const apiReady = Boolean(ai.ready ?? (ai.enabled && ai.configured));

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (!apiReady) {
      setError(
        "The assistant is not available yet. Add GEMINI_API_KEY in the server .env file."
      );
      return;
    }

    setError(null);
    setInput("");
    dismissTeaser();

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

  const openChat = () => {
    dismissTeaser();
    setView("open");
  };

  return (
    <>
      {/* Proactive teaser (Amazon-style popup above launcher) */}
      {showTeaser && view === "closed" ? (
        <div
          className={cn(
            "fixed end-5 z-[52] w-[min(100vw-2.5rem,300px)] animate-in fade-in slide-in-from-bottom-3 duration-300",
            fabOffset
          )}
          style={{ marginBottom: "4.25rem" }}
        >
          <div className="relative rounded-xl border border-[#d5d9d9] bg-white p-4 shadow-xl">
            <button
              type="button"
              onClick={dismissTeaser}
              className="absolute end-2 top-2 rounded p-1 text-[#565959] hover:bg-[#f0f2f2]"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pe-6 text-sm font-semibold text-[#0f1111]">Need help browsing?</p>
            <p className="mt-1 text-xs leading-relaxed text-[#565959]">
              Ask about articles, topics, or subscribing — available 24/7.
            </p>
            <button
              type="button"
              onClick={openChat}
              className="mt-3 w-full rounded-lg bg-[#ffd814] py-2 text-sm font-bold text-[#0f1111] shadow-sm transition hover:bg-[#f7ca00]"
            >
              Start chat
            </button>
            <span
              className="absolute -bottom-2 end-8 h-4 w-4 rotate-45 border-b border-r border-[#d5d9d9] bg-white"
              aria-hidden
            />
          </div>
        </div>
      ) : null}

      {/* Closed: Amazon-style pill launcher */}
      {view === "closed" ? (
        <div className={cn("fixed end-5 z-50 sm:end-6", fabOffset)}>
          <button
            type="button"
            onClick={openChat}
            className="group flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full border border-[#d5d9d9] bg-[#131921] py-2 ps-2 pe-4 text-white shadow-lg transition hover:bg-[#232f3e] hover:shadow-xl sm:gap-3 sm:pe-5"
            aria-label={`Chat with ${chatLabel}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#232f3e] ring-2 ring-[#ff9900]/70">
              <Bot className="h-5 w-5 text-[#ff9900]" />
            </span>
            <span className="min-w-0 text-start">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-white/50">
                Need help?
              </span>
              <span className="block truncate text-sm font-bold">Chat with us</span>
            </span>
            <ChevronUp className="hidden h-5 w-5 shrink-0 text-white/70 sm:block group-hover:text-white" />
          </button>
        </div>
      ) : null}

      {/* Minimized bar */}
      {minimized ? (
        <div
          className={cn(
            "fixed end-5 z-[60] w-[min(100vw-2.5rem,380px)] overflow-hidden rounded-xl border border-[#d5d9d9] shadow-2xl sm:end-6",
            panelOffset
          )}
        >
          <button
            type="button"
            className="w-full text-start"
            onClick={() => setView("open")}
          >
            <ChatHeader
              chatLabel={chatLabel}
              modelLabel={modelLabel}
              apiReady={apiReady}
              compact
              onMinimize={() => setView("open")}
              onClose={() => setView("closed")}
              onClear={resetChat}
            />
          </button>
        </div>
      ) : null}

      {/* Full chat panel */}
      <div
        className={cn(
          "fixed z-[60] flex flex-col bg-[#f7fafa] transition-all duration-300 ease-out",
          "inset-0 sm:inset-auto sm:end-6 sm:w-[min(100vw-2rem,400px)] sm:rounded-xl sm:border sm:border-[#d5d9d9] sm:shadow-2xl",
          panelOffset,
          "sm:max-h-[min(640px,calc(100dvh-2.5rem))]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0 sm:translate-y-4"
        )}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={chatLabel}
      >
        <ChatHeader
          chatLabel={chatLabel}
          modelLabel={modelLabel}
          apiReady={apiReady}
          onMinimize={() => setView("minimized")}
          onClose={() => setView("closed")}
          onClear={resetChat}
        />

        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[#f7fafa] p-4"
        >
          <p className="text-center text-[10px] text-[#565959]">
            Today · Assistant is online
          </p>

          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}
            >
              {msg.role === "assistant" ? (
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#232f3e] text-[#ff9900]">
                  <Bot className="h-4 w-4" />
                </span>
              ) : (
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#007185] text-xs font-bold text-white">
                  You
                </span>
              )}
              <div
                className={cn(
                  "max-w-[82%] text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-2xl rounded-ee-md bg-[#007185] px-4 py-2.5 text-white"
                    : "rounded-2xl rounded-es-md border border-[#d5d9d9] bg-white px-4 py-2.5 text-[#0f1111] shadow-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{formatMessage(msg.content)}</p>
              </div>
            </div>
          ))}

          {loading ? <TypingIndicator /> : null}

          {error ? (
            <p className="mx-2 rounded-lg border border-[#f5c6cb] bg-[#fff5f5] px-3 py-2 text-xs text-[#c40000]">
              {error}
            </p>
          ) : null}

          {isFreshChat && !loading ? (
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold text-[#565959]">Quick topics</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(({ label, prompt, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(prompt)}
                    className="flex flex-col items-start gap-2 rounded-lg border border-[#d5d9d9] bg-white p-3 text-start text-xs font-semibold text-[#0f1111] shadow-sm transition hover:border-[#007185] hover:shadow-md"
                  >
                    <Icon className="h-4 w-4 text-[#007185]" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {isFreshChat && !loading ? (
          <div className="border-t border-[#d5d9d9] bg-white px-3 py-2">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-[#565959]">
              Suggested questions
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="shrink-0 rounded-full border border-[#d5d9d9] bg-[#f0f2f2] px-3 py-1.5 text-xs font-medium text-[#0f1111] hover:border-[#007185] hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form
          className="safe-area-pb shrink-0 border-t border-[#d5d9d9] bg-white p-3 sm:rounded-b-xl"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-[#888c8c] bg-white px-2 py-1 focus-within:border-[#007185] focus-within:ring-1 focus-within:ring-[#007185]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={loading}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#0f1111] placeholder:text-[#888c8c] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffd814] text-[#0f1111] transition hover:bg-[#f7ca00] disabled:opacity-40"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[#888c8c]">
            AI can make mistakes. Verify important details.
          </p>
        </form>
      </div>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-black/30 sm:hidden"
          aria-label="Close chat overlay"
          onClick={() => setView("closed")}
        />
      ) : null}
    </>
  );
}
