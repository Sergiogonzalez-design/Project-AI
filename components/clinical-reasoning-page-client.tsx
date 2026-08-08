"use client";

import { useCallback, useEffect, useState } from "react";
import { ClinicalReasoningFlow } from "@/components/clinical-reasoning-flow";
import { createClient } from "@/lib/supabase/client";

export function ClinicalReasoningPageClient({
  patientId,
  reportId,
  patientName,
}: {
  patientId: string;
  reportId: string;
  patientName: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<{
    body_area: string | null;
    physio_report: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from("clinical_reports")
        .select("body_area, physio_report")
        .eq("id", reportId)
        .eq("patient_id", patientId)
        .maybeSingle();

      if (queryError) {
        setError(queryError.message);
        setReport(null);
        return;
      }
      if (!data) {
        setError("Informe no encontrado.");
        setReport(null);
        return;
      }
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el informe.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [patientId, reportId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-neutral-500">Cargando árbol clínico…</p>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error ?? "No se pudo cargar el informe."}
        </div>
      </main>
    );
  }

  return (
    <ClinicalReasoningFlow
      patientId={patientId}
      patientName={patientName}
      reportId={reportId}
      bodyArea={report.body_area}
      physioReport={report.physio_report}
    />
  );
}
