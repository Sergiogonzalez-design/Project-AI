"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ClinicalReport = {
  id: string;
  created_at: string;
  body_area: string | null;
  patient_summary: string | null;
  physio_report: string;
  status: "new" | "viewed";
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderReportBody(content: string) {
  return content.split("\n").map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    return (
      <span key={li}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-bold text-neutral-900">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        {"\n"}
      </span>
    );
  });
}

export function FisioPatientReports({
  patientId,
  patientLabel,
}: {
  patientId: string;
  patientLabel: string | null;
}) {
  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from("clinical_reports")
      .select("id, created_at, body_area, patient_summary, physio_report, status")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setReports([]);
    } else {
      const list = (data as ClinicalReport[]) ?? [];
      setReports(list);
      if (list.length > 0) setExpandedId((prev) => prev ?? list[0].id);
    }
    setLoading(false);
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
      <Link href="/fisio" className="text-sm font-medium text-blue-600 hover:text-blue-800">
        ← Volver a pacientes
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        {patientLabel || "Informes del paciente"}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Informes clínicos generados automáticamente por Kinora tras cada
        consulta de este paciente con la IA, para orientarte antes de la cita.
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="mt-8 space-y-4">
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
                    <p className="flex items-center gap-2 truncate text-sm font-semibold text-neutral-900">
                      {report.body_area || "Consulta"}
                      {report.status === "new" && (
                        <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Nuevo
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {formatDate(report.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-neutral-400">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-neutral-100 px-5 py-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Informe para el fisioterapeuta
                    </h3>
                    <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
                      {renderReportBody(report.physio_report)}
                    </div>

                    {report.patient_summary && (
                      <details className="mt-6 rounded-xl bg-neutral-50 px-4 py-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          Ver informe entregado al paciente
                        </summary>
                        <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                          {renderReportBody(report.patient_summary)}
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
