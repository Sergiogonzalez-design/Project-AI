"use client";

type Props = {
  supported: boolean;
  autoPlay: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export function VoiceAutoPlayToggle({
  supported,
  autoPlay,
  onChange,
  className = "",
}: Props) {
  if (!supported) return null;

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 text-xs text-slate-500 ${className}`.trim()}
    >
      <input
        type="checkbox"
        checked={autoPlay}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      Leer respuestas en voz alta
    </label>
  );
}
