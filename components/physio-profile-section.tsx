"use client";

import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

export function PhysioProfileSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const [{ data }, { data: clinicRow }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, clinic_name")
          .eq("id", user.id)
          .maybeSingle(),
        supabase.rpc("clinic_get_own"),
      ]);
      setFullName(data?.display_name ?? "");
      let name = data?.clinic_name ?? "";
      if (clinicRow && typeof clinicRow === "object" && "name" in clinicRow) {
        const org = String((clinicRow as { name?: string }).name ?? "");
        if (org) name = org;
      }
      setClinicName(name);
      setLoading(false);
    }
    void load();
  }, [supabase]);

  async function handleSave() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { error: saveErr } = await supabase
        .from("profiles")
        .update({
          display_name: fullName.trim(),
          // Keep clinic_name as loaded from org; do not clear it.
          ...(clinicName.trim() ? { clinic_name: clinicName.trim() } : {}),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (saveErr) throw new Error(saveErr.message);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-10">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-800">Datos profesionales</h2>
      <p className="mt-1 text-sm text-slate-500">
        Tu nombre y clínica para el panel de pacientes e invitaciones.
      </p>

      <div className="mt-5 space-y-4">
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
          <label className={labelClass}>Clínica</label>
          <input
            type="text"
            value={clinicName}
            readOnly
            className={`${inputClass} bg-slate-50 text-slate-700`}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Asignada desde tu invitación. La ficha completa está en Clínica.
          </p>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {saved ? (
          <p className="text-sm font-medium text-emerald-700">Datos profesionales guardados.</p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar datos profesionales"}
        </button>
      </div>
    </div>
  );
}
