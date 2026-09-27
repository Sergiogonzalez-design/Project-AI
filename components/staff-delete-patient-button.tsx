"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  patientId: string;
  patientLabel?: string | null;
  /** Where to go after successful delete. */
  redirectTo: string;
};

export function StaffDeletePatientButton({
  patientId,
  patientLabel,
  redirectTo,
}: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("staff_delete_patient", {
      p_patient_id: patientId,
    });
    setBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  }

  if (!confirming) {
    return (
      <div className="mt-10 border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm font-semibold text-red-600 hover:text-red-800 hover:underline"
        >
          Eliminar perfil del paciente
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
      <p className="text-sm font-semibold text-red-900">
        ¿Eliminar {patientLabel?.trim() || "este paciente"}?
      </p>
      <p className="mt-1 text-sm leading-relaxed text-red-800/90">
        Se quitará de tu lista de pacientes. Si era una consulta previa sin
        cuenta, se borrará por completo. Esta acción no se puede deshacer.
      </p>
      {error ? (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleDelete()}
          className="min-h-11 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? "Eliminando…" : "Sí, eliminar"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          className="min-h-11 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
