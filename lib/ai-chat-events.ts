export const AI_CHAT_OPEN_EVENT = "pixelnoryx:open-ai-chat";

export function openAiChat(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AI_CHAT_OPEN_EVENT));
}
