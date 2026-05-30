import { clientApiFetch } from "@/lib/api-fetch";

const SW_PATH = "/sw.js";
const DISMISS_KEY = "px-push-dismissed";
const SUBSCRIBED_KEY = "px-push-subscribed";

export interface PushConfig {
  enabled: boolean;
  publicKey: string | null;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPushPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

export function isPushDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissPushPrompt(): void {
  localStorage.setItem(DISMISS_KEY, "1");
}

export function isPushSubscribedLocally(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SUBSCRIBED_KEY) === "1";
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export async function fetchPushConfig(): Promise<PushConfig> {
  const envKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  if (envKey) {
    return { enabled: true, publicKey: envKey };
  }

  try {
    const res = await clientApiFetch("/push/config");
    if (!res.ok) {
      return { enabled: false, publicKey: null };
    }
    const json = (await res.json()) as { data?: PushConfig };
    return json.data ?? { enabled: false, publicKey: null };
  } catch {
    return { enabled: false, publicKey: null };
  }
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register(SW_PATH, {
    scope: "/",
  });
  await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribeToPush(): Promise<{ ok: boolean; message?: string }> {
  if (!isPushSupported()) {
    return { ok: false, message: "Push is not supported in this browser." };
  }

  const config = await fetchPushConfig();
  if (!config.enabled || !config.publicKey) {
    return { ok: false, message: "Push is not configured yet." };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, message: "Notification permission denied." };
  }

  const registration = await registerServiceWorker();
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey) as BufferSource,
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return { ok: false, message: "Could not create push subscription." };
  }

  const res = await clientApiFetch("/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: {
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
      contentEncoding: "aes128gcm",
    }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: false, message: body.message ?? "Failed to save subscription." };
  }

  localStorage.setItem(SUBSCRIBED_KEY, "1");
  localStorage.removeItem(DISMISS_KEY);

  return { ok: true };
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
  const subscription = await registration?.pushManager.getSubscription();

  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    await clientApiFetch("/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint }),
    });
  }

  localStorage.removeItem(SUBSCRIBED_KEY);
}
