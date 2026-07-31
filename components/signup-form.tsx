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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.replace("/onboarding");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8"
    >
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="Kinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Regístrate para usar Kinora</p>
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
