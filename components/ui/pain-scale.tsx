"use client";

/**
 * Redesigned 0–10 pain intensity input. Replaces the plain <input type="range">
 * with a color-coded (green -> yellow -> orange -> red) scale, emoji anchors,
 * and a prominent readout of the selected value so users instantly understand
 * their selection.
 */
function paintColor(value: number): string {
  if (value <= 2) return "#10b981"; // success green
  if (value <= 4) return "#84cc16";
  if (value <= 6) return "#f59e0b"; // warning amber
  if (value <= 8) return "#f97316";
  return "#ef4444"; // danger red
}

export function PainScale({
  value,
  onChange,
  label,
  locale = "es",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  locale?: "es" | "en";
}) {
  const en = locale === "en";
  const num = Number.isFinite(value) ? Math.min(10, Math.max(0, value)) : 5;
  const color = paintColor(num);
  const pct = (num / 10) * 100;

  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700">
          {label ?? (en ? "Pain intensity" : "Intensidad del dolor")}
        </label>
        <span
          className="rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white transition-colors duration-150"
          style={{ backgroundColor: color }}
        >
          {num}/10
        </span>
      </div>

      <div className="relative flex items-center gap-3">
        <span className="shrink-0 text-xl" aria-hidden>
          🙂
        </span>
        <div className="relative flex-1">
          <div
            className="h-2.5 w-full rounded-full"
            style={{
              background:
                "linear-gradient(to right, #10b981 0%, #84cc16 25%, #f59e0b 50%, #f97316 75%, #ef4444 100%)",
            }}
          />
          <input
            type="range"
            min={0}
            max={10}
            value={num}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={label ?? (en ? "Pain intensity" : "Intensidad del dolor")}
            className="pain-range absolute inset-0 top-1/2 h-2.5 w-full -translate-y-1/2 cursor-pointer bg-transparent"
          />
          <div
            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-md transition-[left] duration-150 ease-out"
            style={{ left: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <span className="shrink-0 text-xl" aria-hidden>
          😣
        </span>
      </div>
      <div className="mt-1 flex justify-between px-8 text-[11px] text-slate-400">
        <span>0 {en ? "no pain" : "sin dolor"}</span>
        <span>10 {en ? "worst" : "insoportable"}</span>
      </div>
    </div>
  );
}
