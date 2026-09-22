"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  patientId: string;
};

export function StaffPatientNotesCard({ patientId }: Props) {
  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "staff_get_patient_profile",
        { p_patient_id: patientId }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      const value =
        row && typeof row === "object"
          ? ((row as { staff_notes?: string | null }).staff_notes ?? "")
          : "";
      setNotes(value);
      setDirty(false);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las notas.");
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedFlash(false);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_patient_notes",
        {
          p_patient_id: patientId,
          p_staff_notes: notes,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      setNotes(typeof data === "string" ? data : notes.trim() || "");
      setDirty(false);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron guardar las notas.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Notas del fisioterapeuta
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            Observaciones clínicas, evolución o recordatorios internos. No se
            muestran al paciente.
          </p>
        </div>
        {dirty || savedFlash ? (
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={() => void handleSave()}
            className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando…" : savedFlash && !dirty ? "Guardado" : "Guardar notas"}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {!loaded ? (
        <p className="mt-4 text-sm text-neutral-500">Cargando notas…</p>
      ) : (
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setDirty(true);
          }}
          rows={5}
          placeholder="Ej. Antecedentes, respuesta al tratamiento, preferencias…"
          className="mt-4 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      )}

      {loaded && dirty ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar notas"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

export function StaffReportNotesField({
  reportId,
  initialNotes,
}: {
  reportId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setNotes(initialNotes ?? "");
    setDirty(false);
  }, [reportId, initialNotes]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedFlash(false);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_report_notes",
        {
          p_report_id: reportId,
          p_staff_notes: notes,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      setNotes(typeof data === "string" ? data : notes.trim() || "");
      setDirty(false);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
      <label
        htmlFor={`report-notes-${reportId}`}
        className="block text-xs font-semibold uppercase tracking-wide text-amber-900/80"
      >
        Notas de esta consulta
      </label>
      <textarea
        id={`report-notes-${reportId}`}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setDirty(true);
        }}
        rows={3}
        placeholder="Apuntes del fisio sobre esta visita…"
        className="mt-2 w-full resize-y rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {savedFlash && !dirty ? (
        <p className="mt-2 text-xs text-emerald-700">Notas guardadas.</p>
      ) : null}
      {dirty ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="mt-2 rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-900 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar notas de la consulta"}
        </button>
      ) : null}
    </div>
  );
}
