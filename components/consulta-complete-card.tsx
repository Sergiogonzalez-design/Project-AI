"use client";

type Props = {
  locale?: "es" | "en";
  onNewConsulta: () => void;
};

/** Shown when a patient Consulta session is finished (all zones evaluated). */
export function ConsultaCompleteCard({
  locale = "es",
  onNewConsulta,
}: Props) {
  const es = locale !== "en";

  return (
    <div className="mx-auto w-full max-w-lg px-2 py-4 sm:px-0">
      <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-b from-blue-50 to-white p-6 text-center shadow-[var(--shadow-elevated)] sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/25">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {es ? "Consulta terminada" : "Consultation finished"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          {es
            ? "Arriba tienes la orientación de Physio y lo que te recomienda hacer ahora. Si aparece otra molestia o quieres preguntar algo distinto, abre una nueva consulta."
            : "Above you have Physio’s guidance and what it recommends you do next. If another issue comes up or you want to ask something else, open a new consultation."}
        </p>

        <button
          type="button"
          onClick={onNewConsulta}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] sm:w-auto sm:min-w-[220px]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          {es ? "Nueva consulta" : "New consultation"}
        </button>
      </div>
    </div>
  );
}
