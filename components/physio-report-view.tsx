"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { hasClinicalReasoningForReport } from "@/lib/clinical-reasoning";

const SECTION_ORDER = [
  "Resultados de las pruebas funcionales ya realizadas",
  "Pruebas/maniobras a realizar en la cita",
  "Hipótesis diagnósticas",
  "Resumen para el fisioterapeuta",
  "Datos del paciente",
  "Historia y mecanismo",
  "Pruebas de imagen si procede",
  "Puntos de alerta",
] as const;

function normalizeHeading(raw: string): string {
  let h = raw.replace(/\*\*/g, "").trim();
  h = h.replace(/\s*\(por probabilidad\)\s*/i, "").trim();
  if (/^hip[oó]tesis diagn/i.test(h)) return "Hipótesis diagnósticas";
  if (/pruebas\/?\s*maniobras/i.test(h)) return "Pruebas/maniobras a realizar en la cita";
  if (/resultados de las pruebas funcionales/i.test(h)) {
    return "Resultados de las pruebas funcionales ya realizadas";
  }
  if (/resumen para el fisioterapeuta/i.test(h)) return "Resumen para el fisioterapeuta";
  if (/datos del paciente/i.test(h)) return "Datos del paciente";
  if (/historia y mecanismo/i.test(h)) return "Historia y mecanismo";
  if (/pruebas de imagen/i.test(h)) return "Pruebas de imagen si procede";
  if (/puntos de alerta/i.test(h)) return "Puntos de alerta";
  if (/fuentes consultadas|sources consulted/i.test(h)) return "Fuentes consultadas";
  return h;
}

function fixClinicalSpelling(text: string): string {
  return text.replace(/Syndesmosis/gi, "Sindesmosis");
}

function splitReportSections(content: string): {
  sections: { title: string; body: string }[];
  sources: string[];
  preamble: string;
} {
  const fixed = fixClinicalSpelling(content);
  const sources: string[] = [];
  const sections: { title: string; body: string }[] = [];
  const parts = fixed.split(/\n(?=\*\*[^*]+\*\*)/);
  let preamble = "";

  for (const part of parts) {
    const match = /^\*\*([^*]+)\*\*\s*([\s\S]*)$/.exec(part.trim());
    if (!match) {
      if (!sections.length) preamble += (preamble ? "\n" : "") + part.trim();
      continue;
    }
    const title = normalizeHeading(match[1]);
    let body = match[2].trim();
    if (title === "Fuentes consultadas") {
      for (const line of body.split("\n")) {
        const item = line.replace(/^[-*•]\s*/, "").trim();
        if (item) sources.push(item);
      }
      continue;
    }
    if (title === "Pruebas de imagen si procede") {
      body =
        "No se recomienda realizar pruebas de imagen en esta fase inicial hasta pasadas 24-48 horas.";
    }
    sections.push({ title, body });
  }

  const orderIndex = (t: string) => {
    const i = SECTION_ORDER.indexOf(t as (typeof SECTION_ORDER)[number]);
    return i === -1 ? 100 : i;
  };
  sections.sort((a, b) => orderIndex(a.title) - orderIndex(b.title));

  return { sections, sources, preamble };
}

function renderInline(text: string) {
  return text.split("\n").map((line, li) => {
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

export function AiOrientationDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-xs leading-relaxed text-neutral-500 ${className}`.trim()}
    >
      AIKinora es una IA orientativa: no sustituye el criterio clínico ni un
      diagnóstico médico presencial.
    </p>
  );
}

export function PhysioReportView({
  content,
  clinicalReasoningLink,
}: {
  content: string;
  clinicalReasoningLink?: {
    patientId: string;
    reportId: string;
    bodyArea: string | null;
    patientName?: string | null;
  };
}) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { sections, sources, preamble } = useMemo(
    () => splitReportSections(content),
    [content]
  );

  const showReasoningButton =
    clinicalReasoningLink &&
    hasClinicalReasoningForReport({
      bodyArea: clinicalReasoningLink.bodyArea,
      physioReport: content,
    });

  const reasoningHref = clinicalReasoningLink
    ? `/fisio/patients/${clinicalReasoningLink.patientId}/arbol/${clinicalReasoningLink.reportId}${
        clinicalReasoningLink.patientName
          ? `?name=${encodeURIComponent(clinicalReasoningLink.patientName)}`
          : ""
      }`
    : null;

  return (
    <div className="space-y-5 text-sm leading-relaxed text-neutral-800">
      {preamble ? (
        <div className="whitespace-pre-wrap">{renderInline(preamble)}</div>
      ) : null}

      {sections.map((section) => (
        <section key={section.title}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {section.title}
          </h4>
          <div className="mt-1.5 whitespace-pre-wrap">{renderInline(section.body)}</div>
          {section.title === "Pruebas/maniobras a realizar en la cita" &&
          showReasoningButton &&
          reasoningHref ? (
            <div className="mt-4">
              <Link
                href={reasoningHref}
                className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                Árbol de razonamiento clínico
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-2 text-xs text-neutral-500">
                Recorre las pruebas una a una con botones Positivo / Negativo y
                obtén hipótesis orientativas según los resultados.
              </p>
            </div>
          ) : null}
        </section>
      ))}

      {sources.length > 0 ? (
        <div>
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            {sourcesOpen ? "Ocultar fuentes consultadas" : "Fuentes consultadas"}
          </button>
          {sourcesOpen ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-neutral-600">
              {sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <AiOrientationDisclaimer className="border-t border-neutral-100 pt-4" />
    </div>
  );
}
