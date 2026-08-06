import type { BodyPartId } from "./body-parts";

/**
 * Pain in the leg just below the knee / shin / calf — NOT the knee joint.
 * "Rodilla" here is only a landmark (e.g. "justo debajo de la rodilla").
 * Foot/plantar-only complaints are handled separately via resolveAnkleFootFocus.
 */
export function isBelowKneeOrLowerLeg(text: string): boolean {
  const t = text.trim();
  if (
    /debajo\s+(de\s+)?(la\s+)?rodilla|bajo\s+(la\s+)?rodilla|justo\s+debajo.{0,40}rodilla|por\s+debajo\s+de\s+(la\s+)?rodilla|below\s+(the\s+)?knee|under\s+(the\s+)?knee|just\s+below.{0,40}knee|beneath\s+(the\s+)?knee/i.test(
      t
    )
  ) {
    return true;
  }
  if (
    /espinilla|\bshin\b|tuberosidad\s*tibial|pierna\s*baja|lower\s*leg|pantorrilla|gemelo|\bcalf\b|aquiles|achilles|tibial\s*anterior/i.test(
      t
    )
  ) {
    return true;
  }
  // "me duele la pierna" without saying the knee joint itself (and not a foot-only complaint)
  if (
    /\bpierna\b/i.test(t) &&
    !/\b(rodilla|knee|menisco|cruzado|r[oó]tula|patella)\b/i.test(t) &&
    !isFootOrPlantarComplaint(t)
  ) {
    return true;
  }
  return false;
}

