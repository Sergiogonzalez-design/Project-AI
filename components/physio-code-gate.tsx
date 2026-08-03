"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LinkedPhysio = {
  physio_id: string;
  physio_name: string | null;
  clinic_name: string | null;
};

type Props = {
  onLinked: (physio: LinkedPhysio) => void;
};

export function PhysioCodeGate({ onLinked }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = code.trim().toUpperCase();
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
      setError(
        rpcError.message.includes("no encontrado")
          ? "Código no encontrado. Comprueba que lo has escrito bien."
          : rpcError.message
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

  return (
    <div className="flex h-full min-h-[420px] items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Código de tu fisioterapeuta
        </h2>
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
          className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Vinculando…" : "Continuar a la consulta"}
        </button>
      </form>
    </div>
  );
}
