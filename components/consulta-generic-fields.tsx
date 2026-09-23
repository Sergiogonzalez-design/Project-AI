"use client";

import { ChipButton } from "@/components/ui/chip-button";
import {
  defaultGenericConsultaAnswers,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";
import { ALERTAS_LABEL, ALERTAS_NONE } from "@/lib/consulta-compact";
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
  zona: "Where does it hurt?",
  zona_ph: "For example: knee, back, ankle…",
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
        <ChipButton
          key={opt}
          selected={value === opt}
          onClick={() => onChange(opt)}
          label={displayOption ? displayOption(opt) : opt}
        />
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
    if (opt === ALERTAS_NONE || opt === "Ninguno") {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutNone = value.filter((v) => v !== ALERTAS_NONE && v !== "Ninguno");
    if (withoutNone.includes(opt)) onChange(withoutNone.filter((v) => v !== opt));
    else onChange([...withoutNone, opt]);
  };
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <ChipButton
          key={opt}
          selected={value.includes(opt)}
          onClick={() => toggle(opt)}
          label={displayOption ? displayOption(opt) : opt}
        />
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

      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{en ? L.problem : "Tu problema"}</h2>
      <div data-question-id="zona">
        <label className={labelClass}>{en ? L.zona : "¿Dónde te duele o te molesta?"}</label>
        <textarea
          value={a.zona}
          onChange={(e) => patch({ zona: e.target.value })}
          rows={2}
          placeholder={en ? L.zona_ph : "Por ejemplo: rodilla, espalda, tobillo…"}
          className={textareaClass}
        />
      </div>
      <div data-question-id="evolucion">
        <label className={labelClass}>{en ? L.evolucion : "¿Cuánto tiempo llevas con esto?"}</label>
        <ChipGroup options={GENERIC_FIELD_OPTIONS.evolution} value={a.evolucion} onChange={(evolucion) => patch({ evolucion })} displayOption={displayOption} />
      </div>
      <div data-question-id="mecanismo">
        <label className={labelClass}>{en ? L.mecanismo : "¿Qué pudo provocarlo? (puedes marcar varias)"}</label>
        <MultiChipGroup options={GENERIC_FIELD_OPTIONS.mechanism} value={a.mecanismo} onChange={(mecanismo) => patch({ mecanismo })} displayOption={displayOption} />
      </div>
      {a.mecanismo.includes("Otro") && (
        <div data-question-id="mecanismo_otro">
          <label className={labelClass}>{en ? L.mecanismo_otro : "Cuéntanos qué pasó o cómo empezó"}</label>
          <textarea
            value={a.mecanismo_otro}
            onChange={(e) => patch({ mecanismo_otro: e.target.value })}
            rows={2}
            className={textareaClass}
          />
        </div>
      )}
      <div data-question-id="alertas">
        <label className={labelClass}>
          {en ? "Any of these warning signs?" : ALERTAS_LABEL}
        </label>
        <MultiChipGroup
          options={[...GENERIC_FIELD_OPTIONS.alertas]}
          value={a.alertas}
          onChange={(alertas) => patch({ alertas })}
          displayOption={displayOption}
        />
      </div>
      <div data-question-id="descripcion">
        <label className={labelClass}>{en ? L.descripcion : "Detalles adicionales (opcional)"}</label>
        <textarea
          value={a.descripcion}
          onChange={(e) => patch({ descripcion: e.target.value })}
          rows={3}
          placeholder={en ? L.descripcion_ph : "Cualquier información que quieras añadir…"}
          className={textareaClass}
        />
      </div>
    </div>
  );
}
