import { clientApiFetch } from "@/lib/api-fetch";

export const AUTH_TOKEN_KEY = "pixelnoryx_auth_token";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

type AuthSuccess = { ok: true; token: string; user: AuthUser };
type AuthFailure = { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function parseApiError(
  json: { message?: string; errors?: Record<string, string[]> },
  fallback: string
): AuthFailure {
  if (json.errors) {
    const fieldErrors = json.errors;
    const firstKey = Object.keys(fieldErrors)[0];
    const firstMsg = firstKey ? fieldErrors[firstKey]?.[0] : undefined;

    return {
      ok: false,
      message: firstMsg ?? json.message ?? fallback,
      fieldErrors,
    };
  }

  return { ok: false, message: json.message ?? fallback };
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthSuccess | AuthFailure> {
  try {
    const res = await clientApiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      token?: string;
      user?: AuthUser;
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (!res.ok) {
      return parseApiError(json, "Login failed.");
    }

    if (!json.token || !json.user) {
      return { ok: false, message: "Invalid server response." };
    }

    return { ok: true, token: json.token, user: json.user };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthSuccess | AuthFailure> {
  try {
    const res = await clientApiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as {
      token?: string;
      user?: AuthUser;
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (!res.ok) {
      return parseApiError(json, "Registration failed.");
    }

    if (!json.token || !json.user) {
      return { ok: false, message: "Invalid server response." };
    }

    return { ok: true, token: json.token, user: json.user };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function fetchCurrentUser(
  token: string
): Promise<{ ok: true; user: AuthUser } | { ok: false }> {
  try {
    const res = await clientApiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { ok: false };
    }

    const json = (await res.json()) as { user?: AuthUser };
    if (!json.user) {
      return { ok: false };
    }

    return { ok: true, user: json.user };
  } catch {
    return { ok: false };
  }
}

export async function logoutUser(token: string): Promise<void> {
  try {
    await clientApiFetch("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* ignore */
  }
}
