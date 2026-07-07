"use client";

import {
  defaultGenericConsultaAnswers,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

type Props = {
  value: GenericConsultaAnswers;
  onChange: (v: GenericConsultaAnswers) => void;
};

export function ConsultaGenericFields({ value, onChange }: Props) {
  const a = value ?? defaultGenericConsultaAnswers();
  const patch = (p: Partial<GenericConsultaAnswers>) => onChange({ ...a, ...p });

  return (
    <div>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Cuestionario detallado disponible para hombro. Para otras zonas, responde estas preguntas básicas.
      </div>

      <h2 className="mb-4 text-base font-bold text-slate-800">Comprobación de urgencia</h2>
      <label className={labelClass}>¿Deformidad evidente?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_deformidad} onChange={(rf_deformidad) => patch({ rf_deformidad })} />
      <label className={labelClass}>¿Fiebre asociada?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_fiebre} onChange={(rf_fiebre) => patch({ rf_fiebre })} />
      <label className={labelClass}>¿Pérdida de sensibilidad?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_perdida_sensibilidad} onChange={(rf_perdida_sensibilidad) => patch({ rf_perdida_sensibilidad })} />

      <h2 className="mb-4 mt-2 text-base font-bold text-slate-800">Tu problema</h2>
      <label className={labelClass}>¿Cuánto tiempo llevas con esto?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.evolution} value={a.evolucion} onChange={(evolucion) => patch({ evolucion })} />
      <label className={labelClass}>¿Cómo fue el inicio?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.onset} value={a.inicio} onChange={(inicio) => patch({ inicio })} />
      <label className={labelClass}>¿Qué pudo provocarlo?</label>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.mechanism} value={a.mecanismo} onChange={(mecanismo) => patch({ mecanismo })} />
      {a.mecanismo === "Otro" && (
        <>
          <label className={labelClass}>Describe el mecanismo</label>
          <textarea
            value={a.mecanismo_otro}
            onChange={(e) => patch({ mecanismo_otro: e.target.value })}
            rows={2}
            className="mb-5 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm"
          />
        </>
      )}
      <label className={labelClass}>
        Intensidad del dolor: <span className="text-blue-600">{a.intensidad_dolor}/10</span>
      </label>
      <input
        type="range"
        min={1}
        max={10}
        value={a.intensidad_dolor}
        onChange={(e) => patch({ intensidad_dolor: Number(e.target.value) })}
        className="mb-5 w-full accent-blue-600"
      />
      <label className={labelClass}>Detalles adicionales (opcional)</label>
      <textarea
        value={a.descripcion}
        onChange={(e) => patch({ descripcion: e.target.value })}
        rows={3}
        placeholder="Cualquier información que quieras añadir…"
        className="mb-5 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm"
      />
    </div>
  );
}
