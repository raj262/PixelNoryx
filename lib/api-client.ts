import { clientApiFetch } from "@/lib/api-fetch";

export async function subscribeNewsletter(email: string, name?: string) {
  try {
    const res = await clientApiFetch("/subscribe", {
      method: "POST",
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
    const res = await clientApiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: res.ok, message: json.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
