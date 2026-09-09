"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

export function PhysioOnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const client = createClient();
    void client.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) {
        setLoadingProfile(false);
        return;
      }
      const { data: profile } = await client
        .from("profiles")
        .select("display_name, clinic_id, clinic_name")
        .eq("id", id)
        .maybeSingle();
      if (profile?.display_name) setFullName(profile.display_name);
      if (profile?.clinic_name) {
        setClinicName(profile.clinic_name);
      } else if (profile?.clinic_id) {
        const { data: clinic } = await client
          .from("clinics")
          .select("name")
          .eq("id", profile.clinic_id)
          .maybeSingle();
        if (clinic?.name) setClinicName(clinic.name);
      }
      setLoadingProfile(false);
    });
  }, []);

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
        clinic_name: clinicName?.trim() || null,
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
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bienvenido, fisioterapeuta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Indica tu nombre completo. La clínica ya viene de tu invitación.
          </p>
        </div>
      </div>

      {loadingProfile ? (
        <p className="text-center text-sm text-slate-500">Cargando…</p>
      ) : (
        <div className="space-y-5">
          {clinicName ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Clínica
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">{clinicName}</p>
              <p className="mt-1 text-xs text-slate-500">
                Asignada automáticamente desde la invitación. No hace falta
                escribirla.
              </p>
            </div>
          ) : (
            <p className="text-sm text-amber-800">
              No encontramos la clínica de la invitación. Contacta con el titular
              del centro.
            </p>
          )}

          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre y apellidos"
              className={inputClass}
              autoComplete="name"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Ir al panel de pacientes"}
          </button>
        </div>
      )}
    </div>
  );
}
