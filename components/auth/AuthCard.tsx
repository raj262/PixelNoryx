"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="magazine-container py-12 sm:py-16">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-border/80 bg-white shadow-card">
        <div className="border-b border-border bg-gradient-to-r from-foreground to-foreground/95 px-8 py-8 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Account</p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-white/70">{subtitle}</p>
        </div>
        <div className="p-8">{children}</div>
        <div className="border-t border-border bg-surface/50 px-8 py-5 text-center text-sm text-muted">
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
  disabled,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
      />
    </div>
  );
}

export function AuthPasswordField({
  label,
  id,
  value,
  onChange,
  required,
  autoComplete,
  disabled,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-border bg-surface/40 py-3 pe-12 ps-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function AuthSubmit({
  children,
  loading,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-full bg-foreground py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-primary disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
      {message}
    </p>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-primary hover:underline">
      {children}
    </Link>
  );
}
