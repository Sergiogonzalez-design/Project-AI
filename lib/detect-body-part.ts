import type { BodyPartId } from "@/lib/body-parts";

/**
 * Remove body-part words that only describe a workout/session
 * (e.g. "entreno de pierna", "día de pecho", "leg day") — not the injured site.
 */
export function stripTrainingBodyPartContext(text: string): string {
  return text
    .replace(
      /\b(?:entrenos?|entrenamientos?|ejercicios?|sesiones?|rutinas?|d[ií]as?|workouts?|training)\s+(?:de\s+(?:la\s+|las\s+|el\s+|los\s+)?)?(?:piernas?|legs?|espalda|backs?|pechos?|chests?|hombros?|shoulders?|brazos?|arms?|core|gl[uú]teos?|glutes?|cuadr[ií]ceps|isquios?|push|pull|full\s*body)\b/gi,
      " "
    )
    .replace(
      /\b(?:haciendo|hacer|hice|hecho)\s+(?:un\s+|el\s+|entreno\s+|entrenamiento\s+|ejercicio\s+|workout\s+)?(?:de\s+)?(?:piernas?|legs?|espalda|backs?|pechos?|chests?|hombros?|shoulders?|brazos?|arms?)\b/gi,
      " "
    )
    .replace(
      /\b(?:entren(?:ar|ando|é|e)|entreno)\s+(?:la\s+|las\s+|el\s+|los\s+)?(?:piernas?|legs?|espalda|backs?|pechos?|chests?|hombros?|shoulders?|brazos?|arms?)\b/gi,
      " "
    )
    .replace(/\b(?:leg|chest|back|arm|shoulder|push|pull)\s*days?\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Body-part aliases used to spot “pain/molestia in X” phrasing. */
const COMPLAINT_PART_ALIASES: Partial<Record<BodyPartId, string[]>> = {
  back: ["espalda", "lumbar", "dorsal", "lumbago", "ci[aá]tica", "\\bback\\b"],
  neck: ["cuello", "cervical", "\\bneck\\b"],
  shoulder: ["hombro", "hombros", "shoulder", "manguito", "pectoral", "p[eé]ctoral", "\\bpecho\\b", "\\bchest\\b"],
  elbow: ["codo", "codos", "elbow", "antebrazo", "b[ií]ceps(?!\\s*femoral)", "tr[ií]ceps(?!\\s*sural)"],
  wrist_hand: ["mu[ñn]eca", "\\bmano\\b", "\\bmanos\\b", "\\bwrist\\b", "\\bhand\\b"],
  finger: ["dedos?", "finger", "pulgar"],
  head: ["cabeza", "cefalea", "migra[nñ]a", "headache", "\\bhead\\b"],
  hip: ["cadera", "\\bhip\\b", "ingle", "gl[uú]teo", "muslo\\s*interno"],
  knee: ["rodilla", "\\bknee\\b", "menisco", "r[oó]tula"],
  ankle_foot: [
    "piernas?",
    "\\blegs?\\b",
    "tobillo",
    "\\bankle\\b",
    "\\bpie\\b",
    "\\bfoot\\b",
    "espinilla",
    "\\bshin\\b",
    "pantorrilla",
    "gemelo",
    "\\bcalf\\b",
    "aquiles",
    "tal[oó]n",
    "muslo",
    "thigh",
    "isquio",
    "hamstring",
    "cuadr[ií]ceps",
  ],
};

/**
 * Parts explicitly tied to a symptom phrase (dolor/molestia/duele en…).
 * Ignores “entreno de pierna”-style activity mentions.
 */
export function detectComplaintLinkedBodyParts(text: string): BodyPartId[] {
  const t = text.trim();
  if (!t) return [];
  const scored: { id: BodyPartId; index: number }[] = [];

  for (const [id, aliases] of Object.entries(COMPLAINT_PART_ALIASES) as [
    BodyPartId,
    string[],
  ][]) {
    for (const alias of aliases) {
      const re = new RegExp(
        String.raw`(?:` +
          String.raw`(?:molestia|dolor|lesi[oó]n|pinchazo|tir[oó]n|contractura|rigidez|hinchaz[oó]n|inflamaci[oó]n|discomfort|pain|soreness)\s+(?:en|de|con|al)?\s*(?:la|el|mi|mis|una|un)?\s*${alias}` +
          String.raw`|` +
          String.raw`(?:me\s+)?(?:duele|molest[ao]|ha\s+dolido|doli[oó]|noto|notado|siento|tengo)\s+(?:una?\s+)?(?:molestia|dolor)?\s*(?:en|de|con)?\s*(?:la|el|mi|mis)?\s*${alias}` +
          String.raw`|` +
          String.raw`${alias}\s+(?:me\s+)?(?:duele|molest[ao]|dolorid[oa]|hurt|hurts)` +
          String.raw`)`,
        "i"
      );
      const m = re.exec(t);
      if (m?.index != null) {
        scored.push({ id, index: m.index });
        break;
      }
    }
  }

  scored.sort((a, b) => a.index - b.index);
  const out: BodyPartId[] = [];
  for (const s of scored) {
    if (!out.includes(s.id)) out.push(s.id);
  }
  return out;
}

/**
 * Vague "pierna" / "leg" with no clear sub-region (thigh, knee, shin, calf, ankle, foot).
 * Must NOT be treated as "below the knee" — ask where on the whole leg it hurts.
 * "entreno de pierna" alone is NOT a leg complaint.
 */
export function isVagueLegComplaint(text: string): boolean {
  const t = stripTrainingBodyPartContext(text.trim());
  if (!/\bpierna\b|\bleg\b/i.test(t)) return false;
  // Already named a specific sub-region
  if (
    /rodilla|knee|menisco|cruzado|r[oó]tula|patella|muslo|thigh|cuadr[ií]ceps|cu[aá]driceps|isquio|hamstring|espinilla|\bshin\b|pantorrilla|gemelo|\bcalf\b|aquiles|achilles|tobillo|ankle|pie\b|foot|fascitis|plantar|tal[oó]n|heel|pierna\s*baja|lower\s*leg|debajo\s+(de\s+)?(la\s+)?rodilla|below\s+(the\s+)?knee|tuberosidad\s*tibial|ingle|groin|cadera|\bhip\b/i.test(
      t
    )
  ) {
    return false;
  }
  // If another zone is the clear complaint site, pierna leftover is not the injury
  const linked = detectComplaintLinkedBodyParts(text);
  if (linked.length > 0 && !linked.includes("ankle_foot") && !linked.includes("knee")) {
    return false;
  }
  return true;
}

/**
 * Vague "brazo" / "arm" with no clear sub-region (shoulder, upper arm, elbow, forearm, wrist, hand).
 * Must NOT assume elbow or shoulder — ask where on the arm it hurts first.
 */
export function isVagueArmComplaint(text: string): boolean {
  const t = stripTrainingBodyPartContext(text.trim());
  if (!/\bbrazos?\b|\barms?\b/i.test(t)) return false;
  if (/\bantebrazo\b|\bforearm\b/i.test(t)) return false;
  // Already named a specific sub-region, structure, or clear shoulder movement cue
  if (
    /hombro|shoulder|manguito|rotador|deltoides|clav[ií]cula|om[oó]plato|codo|elbow|epicond|olecranon|cubital|mu[ñn]eca|wrist|\bmanos?\b|\bhands?\b|dedos?|finger|pulgar|b[ií]ceps(?!\s*femoral)|tr[ií]ceps(?!\s*sural)|popeye|pectoral|p[eé]ctoral|\bpecho\b|\bchest\b|parte\s+alta\s+del\s+brazo|parte\s+baja\s+del\s+brazo|cerca\s+del\s+hombro|cerca\s+del\s+codo|upper\s+arm|lower\s+arm|elev(ar|o|ando)\s+(el\s+)?brazo|por\s+encima\s+de\s+la\s+cabeza|overhead|lanzar|press\s*banca|bench\s*press/i.test(
      t
    )
  ) {
    return false;
  }
  const linked = detectComplaintLinkedBodyParts(text);
  if (
    linked.length > 0 &&
    !linked.includes("shoulder") &&
    !linked.includes("elbow") &&
    !linked.includes("wrist_hand") &&
    !linked.includes("finger")
  ) {
    return false;
  }
  return true;
}

/** Canned clarify prompt when the patient only said "brazo" / "arm". */
export function vagueArmClarifyMessage(locale: "es" | "en" = "es"): string {
  if (locale === "en") {
    return `Thanks for telling us. “Arm” is a wide area — it could be the **shoulder**, the **upper arm**, the **elbow**, the **forearm**, the **wrist** or the **hand**.

Where exactly does it hurt the most? Reply with the most specific place you can (for example: shoulder, elbow, forearm, wrist…). Then I’ll ask the right questions for that zone.`;
  }
  return `Gracias por contarnos. “Brazo” es una zona amplia: puede ser el **hombro**, la **parte alta del brazo**, el **codo**, el **antebrazo**, la **muñeca** o la **mano**.

¿Dónde te duele exactamente con más intensidad? Responde con la zona más concreta que puedas (por ejemplo: hombro, codo, antebrazo, muñeca…). Así te haré las preguntas adecuadas para esa zona.`;
}

/** Patient said something hurts but did not name a body region. */
export function vagueInjuryLocationMessage(locale: "es" | "en" = "es"): string {
  if (locale === "en") {
    return `Thanks for telling us. To prepare the report for your physiotherapist I need to know **where** it hurts.

Is it the neck, back, shoulder, elbow, wrist/hand, hip, thigh, knee, lower leg, ankle or foot? Reply with the most specific place you can. Then I will ask the right questions for that area.`;
  }
  return `Gracias por contarnos. Para preparar el informe de tu fisioterapeuta necesito saber **dónde** te duele.

¿Es el cuello, la espalda, el hombro, el codo, la muñeca/mano, la cadera, el muslo, la rodilla, la pierna baja, el tobillo o el pie? Responde con la zona más concreta que puedas. Así te haré las preguntas adecuadas para esa zona.`;
}

/** Brief steer when they ask how Fisioterapia works instead of describing the injury. */
export function fisioSteerToComplaintMessage(locale: "es" | "en" = "es"): string {
  if (locale === "en") {
    return `This chat is only to prepare a clinical report for your physiotherapist before the appointment.

Tell me what hurts (where, when it started and how it affects you). I will then ask a questionnaire for that area so the report can be generated. For other questions, use the Consulta tab.`;
  }
  return `Este chat sirve solo para preparar un informe clínico para tu fisioterapeuta antes de la cita.

Cuéntame qué te molesta (dónde, desde cuándo y cómo te afecta). Después te haré un cuestionario de esa zona para poder generar el informe. Para otras dudas, usa la pestaña Consulta.`;
}

/**
 * Pain in the leg just below the knee / shin / calf — NOT the knee joint.
 * "Rodilla" here is only a landmark (e.g. "justo debajo de la rodilla").
 * Bare "pierna" alone is NOT enough — that is handled via isVagueLegComplaint.
 * Foot/plantar-only complaints are handled separately via resolveAnkleFootFocus.
 */
export function isBelowKneeOrLowerLeg(text: string): boolean {
  const t = text.trim();
  if (isVagueLegComplaint(t)) return false;
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

export type AnkleFootFocus = "foot" | "ankle" | "lower_leg" | "leg" | "thigh" | "mixed";

/** Inner thigh / adductors — hip questionnaire, not knee or generic muslo. */
export function isInnerThighOrAdductorComplaint(text: string): boolean {
  return /muslo\s*interno|inner\s*thigh|\baductores?\b|\badductors?\b/i.test(text);
}

/**
 * Thigh / hamstring / quadriceps named as the painful site.
 * Must NOT be treated as the knee joint ("rodilla").
 * "muslo interno" alone is hip/adductor, not this.
 */
export function isThighOrHamstringComplaint(text: string): boolean {
  const t = text.trim();
  if (
    isInnerThighOrAdductorComplaint(t) &&
    !/isquiotibial|\bisquios?\b|hamstring|cuadr[ií]ceps|muslo\s*(anterior|posterior)|parte\s+de\s+atr[aá]s/i.test(
      t
    )
  ) {
    const withoutInner = t.replace(/muslo\s*interno|inner\s*thigh/gi, " ");
    if (!/\bmuslos?\b|\bthighs?\b/i.test(withoutInner)) return false;
  }
  return /isquiotibial|\bisquios?\b|hamstring|\bmuslos?\b|\bthighs?\b|cuadr[ií]ceps|cu[aá]driceps|\bquads?\b|\bquadriceps\b|recto\s*femoral/i.test(
    t
  );
}

function thighHasLowerLegOrFoot(text: string): boolean {
  return /espinilla|\bshin\b|pantorrilla|gemelo|\bcalf\b|tobillo|ankle|aquiles|achilles|fascitis|plantar|tal[oó]n|heel|tuberosidad/i.test(
    text
  );
}

/** Patient-facing name when the complaint is muslo / isquio / cuádriceps. */
export function thighFacingLabel(
  text: string,
  locale: "es" | "en" = "es"
): string {
  const ham = /isquiotibial|\bisquios?\b|hamstring/i.test(text);
  const quad = /cuadr[ií]ceps|cu[aá]driceps|\bquads?\b|\bquadriceps\b/i.test(text);
  const muslo = /\bmuslos?\b|\bthighs?\b/i.test(text);
  if (locale === "en") {
    if (ham && muslo) return "Hamstring and thigh";
    if (ham && quad) return "Hamstring and quadriceps";
    if (ham) return "Hamstrings";
    if (quad) return "Quadriceps / thigh";
    return "Thigh";
  }
  if (ham && muslo) return "Isquio y muslo";
  if (ham && quad) return "Isquio y cuádriceps";
  if (ham) return "Isquiotibiales";
  if (quad) return "Cuádriceps / muslo";
  return "Muslo";
}

function thighIntroZone(text: string, locale: "es" | "en"): string {
  const label = thighFacingLabel(text, locale);
  if (locale === "en") return `your ${label.toLowerCase()}`;
  if (label === "Isquio y muslo") return "tu isquio y tu muslo";
  if (label === "Isquio y cuádriceps") return "tu isquio y tu cuádriceps";
  if (label === "Isquiotibiales") return "tus isquiotibiales";
  if (label === "Cuádriceps / muslo") return "tu cuádriceps / muslo";
  return "tu muslo";
}

/** Sub-region inside ankle_foot so the questionnaire matches what the patient said. */
export function resolveAnkleFootFocus(text: string): AnkleFootFocus {
  const t = text.trim();
  // Vague "pierna" → whole-leg location question (do NOT assume below knee)
  if (isVagueLegComplaint(t)) return "leg";
  // Named muslo / isquio / cuádriceps — not the knee, not "pierna baja"
  if (isThighOrHamstringComplaint(t) && !thighHasLowerLegOrFoot(t)) return "thigh";

  const foot = isFootOrPlantarComplaint(t);
  const ankle =
    /tobillo|ankle|esguince\s+(de\s+)?tobillo/i.test(t) &&
    !/planta|fascitis|arco\s+plantar/i.test(t);
  const lower =
    /espinilla|\bshin\b|pantorrilla|gemelo|\bcalf\b|pierna\s+baja|lower\s+leg|tuberosidad\s*tibial|aquiles|achilles|debajo\s+(de\s+)?(la\s+)?rodilla|tibial\s*anterior/i.test(
      t
    ) && !foot;

  if (foot && !lower) return "foot";
  if (ankle && !foot && !lower) return "ankle";
  if (lower && !foot) return "lower_leg";
  if (foot && lower) return "mixed";
  if (/\b(pie|foot)\b/i.test(t)) return "foot";
  if (/\b(tobillo|ankle)\b/i.test(t)) return "ankle";
  if (/\bpierna\b|\bleg\b/i.test(t)) return "leg";
  return "mixed";
}

/** "Rodilla" used only as a landmark (near/below the knee), not as the painful joint. */
export function isKneeUsedOnlyAsLandmark(text: string): boolean {
  const t = text.trim();
  if (!/\brodilla\b|\bknee\b/i.test(t)) return false;
  if (hasKneeAsPainSite(t)) return false;
  return /(?:debajo|bajo|cerca|al\s+lado|alrededor|por\s+debajo|por\s+encima|justo\s+debajo)\s+(de\s+)?(la\s+)?rodilla|below\s+(the\s+)?knee|near\s+(the\s+)?knee|under\s+(the\s+)?knee|around\s+(the\s+)?knee/i.test(
    t
  );
}

/** Pain/injury language attached to the knee joint itself. */
export function hasKneeAsPainSite(text: string): boolean {
  return /(?:duele|dolor|molestia|hinchaz|inflam|lesi[oó]n|pinchazo|tir[oó]n).{0,28}rodilla|rodilla.{0,28}(?:duele|dolor|molest|hinchaz)|menisco|ligamento\s*cruzado|r[oó]tula|patella|(?:hurt|pain|sore|swell).{0,24}knee|knee.{0,24}(?:hurt|pain|sore|swell)/i.test(
    text
  );
}

export function hasExplicitAnkleOrFootSite(text: string): boolean {
  return /\b(tobillos?|ankles?|pies?|feet|foot)\b/i.test(text) ||
    /esguince\s+(de\s+)?tobillo|fascitis|planta(\s+del\s+pie)?|tal[oó]n|aquiles|achilles/i.test(
      text
    );
}

/** True knee-joint complaint (not "below/near the knee" landmark phrasing). */
export function isTrueKneeComplaint(text: string): boolean {
  if (isBelowKneeOrLowerLeg(text) || isKneeUsedOnlyAsLandmark(text)) return false;
  if (hasExplicitAnkleOrFootSite(text) && !hasKneeAsPainSite(text)) return false;
  if (isThighOrHamstringComplaint(text) && !hasKneeAsPainSite(text)) return false;
  return /rodilla|knee|menisco|cruzado|r[oó]tula|patella|ligamento\s*colateral/i.test(
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
    /parte\s+alta\s+del\s+brazo/i,
    /cerca\s+del\s+hombro/i,
    /upper\s+arm/i,
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
    /parte\s+baja\s+del\s+brazo/i,
    /cerca\s+del\s+codo/i,
    /flexionar el codo/i,
    /estirar el codo/i,
  ],
  wrist_hand: [/\bmu[ñn]ecas?\b/i, /\bmanos?\b/i, /\bwrists?\b/i, /\bhands?\b/i],
  finger: [
    /\bdedos?\b/i,
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
  back: [/espalda/i, /lumbar/i, /dorsal/i, /\bbacks?\b/i],
  hip: [
    /cadera/i,
    /\bhips?\b/i,
    /ingle/i,
    /aductor/i,
    /adductor/i,
    /pubalgia/i,
    /muslo\s*interno/i,
  ],
  knee: [
    /\brodillas?\b/i,
    /\bknees?\b/i,
    /menisco/i,
    /ligamento cruzado/i,
    /r[oó]tula/i,
    /patella/i,
  ],
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
    /\bmuslos?\b/i,
    /\bthighs?\b/i,
    /isquiotibial/i,
    /\bisquios?\b/i,
    /hamstring/i,
    /cuadr[ií]ceps/i,
    /cu[aá]driceps/i,
    /\bquads?\b/i,
    /\bquadriceps\b/i,
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

function dropConflictingZones(text: string, parts: BodyPartId[]): BodyPartId[] {
  let out = parts.filter((id, i) => parts.indexOf(id) === i);
  if (hasExplicitAnkleOrFootSite(text) && !isTrueKneeComplaint(text)) {
    out = out.filter((id) => id !== "knee");
    if (!out.includes("ankle_foot")) out = ["ankle_foot", ...out];
  }
  if (isThighOrHamstringComplaint(text) && !isTrueKneeComplaint(text)) {
    out = out.filter((id) => id !== "knee");
    if (!out.includes("ankle_foot")) out = ["ankle_foot", ...out];
  }
  return out;
}

/** Body parts mentioned as injury sites in free text (may be empty), ordered by first mention.
 * Workout context ("entreno de pierna") is ignored; "molestia en la espalda" wins.
 * Keyword leftovers ("semana" ≠ muñeca, "alrededor" ≠ dedo) must not invent extra zones.
 */
export function detectBodyPartsFromText(text: string): BodyPartId[] {
  const linked = detectComplaintLinkedBodyParts(text);
  const scanText = stripTrainingBodyPartContext(text);

  // Vague "pierna" / "leg" OR foot/plantar OR explicit below-knee → ankle_foot (UI adapts)
  if (
    isVagueLegComplaint(text) ||
    isFootOrPlantarComplaint(scanText) ||
    isBelowKneeOrLowerLeg(scanText)
  ) {
    // Other complaint-linked zones (e.g. espalda) beat a vague leftover "pierna"
    if (linked.length > 0 && !linked.includes("ankle_foot") && !linked.includes("knee")) {
      return dropConflictingZones(text, sortPartsByFirstMention(text, linked));
    }
    const linkedOthers = linked.filter((id) => id !== "ankle_foot" && id !== "knee");
    if (linked.length > 0 && (linked.includes("ankle_foot") || linked.includes("knee"))) {
      const sites = linked.filter((id) => id !== "knee" || isTrueKneeComplaint(text));
      const withAnkle = sites.includes("ankle_foot") ? sites : ["ankle_foot" as BodyPartId, ...sites];
      return dropConflictingZones(text, sortPartsByFirstMention(text, withAnkle));
    }
    if (linkedOthers.length === 0) return ["ankle_foot"];
    return dropConflictingZones(
      text,
      sortPartsByFirstMention(text, ["ankle_foot" as BodyPartId, ...linkedOthers])
    );
  }

  // Muslo / isquio / cuádriceps → thigh questionnaire, never "rodilla".
  // "pierna izquierda/derecha" is laterality, not a second zone.
  if (
    isThighOrHamstringComplaint(text) &&
    !hasKneeAsPainSite(text) &&
    !isBelowKneeOrLowerLeg(scanText) &&
    !isFootOrPlantarComplaint(scanText)
  ) {
    const others = linked.filter((id) => id !== "knee" && id !== "ankle_foot");
    return dropConflictingZones(
      text,
      sortPartsByFirstMention(text, ["ankle_foot" as BodyPartId, ...others])
    );
  }

  const found: BodyPartId[] = [];
  for (const [id, patterns] of Object.entries(KEYWORDS) as [BodyPartId, RegExp[]][]) {
    if (id === "head" && !isTrueHeadComplaint(scanText)) continue;
    if (patterns.some((p) => p.test(scanText))) found.push(id);
  }
  if (found.includes("knee") && found.includes("ankle_foot") && !isTrueKneeComplaint(scanText)) {
    const withoutKnee = found.filter((id) => id !== "knee");
    if (linked.length > 0) {
      return dropConflictingZones(text, sortPartsByFirstMention(text, linked));
    }
    return dropConflictingZones(text, sortPartsByFirstMention(text, withoutKnee));
  }

  if (linked.length > 0) {
    const extras = found.filter((p) => !linked.includes(p));
    return dropConflictingZones(
      text,
      sortPartsByFirstMention(text, [...linked, ...extras])
    );
  }
  return dropConflictingZones(text, sortPartsByFirstMention(text, found));
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
  if (isThighOrHamstringComplaint(text) && !isTrueKneeComplaint(text)) {
    return { part: "ankle_foot", detected: ["ankle_foot"] };
  }
  if (isTrueKneeComplaint(text)) {
    return { part: "knee", detected: ["knee"] };
  }
  if (/tobillo|pie\b|ankle|foot|fascitis|gemelo|pantorrilla|calf|aquiles|achilles|pierna|espinilla|shin/i.test(text)) {
    return { part: "ankle_foot", detected: ["ankle_foot"] };
  }
  // Bare "brazo" is too vague — never assume shoulder or elbow here.
  if (isVagueArmComplaint(text)) {
    return { part: "generic", detected: [] };
  }
  // Upper-arm / overhead cues → shoulder questionnaire (not elbow)
  if (
    /parte\s+alta\s+del\s+brazo|cerca\s+del\s+hombro|upper\s+arm|elev(ar|o|ando)\s+(el\s+)?brazo|por\s+encima\s+de\s+la\s+cabeza|overhead/i.test(
      text
    )
  ) {
    return { part: "shoulder", detected: ["shoulder"] };
  }
  if (/hombro|elev|lanzar|press|remo|pectoral|pecho|chest/i.test(text)) {
    return { part: "shoulder", detected: ["shoulder"] };
  }
  return { part: "generic", detected: [] };
}

/**
 * Short location replies after "dónde te duele" (e.g. "la mano", "codo", "hombro").
 * Used to open the matching adaptive questionnaire.
 */
export function resolveBodyPartFromLocationReply(
  text: string
): BodyPartId | null {
  const t = text.trim();
  if (!t) return null;
  const fromDetect = detectBodyPartsFromText(t);
  if (fromDetect[0]) return fromDetect[0];
  const { part } = questionnaireForText(t);
  if (part !== "generic") return part;
  if (
    /^(la\s+|el\s+|mi\s+|the\s+)?(manos?|muñecas?|munecas?|hands?|wrists?)\b/i.test(
      t
    )
  ) {
    return "wrist_hand";
  }
  if (/^(el\s+|mi\s+|the\s+)?(codos?|elbows?)\b/i.test(t)) return "elbow";
  if (/^(el\s+|mi\s+|the\s+)?(hombros?|shoulders?)\b/i.test(t)) {
    return "shoulder";
  }
  if (
    /parte\s+alta|cerca\s+del\s+hombro|upper\s+arm|deltoides/i.test(t)
  ) {
    return "shoulder";
  }
  if (
    /parte\s+baja|cerca\s+del\s+codo|antebrazo|forearm/i.test(t)
  ) {
    return "elbow";
  }
  if (/^(los\s+|mis\s+|the\s+)?(dedos?|fingers?|pulgar|thumb)\b/i.test(t)) {
    return "finger";
  }
  if (/^(la\s+|el\s+|mi\s+|the\s+)?(rodillas?|knees?)\b/i.test(t)) return "knee";
  if (/^(la\s+|el\s+|mi\s+|the\s+)?(caderas?|hips?|ingles?|groin)\b/i.test(t)) {
    return "hip";
  }
  if (/^(la\s+|el\s+|mi\s+|the\s+)?(espaldas?|backs?|lumbar|dorsal)\b/i.test(t)) {
    return "back";
  }
  if (/^(el\s+|mi\s+|the\s+)?(cuello|neck|cervical)\b/i.test(t)) return "neck";
  if (
    /^(el\s+|la\s+|mi\s+|the\s+)?(tobillos?|ankles?|pies?|foot|feet|tal[oó]n|heel|muslos?|thighs?|isquios?)\b/i.test(
      t
    )
  ) {
    return "ankle_foot";
  }
  return null;
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
    if (focus === "thigh" || isThighOrHamstringComplaint(text)) {
      return thighFacingLabel(text, locale);
    }
    if (locale === "en") {
      if (focus === "foot") return "Foot";
      if (focus === "ankle") return "Ankle";
      if (focus === "lower_leg") return "Lower leg";
      if (focus === "leg") return "Leg";
      return "Ankle / foot / lower leg";
    }
    if (focus === "foot") return "Pie";
    if (focus === "ankle") return "Tobillo";
    if (focus === "lower_leg") return "Pierna baja";
    if (focus === "leg") return "Pierna";
    return "Tobillo / pie / pierna baja";
  }
  if (part === "hip") {
    const peri =
      /gl[uú]teo|isquio|aductor|adductor|hamstring|groin|ingle/i.test(text) &&
      !/\bcadera\b|\bhip\b/i.test(text);
    if (peri) {
      return locale === "en"
        ? "Buttock / hamstring / groin"
        : "Glúteo / parte de atrás del muslo / ingle";
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
  const useThighZone =
    ankleFootFocus === "thigh" ||
    (part === "ankle_foot" && isThighOrHamstringComplaint(text));
  const ankleFootZoneEs = useThighZone
    ? thighIntroZone(text, "es")
    : ankleFootFocus === "foot"
      ? "tu pie"
      : ankleFootFocus === "ankle"
        ? "tu tobillo"
        : ankleFootFocus === "lower_leg"
          ? "tu pierna (debajo de la rodilla)"
          : ankleFootFocus === "leg"
            ? "tu pierna"
            : "tu tobillo / pie / pierna baja";
  const ankleFootZoneEn = useThighZone
    ? thighIntroZone(text, "en")
    : ankleFootFocus === "foot"
      ? "your foot"
      : ankleFootFocus === "ankle"
        ? "your ankle"
        : ankleFootFocus === "lower_leg"
          ? "your lower leg (below the knee)"
          : ankleFootFocus === "leg"
            ? "your leg"
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
      ? "la zona que describes (glúteo / parte de atrás del muslo / ingle)"
      : "tu zona de glúteo, ingle o cadera",
    knee: "tu rodilla",
    ankle_foot: ankleFootZoneEs,
    generic: "tu molestia",
  };
  const zone = labels[part] ?? "tu molestia";
  return `Gracias por contarnos. Para orientarte mejor, necesito hacerte algunas preguntas detalladas sobre ${zone}. Solo te preguntaré lo relevante según tus respuestas.`;
}
