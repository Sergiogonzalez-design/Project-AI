"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

export function PhysioOnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      const { error: saveErr } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: fullName.trim(),
        clinic_name: clinicName.trim() || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (saveErr) throw new Error(saveErr.message);

      router.replace("/fisio");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-blue-100 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="Kinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bienvenido, fisioterapeuta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Solo necesitamos un par de datos para crear tu panel de pacientes
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre y apellidos"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Clínica o centro (opcional)</label>
          <input
            type="text"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            placeholder="Ej: Clínica Kinora"
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
