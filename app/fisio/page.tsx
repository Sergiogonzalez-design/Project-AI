"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PhysioClinicInfoCard,
  type PhysioClinicSummary,
} from "@/components/physio-clinic-info-card";
import {
  buildPhysioInviteShareText,
  buildPhysioInviteUrl,
  buildPhysioWhatsAppInviteShareText,
  buildPhysioWhatsAppInviteUrl,
} from "@/lib/physio-invite";
import { staffPatientLabel } from "@/lib/guest-account";
import { createClient } from "@/lib/supabase/client";

type PhysioPatient = {
  id: string;
  email: string | null;
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
  const [copied, setCopied] = useState<"code" | "link" | "wa" | null>(null);
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const [vinculacionOpen, setVinculacionOpen] = useState(false);
  const [physioName, setPhysioName] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [clinic, setClinic] = useState<PhysioClinicSummary | null>(null);
  const [claimCode, setClaimCode] = useState("");
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const codeMenuRef = useRef<HTMLDivElement>(null);

  const inviteLink = inviteCode ? buildPhysioInviteUrl(inviteCode) : null;
  const whatsappInviteLink = inviteCode
    ? buildPhysioWhatsAppInviteUrl(inviteCode)
    : null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, clinic_name")
          .eq("id", user.id)
          .single();
        setPhysioName(profile?.display_name ?? null);
        setClinicName(profile?.clinic_name ?? null);
      }

      const { data: clinicRow } = await supabase.rpc("clinic_get_own");
      if (clinicRow && typeof clinicRow === "object" && "id" in clinicRow && clinicRow.id) {
        const row = clinicRow as PhysioClinicSummary;
        setClinic(row);
        if (row.name) setClinicName(row.name);
        if (user && row.name) {
          void supabase
            .from("profiles")
            .update({ clinic_name: row.name, clinic_id: row.id })
            .eq("id", user.id);
        }
      } else {
        setClinic(null);
      }

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

      const { data: unreadRows } = await supabase
        .from("clinical_reports")
        .select("patient_id, status")
        .eq("status", "new");
      const unreadCounts: Record<string, number> = {};
      for (const r of (unreadRows as { patient_id: string; status: string }[]) ?? []) {
        unreadCounts[r.patient_id] = (unreadCounts[r.patient_id] ?? 0) + 1;
      }
      setUnreadByPatient(unreadCounts);
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

  async function claimClinic(e: React.FormEvent) {
    e.preventDefault();
    const code = claimCode.trim();
    if (!code) {
      setClaimError("Introduce el código de alta de tu clínica.");
      return;
    }
    setClaimBusy(true);
    setClaimError(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("clinic_claim_invite", {
        p_token: code,
      });
      if (rpcError) throw new Error(rpcError.message);
      const row = (Array.isArray(data) ? data[0] : data) as PhysioClinicSummary | null;
      if (!row?.id) throw new Error("No se pudo vincular la clínica.");
      setClinic(row);
      setClinicName(row.name);
      setClaimCode("");
      await load();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "No se pudo vincular.");
    } finally {
      setClaimBusy(false);
    }
  }

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

  async function copyText(kind: "code" | "link" | "wa", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError(
        kind === "code"
          ? "No se pudo copiar el código."
          : "No se pudo copiar el enlace."
      );
    }
  }

  async function shareLink(kind: "web" | "wa" = "web") {
    const url = kind === "wa" ? whatsappInviteLink : inviteLink;
    if (!url || !inviteCode) return;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title:
            kind === "wa"
              ? "AIKinora — consulta previa por WhatsApp"
              : "AIKinora — consulta previa",
          text:
            kind === "wa"
              ? buildPhysioWhatsAppInviteShareText()
              : buildPhysioInviteShareText(),
          url,
        });
        return;
      } catch {
        // Fall through to clipboard if share is cancelled/unavailable.
      }
    }
    await copyText(kind === "wa" ? "wa" : "link", url);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        Bienvenido/a
        {physioName ? `, ${physioName}` : ""}
        {clinicName ? ` · ${clinicName}` : ""}
      </h1>

      {clinic ? (
        <PhysioClinicInfoCard clinic={clinic} />
      ) : !loading ? (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-bold text-amber-950">Vincula tu clínica</h2>
          <p className="mt-1 text-sm text-amber-900/90">
            Tu cuenta aún no está unida a una clínica. Introduce el código de
            alta del titular para ver la ficha del centro.
          </p>
          <form
            onSubmit={(e) => void claimClinic(e)}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <input
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
              placeholder="Código (ej. AB12CD)"
              className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-sm font-semibold tracking-widest sm:max-w-xs"
              autoCapitalize="characters"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={claimBusy}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {claimBusy ? "Vinculando…" : "Vincular clínica"}
            </button>
          </form>
          {claimError ? (
            <p className="mt-2 text-sm text-red-700">{claimError}</p>
          ) : null}
        </section>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

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
            Todavía no hay pacientes ni informes en esta cuenta. Abre Vinculación
            para compartir el enlace de consulta previa y pulsa Actualizar después
            de que el paciente lo abra.
            termine el cuestionario.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {patients.map((patient) => {
              const unread = unreadByPatient[patient.id] ?? 0;
              const label = staffPatientLabel({
                displayName: patient.display_name,
                email: patient.email,
              });
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
                            {unread} nuevo{unread === 1 ? " informe" : "s informes"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-neutral-400">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-8">
        <button
          type="button"
          aria-expanded={vinculacionOpen}
          onClick={() => {
            setVinculacionOpen((v) => !v);
            if (vinculacionOpen) setCodeMenuOpen(false);
          }}
          className="flex w-full items-center justify-between gap-3 rounded-2xl bg-blue-600 px-5 py-4 text-left text-base font-semibold text-white hover:bg-blue-700"
        >
          <span>Vinculación</span>
          <span className="text-blue-100" aria-hidden>
            {vinculacionOpen ? "▴" : "▾"}
          </span>
        </button>

        {vinculacionOpen ? (
          <section className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">
              Vinculación
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Enlace de consulta previa para pacientes
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              Comparte el enlace: el paciente lo abre y va directo a poner su
              nombre. No necesita escribir ningún código. El informe llega a tu
              panel.
            </p>
            {inviteLink ? (
              <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                {inviteLink}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!inviteLink || codeBusy}
                onClick={() => void shareLink("web")}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {copied === "link"
                  ? "Enlace copiado"
                  : "Compartir enlace de consulta previa"}
              </button>
              <div className="relative" ref={codeMenuRef}>
                <button
                  type="button"
                  disabled={!inviteCode || codeBusy}
                  onClick={() => setCodeMenuOpen((o) => !o)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Más opciones
                </button>
                {codeMenuOpen && inviteCode ? (
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
                  >
                    {inviteLink ? (
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                        onClick={() => {
                          setCodeMenuOpen(false);
                          void copyText("link", inviteLink);
                        }}
                      >
                        {copied === "link" ? "Enlace copiado" : "Copiar enlace"}
                      </button>
                    ) : null}
                    {whatsappInviteLink ? (
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                        onClick={() => {
                          setCodeMenuOpen(false);
                          void shareLink("wa");
                        }}
                      >
                        {copied === "wa"
                          ? "Enlace WhatsApp copiado"
                          : "Compartir WhatsApp"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                      onClick={() => {
                        setCodeMenuOpen(false);
                        void copyText("code", inviteCode);
                      }}
                    >
                      {copied === "code"
                        ? "Código copiado"
                        : "Copiar código (solo si hace falta)"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={codeBusy}
                      className="block w-full px-3 py-2.5 text-left text-sm text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                      onClick={() => {
                        setCodeMenuOpen(false);
                        void regenerateCode();
                      }}
                    >
                      {codeBusy ? "Generando…" : "Generar código nuevo"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Si regeneras el código, los pacientes ya vinculados siguen
              vinculados; solo cambia el enlace para nuevos pacientes.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
