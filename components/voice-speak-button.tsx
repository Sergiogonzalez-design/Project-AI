"use client";

type Props = {
  supported: boolean;
  speaking: boolean;
  disabled?: boolean;
  onToggle: () => void;
  className?: string;
};

export function VoiceSpeakButton({
  supported,
  speaking,
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
      title={speaking ? "Detener audio" : "Escuchar respuesta"}
      aria-label={speaking ? "Detener audio" : "Escuchar respuesta"}
      aria-pressed={speaking}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-40 ${
        speaking
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-slate-200 text-slate-500 hover:bg-slate-50"
      } ${className}`.trim()}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {speaking ? (
          <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none" />
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
}
