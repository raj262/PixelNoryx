import type { AiStatusPayload } from "@/lib/cms-types";

import { getApiBaseUrl } from "@/lib/api-config";

const API_BASE = getApiBaseUrl();

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function fetchAiStatus(): Promise<AiStatusPayload> {
  try {
    const res = await fetch(`${API_BASE}/ai/status`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { enabled: false };
    const json = (await res.json()) as { data: AiStatusPayload };
    return json.data ?? { enabled: false };
  } catch {
    return { enabled: false };
  }
}

export async function sendAiChat(
  message: string,
  history: ChatMessage[] = []
): Promise<{ ok: true; reply: string } | { ok: false; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: { reply: string };
      message?: string;
    };

    if (!res.ok) {
      return { ok: false, message: json.message ?? "AI request failed." };
    }

    return { ok: true, reply: json.data?.reply ?? "" };
  } catch {
    return { ok: false, message: "Network error. Check the API server." };
  }
}
