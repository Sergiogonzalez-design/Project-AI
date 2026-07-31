"use client";

/**
 * Compact trust-building strip shown near the start of the assessment flow.
 * Healthcare products live or die on trust — this reinforces it without
 * getting in the way of the conversation.
 */
const ITEMS_ES = [
  "Datos seguros y cifrados",
  "Evaluación asistida por IA",
  "Orientación basada en evidencia",
  "No sustituye un diagnóstico médico",
  "Enfoque fisioterapéutico",
] as const;

const ITEMS_EN = [
  "Secure and encrypted",
  "AI-assisted assessment",
  "Evidence-informed guidance",
  "Not a medical diagnosis",
  "Physiotherapy-focused recommendations",
] as const;

export function TrustPanel({ locale = "es" }: { locale?: "es" | "en" }) {
  const items = locale === "en" ? ITEMS_EN : ITEMS_ES;
  return (
    <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="shrink-0 text-emerald-500"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </span>
      ))}
    </div>
  );
}
