"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { authUiCopy } from "@/lib/auth-ui-copy";
import { createClient } from "@/lib/supabase/client";
import { useUiLocale } from "@/lib/ui-locale";

export function ForgotPasswordForm() {
  const { locale } = useUiLocale();
  const copy = useMemo(() => authUiCopy(locale), [locale]);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      });
    } finally {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{copy.forgotTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{copy.forgotSubtitle}</p>
        </div>
      </div>

      {sent ? (
        <p className="text-sm leading-relaxed text-slate-700">{copy.forgotSent}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">{copy.email}</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
            {loading ? copy.forgotSending : copy.forgotSend}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          {copy.forgotBack}
        </Link>
      </p>
    </div>
  );
}
