"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PHYSIO_EQUIPMENT_CATEGORIES,
} from "@/lib/physio-equipment-options";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

export function PhysioOnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [equipmentNotes, setEquipmentNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleEquipment(id: string) {
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function goNext() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit() {
    if (equipment.length === 0) {
      setError(
        "Selecciona al menos el material que tienes (o «Solo material básico»)."
      );
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
        clinic_equipment: equipment,
        clinic_equipment_notes: equipmentNotes.trim() || null,
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
            {step === 1
              ? "Paso 1 de 2 — Tus datos para el panel de pacientes"
              : "Paso 2 de 2 — Material de tu consulta (para recomendaciones más precisas)"}
          </p>
        </div>
      </div>

      {step === 1 ? (
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
              placeholder="Ej: Clínica AIKinora"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={goNext}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700"
          >
            Continuar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Marca todo el material que tienes disponible. Physio lo usará para
            adaptar recomendaciones; si algo no tienes (p. ej. RX), podrá
            sugerirlo igual y decirte que derives al paciente a un centro donde
            sí lo haya.
          </p>

          <div className="max-h-[min(50vh,420px)] space-y-5 overflow-y-auto pr-1">
            {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {cat.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.options.map((opt) => {
                    const selected = equipment.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleEquipment(opt.id)}
                        className={`rounded-full border px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass}>Otro material o notas (opcional)</label>
            <textarea
              value={equipmentNotes}
              onChange={(e) => setEquipmentNotes(e.target.value)}
              rows={3}
              placeholder="Ej: tengo acceso a RX en el edificio de al lado, no en la sala…"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Guardando…" : "Ir al panel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
