"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PhysioEquipmentSettings } from "@/components/physio-equipment-settings";
import { buildPhysioInviteUrl } from "@/lib/physio-invite";
import { createClient } from "@/lib/supabase/client";

type PhysioPatient = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
};

export default function FisioPatientsPage() {
  const [patients, setPatients] = useState<PhysioPatient[]>([]);
  const [unreadByPatient, setUnreadByPatient] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const codeMenuRef = useRef<HTMLDivElement>(null);

  const inviteLink = inviteCode ? buildPhysioInviteUrl(inviteCode) : null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

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
    } catch (e) {
      const message =
        e instanceof Error && e.message
          ? e.message
          : "No se pudo conectar con el servidor. Recarga la página.";
      setError(
        message === "Failed to fetch"
          ? "No se pudo conectar con Supabase. Comprueba tu conexión y recarga."
          : message
      );
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!codeMenuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!codeMenuRef.current?.contains(e.target as Node)) {
        setCodeMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCodeMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [codeMenuOpen]);

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
    setCopied(null);
  }

  async function copyText(kind: "code" | "link", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError(
        kind === "link"
          ? "No se pudo copiar el enlace."
          : "No se pudo copiar el código."
      );
    }
  }

  async function shareLink() {
    if (!inviteLink || !inviteCode) return;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "AIKinora — vinculación con tu fisioterapeuta",
          text: `Usa este enlace para vincularte en AIKinora (código ${inviteCode}):`,
          url: inviteLink,
        });
        return;
      } catch {
        // Fall through to clipboard if share is cancelled/unavailable.
      }
    }
    await copyText("link", inviteLink);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Panel del fisioterapeuta
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Comparte tu código o un enlace con el paciente. Él crea su propia cuenta,
        se vincula y, al terminar la consulta con la IA, recibes el informe
        clínico aquí.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="relative mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <div ref={codeMenuRef} className="absolute right-4 top-4 sm:right-5 sm:top-5">
          <button
            type="button"
            aria-label={codeMenuOpen ? "Cerrar opciones" : "Más opciones"}
            aria-expanded={codeMenuOpen}
            disabled={!inviteCode && !codeBusy}
            onClick={() => setCodeMenuOpen((v) => !v)}
            className="rounded-xl border border-neutral-200 p-2.5 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden>
              {codeMenuOpen ? (
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              ) : (
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          {codeMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-1 min-w-[13.5rem] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                disabled={!inviteLink}
                onClick={() => {
                  setCodeMenuOpen(false);
                  void shareLink();
                }}
                className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
              >
                {copied === "link" ? "Enlace copiado" : "Copiar / compartir enlace"}
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={codeBusy}
                onClick={() => {
                  setCodeMenuOpen(false);
                  void regenerateCode();
                }}
                className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
              >
                {codeBusy ? "Generando…" : "Generar nuevo código"}
              </button>
            </div>
          ) : null}
        </div>

        <h2 className="pr-12 text-lg font-semibold text-neutral-900">
          Tu código de vinculación
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          El paciente lo introduce una vez en AIKinora, o abre el enlace directo.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-mono text-2xl font-bold tracking-[0.2em] text-blue-800">
            {inviteCode ?? (loading ? "…" : "—")}
          </p>
          <button
            type="button"
            onClick={() => inviteCode && void copyText("code", inviteCode)}
            disabled={!inviteCode}
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {copied === "code" ? "Copiado" : "Copiar código"}
          </button>
        </div>
        {inviteLink ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="min-w-0 flex-1 break-all rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 font-mono text-xs leading-relaxed text-neutral-600">
              {inviteLink}
            </p>
            <button
              type="button"
              onClick={() => void copyText("link", inviteLink)}
              className="shrink-0 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              {copied === "link" ? "Copiado" : "Copiar enlace"}
            </button>
          </div>
        ) : null}
        <p className="mt-3 text-xs text-neutral-500">
          Si regeneras el código, los pacientes ya vinculados siguen vinculados;
          solo cambia el código para nuevos pacientes.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <h2 className="text-base font-semibold text-neutral-900">
          Consulta clínica con Physio
        </h2>
        <Link
          href="/fisio/consulta"
          className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Abrir consulta
        </Link>
      </section>

      <PhysioEquipmentSettings />

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
            Todavía no hay pacientes vinculados. Comparte tu código o enlace para
            que se registren y se vinculen.
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
                        {patient.email}
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
