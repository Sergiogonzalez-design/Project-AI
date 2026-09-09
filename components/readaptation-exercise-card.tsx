"use client";

import { useState } from "react";
import { getReadaptExerciseById } from "@/lib/readaptation-exercise-catalog";
import { READAPT_PHASE_LABELS } from "@/lib/readaptation-types";
import type { ConsultReadaptExerciseLink } from "@/lib/consult-readaptation";

type Props = {
  link: ConsultReadaptExerciseLink;
  language?: "es" | "en";
};

export function ReadaptationExerciseCard({ link, language = "es" }: Props) {
  const [open, setOpen] = useState(false);
  const ex = getReadaptExerciseById(link.id);
  const phaseLabel = ex
    ? language === "en"
      ? READAPT_PHASE_LABELS[ex.phase].en
      : READAPT_PHASE_LABELS[ex.phase].es
    : null;

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col items-start gap-0.5 px-3.5 py-2.5 text-left transition-colors hover:bg-emerald-100/80"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-emerald-900">
          {link.label}
        </span>
        {link.meta ? (
          <span className="text-xs leading-snug text-emerald-800/80">
            {link.meta}
          </span>
        ) : phaseLabel ? (
          <span className="text-xs text-emerald-700/70">{phaseLabel}</span>
        ) : (
          <span className="text-xs text-emerald-700/70">
            {language === "en" ? "Tap for instructions" : "Toca para ver instrucciones"}
          </span>
        )}
        <span className="text-[11px] font-medium text-emerald-700/60">
          {open
            ? language === "en"
              ? "Hide details ▲"
              : "Ocultar detalle ▲"
            : language === "en"
              ? "Show how-to ▼"
              : "Ver cómo hacerlo ▼"}
        </span>
      </button>
      {open && ex ? (
        <div className="space-y-2 border-t border-emerald-200/80 bg-white/60 px-3.5 py-3 text-xs leading-relaxed text-neutral-800">
          <p>
            <strong className="text-emerald-900">
              {language === "en" ? "How to" : "Cómo hacerlo"}:
            </strong>{" "}
            {language === "en" ? ex.instructionsEn : ex.instructionsEs}
          </p>
          <p>
            <strong className="text-emerald-900">
              {language === "en" ? "Dose" : "Dosis"}:
            </strong>{" "}
            {language === "en" ? ex.dosageEn : ex.dosageEs}
          </p>
          <p>
            <strong className="text-emerald-900">
              {language === "en" ? "Progression" : "Progresión"}:
            </strong>{" "}
            {language === "en" ? ex.progressionEn : ex.progressionEs}
          </p>
          <p>
            <strong className="text-emerald-900">
              {language === "en" ? "Regression" : "Regresión"}:
            </strong>{" "}
            {language === "en" ? ex.regressionEn : ex.regressionEs}
          </p>
          <p>
            <strong className="text-emerald-900">
              {language === "en" ? "Avoid if" : "Evitar si"}:
            </strong>{" "}
            {language === "en"
              ? ex.contraindicationsEn
              : ex.contraindicationsEs}
          </p>
          <p className="text-neutral-600">
            <strong>{language === "en" ? "Evidence" : "Evidencia"}:</strong>{" "}
            {language === "en" ? ex.evidenceEn : ex.evidenceEs}
          </p>
        </div>
      ) : open ? (
        <div className="border-t border-emerald-200/80 bg-white/60 px-3.5 py-3 text-xs text-neutral-600">
          {language === "en"
            ? "Detailed instructions for this exercise are not in the catalog. Follow the line above and consult your physiotherapist if unsure."
            : "No hay ficha detallada en el catálogo para este ejercicio. Sigue la línea anterior y consulta a tu fisioterapeuta si tienes dudas."}
        </div>
      ) : null}
    </div>
  );
}
