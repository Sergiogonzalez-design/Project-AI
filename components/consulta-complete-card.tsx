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
      <div className="ui-card rounded-[20px] border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#3b82f6,#2563eb)] text-white shadow-[0_8px_24px_rgba(37,99,235,0.25)]">
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
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
          {es
            ? "Arriba tienes la orientación de Physio y lo que te recomienda hacer ahora. Si aparece otra molestia o quieres preguntar algo distinto, abre una nueva consulta."
            : "Above you have Physio’s guidance and what it recommends you do next. If another issue comes up or you want to ask something else, open a new consultation."}
        </p>

        <button
          type="button"
          onClick={onNewConsulta}
          className="new-chat-btn mt-6 sm:mx-auto sm:max-w-[280px]"
        >
          <span className="new-chat-btn__icon" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </span>
          {es ? "Nueva consulta" : "New consultation"}
        </button>
      </div>
    </div>
  );
}
