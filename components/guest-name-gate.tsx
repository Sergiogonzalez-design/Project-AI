"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  guestNameStorageKey,
  isGuestDisplayNameSet,
  normalizeGuestPhoneInput,
} from "@/lib/guest-account";
import { signOutToLogin } from "@/lib/sign-out-client";

type Props = {
  onSaved: (name: string) => void;
};

export function GuestNameGate({ onSaved }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const displayName = name.trim().replace(/\s+/g, " ");
    if (!isGuestDisplayNameSet(displayName)) {
      setError("Escribe tu nombre para que tu fisioterapeuta sepa quién eres.");
      return;
    }
    const phoneDigits = normalizeGuestPhoneInput(phone);
    if (!phoneDigits) {
      setError(
        "Introduce tu teléfono con prefijo (ej. 34612345678). Es obligatorio para identificarte."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token || !session.user) {
        setError("Sesión caducada. Vuelve a abrir el enlace de tu fisioterapeuta.");
        return;
      }

      const res = await fetch("/api/auth/guest-identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ displayName, phone: phoneDigits }),
      });
      const payload = (await res.json()) as {
        error?: string;
        email?: string;
        password?: string;
        switched?: boolean;
      };
      if (!res.ok || !payload.email || !payload.password) {
        setError(payload.error ?? "No se pudo guardar tus datos. Inténtalo de nuevo.");
        return;
      }

      const { error: signError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) sessionStorage.setItem(guestNameStorageKey(user.id), "1");
      } catch {
        // Private mode — still continue into the consult.
      }
      onSaved(displayName);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-full min-h-[420px] items-center justify-center p-6">
      <button
        type="button"
        onClick={() => signOutToLogin()}
        className="absolute left-4 top-4 rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
        aria-label="Volver al inicio"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <form
        onSubmit={handleSubmit}
        translate="no"
        className="notranslate w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="mx-auto mb-4 object-contain" />
        <h2 className="text-center text-lg font-semibold text-slate-900">¿Cómo te llamas?</h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          Nombre y teléfono identifican tu ficha. Así tu fisio sabe quién eres
          aunque otra persona se llame igual.
        </p>
        <label htmlFor="guest-display-name" className="mt-5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Nombre
        </label>
        <input
          id="guest-display-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre y apellidos"
          autoComplete="name"
          autoFocus
          required
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <label htmlFor="guest-phone" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Teléfono
        </label>
        <input
          id="guest-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 34612345678"
          autoComplete="tel"
          required
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Obligatorio, con prefijo del país. El mismo número une web, app y
          WhatsApp en tu historial.
        </p>
        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={loading} className="mt-5 btn-primary w-full">
          {loading ? "Guardando…" : "Empezar consulta"}
        </button>
      </form>
    </div>
  );
}
