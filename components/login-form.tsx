"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authUiCopy } from "@/lib/auth-ui-copy";
import { parsePastedInviteCode } from "@/lib/physio-invite";
import { createClient } from "@/lib/supabase/client";
import { useUiLocale } from "@/lib/ui-locale";

type LoginFormProps = {
  nextPath?: string;
  initialCode?: string;
  infoMessage?: string;
};

export function LoginForm({
  nextPath,
  initialCode = "",
  infoMessage,
}: LoginFormProps) {
  const { locale } = useUiLocale();
  const copy = useMemo(() => authUiCopy(locale), [locale]);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  // Never keep credentials in the address bar (password managers / paste mistakes).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("email") && !url.searchParams.has("password")) return;
    url.searchParams.delete("email");
    url.searchParams.delete("password");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGuestError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signError) { setError(signError.message); return; }
      const safeNext =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/consulta";
      router.replace(safeNext);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function startGuestConsult(rawCode: string) {
    setError(null);
    setGuestError(null);
    const normalized = parsePastedInviteCode(rawCode);
    if (normalized.length < 6) {
      setGuestError(copy.guestCodeRequired);
      return;
    }
    setGuestLoading(true);
    try {
      const res = await fetch("/api/auth/guest-physio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });
      const payload = (await res.json()) as {
        error?: string;
        email?: string;
        password?: string;
      };
      if (!res.ok || !payload.email || !payload.password) {
        setGuestError(payload.error ?? copy.guestStartError);
        return;
      }
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signError) {
        setGuestError(signError.message);
        return;
      }
      router.replace("/fisioterapia");
      router.refresh();
    } catch {
      setGuestError(copy.guestStartError);
    } finally {
      setGuestLoading(false);
    }
  }

  async function handleGuestCode(e: React.FormEvent) {
    e.preventDefault();
    await startGuestConsult(inviteCode);
  }

  const busy = loading || guestLoading;

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{copy.loginTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {nextPath === "/admin" ? copy.adminSubtitle : copy.loginSubtitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">{copy.email}</label>
          <input
            type="email" name="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className="rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-5 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">{copy.password}</label>
          <input
            type="password" name="password" autoComplete="current-password" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            className="rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {infoMessage ? (
          <p className="mb-4 text-sm text-blue-700" role="status">
            {infoMessage}
          </p>
        ) : null}
        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

        <p className="mb-4 text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
            {copy.forgotPassword}
          </Link>
        </p>

        <button
          type="submit" disabled={busy}
          className="btn-primary w-full"
        >
          {loading ? copy.entering : copy.enter}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        {copy.noAccount}{" "}
        <Link
          href={nextPath ? `/signup?next=${encodeURIComponent(nextPath)}` : "/signup"}
          className="font-semibold text-blue-600 hover:underline"
        >
          {copy.createAccount}
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {copy.or}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleGuestCode}>
        <label htmlFor="guest-code" className="block text-sm font-semibold text-slate-800">
          {copy.guestCodeTitle}
        </label>
        <input
          id="guest-code"
          value={inviteCode}
          onChange={(e) => setInviteCode(parsePastedInviteCode(e.target.value))}
          placeholder={copy.guestCodePlaceholder}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          disabled={busy}
          className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm tracking-widest text-slate-900 uppercase placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {guestError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {guestError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100 disabled:opacity-60"
        >
          {guestLoading ? copy.guestOpening : copy.guestStart}
        </button>
      </form>
    </div>
  );
}
