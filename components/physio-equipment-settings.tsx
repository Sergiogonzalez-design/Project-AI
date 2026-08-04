"use client";

import { useCallback, useEffect, useState } from "react";
import { PHYSIO_EQUIPMENT_CATEGORIES } from "@/lib/physio-equipment-options";
import { createClient } from "@/lib/supabase/client";

/**
 * Lets an already-onboarded physio view/update clinic equipment so Physio AI
 * recommendations stay grounded in what they actually have.
 */
export function PhysioEquipmentSettings() {
  const supabase = createClient();
  const [equipment, setEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("clinic_equipment, clinic_equipment_notes")
      .eq("id", user.id)
      .maybeSingle();
    const ids = (data?.clinic_equipment as string[] | null) ?? [];
    setEquipment(ids);
    setNotes((data?.clinic_equipment_notes as string | null) ?? "");
    if (ids.length === 0) setExpanded(true);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  function toggle(id: string) {
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function save() {
    if (equipment.length === 0) {
      setError("Selecciona al menos una opción (o «Solo material básico»).");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión expirada.");
      setSaving(false);
      return;
    }
    const { error: saveErr } = await supabase
      .from("profiles")
      .update({
        clinic_equipment: equipment,
        clinic_equipment_notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (saveErr) {
      setError(saveErr.message);
      return;
    }
    setMessage("Material guardado. Physio ya puede usarlo en la consulta clínica.");
  }

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Material de tu consulta
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Physio adapta recomendaciones a lo que tienes. Si falta algo (p. ej.
            RX), te sugerirá derivar al paciente.
          </p>
          {!loading && equipment.length === 0 ? (
            <p className="mt-2 text-xs font-semibold text-amber-700">
              Aún no has indicado tu material — completa esto para mejores
              recomendaciones.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
        >
          {expanded ? "Ocultar" : "Editar"}
        </button>
      </div>

      {expanded ? (
        <div className="mt-5 space-y-5">
          {loading ? (
            <p className="text-sm text-neutral-500">Cargando…</p>
          ) : (
            <>
              {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400">
                    {cat.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.options.map((opt) => {
                      const selected = equipment.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggle(opt.id)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-blue-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                  Otro material o notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ej: RX disponible en el edificio de al lado…"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar material"}
              </button>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
