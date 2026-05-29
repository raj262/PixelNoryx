import { getApiBaseUrl } from "@/lib/api-config";

const API_BASE = getApiBaseUrl();

export async function subscribeNewsletter(email: string, name?: string) {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, ...(name ? { name } : {}) }),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: res.ok, message: json.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: res.ok, message: json.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
