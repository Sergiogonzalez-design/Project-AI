"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error: signError } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (signError) { setError(signError.message); return; }
      if (data.session) { router.replace("/onboarding"); router.refresh(); return; }
      setInfo("Revisa tu correo para confirmar la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-blue-100 bg-white px-6 py-8 shadow-sm sm:px-8"
    >
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="PhysioGuide AI" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Regístrate para usar PhysioGuide AI</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Correo electrónico</label>
        <input
          type="email" name="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="tu@correo.com"
        />
      </div>

      <div className="mb-5 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          type="password" name="password" autoComplete="new-password" required minLength={6}
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
      {info && (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700" role="status">
          {info}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
