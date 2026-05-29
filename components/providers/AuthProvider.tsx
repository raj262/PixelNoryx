"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentUser,
  getStoredToken,
  loginUser,
  logoutUser,
  registerUser,
  setStoredToken,
  type AuthUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((token: string, authUser: AuthUser) => {
    setStoredToken(token);
    setUser(authUser);
  }, []);

  const clearSession = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser(token).then((result) => {
      if (result.ok) {
        setUser(result.user);
      } else {
        clearSession();
      }
      setLoading(false);
    });
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      applySession(result.token, result.user);
      return { ok: true };
    },
    [applySession]
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const result = await registerUser(data);
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      applySession(result.token, result.user);
      return { ok: true };
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    const token = getStoredToken();
    if (token) {
      await logoutUser(token);
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
