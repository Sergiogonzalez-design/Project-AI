"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClinicTeamPanel } from "@/components/clinic-team-panel";
import { clinicHubCopy } from "@/lib/clinic-hub-copy";
import { buildPhysioInviteUrl } from "@/lib/physio-invite";
import { createClient } from "@/lib/supabase/client";
import { useUiLocaleOptional } from "@/lib/ui-locale";

type ClinicPatient = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
  physio_id: string | null;
  physio_name: string | null;
};

type RecentReport = {
  id: string;
  created_at: string;
  body_area: string | null;
  status: string;
  patient_id: string;
};

export function ClinicPatientsPanel() {
  const { locale, ready } = useUiLocaleOptional();
  const [mounted, setMounted] = useState(false);
  const copy = useMemo(
    () => clinicHubCopy(mounted && ready ? locale : "es"),
    [locale, mounted, ready]
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  const [patients, setPatients] = useState<ClinicPatient[]>([]);
  const [unreadByPatient, setUnreadByPatient] = useState<Record<string, number>>({});
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const [vinculacionOpen, setVinculacionOpen] = useState(true);
  const [tab, setTab] = useState<"pacientes" | "fisios">("pacientes");
  const codeMenuRef = useRef<HTMLDivElement>(null);

  const inviteLink = inviteCode ? buildPhysioInviteUrl(inviteCode) : null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: code, error: codeError } = await supabase.rpc(
        "clinic_get_or_create_patient_invite_code"
      );
      if (codeError) {
        setError(codeError.message);
      } else {
        setInviteCode((code as string) ?? null);
      }

      const { data, error: rpcError } = await supabase.rpc("clinic_list_patients");
      if (rpcError) {
        setError(rpcError.message);
        setPatients([]);
        return;
      }
      const list = (data as ClinicPatient[]) ?? [];
      setPatients(list);

      const { data: reports } = await supabase
        .from("clinical_reports")
        .select("id, created_at, body_area, status, patient_id")
        .order("created_at", { ascending: false })
        .limit(20);
      setRecentReports((reports as RecentReport[]) ?? []);

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
      "clinic_regenerate_patient_invite_code"
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
          title: "AIKinora — vinculación con tu clínica",
          text: `Usa este enlace para vincularte en AIKinora (código ${inviteCode}):`,
          url: inviteLink,
        });
        return;
      } catch {
        // Fall through
      }
    }
    await copyText("link", inviteLink);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-neutral-900"
          suppressHydrationWarning
        >
          {copy.title}
        </h1>
        <div
          className="mt-4 grid grid-cols-2 gap-1 rounded-2xl border border-neutral-200 bg-neutral-100 p-1"
          role="tablist"
          aria-label={copy.title}
          suppressHydrationWarning
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "pacientes"}
            onClick={() => setTab("pacientes")}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              tab === "pacientes"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {copy.tabPatients}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "fisios"}
            onClick={() => setTab("fisios")}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              tab === "fisios"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {copy.tabPhysios}
          </button>
        </div>
      </div>

      {tab === "fisios" ? (
        <ClinicTeamPanel embedded />
      ) : (
        <>
          <p className="text-sm text-neutral-600">{copy.patientsLead}</p>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <button
              type="button"
              onClick={() => setVinculacionOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {copy.linkingTitle}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {copy.linkingSubtitle}
                </p>
              </div>
              <span className="text-neutral-400">
                {vinculacionOpen ? "▴" : "▾"}
              </span>
            </button>

            {vinculacionOpen ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-neutral-600">{copy.linkingHint}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold tracking-[0.18em] text-slate-900">
                    {inviteCode ?? (loading ? "…" : "—")}
                  </code>
                  <div className="relative" ref={codeMenuRef}>
                    <button
                      type="button"
                      disabled={!inviteCode || codeBusy}
                      onClick={() => setCodeMenuOpen((o) => !o)}
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      {copy.actions}
                    </button>
                    {codeMenuOpen && inviteCode ? (
                      <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                        <button
                          type="button"
                          className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                          onClick={() => {
                            void copyText("code", inviteCode);
                            setCodeMenuOpen(false);
                          }}
                        >
                          {copied === "code" ? copy.codeCopied : copy.copyCode}
                        </button>
                        {inviteLink ? (
                          <>
                            <button
                              type="button"
                              className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                              onClick={() => {
                                void copyText("link", inviteLink);
                                setCodeMenuOpen(false);
                              }}
                            >
                              {copied === "link"
                                ? copy.linkCopied
                                : copy.copyLink}
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                              onClick={() => {
                                void shareLink();
                                setCodeMenuOpen(false);
                              }}
                            >
                              {copy.shareLink}
                            </button>
                          </>
                        ) : null}
                        <button
                          type="button"
                          className="block w-full px-3 py-2.5 text-left text-sm text-amber-800 hover:bg-amber-50"
                          disabled={codeBusy}
                          onClick={() => {
                            setCodeMenuOpen(false);
                            void regenerateCode();
                          }}
                        >
                          {codeBusy ? copy.generating : copy.newCode}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                {inviteLink ? (
                  <p className="break-all text-xs text-neutral-500">{inviteLink}</p>
                ) : null}
              </div>
            ) : null}
          </section>

          {!loading && recentReports.length > 0 ? (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">
                {copy.recentReports}
              </h2>
              <ul className="mt-4 divide-y divide-neutral-100">
                {recentReports.map((report) => {
                  const patient = patients.find((p) => p.id === report.patient_id);
                  const label =
                    patient?.display_name || patient?.email || copy.tabPatients;
                  const when = new Date(report.created_at).toLocaleString(
                    locale === "en" ? "en-GB" : "es-ES",
                    {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                  return (
                    <li key={report.id}>
                      <Link
                        href={`/clinica/pacientes/${report.patient_id}?name=${encodeURIComponent(label)}`}
                        className="flex items-center justify-between gap-3 py-3 hover:bg-neutral-50"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-neutral-900">
                              {label}
                            </p>
                            {report.status === "new" ? (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                {copy.newBadge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {report.body_area || copy.consult} · {when}
                          </p>
                        </div>
                        <span className="text-neutral-400">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-neutral-900">
                {(patients.length === 1
                  ? copy.patientsCount
                  : copy.patientsCountPlural
                ).replace("{n}", String(patients.length))}
              </h2>
              <button
                type="button"
                onClick={() => void load()}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {copy.refresh}
              </button>
            </div>

            {loading ? (
              <p className="mt-4 text-sm text-neutral-500">{copy.loading}</p>
            ) : patients.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-500">{copy.noPatients}</p>
            ) : (
              <ul className="mt-4 divide-y divide-neutral-100">
                {patients.map((patient) => {
                  const label = patient.display_name || patient.email;
                  const unread = unreadByPatient[patient.id] ?? 0;
                  return (
                    <li key={patient.id}>
                      <Link
                        href={`/clinica/pacientes/${patient.id}?name=${encodeURIComponent(label)}`}
                        className="flex items-center justify-between gap-3 py-3 hover:bg-neutral-50"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-neutral-900">
                              {label}
                            </p>
                            {unread > 0 ? (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                {unread} {copy.newBadge.toLowerCase()}
                                {unread === 1 ? "" : "s"}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-neutral-500">
                            {patient.email}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-blue-700">
                            {patient.physio_name
                              ? copy.physioLabel.replace(
                                  "{name}",
                                  patient.physio_name
                                )
                              : copy.unassignedPhysio}
                          </p>
                        </div>
                        <span className="text-neutral-400">{copy.viewReport}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
