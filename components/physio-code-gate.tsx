"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LinkedPhysio = {
  physio_id: string;
  physio_name: string | null;
  clinic_name: string | null;
};

type Props = {
  onLinked: (physio: LinkedPhysio) => void;
  /** When set, renders without full-page centering (e.g. modal). */
  embedded?: boolean;
  onCancel?: () => void;
  /** Prefill from invite URL (?code=). */
  initialCode?: string | null;
  /** Auto-submit once when initialCode is valid. */
  autoSubmit?: boolean;
};

export function PhysioCodeGate({
  onLinked,
  embedded = false,
  onCancel,
  initialCode = null,
  autoSubmit = false,
}: Props) {
  const [code, setCode] = useState(() =>
    (initialCode ?? "").trim().toUpperCase().replace(/\s+/g, "")
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const autoSubmitted = useRef(false);

  async function linkWithCode(rawCode: string) {
    setError(null);
    const normalized = rawCode.trim().toUpperCase().replace(/\s+/g, "");
    if (normalized.length < 6) {
      setError("Introduce el código que te ha dado tu fisioterapeuta.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("patient_link_physio_code", {
      p_code: normalized,
    });
    setLoading(false);
    if (rpcError) {
      const raw = rpcError.message ?? "";
      setError(
        raw.includes("no encontrado")
          ? "Código no encontrado. Comprueba que lo has escrito bien."
          : raw.includes("fisioterapeutas no pueden")
            ? "Estás en una cuenta de fisioterapeuta. Inicia sesión con una cuenta de paciente para vincularte."
            : raw
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.physio_id) {
      setError("No se pudo vincular con ese código.");
      return;
    }
    onLinked({
      physio_id: row.physio_id,
      physio_name: row.physio_name ?? null,
      clinic_name: row.clinic_name ?? null,
    });
  }

  useEffect(() => {
    if (!autoSubmit || autoSubmitted.current) return;
    const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
    if (normalized.length < 6) return;
    autoSubmitted.current = true;
    void linkWithCode(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for invite deep link
  }, [autoSubmit, code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await linkWithCode(code);
  }

  return (
    <div
      className={
        embedded
          ? "p-1"
          : "flex h-full min-h-[420px] items-center justify-center p-6"
      }
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full rounded-2xl border border-slate-200 bg-white shadow-sm ${
          embedded ? "p-5" : "max-w-md p-6"
        }`}
      >
        {embedded && onCancel ? (
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Código de tu fisioterapeuta
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-slate-900">
            Código de tu fisioterapeuta
          </h2>
        )}
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Introduce el código que te ha compartido tu fisioterapeuta para
          empezar la consulta con la IA. Al terminar, el informe clínico se
          enviará automáticamente a su panel antes de tu cita.
        </p>
        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Código
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ej. K7M2P9QX"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm tracking-widest text-slate-900 uppercase placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          required
        />
        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 btn-primary w-full"
        >
          {loading ? "Vinculando…" : "Continuar a la consulta"}
        </button>
      </form>
    </div>
  );
}
