"use client";

type Props = {
  listening: boolean;
  supported: boolean;
  disabled?: boolean;
  onToggle: () => void;
  title?: string;
  className?: string;
};

export function VoiceMicButton({
  listening,
  supported,
  disabled,
  onToggle,
  title,
  className = "",
}: Props) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={
        title ??
        (listening ? "Detener dictado" : "Dictar por voz")
      }
      aria-label={listening ? "Detener dictado" : "Dictar por voz"}
      aria-pressed={listening}
      className={`btn-icon !h-10 !w-10 disabled:opacity-40 ${
        listening
          ? "!border-red-300 !bg-red-50 !text-red-600 hover:!bg-red-100"
          : ""
      } ${className}`.trim()}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {listening ? (
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
