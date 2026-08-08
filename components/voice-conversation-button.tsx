"use client";

type Props = {
  active: boolean;
  supported: boolean;
  disabled?: boolean;
  onToggle: () => void;
  className?: string;
};

export function VoiceConversationButton({
  active,
  supported,
  disabled,
  onToggle,
  className = "",
}: Props) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={active ? "Salir de conversación" : "Conversación por voz"}
      aria-label={active ? "Salir de conversación" : "Conversación por voz"}
      aria-pressed={active}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 ${
        active
          ? "bg-blue-600 text-white shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      } ${className}`.trim()}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        {active ? (
          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
        ) : (
          <>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </>
        )}
      </svg>
    </button>
  );
}
