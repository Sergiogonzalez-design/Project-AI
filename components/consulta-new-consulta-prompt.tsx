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
        className="new-chat-btn sm:mx-auto sm:max-w-[280px]"
      >
        <span className="new-chat-btn__icon" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
        {es ? "Nueva consulta" : "New consultation"}
      </button>
    </div>
  );
}
