"use client";

import {
  LATERALITY_OPTIONS,
  PAIN_PATTERN_OPTIONS,
  PROGRESSION_OPTIONS,
  SWELLING_SIGN_OPTIONS,
  TRIED_TREATMENT_OPTIONS,
  TRAINING_IMPACT_OPTIONS,
  WEIGHT_BEARING_OPTIONS,
  YES_NO,
  type ConsultaSymptomDetails,
} from "@/lib/consulta-symptoms";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

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

function MultiChipGroup({
  options,
  values,
  onChange,
}: {
  options: readonly string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    if (opt === "Ninguno") {
      onChange(values.includes("Ninguno") ? [] : ["Ninguno"]);
      return;
    }
    const withoutNone = values.filter((v) => v !== "Ninguno");
    onChange(
      withoutNone.includes(opt)
        ? withoutNone.filter((v) => v !== opt)
        : [...withoutNone, opt]
    );
  }

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            values.includes(opt)
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
  value: ConsultaSymptomDetails;
  onChange: (v: ConsultaSymptomDetails) => void;
};

export function ConsultaSymptomFields({ value, onChange }: Props) {
  function patch(partial: Partial<ConsultaSymptomDetails>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="border-t border-blue-100 pt-6 mt-2">
      <h2 className="mb-4 text-base font-bold text-slate-800">Detalles del dolor</h2>

      <label className={labelClass}>¿El dolor es constante o solo al moverte / entrenar?</label>
      <ChipGroup
        options={PAIN_PATTERN_OPTIONS}
        value={value.painPattern}
        onChange={(painPattern) => patch({ painPattern })}
      />

      <label className={labelClass}>¿Puedes apoyar peso o usar esa zona con normalidad?</label>
      <ChipGroup
        options={WEIGHT_BEARING_OPTIONS}
        value={value.weightBearing}
        onChange={(weightBearing) => patch({ weightBearing })}
      />

      <label className={labelClass}>¿Hay hinchazón, moretón o calor en la zona?</label>
      <MultiChipGroup
        options={SWELLING_SIGN_OPTIONS}
        values={value.swellingSigns}
        onChange={(swellingSigns) => patch({ swellingSigns })}
      />

      <label className={labelClass}>¿Notas hormigueo, entumecimiento o debilidad?</label>
      <ChipGroup
        options={YES_NO}
        value={value.nerveSymptoms}
        onChange={(nerveSymptoms) =>
          patch({
            nerveSymptoms,
            nerveSymptomsDetail: nerveSymptoms === "No" ? "" : value.nerveSymptomsDetail,
          })
        }
      />
      {value.nerveSymptoms === "Sí" && (
        <input
          type="text"
          value={value.nerveSymptomsDetail}
          onChange={(e) => patch({ nerveSymptomsDetail: e.target.value })}
          placeholder="Describe dónde y qué notas"
          className={`${inputClass} mb-5`}
        />
      )}

      <label className={labelClass}>¿El dolor empeora por la noche o al estar en reposo?</label>
      <ChipGroup
        options={YES_NO}
        value={value.nightPain}
        onChange={(nightPain) => patch({ nightPain })}
      />

      <label className={labelClass}>¿Has tenido este mismo dolor antes en esa zona?</label>
      <ChipGroup
        options={YES_NO}
        value={value.previousSamePain}
        onChange={(previousSamePain) =>
          patch({
            previousSamePain,
            previousSamePainDetail:
              previousSamePain === "No" ? "" : value.previousSamePainDetail,
          })
        }
      />
      {value.previousSamePain === "Sí" && (
        <input
          type="text"
          value={value.previousSamePainDetail}
          onChange={(e) => patch({ previousSamePainDetail: e.target.value })}
          placeholder="Cuándo aproximadamente (opcional)"
          className={`${inputClass} mb-5`}
        />
      )}

      <label className={labelClass}>¿Qué movimiento o actividad lo empeora más?</label>
      <input
        type="text"
        value={value.aggravatingMovement}
        onChange={(e) => patch({ aggravatingMovement: e.target.value })}
        placeholder="Ej: al correr, al girar, al levantar el brazo…"
        className={`${inputClass} mb-5`}
      />

      <label className={labelClass}>¿Qué has hecho ya?</label>
      <MultiChipGroup
        options={TRIED_TREATMENT_OPTIONS}
        values={value.triedTreatments}
        onChange={(triedTreatments) => patch({ triedTreatments })}
      />

      <label className={labelClass}>¿Ha ido a más, se mantiene igual o empeora?</label>
      <ChipGroup
        options={PROGRESSION_OPTIONS}
        value={value.progression}
        onChange={(progression) => patch({ progression })}
      />

      <label className={labelClass}>¿Te impide entrenar o competir?</label>
      <ChipGroup
        options={TRAINING_IMPACT_OPTIONS}
        value={value.trainingImpact}
        onChange={(trainingImpact) => patch({ trainingImpact })}
      />

      <label className={labelClass}>¿Dolor en un solo lado o ambos?</label>
      <ChipGroup
        options={LATERALITY_OPTIONS}
        value={value.laterality}
        onChange={(laterality) => patch({ laterality })}
      />

      <label className={labelClass}>¿Escuchaste un chasquido o crack en el momento?</label>
      <ChipGroup
        options={YES_NO}
        value={value.heardPop}
        onChange={(heardPop) => patch({ heardPop })}
      />

      <label className={labelClass}>¿La zona se bloquea o se traba?</label>
      <ChipGroup
        options={YES_NO}
        value={value.jointLocking}
        onChange={(jointLocking) => patch({ jointLocking })}
      />

      <label className={labelClass}>¿El dolor se irradia a otra zona?</label>
      <ChipGroup
        options={YES_NO}
        value={value.radiatingPain}
        onChange={(radiatingPain) =>
          patch({
            radiatingPain,
            radiatingPainDetail: radiatingPain === "No" ? "" : value.radiatingPainDetail,
          })
        }
      />
      {value.radiatingPain === "Sí" && (
        <input
          type="text"
          value={value.radiatingPainDetail}
          onChange={(e) => patch({ radiatingPainDetail: e.target.value })}
          placeholder="Hacia dónde se irradia"
          className={`${inputClass} mb-5`}
        />
      )}

      <h2 className="mb-4 mt-2 text-base font-bold text-slate-800">Signos de alarma</h2>

      <label className={labelClass}>¿Fiebre, malestar general o pérdida de peso reciente?</label>
      <ChipGroup
        options={YES_NO}
        value={value.systemicSymptoms}
        onChange={(systemicSymptoms) => patch({ systemicSymptoms })}
      />

      <label className={labelClass}>¿Deformidad visible o incapacidad total para mover la zona?</label>
      <ChipGroup
        options={YES_NO}
        value={value.deformity}
        onChange={(deformity) => patch({ deformity })}
      />

      <label className={labelClass}>¿Dolor tras un golpe fuerte o caída desde altura?</label>
      <ChipGroup
        options={YES_NO}
        value={value.severeTrauma}
        onChange={(severeTrauma) => patch({ severeTrauma })}
      />
    </div>
  );
}
