/** Shared types for Kinora readaptation / rehab exercise prescriptions. */

export type ReadaptPhase =
  | "protection"
  | "loading"
  | "functional"
  | "return_to_sport";

export type ReadaptRegion =
  | "shoulder"
  | "elbow"
  | "wrist_hand"
  | "cervical"
  | "thoracic"
  | "lumbar"
  | "hip"
  | "knee"
  | "ankle"
  | "foot"
  | "core"
  | "general";

export type ReadaptExercise = {
  id: string;
  nameEs: string;
  nameEn: string;
  region: ReadaptRegion;
  /** Typical phase when this exercise is first introduced */
  phase: ReadaptPhase;
  targetMuscles: string;
  equipment: string;
  /** Patient-facing how-to (2–4 sentences) */
  instructionsEs: string;
  instructionsEn: string;
  /** Example dosing — individualize */
  dosageEs: string;
  dosageEn: string;
  progressionEs: string;
  progressionEn: string;
  regressionEs: string;
  regressionEn: string;
  contraindicationsEs: string;
  contraindicationsEn: string;
  /** Qualitative evidence — never invent Sn/Sp */
  evidenceEs: string;
  evidenceEn: string;
  /** Substrings for matching AI text to catalog id */
  aliases: string[];
};

export const READAPT_PHASE_LABELS: Record<
  ReadaptPhase,
  { es: string; en: string }
> = {
  protection: { es: "Protección / analgesia", en: "Protection / pain relief" },
  loading: { es: "Carga progresiva", en: "Progressive loading" },
  functional: { es: "Funcional", en: "Functional" },
  return_to_sport: { es: "Retorno al deporte", en: "Return to sport" },
};
