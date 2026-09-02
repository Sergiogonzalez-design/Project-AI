import {
  getReadaptExerciseById,
  getReadaptExercisesForRegion,
  resolveReadaptRegionFromText,
  READAPTATION_EXERCISES,
} from "./readaptation-exercise-catalog";
import {
  READAPT_PHASE_LABELS,
  type ReadaptRegion,
} from "./readaptation-types";

const READAPT_ID_RE = /\[id=([a-z0-9_]+)\]/i;

export type ConsultReadaptExerciseLink = {
  id: string;
  label: string;
  meta: string;
};

/** Parse `[id=readapt_xxx]` exercise lines from Physio replies. */
export function parseReadaptExerciseFromLine(
  line: string,
): ConsultReadaptExerciseLink | null {
  const match = READAPT_ID_RE.exec(line);
  if (!match) return null;
  const id = match[1].toLowerCase();
  const ex = getReadaptExerciseById(id);
  const withoutId = line.replace(READAPT_ID_RE, " ").replace(/\s+/g, " ").trim();
  const parts = withoutId
    .split("|")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let label = (parts[0] ?? ex?.nameEs ?? id)
    .replace(/^[-•*]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/[:\-–—]\s*$/, "")
    .trim();
  if (!label) label = ex?.nameEs ?? id;
  const meta = parts.slice(1).join(" · ").trim();
  return { id, label, meta };
}

export function lineHasReadaptExerciseId(line: string): boolean {
  return READAPT_ID_RE.test(line);
}

const READAPT_QUERY_RE =
  /readaptaci[oó]n|rehabilitaci[oó]n|ejercicio(s)?|rutina|estiramiento|movilidad|fortalecimiento|vuelta\s*(al|a)\s*(deporte|entreno|entrenamiento)|return\s*to\s*(sport|play|training)|\bRTS\b|\bRTP\b|prescripci[oó]n\s*de\s*ejercicio|plan\s*de\s*ejercicio|qu[eé]\s*ejercicios|what\s*exercises/i;

export function isReadaptationQuery(text: string): boolean {
  return READAPT_QUERY_RE.test(text.trim());
}

function catalogLinesForRegion(
  region: ReadaptRegion | "general",
  language: "es" | "en",
): string[] {
  const list =
    region === "general"
      ? [...READAPTATION_EXERCISES]
      : getReadaptExercisesForRegion(region);
  return list.map((ex) => {
    const phase =
      language === "en"
        ? READAPT_PHASE_LABELS[ex.phase].en
        : READAPT_PHASE_LABELS[ex.phase].es;
    const name = language === "en" ? ex.nameEn : ex.nameEs;
    const dose = language === "en" ? ex.dosageEn : ex.dosageEs;
    return `- [id=${ex.id}] ${name} | ${phase} | ${dose}`;
  });
}

/** Inject catalog + format rules when the user asks for exercises / readaptation. */
export function buildReadaptationPromptBlock(
  message: string,
  bodyArea = "",
  language: "es" | "en" = "es",
): string {
  const combined = `${message}\n${bodyArea}`.trim();
  if (!isReadaptationQuery(combined)) return "";

  const region = resolveReadaptRegionFromText(combined);
  const catalog = catalogLinesForRegion(region, language);

  if (language === "en") {
    return [
      "READAPTATION / EXERCISE PRESCRIPTION (CRITICAL — follow exactly):",
      "You are prescribing conservative, evidence-informed exercises — NOT diagnosing.",
      "Use language: «compatible with», «may be explored», «evidence is mixed/limited».",
      "Never invent Sn/Sp, percentages, or guaranteed outcomes.",
      "Pain rule: during/after exercise ≤ 3/10 and no increase in symptoms 24 h later; if not, regress.",
      "Phases: protection → progressive loading → functional → return to sport (only when criteria met).",
      "Do NOT prescribe hop/plyometric/RTS if PRIORIDAD ALTA, red flags, acute trauma unassessed, or neuro deficit.",
      "",
      "MANDATORY OUTPUT FORMAT:",
      "1–2 intro sentences (phase context, safety, not a diagnosis).",
      "Section title **Exercises** (or **Exercises — [region]**).",
      "ONE exercise per line, numbered:",
      "1. [id=exercise_id] Exercise name | Phase | Example dose (sets/reps/RPE/pain rule)",
      "Use ONLY ids from the catalog below when possible.",
      "Close with 1–2 sentences: reassess in 1–2 weeks; stop and seek care if worsening/red flags.",
      "",
      `Catalog (${region === "general" ? "general / mixed" : region}):`,
      ...catalog,
    ].join("\n");
  }

  return [
    "READAPTACIÓN / PRESCRIPCIÓN DE EJERCICIOS (CRÍTICO — cumple al pie de la letra):",
    "Prescribes ejercicios conservadores basados en evidencia — NO es diagnóstico.",
    "Lenguaje: «compatible con», «podría explorarse», «evidencia limitada/mixta».",
    "Nunca inventes Sn/Sp, porcentajes ni resultados garantizados.",
    "Regla de dolor: durante/después del ejercicio ≤ 3/10 y sin empeoramiento a las 24 h; si no, regresa.",
    "Fases: protección → carga progresiva → funcional → retorno al deporte (solo si cumple criterios).",
    "NO prescribas saltos/pliometría/RTS si PRIORIDAD ALTA, banderas rojas, trauma agudo no valorado o déficit neurológico.",
    "",
    "FORMATO OBLIGATORIO DE SALIDA:",
    "1–2 frases intro (contexto de fase, seguridad, no es diagnóstico).",
    "Título de sección **Ejercicios** (o **Ejercicios — [zona]**).",
    "UN ejercicio por línea, numerado:",
    "1. [id=exercise_id] Nombre del ejercicio | Fase | Dosis ejemplo (series/reps/RPE/regla de dolor)",
    "Usa SOLO ids del catálogo inferior cuando sea posible.",
    "Cierra con 1–2 frases: reevaluar en 1–2 semanas; parar y consultar si empeora/banderas rojas.",
    "",
    `Catálogo (${region === "general" ? "general / mixto" : region}):`,
    ...catalog,
  ].join("\n");
}
