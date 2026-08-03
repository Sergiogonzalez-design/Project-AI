"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PhysioPatient = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FisioPatientsPage() {
  const [patients, setPatients] = useState<PhysioPatient[]>([]);
  const [unreadByPatient, setUnreadByPatient] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    const { data: code, error: codeError } = await supabase.rpc(
      "physio_get_or_create_invite_code"
    );
    if (codeError) {
      setError(codeError.message);
    } else {
      setInviteCode((code as string) ?? null);
    }

    const { data, error: rpcError } = await supabase.rpc("physio_list_patients");
    if (rpcError) {
      setError(rpcError.message);
      setPatients([]);
      setLoading(false);
      return;
    }
    const list = (data as PhysioPatient[]) ?? [];
    setPatients(list);

    const { data: reports } = await supabase
      .from("clinical_reports")
      .select("patient_id, status");
    const counts: Record<string, number> = {};
    for (const r of (reports as { patient_id: string; status: string }[]) ?? []) {
      if (r.status === "new") {
        counts[r.patient_id] = (counts[r.patient_id] ?? 0) + 1;
      }
    }
    setUnreadByPatient(counts);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function regenerateCode() {
    setCodeBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc(
      "physio_regenerate_invite_code"
    );
    setCodeBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setInviteCode((data as string) ?? null);
    setCopied(false);
  }

  async function copyCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el código.");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Panel del fisioterapeuta
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Comparte tu código con el paciente. Él crea su propia cuenta, introduce
        el código y, al terminar la consulta con la IA, recibes el informe
        clínico aquí.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Tu código de vinculación
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          El paciente lo introduce una vez en Kinora para vincularse contigo.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-mono text-2xl font-bold tracking-[0.2em] text-blue-800">
            {inviteCode ?? (loading ? "…" : "—")}
          </p>
          <button
            type="button"
            onClick={() => void copyCode()}
            disabled={!inviteCode}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={() => void regenerateCode()}
            disabled={codeBusy}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {codeBusy ? "Generando…" : "Generar nuevo código"}
          </button>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Si regeneras el código, los pacientes ya vinculados siguen vinculados;
          solo cambia el código para nuevos pacientes.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <h2 className="text-base font-semibold text-neutral-900">
          Consulta clínica con Physio
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Mismo chat que tus pacientes, con lenguaje técnico (maniobras,
          diferenciales, imagen).
        </p>
        <Link
          href="/fisio/consulta"
          className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Abrir consulta
        </Link>
      </section>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-900">
            {patients.length} paciente{patients.length === 1 ? "" : "s"}
          </h2>
          <button
            type="button"
            onClick={() => void load()}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-neutral-500">Cargando…</p>
        ) : patients.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Todavía no hay pacientes vinculados. Comparte tu código para que se
            registren y lo introduzcan.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {patients.map((patient) => {
              const unread = unreadByPatient[patient.id] ?? 0;
              const label = patient.display_name || patient.email;
              return (
                <li key={patient.id}>
                  <Link
                    href={`/fisio/patients/${patient.id}?name=${encodeURIComponent(label)}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-neutral-50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {label}
                        </p>
                        {unread > 0 ? (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            {unread} nuevo{unread === 1 ? "" : "s"}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-neutral-500">
                        {patient.email} · Alta {formatDate(patient.created_at)}
                      </p>
                    </div>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
