"use client";

type Props = {
  locale?: "es" | "en";
  onNewConsulta: () => void;
};

/** Soft CTA when the patient asks about a different topic — chat stays open. */
export function ConsultaNewConsultaPrompt({
  locale = "es",
  onNewConsulta,
}: Props) {
  const es = locale !== "en";

  return (
    <div className="mx-auto w-full max-w-lg px-2 pb-2 pt-1 sm:px-0">
      <button
        type="button"
        onClick={onNewConsulta}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] sm:w-auto sm:min-w-[220px]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
        {es ? "Nueva consulta" : "New consultation"}
      </button>
    </div>
  );
}
