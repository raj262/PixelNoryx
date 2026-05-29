import type { AiStatusPayload } from "@/lib/cms-types";
import { clientApiFetch, serverApiFetch } from "@/lib/api-fetch";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function fetchAiStatus(): Promise<AiStatusPayload> {
  try {
    const res = await serverApiFetch("/ai/status", {
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
    const res = await clientApiFetch("/ai/chat", {
      method: "POST",
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