/** Sole / heel / foot (not shin/calf as the primary site). */
export function isFootOrPlantarComplaint(text: string): boolean {
  const t = text.trim();
  if (
    /planta(\s+del\s+pie)?|fascitis|arco\s+(del\s+pie|plantar)|sole\s+of|plantar\s+fascia|debajo\s+del\s+tal[oó]n|tal[oó]n\s+(del\s+pie)?|heel\b|metatars|antepi[eé]|mediopi[eé]|dedos?\s+del\s+pie|\btoes?\b/i.test(
      t
    )
  ) {
    return true;
  }
  // "me duele el pie / foot" without lower-leg landmarks
  if (
    /\b(pie|foot)\b/i.test(t) &&
    !/espinilla|\bshin\b|pantorrilla|gemelo|\bcalf\b|pierna\s+baja|tuberosidad\s*tibial|debajo\s+(de\s+)?(la\s+)?rodilla/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

export type AnkleFootFocus = "foot" | "ankle" | "lower_leg" | "mixed";

/** Sub-region inside ankle_foot so the questionnaire matches what the patient said. */
export function resolveAnkleFootFocus(text: string): AnkleFootFocus {
  const t = text.trim();
  const foot = isFootOrPlantarComplaint(t);
  const ankle =
    /tobillo|ankle|esguince\s+(de\s+)?tobillo/i.test(t) &&
    !/planta|fascitis|arco\s+plantar/i.test(t);
  const lower =
    /espinilla|\bshin\b|pantorrilla|gemelo|\bcalf\b|pierna\s+baja|lower\s+leg|tuberosidad\s*tibial|aquiles|achilles|debajo\s+(de\s+)?(la\s+)?rodilla|tibial\s*anterior|\bpierna\b/i.test(
      t
    ) && !foot;

  if (foot && !lower) return "foot";
  if (ankle && !foot && !lower) return "ankle";
  if (lower && !foot) return "lower_leg";
  if (foot && lower) return "mixed";
  if (/\b(pie|foot)\b/i.test(t)) return "foot";
  if (/\b(tobillo|ankle)\b/i.test(t)) return "ankle";
  if (/\bpierna\b/i.test(t)) return "lower_leg";
  return "mixed";
}

/** True knee-joint complaint (not "below the knee" landmark phrasing). */
export function isTrueKneeComplaint(text: string): boolean {
  if (isBelowKneeOrLowerLeg(text)) return false;
  return /rodilla|knee|menisco|cruzado|r[oó]tula|patella|ligamento\s*colateral|cuadr[ií]ceps|cu[aá]driceps|quad(?:riceps)?|muslo|isquiotibial|isquio|hamstring/i.test(
    text
  );
}

const KEYWORDS: Record<BodyPartId, RegExp[]> = {
  shoulder: [
    /hombro/i,
    /shoulder/i,
    /manguito/i,
    /rotador/i,
    /deltoides/i,
    /clav[ií]cula/i,
    /om[oó]plato/i,
    /articulaci[oó]n\s*ac/i,
    /elev(ar|o)\s+(el\s+)?brazo/i,
    /por encima de la cabeza/i,
    /pectoral/i,
    /p[eé]ctoral/i,
    /pecho/i,
    /chest/i,
  ],
  elbow: [
    /b[ií]ceps(?!\s*femoral)/i,
    /tr[ií]ceps(?!\s*sural)/i,
    /codo/i,
    /elbow/i,
    /epicond/i,
    /epicondilitis/i,
    /olecranon/i,
    /cubital/i,
    /antebrazo/i,
    /flexionar el codo/i,
    /estirar el codo/i,
  ],
  wrist_hand: [/mu[ñn]eca/i, /mano/i, /wrist/i, /hand/i],
  finger: [
    /dedo/i,
    /dedos/i,
    /finger/i,
    /pulgar/i,
    /índice/i,
    /indice/i,
    /anular/i,
    /meñique/i,
    /falange/i,
    /mallet/i,
    /dedo en resorte/i,
    /articulaci[oó]n del dedo/i,
  ],
  // Avoid bare "cabeza" alone — "por encima de la cabeza" is a shoulder movement phrase
  head: [
    /cefalea/i,
    /migra[nñ]a/i,
    /headache/i,
    /dolor\s+(?:de\s+)?(?:la\s+)?cabeza/i,
    /me\s+duele\s+(?:la\s+)?cabeza/i,
    /duele\s+(?:la\s+)?cabeza/i,
    /\bla\s+cabeza\b/i,
    /my\s+head\b/i,
    /head\s+pain/i,
  ],
  neck: [/cuello/i, /neck/i, /cervical/i],
  back: [/espalda/i, /lumbar/i, /dorsal/i, /back/i],
  hip: [/cadera/i, /hip/i, /ingle/i, /aductor/i, /adductor/i, /pubalgia/i],
  knee: [/rodilla/i, /knee/i, /menisco/i, /ligamento cruzado/i, /cuadr[ií]ceps/i, /cu[aá]driceps/i, /quad(?:riceps)?/i, /muslo/i, /isquiotibial/i, /isquio/i, /hamstring/i],
  ankle_foot: [
    /tobillo/i,
    /pie\b/i,
    /ankle/i,
    /foot/i,
    /fascia plantar/i,
    /planta/i,
    /plantar/i,
    /tal[oó]n/i,
    /heel/i,
    /gemelo/i,
    /pantorrilla/i,
    /calf/i,
    /aquiles/i,
    /achilles/i,
    /espinilla/i,
    /\bshin\b/i,
    /pierna/i,
    /lower\s*leg/i,
    /tuberosidad\s*tibial/i,
  ],
};

/** True head/headache complaint — not the shoulder phrase "por encima de la cabeza". */
export function isTrueHeadComplaint(text: string): boolean {
  const t = text.trim();
  if (
    /cefalea|migra[nñ]a|headache|dolor\s+(?:de\s+)?(?:la\s+)?cabeza|me\s+duele\s+(?:la\s+)?cabeza|duele\s+(?:la\s+)?cabeza|my\s+head\b|head\s+pain/i.test(
      t
    )
  ) {
    return true;
  }
  const withoutOverhead = t.replace(/por\s+encima\s+de\s+(?:la\s+)?cabeza/gi, " ");
  return /\bla\s+cabeza\b|\bcabeza\b/i.test(withoutOverhead);
}

/** Body parts mentioned in free text (may be empty), ordered by first mention. */
export function detectBodyPartsFromText(text: string): BodyPartId[] {
  // Foot/plantar first so we never treat "planta del pie" as a shin/calf case
  if (isFootOrPlantarComplaint(text) || isBelowKneeOrLowerLeg(text)) {
    // Still allow other zones named in the same message (e.g. shoulder + plantar pain)
    const also: BodyPartId[] = [];
    for (const [id, patterns] of Object.entries(KEYWORDS) as [BodyPartId, RegExp[]][]) {
      if (id === "ankle_foot" || id === "knee") continue;
      if (id === "head" && !isTrueHeadComplaint(text)) continue;
      if (patterns.some((p) => p.test(text))) also.push(id);
    }
    if (also.length === 0) return ["ankle_foot"];
    // Mention order across ankle_foot + others
    const all = ["ankle_foot" as BodyPartId, ...also];
    return sortPartsByFirstMention(text, all);
  }
  const found: BodyPartId[] = [];
  for (const [id, patterns] of Object.entries(KEYWORDS) as [BodyPartId, RegExp[]][]) {
    if (id === "head" && !isTrueHeadComplaint(text)) continue;
    if (patterns.some((p) => p.test(text))) found.push(id);
  }
  // If both knee and ankle_foot matched because of "rodilla" landmark noise, prefer knee only when truly knee
  if (found.includes("knee") && found.includes("ankle_foot") && !isTrueKneeComplaint(text)) {
    return sortPartsByFirstMention(
      text,
      found.filter((id) => id !== "knee")
    );
  }
  return sortPartsByFirstMention(text, found);
}

function sortPartsByFirstMention(text: string, parts: BodyPartId[]): BodyPartId[] {
  const scored = parts.map((id) => {
    let min = Number.POSITIVE_INFINITY;
    for (const p of KEYWORDS[id] ?? []) {
      const flags = p.flags.includes("g") ? p.flags : `${p.flags}g`;
      const re = new RegExp(p.source, flags);
      const m = re.exec(text);
      if (m?.index != null) min = Math.min(min, m.index);
    }
    return { id, min };
  });
  scored.sort((a, b) => a.min - b.min);
  return scored.map((s) => s.id);
}

/**
 * Which questionnaire to show.
 * Full adaptive UIs: shoulder, elbow, wrist_hand, finger, neck.
 * Other single regions still start a questionnaire (generic fields until dedicated UI exists).
 * When several zones are named, always pick the first mentioned (chat queues the rest).
 */
export function questionnaireForText(text: string): {
  part: BodyPartId | "generic";
  detected: BodyPartId[];
} {
  const detected = detectBodyPartsFromText(text);
  if (detected.length >= 1) {
    return { part: detected[0], detected };
  }
  if (/codo|elbow|epicond|b[ií]ceps(?!\s*femoral)|tr[ií]ceps(?!\s*sural)|popeye/i.test(text)) {
    return { part: "elbow", detected: ["elbow"] };
  }
  if (/cefalea|migra[nñ]a|headache|dolor\s+(?:de\s+)?(?:la\s+)?cabeza|me\s+duele\s+(?:la\s+)?cabeza|\bla\s+cabeza\b/i.test(text)) {
    return { part: "head", detected: ["head"] };
  }
  if (/cuello|cervical|neck/i.test(text)) {
    return { part: "neck", detected: ["neck"] };
  }
  if (/dedo|dedos|finger|pulgar|índice|indice|anular|meñique|falange/i.test(text)) {
    return { part: "finger", detected: ["finger"] };
  }
  if (/mu[ñn]eca|wrist|mano|hand/i.test(text)) {
    return { part: "wrist_hand", detected: ["wrist_hand"] };
  }
  if (/espalda|lumbar|dorsal/i.test(text)) {
    return { part: "back", detected: ["back"] };
  }
  if (/cadera|hip|ingle|aductor|adductor|pubalgia/i.test(text)) {
    return { part: "hip", detected: ["hip"] };
  }
  if (isFootOrPlantarComplaint(text) || isBelowKneeOrLowerLeg(text)) {
    return { part: "ankle_foot", detected: ["ankle_foot"] };
  }
  if (isTrueKneeComplaint(text)) {
    return { part: "knee", detected: ["knee"] };
  }
  if (/tobillo|pie\b|ankle|foot|fascitis|gemelo|pantorrilla|calf|aquiles|achilles|pierna|espinilla|shin/i.test(text)) {
    return { part: "ankle_foot", detected: ["ankle_foot"] };
  }
  if (/brazo|hombro|elev|lanzar|press|remo|pectoral|pecho|chest/i.test(text)) {
    return { part: "shoulder", detected: ["shoulder"] };
  }
  return { part: "generic", detected: [] };
}

/** Patient said pectoral/chest without naming the shoulder joint. */
export function isPectoralChestComplaint(text: string): boolean {
  const t = text.trim();
  if (!/pectoral|p[eé]ctoral|\bpecho\b|\bchest\b|press\s*banca|bench\s*press/i.test(t)) {
    return false;
  }
  // If they also named the shoulder joint, keep "hombro" as the primary label.
  if (/\bhombro\b|\bshoulder\b|manguito|rotador|deltoides|om[oó]plato/i.test(t)) {
    return false;
  }
  return true;
}

/**
 * Patient-facing zone name for intros, titles, AI bodyArea, and "next part" prompts.
 * Uses what they wrote (e.g. Pectoral) instead of internal questionnaire ids (shoulder).
 */
export function patientFacingPartLabel(
  part: BodyPartId | "generic",
  userText: string = "",
  locale: "es" | "en" = "es"
): string {
  const text = userText.trim();
  if (part === "shoulder" && isPectoralChestComplaint(text)) {
    return locale === "en" ? "Pectoral / chest" : "Pectoral";
  }
  if (part === "ankle_foot") {
    const focus = resolveAnkleFootFocus(text);
    if (locale === "en") {
      if (focus === "foot") return "Foot";
      if (focus === "ankle") return "Ankle";
      if (focus === "lower_leg") return "Lower leg";
      return "Ankle / foot / lower leg";
    }
    if (focus === "foot") return "Pie";
    if (focus === "ankle") return "Tobillo";
    if (focus === "lower_leg") return "Pierna baja";
    return "Tobillo / pie / pierna baja";
  }
  if (part === "hip") {
    const peri =
      /gl[uú]teo|isquio|aductor|adductor|hamstring|groin|ingle/i.test(text) &&
      !/\bcadera\b|\bhip\b/i.test(text);
    if (peri) {
      return locale === "en"
        ? "Buttock / hamstring / groin"
        : "Glúteo / isquiotibial / ingle";
    }
  }
  if (part === "generic") {
    return locale === "en" ? "General" : "Consulta general";
  }
  const es: Record<BodyPartId, string> = {
    shoulder: "Hombro",
    elbow: "Codo",
    wrist_hand: "Muñeca / mano",
    finger: "Dedos",
    head: "Cabeza",
    neck: "Cuello",
    back: "Espalda",
    hip: "Cadera",
    knee: "Rodilla",
    ankle_foot: "Tobillo / pie",
  };
  const en: Record<BodyPartId, string> = {
    shoulder: "Shoulder",
    elbow: "Elbow",
    wrist_hand: "Wrist / hand",
    finger: "Fingers",
    head: "Head",
    neck: "Neck",
    back: "Back",
    hip: "Hip",
    knee: "Knee",
    ankle_foot: "Ankle / foot",
  };
  return (locale === "en" ? en : es)[part] ?? (locale === "en" ? "Affected area" : "Zona afectada");
}

export function questionnaireIntroMessage(
  part: BodyPartId | "generic",
  locale: "es" | "en" = "es",
  userText: string = ""
): string {
  const text = userText.trim();
  const periHipSoftTissue =
    part === "hip" &&
    /gl[uú]teo|isquio|aductor|adductor|hamstring|groin|ingle/i.test(text) &&
    !/\bcadera\b|\bhip\b/i.test(text);

  const ankleFootFocus = part === "ankle_foot" ? resolveAnkleFootFocus(text) : null;
  const ankleFootZoneEs =
    ankleFootFocus === "foot"
      ? "tu pie"
      : ankleFootFocus === "ankle"
        ? "tu tobillo"
        : ankleFootFocus === "lower_leg"
          ? "tu pierna (debajo de la rodilla)"
          : "tu tobillo / pie / pierna baja";
  const ankleFootZoneEn =
    ankleFootFocus === "foot"
      ? "your foot"
      : ankleFootFocus === "ankle"
        ? "your ankle"
        : ankleFootFocus === "lower_leg"
          ? "your lower leg (below the knee)"
          : "your ankle / foot / lower leg";

  const shoulderZoneEs =
    isPectoralChestComplaint(text) ? "tu pectoral / pecho" : "tu hombro";
  const shoulderZoneEn =
    isPectoralChestComplaint(text) ? "your pectoral / chest" : "your shoulder";

  if (locale === "en") {
    const labels: Partial<Record<BodyPartId | "generic", string>> = {
      shoulder: shoulderZoneEn,
      elbow: "your elbow",
      wrist_hand: "your wrist/hand",
      finger: "your finger",
      head: "your head",
      neck: "your neck",
      back: "your back",
      hip: periHipSoftTissue
        ? "the area you described (buttock / hamstring / groin)"
        : "your hip / groin region",
      knee: "your knee",
      ankle_foot: ankleFootZoneEn,
      generic: "your complaint",
    };
    const zone = labels[part] ?? "your complaint";
    return `Thanks for sharing. To guide you better, I need to ask you some detailed questions about ${zone}. I'll only ask what's relevant based on your answers.`;
  }
  const labels: Partial<Record<BodyPartId | "generic", string>> = {
    shoulder: shoulderZoneEs,
    elbow: "tu codo",
    wrist_hand: "tu muñeca/mano",
    finger: "tu dedo",
    head: "tu cabeza",
    neck: "tu cuello",
    back: "tu espalda",
    hip: periHipSoftTissue
      ? "la zona que describes (glúteo / isquiotibial / ingle)"
      : "tu zona de glúteo, ingle o cadera",
    knee: "tu rodilla",
    ankle_foot: ankleFootZoneEs,
    generic: "tu molestia",
  };
  const zone = labels[part] ?? "tu molestia";
  return `Gracias por contarnos. Para orientarte mejor, necesito hacerte algunas preguntas detalladas sobre ${zone}. Solo te preguntaré lo relevante según tus respuestas.`;
}
