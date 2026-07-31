"use client";

/**
 * Highly visible assessment progress indicator used at the top of every
 * body-part questionnaire. Shows current step, remaining steps and a
 * percentage-filled gradient bar so users always know where they stand.
 */
export function QuestionnaireProgress({
  stepIndex,
  totalSteps,
  label = "Progreso de la evaluación",
  locale = "es",
}: {
  stepIndex: number;
  totalSteps: number;
  label?: string;
  locale?: "es" | "en";
}) {
  const current = Math.min(stepIndex + 1, Math.max(totalSteps, 1));
  const pct = totalSteps > 0 ? Math.round((current / totalSteps) * 100) : 0;
  const remaining = Math.max(totalSteps - current, 0);
  const en = locale === "en";

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {en ? "Assessment progress" : label}
        </p>
        <span className="text-xs font-bold text-blue-600">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          {en ? `Step ${current} of ${totalSteps}` : `Paso ${current} de ${totalSteps}`}
        </p>
        {remaining > 0 && (
          <p className="text-xs text-slate-400">
            {en
              ? `${remaining} step${remaining === 1 ? "" : "s"} left`
              : `${remaining} paso${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}`}
          </p>
        )}
      </div>
    </div>
  );
}
