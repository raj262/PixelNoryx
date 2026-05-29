"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, {
  AuthError,
  AuthField,
  AuthLink,
  AuthPasswordField,
  AuthSubmit,
} from "@/components/auth/AuthCard";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="magazine-container py-20 text-center text-muted">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextUrl.startsWith("/") ? nextUrl : "/account");
    }
  }, [loading, user, router, nextUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message ?? "Login failed.");
      return;
    }

    router.push(nextUrl.startsWith("/") ? nextUrl : "/account");
  };

  if (loading || user) {
    return (
      <div className="magazine-container py-20 text-center text-muted">
        Loading…
      </div>
    );
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your PixelNoryx reader account."
      footer={
        <>
          New here? <AuthLink href="/register">Create an account</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          disabled={submitting}
        />
        <AuthPasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="current-password"
          disabled={submitting}
        />
        <AuthSubmit loading={submitting}>Sign in</AuthSubmit>
      </form>
    </AuthCard>
  );
}
