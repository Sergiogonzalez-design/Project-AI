"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function ContactInquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  if (success) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-left backdrop-blur-sm">
        <p className="text-base font-semibold text-white">Mensaje enviado</p>
        <p className="mt-2 text-sm leading-relaxed text-blue-50">
          Gracias por escribirnos. Revisaremos tu consulta y te responderemos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm font-semibold text-white underline-offset-2 hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-left backdrop-blur-sm sm:px-6"
    >
      <div className="mb-4">
        <label htmlFor="contact-full-name" className="mb-1.5 block text-sm font-semibold text-white">
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
          className="w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="Tu nombre y apellidos"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-white">
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
          className="w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="tu@correo.com"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact-age" className="mb-1.5 block text-sm font-semibold text-white">
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
          className="w-full rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="Ej. 28"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="contact-inquiry" className="mb-1.5 block text-sm font-semibold text-white">
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
          className="w-full resize-y rounded-xl border border-white/25 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="Cuéntanos en qué podemos ayudarte…"
        />
      </div>

      {error ? (
        <p className="mb-4 text-sm font-medium text-red-100" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-blue-700 shadow transition hover:bg-blue-50 disabled:opacity-60"
      >
        {loading ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
