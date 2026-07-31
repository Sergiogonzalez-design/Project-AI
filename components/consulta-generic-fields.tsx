"use client";

import { chipClass } from "@/components/ui/chip-style";
import { PainScale } from "@/components/ui/pain-scale";
import {
  defaultGenericConsultaAnswers,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";
import {
  localizeShoulderOption,
  type ConsultLocale,
} from "@/lib/consulta-shoulder-adaptive";

const labelClass = "mb-2.5 block text-base font-semibold text-slate-800";

const GENERIC_LABELS_EN = {
  banner: "Questionnaire to gather details before guidance.",
  urgency: "Urgency check",
  rf_deformidad: "Obvious deformity?",
  rf_fiebre: "Associated fever?",
  rf_perdida_sensibilidad: "Loss of sensation?",
  problem: "Your problem",
  evolucion: "How long have you had this?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Describe the mechanism",
  intensidad: "Pain intensity",
  descripcion: "Additional details (optional)",
  descripcion_ph: "Anything else you’d like to add…",
} as const;

function ChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  displayOption?: (opt: string) => string;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={chipClass(value === opt)}
        >
          {displayOption ? displayOption(opt) : opt}
        </button>
      ))}
    </div>
  );
}

function MultiChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  displayOption?: (opt: string) => string;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={chipClass(value.includes(opt))}
        >
          {displayOption ? displayOption(opt) : opt}
        </button>
      ))}
    </div>
  );
}

type Props = {
  value: GenericConsultaAnswers;
  onChange: (v: GenericConsultaAnswers) => void;
  locale?: ConsultLocale;
};

export function ConsultaGenericFields({ value, onChange, locale = "es" }: Props) {
  const a = value ?? defaultGenericConsultaAnswers();
  const patch = (p: Partial<GenericConsultaAnswers>) => onChange({ ...a, ...p });
  const en = locale === "en";
  const L = GENERIC_LABELS_EN;
  const displayOption = (opt: string) => localizeShoulderOption(opt, locale);

  const textareaClass =
    "mb-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50";

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 shadow-sm">
        {en
          ? L.banner
          : "Cuestionario para recoger detalles antes de orientación."}
      </div>

      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{en ? L.urgency : "Comprobación de urgencia"}</h2>
      <label className={labelClass}>{en ? L.rf_deformidad : "¿Deformidad evidente?"}</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_deformidad} onChange={(rf_deformidad) => patch({ rf_deformidad })} displayOption={displayOption} />
      <label className={labelClass}>{en ? L.rf_fiebre : "¿Fiebre asociada?"}</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_fiebre} onChange={(rf_fiebre) => patch({ rf_fiebre })} displayOption={displayOption} />
      <label className={labelClass}>{en ? L.rf_perdida_sensibilidad : "¿Pérdida de sensibilidad?"}</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_perdida_sensibilidad} onChange={(rf_perdida_sensibilidad) => patch({ rf_perdida_sensibilidad })} displayOption={displayOption} />

      <h2 className="mb-4 mt-2 text-xl font-bold tracking-tight text-slate-900">{en ? L.problem : "Tu problema"}</h2>
      <label className={labelClass}>{en ? L.evolucion : "¿Cuánto tiempo llevas con esto?"}</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.evolution} value={a.evolucion} onChange={(evolucion) => patch({ evolucion })} displayOption={displayOption} />
      <label className={labelClass}>{en ? L.inicio : "¿Cómo fue el inicio?"}</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.onset} value={a.inicio} onChange={(inicio) => patch({ inicio })} displayOption={displayOption} />
      <label className={labelClass}>{en ? L.mecanismo : "¿Qué pudo provocarlo? (puedes marcar varias)"}</label>
      <MultiChipGroup options={GENERIC_FIELD_OPTIONS.mechanism} value={a.mecanismo} onChange={(mecanismo) => patch({ mecanismo })} displayOption={displayOption} />
      {a.mecanismo.includes("Otro") && (
        <>
          <label className={labelClass}>{en ? L.mecanismo_otro : "Describe el mecanismo"}</label>
          <textarea
            value={a.mecanismo_otro}
            onChange={(e) => patch({ mecanismo_otro: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </>
      )}
      <PainScale
        value={a.intensidad_dolor}
        onChange={(v) => patch({ intensidad_dolor: v })}
        label={en ? L.intensidad : "Intensidad del dolor"}
        locale={locale}
      />
      <label className={labelClass}>{en ? L.descripcion : "Detalles adicionales (opcional)"}</label>
      <textarea
        value={a.descripcion}
        onChange={(e) => patch({ descripcion: e.target.value })}
        rows={3}
        placeholder={en ? L.descripcion_ph : "Cualquier información que quieras añadir…"}
        className={textareaClass}
      />
    </div>
  );
}
