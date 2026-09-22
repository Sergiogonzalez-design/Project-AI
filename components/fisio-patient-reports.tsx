"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AiOrientationDisclaimer,
  PhysioPatientOrientationView,
  PhysioReportView,
} from "@/components/physio-report-view";
import {
  StaffPatientNotesCard,
  StaffReportNotesField,
} from "@/components/staff-patient-notes";
import { StaffPatientProfileEditor } from "@/components/staff-patient-profile-editor";
import {
  buildConsultaNumberMap,
  formatConsultaLabel,
  summarizeConsultaHistory,
} from "@/lib/consulta-history";
import { createClient } from "@/lib/supabase/client";

type ClinicalReport = {
  id: string;
  created_at: string;
  body_area: string | null;
  patient_summary: string | null;
  physio_report: string;
  status: "new" | "viewed";
  staff_notes: string | null;
};

const PAGE_INTRO =
  "Ficha administrativa e historial de consultas. Los informes se generan automáticamente tras cada consulta previa con la IA.";

/** Same locale+timezone on server and client → no hydration mismatch. */
function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function FisioPatientReports({
  patientId,
  patientLabel,
  backHref = "/fisio",
}: {
  patientId: string;
  patientLabel: string | null;
  /** Back link target (physio roster or clinic patients). */
  backHref?: string;
}) {
  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveLabel, setLiveLabel] = useState<string | null>(patientLabel);

  useEffect(() => {
    setLiveLabel(patientLabel);
  }, [patientLabel]);

  const consultaNumbers = useMemo(
    () => buildConsultaNumberMap(reports),
    [reports]
  );
  const history = useMemo(() => summarizeConsultaHistory(reports), [reports]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("clinical_reports")
        .select(
          "id, created_at, body_area, patient_summary, physio_report, status, staff_notes"
        )
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        setReports([]);
        return;
      }

      const list = (data as ClinicalReport[]) ?? [];
      setReports(list);

      const newIds = list.filter((r) => r.status === "new").map((r) => r.id);
      if (newIds.length === 0) return;

      const { error: updateError } = await supabase
        .from("clinical_reports")
        .update({ status: "viewed", viewed_at: new Date().toISOString() })
        .in("id", newIds)
        .eq("status", "new");

      if (!updateError) {
        setReports((prev) =>
          prev.map((r) =>
            newIds.includes(r.id) ? { ...r, status: "viewed" } : r
          )
        );
      }
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
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleExpand(report: ClinicalReport) {
    const next = expandedId === report.id ? null : report.id;
    setExpandedId(next);

    if (next && report.status === "new") {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("clinical_reports")
        .update({ status: "viewed", viewed_at: new Date().toISOString() })
        .eq("id", report.id);
      if (!updateError) {
        setReports((prev) =>
          prev.map((r) => (r.id === report.id ? { ...r, status: "viewed" } : r))
        );
      }
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href={backHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
        ← Volver a pacientes
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        {liveLabel || "Ficha del paciente"}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">{PAGE_INTRO}</p>
      <AiOrientationDisclaimer className="mt-2" />

      {!loading && history.total > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              Consultas
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {history.total}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              Primera visita
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {history.firstAt ? formatDay(history.firstAt) : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              Última consulta
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {history.lastAt ? formatDay(history.lastAt) : "—"}
            </p>
          </div>
        </div>
      ) : null}

      <StaffPatientProfileEditor
        patientId={patientId}
        onDisplayNameChange={(name) => setLiveLabel(name || patientLabel)}
      />

      <StaffPatientNotesCard patientId={patientId} />

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="mt-8 space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold text-neutral-900">
            Historial de consultas
          </h2>
          {!loading && history.total > 0 ? (
            <p className="text-xs text-neutral-500">
              {history.total === 1
                ? "1 consulta registrada"
                : `${history.total} consultas registradas`}
            </p>
          ) : null}
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">Cargando…</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-8 text-center">
            <p className="text-sm text-neutral-500">
              Este paciente todavía no ha completado ninguna consulta.
            </p>
          </div>
        ) : (
          reports.map((report) => {
            const isOpen = expandedId === report.id;
            const n = consultaNumbers.get(report.id) ?? 0;
            return (
              <div
                key={report.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => void toggleExpand(report)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-900">
                      <span className="truncate">
                        {formatConsultaLabel(n, report.body_area)}
                      </span>
                      {report.status === "new" && (
                        <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Nuevo
                        </span>
                      )}
                      {report.staff_notes ? (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                          Con notas
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {formatDate(report.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-neutral-400">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-neutral-100 px-5 py-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Informe para el fisioterapeuta
                    </h3>
                    <PhysioReportView
                      content={report.physio_report}
                      clinicalReasoningLink={{
                        patientId,
                        reportId: report.id,
                        bodyArea: report.body_area,
                        patientName: liveLabel,
                      }}
                    />

                    <StaffReportNotesField
                      reportId={report.id}
                      initialNotes={report.staff_notes}
                    />

                    {report.patient_summary && (
                      <details className="mt-6 rounded-xl bg-neutral-50 px-4 py-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          Ver orientación mostrada al paciente
                        </summary>
                        <div className="mt-2">
                          <PhysioPatientOrientationView
                            content={report.patient_summary}
                          />
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
