/**
 * Clinic equipment / materials a physiotherapist may have available.
 * UI temporarily hidden; AI context injection disabled via flag below.
 */

/** When false, physio_chat ignores clinic_equipment (no adaptation by material). */
export const PHYSIO_EQUIPMENT_AI_CONTEXT_ENABLED = false;

export type PhysioEquipmentOption = {
  id: string;
  label: string;
};

export type PhysioEquipmentCategory = {
  id: string;
  title: string;
  options: readonly PhysioEquipmentOption[];
};

export const PHYSIO_EQUIPMENT_CATEGORIES: readonly PhysioEquipmentCategory[] = [
  {
    id: "imaging_assessment",
    title: "Imagen y valoración",
    options: [
      { id: "diagnostic_ultrasound", label: "Ecógrafo (ultrasonido diagnóstico)" },
      { id: "xray_in_clinic", label: "Radiografía (RX) en la clínica" },
      { id: "mri_in_clinic", label: "Resonancia (RMN) en la clínica / centro" },
      { id: "pressure_platform", label: "Plataforma de presión / podoscopio" },
      { id: "dynamometer", label: "Dinamómetro" },
      { id: "algometer", label: "Algómetro" },
      { id: "goniometer", label: "Goniómetro / inclinómetro" },
    ],
  },
  {
    id: "electrotherapy",
    title: "Electroterapia y agentes físicos",
    options: [
      { id: "tens_ems", label: "TENS / electroestimulación" },
      { id: "therapeutic_ultrasound", label: "Ultrasonido terapéutico" },
      { id: "therapeutic_laser", label: "Láser terapéutico" },
      { id: "shockwave", label: "Ondas de choque (ESWT / EPTE)" },
      { id: "diathermy_rf", label: "Diatermia / radiofrecuencia" },
      { id: "magnetotherapy", label: "Magnetoterapia" },
      { id: "cryotherapy", label: "Crioterapia avanzada" },
      { id: "heat_pack", label: "Termoterapia (compresas, infrarrojos…)" },
    ],
  },
  {
    id: "exercise",
    title: "Ejercicio y rehabilitación",
    options: [
      { id: "resistance_bands", label: "Bandas elásticas / theraband" },
      { id: "free_weights", label: "Pesas libres / mancuernas" },
      { id: "gym_machines", label: "Máquinas de musculación" },
      { id: "stationary_bike", label: "Bicicleta estática" },
      { id: "treadmill", label: "Cinta de correr" },
      { id: "pilates_reformer", label: "Reformer / Pilates" },
      { id: "suspension_trx", label: "TRX / entrenamiento en suspensión" },
      { id: "balance_props", label: "Material de equilibrio / propiocepción" },
      { id: "parallel_bars", label: "Barras paralelas" },
      { id: "traction_table", label: "Camilla de tracción" },
      { id: "hydrotherapy", label: "Hidroterapia / piscina" },
    ],
  },
  {
    id: "procedures",
    title: "Técnicas y material fungible",
    options: [
      { id: "dry_needling", label: "Punción seca" },
      { id: "acupuncture", label: "Acupuntura" },
      { id: "kinesio_tape", label: "Vendaje neuromuscular (tape)" },
      { id: "functional_taping", label: "Vendaje funcional" },
      { id: "manual_basic", label: "Solo material básico (camilla + exploración manual)" },
    ],
  },
] as const;

export const ALL_PHYSIO_EQUIPMENT_OPTIONS: readonly PhysioEquipmentOption[] =
  PHYSIO_EQUIPMENT_CATEGORIES.flatMap((c) => [...c.options]);

const LABEL_BY_ID = new Map(
  ALL_PHYSIO_EQUIPMENT_OPTIONS.map((o) => [o.id, o.label] as const)
);

export function physioEquipmentLabel(id: string): string {
  return LABEL_BY_ID.get(id) ?? id;
}

export function formatPhysioEquipmentLabels(ids: string[] | null | undefined): string[] {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids.map(physioEquipmentLabel);
}

/** Text block injected into physio_chat so the AI knows clinic resources. */
export function buildPhysioEquipmentContext(profile: {
  display_name?: string | null;
  clinic_name?: string | null;
  clinic_equipment?: string[] | null;
  clinic_equipment_notes?: string | null;
} | null): string {
  if (!PHYSIO_EQUIPMENT_AI_CONTEXT_ENABLED || !profile) return "";
  const labels = formatPhysioEquipmentLabels(profile.clinic_equipment);
  const notes = profile.clinic_equipment_notes?.trim();
  if (!labels.length && !notes) return "";

  const lines = [
    profile.display_name ? `Fisioterapeuta: ${profile.display_name}` : "",
    profile.clinic_name ? `Clínica: ${profile.clinic_name}` : "",
    labels.length
      ? `Material / equipo DISPONIBLE en su consulta:\n${labels.map((l) => `- ${l}`).join("\n")}`
      : "",
    notes ? `Notas adicionales del fisioterapeuta sobre su material: ${notes}` : "",
    "",
    "REGLAS DE USO DEL MATERIAL (CRÍTICO):",
    "- Prioriza recomendaciones, pruebas y tratamientos que pueda hacer CON el material que tiene.",
    "- Si algo es clínicamente indicado pero NO está en la lista (p. ej. RX, RMN, ecógrafo, ondas de choque), recomiéndalo igual y dile explícitamente que derive o busque un centro donde hacerlo (p. ej. «Te recomendaría que el paciente se haga una radiografía; como no tienes RX en consulta, indícale un centro de imagen / urgencias / médico según el caso»).",
    "- No inventes que tiene un equipo que no figura en la lista.",
    "- Si solo tiene material básico, centra la consulta en exploración manual, razonamiento clínico y ejercicio con poco material; sigue recomendando derivaciones de imagen o técnicas especializadas cuando procedan.",
  ].filter((l) => l !== undefined);

  return [
    "Contexto de la consulta del fisioterapeuta (material disponible):",
    ...lines,
  ].join("\n");
}
