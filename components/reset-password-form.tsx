"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authUiCopy } from "@/lib/auth-ui-copy";
import { signOutToLogin } from "@/lib/sign-out-client";
import { createClient } from "@/lib/supabase/client";
import { useUiLocale } from "@/lib/ui-locale";

function emailsMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function ResetPasswordForm() {
  const { locale } = useUiLocale();
  const copy = useMemo(() => authUiCopy(locale), [locale]);
  const [ready, setReady] = useState(false);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setAccountEmail(data.user?.email ?? null);
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountEmail) return;
    if (!emailsMatch(confirmEmail, accountEmail)) {
      setError(copy.confirmEmailMismatch);
      return;
    }
    if (password.length < 6) {
      setError(copy.passwordTooShort);
      return;
    }
    if (password !== confirm) {
      setError(copy.passwordMismatch);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setSaved(true);
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center text-sm text-slate-500">
        …
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{copy.resetTitle}</h1>
      </div>

      {!accountEmail ? (
        <>
          <p className="text-sm leading-relaxed text-slate-600">{copy.resetInvalid}</p>
          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              {copy.goLogin}
            </Link>
          </p>
        </>
      ) : saved ? (
        <>
          <p className="text-sm leading-relaxed text-slate-700">{copy.resetSuccess}</p>
          <button
            type="button"
            onClick={() => signOutToLogin()}
            className="btn-primary mt-6 w-full"
          >
            {copy.goLogin}
          </button>
        </>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)}>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">{copy.confirmEmailHint}</p>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            {copy.confirmEmail}
          </label>
          <input
            type="email"
            name="email-confirm"
            autoComplete="email"
            required
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            disabled={saving}
            className="mb-4 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            {copy.newPassword}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={saving}
            className="mb-4 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            {copy.confirmPassword}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={saving}
            className="mb-4 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {error ? (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? copy.savingPassword : copy.savePassword}
          </button>
        </form>
      )}
    </div>
  );
}
