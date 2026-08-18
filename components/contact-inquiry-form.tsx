"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

type ContactInquiryFormProps = {
  /** `glass` sits on a dark hero. `card` is a white form for light layouts. */
  variant?: "glass" | "card";
};

export function ContactInquiryForm({ variant = "glass" }: ContactInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const card = variant === "card";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const name = fullName.trim();
    const emailNorm = email.trim().toLowerCase();
    const ageNum = Number.parseInt(age, 10);
    const message = inquiry.trim();

    if (name.length < 2) {
      setError("Indica tu nombre completo.");
      return;
    }
    if (!emailNorm.includes("@") || emailNorm.length < 5) {
      setError("Indica un correo electrónico válido.");
      return;
    }
    if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Indica una edad válida.");
      return;
    }
    if (message.length < 5) {
      setError("Cuéntanos un poco más en tu consulta.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: insertError } = await supabase.from("contact_inquiries").insert({
        full_name: name,
        email: emailNorm,
        age: ageNum,
        inquiry: message,
        user_id: user?.id ?? null,
      });

      if (insertError) {
        setError(insertError.message || "No se pudo enviar el mensaje. Inténtalo de nuevo.");
        return;
      }

      setSuccess(true);
      setFullName("");
      setEmail("");
      setAge("");
      setInquiry("");
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const wrap = card
    ? "rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-[var(--shadow-elevated)] sm:p-8"
    : "rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-left backdrop-blur-sm sm:px-6";
  const title = card ? "text-slate-900" : "text-white";
  const body = card ? "text-slate-500" : "text-blue-50";
  const label = card ? "text-slate-700" : "text-white";
  const input = card
    ? "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
    : "w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40";
  const errorClass = card ? "text-red-600" : "text-red-100";
  const submit = card
    ? "w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-primary)] transition hover:bg-blue-700 disabled:opacity-60"
    : "w-full rounded-xl bg-white py-3.5 text-sm font-bold text-blue-700 shadow transition hover:bg-blue-50 disabled:opacity-60";
  const again = card
    ? "mt-4 text-sm font-semibold text-blue-600 underline-offset-2 hover:underline"
    : "mt-4 text-sm font-semibold text-white underline-offset-2 hover:underline";

  if (success) {
    return (
      <div className={wrap}>
        <p className={`text-base font-semibold ${title}`}>Mensaje enviado</p>
        <p className={`mt-2 text-sm leading-relaxed ${body}`}>
          Gracias por escribirnos. Revisaremos tu consulta y te responderemos lo antes posible.
        </p>
        <button type="button" onClick={() => setSuccess(false)} className={again}>
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={wrap}>
      <div className="mb-4">
        <label htmlFor="contact-full-name" className={`mb-1.5 block text-sm font-semibold ${label}`}>
          Nombre completo
        </label>
        <input
          id="contact-full-name"
          type="text"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={input}
          placeholder="Tu nombre y apellidos"
        />
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div>
          <label htmlFor="contact-email" className={`mb-1.5 block text-sm font-semibold ${label}`}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label htmlFor="contact-age" className={`mb-1.5 block text-sm font-semibold ${label}`}>
            Edad
          </label>
          <input
            id="contact-age"
            type="number"
            name="age"
            inputMode="numeric"
            min={1}
            max={120}
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={input}
            placeholder="28"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="contact-inquiry" className={`mb-1.5 block text-sm font-semibold ${label}`}>
          Consulta
        </label>
        <textarea
          id="contact-inquiry"
          name="inquiry"
          required
          rows={4}
          maxLength={4000}
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          className={`${input} resize-y`}
          placeholder="Cuéntanos en qué podemos ayudarte…"
        />
      </div>

      {error ? (
        <p className={`mb-4 text-sm font-medium ${errorClass}`} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className={submit}>
        {loading ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
