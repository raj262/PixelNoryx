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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="magazine-container py-20 text-center text-muted">Loading…</div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const { user, loading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: passwordConfirmation,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message ?? "Registration failed.");
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
      title="Join PixelNoryx"
      subtitle="Create a free account to follow issues and save your preferences."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <AuthField
          id="name"
          label="Full name"
          value={name}
          onChange={setName}
          required
          autoComplete="name"
          disabled={submitting}
        />
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
          autoComplete="new-password"
          disabled={submitting}
        />
        <AuthPasswordField
          id="password_confirmation"
          label="Confirm password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          required
          autoComplete="new-password"
          disabled={submitting}
        />
        <p className="text-xs text-muted">
          Password must be at least 8 characters.
        </p>
        <AuthSubmit loading={submitting}>Create account</AuthSubmit>
      </form>
    </AuthCard>
  );
}
