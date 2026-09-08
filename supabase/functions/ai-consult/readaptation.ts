import catalog from "./readaptation-catalog.json" with { type: "json" };

type CompactEx = {
  id: string;
  nameEs: string;
  nameEn: string;
  region: string;
  phase: string;
  dosageEs: string;
  dosageEn: string;
};

const EXERCISES = catalog as CompactEx[];

const READAPT_QUERY_RE =
  /readaptaci[oó]n|rehabilitaci[oó]n|ejercicio(s)?|rutina|estiramiento|movilidad|fortalecimiento|vuelta\s*(al|a)\s*(deporte|entreno|entrenamiento)|return\s*to\s*(sport|play|training)|\bRTS\b|\bRTP\b|prescripci[oó]n\s*de\s*ejercicio|plan\s*de\s*ejercicio|qu[eé]\s*ejercicios|what\s*exercises/i;

const REGION_KEYWORDS: { region: string; patterns: RegExp[] }[] = [
  {
    region: "shoulder",
    patterns: [/hombro|manguito|rotador|deltoides|RCRSP/i],
  },
  { region: "elbow", patterns: [/codo|epicondil|epitrocle/i] },
  {
    region: "wrist_hand",
    patterns: [/muñeca|mano|dedo|tendón gliding|median/i],
  },
  {
    region: "cervical",
    patterns: [/cuello|cervical|nuca|whiplash/i],
  },
  {
    region: "lumbar",
    patterns: [/lumbar|espalda baja|ciática|lumbago|ciatica/i],
  },
  { region: "hip", patterns: [/cadera|ingle|glúteo|gluteo|trocant/i] },
  {
    region: "knee",
    patterns: [/rodilla|rotulian|patelar|cuádriceps|cuadriceps|menisco|acl|lca|pfps/i],
  },
  {
    region: "ankle",
    patterns: [/tobillo|esguince.*tobillo|peroneo|talocrural/i],
  },
  {
    region: "foot",
    patterns: [/pie|planta|fascia plantar|metatar|calzado|windlass/i],
  },
  {
    region: "core",
    patterns: [/core|abdominal|transverso|diafragma|estabilización lumbar/i],
  },
];

const PHASE_LABELS: Record<string, { es: string; en: string }> = {
  protection: { es: "Protección / analgesia", en: "Protection / pain relief" },
  loading: { es: "Carga progresiva", en: "Progressive loading" },
  functional: { es: "Funcional", en: "Functional" },
  return_to_sport: { es: "Retorno al deporte", en: "Return to sport" },
};

export function isReadaptationQuery(text: string): boolean {
  return READAPT_QUERY_RE.test(text.trim());
}

export function resolveReadaptRegionFromText(text: string): string {
  const normalized = text.trim();
  if (!normalized) return "general";
  for (const { region, patterns } of REGION_KEYWORDS) {
    if (patterns.some((re) => re.test(normalized))) return region;
  }
  return "general";
}

function catalogLines(region: string, language: "es" | "en"): string[] {
  const list =
    region === "general"
      ? EXERCISES
      : EXERCISES.filter((ex) => ex.region === region);
  return list.map((ex) => {
    const phase = PHASE_LABELS[ex.phase]?.[language === "en" ? "en" : "es"] ?? ex.phase;
    const name = language === "en" ? ex.nameEn : ex.nameEs;
    const dose = language === "en" ? ex.dosageEn : ex.dosageEs;
    return `- [id=${ex.id}] ${name} | ${phase} | ${dose}`;
  });
}

export function buildReadaptationPromptBlock(
  message: string,
  bodyArea = "",
  language: "es" | "en" = "es",
): string {
  const combined = `${message}\n${bodyArea}`.trim();
  if (!isReadaptationQuery(combined)) return "";

  const region = resolveReadaptRegionFromText(combined);
  const catalog = catalogLines(region, language);

  if (language === "en") {
    return [
      "READAPTATION / EXERCISE PRESCRIPTION (CRITICAL — follow exactly):",
      "Prescribe conservative, evidence-informed exercises — NOT a diagnosis.",
      "Use: «compatible with», «may be explored», «evidence is mixed/limited».",
      "Never invent Sn/Sp or guaranteed outcomes.",
      "Pain rule: during/after ≤ 3/10; no worsening at 24 h or regress.",
      "Do NOT prescribe hop/RTS if PRIORIDAD ALTA, red flags, or acute unassessed trauma.",
      "",
      "OUTPUT: intro → **Exercises** → numbered lines:",
      "1. [id=exercise_id] Name | Phase | Dose",
      "Use ONLY ids from catalog below.",
      "",
      `Catalog (${region}):`,
      ...catalog,
    ].join("\n");
  }

  return [
    "READAPTACIÓN / PRESCRIPCIÓN DE EJERCICIOS (CRÍTICO):",
    "Ejercicios conservadores basados en evidencia — NO es diagnóstico.",
    "Lenguaje: «compatible con», «podría explorarse», «evidencia limitada/mixta».",
    "Nunca inventes Sn/Sp ni resultados garantizados.",
    "Dolor durante/después ≤ 3/10; sin empeoramiento a 24 h o regresa.",
    "NO saltos/RTS si PRIORIDAD ALTA, banderas rojas o trauma agudo no valorado.",
    "",
    "SALIDA: intro → **Ejercicios** → líneas numeradas:",
    "1. [id=exercise_id] Nombre | Fase | Dosis",
    "Usa SOLO ids del catálogo inferior.",
    "",
    `Catálogo (${region}):`,
    ...catalog,
  ].join("\n");
}

export const AI_READAPTATION_RULES = `READAPTACIÓN Y EJERCICIOS — PHYSIOGUIDE (cuando piden ejercicios, rutina, movilidad, readaptación o retorno al deporte):

ROL: prescripción orientativa basada en evidencia; no diagnóstico ni entrenador personal.
FASES: protección → carga progresiva → funcional → retorno al deporte (criterios clínicos + carga tolerada).
DOLOR: ≤ 3/10 durante/después; sin empeoramiento 24 h; si no, regresión.
PROHIBIDO: PRIORIDAD ALTA, banderas rojas, fractura/luxación sospechada, déficit neurológico → NO programa; derivación.
FORMATO: **Ejercicios**; una línea por ejercicio: 1. [id=xxx] Nombre | Fase | Dosis (ids del catálogo Kinora).
EVIDENCIA: tendinopatía → carga progresiva (Alfredson/Rio themes); hombro → control escapular + RE (JOSPT); lumbar estable → movimiento gradual (McGill themes, evidencia mixta); rodilla anterior → cuádriceps/glúteo (JOSPT CPG); esguince → movilidad temprana (Cochrane ankle).
SEGUIMIENTO: reevaluar 1–2 semanas; si no mejora → imagen/fisio/reexplorar hipótesis.`;
