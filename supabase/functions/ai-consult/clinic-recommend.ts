/** Same-city clinic recommendations for patient Consulta (never invent names). */

const EQUIPMENT_LABELS: Record<string, string> = {
  diagnostic_ultrasound: "Ecógrafo",
  xray_in_clinic: "Radiografía (RX)",
  mri_in_clinic: "Resonancia (RMN)",
  pressure_platform: "Plataforma de presión",
  dynamometer: "Dinamómetro",
  tens_ems: "TENS / electroestimulación",
  therapeutic_ultrasound: "Ultrasonido terapéutico",
  shockwave: "Ondas de choque",
  diathermy_rf: "Diatermia / radiofrecuencia",
  dry_needling: "Punción seca",
  acupuncture: "Acupuntura",
  hydrotherapy: "Hidroterapia",
  pilates_reformer: "Pilates / reformer",
};

type NeedTags = { equipment: string[]; specialties: string[] };

const NEED_RULES: { re: RegExp; equipment?: string[]; specialties?: string[] }[] = [
  { re: /ecograf|\beco\b|ultrasonido|ultrasound/i, equipment: ["diagnostic_ultrasound"] },
  { re: /radiograf|\brx\b|rayos?\s*x/i, equipment: ["xray_in_clinic"] },
  { re: /resonancia|\brmn\b|\bmri\b/i, equipment: ["mri_in_clinic"] },
  { re: /ondas?\s*de\s*choque|shockwave|\beswt\b|\bepte\b/i, equipment: ["shockwave"] },
  {
    re: /punci[oó]n\s*seca|dry\s*needling|ecoguiad|invasiv/i,
    equipment: ["dry_needling"],
    specialties: ["Invasiva"],
  },
  { re: /suelo\s*p[eé]lvic|pelvic\s*floor/i, specialties: ["Suelo pélvico"] },
  { re: /deportiv|sport|f[uú]tbol|running|correr|p[áa]del/i, specialties: ["Deportiva"] },
  { re: /ni[nñ]o|pedi[aá]tr/i, specialties: ["Pediátrica"] },
  { re: /neurol|esclerosis|parkinson|ictus/i, specialties: ["Neurológica"] },
  { re: /\batm\b|mand[ií]bula|\bjaw\b/i, specialties: ["ATM / mandíbula"] },
  { re: /espalda|lumbar|raquis|cervical|cuello/i, specialties: ["Raquis"] },
  { re: /dolor\s*cr[oó]nico/i, specialties: ["Dolor crónico"] },
  { re: /readapt/i, specialties: ["Readaptación"] },
  { re: /osteopat/i, specialties: ["Osteopatía"] },
  { re: /geriatr|mayor/i, specialties: ["Geriátrica"] },
  { re: /hombro|shoulder|manguito/i, specialties: ["Deportiva", "Traumatológica"] },
  { re: /rodilla|knee|menisco/i, specialties: ["Deportiva", "Traumatológica"] },
  {
    re: /tobillo|ankle|plantar|aquiles|gemelo|cu[aá]driceps|isquiotib/i,
    equipment: ["diagnostic_ultrasound"],
    specialties: ["Traumatológica"],
  },
  { re: /cadera|hip|ingle|groin/i, specialties: ["Traumatológica"] },
  { re: /codo|elbow|epicondil/i, specialties: ["Traumatológica"] },
  { re: /mu[nñ]eca|wrist|mano\b|hand\b/i, specialties: ["Traumatológica"] },
];

export function inferClinicNeedTags(parts: Array<string | null | undefined>): NeedTags {
  const haystack = parts.filter(Boolean).join(" \n ");
  const equipment = new Set<string>();
  const specialties = new Set<string>();
  if (!haystack.trim()) return { equipment: [], specialties: [] };
  for (const rule of NEED_RULES) {
    if (!rule.re.test(haystack)) continue;
    for (const id of rule.equipment ?? []) equipment.add(id);
    for (const s of rule.specialties ?? []) specialties.add(s);
  }
  return { equipment: [...equipment], specialties: [...specialties] };
}

export type ClinicRecommendRow = {
  name: string;
  slug: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  specialties: string[] | null;
  equipment: string[] | null;
};

function equipmentLabels(ids: string[] | null | undefined): string {
  if (!ids?.length) return "";
  return ids
    .map((id) => EQUIPMENT_LABELS[id] ?? id)
    .filter(Boolean)
    .slice(0, 6)
    .join(", ");
}

export function buildClinicRecommendPrompt(
  recs: ClinicRecommendRow[],
  city: string | null,
  language: "es" | "en"
): string {
  const cityLabel = city?.trim() || "";
  const lineFor = (c: ClinicRecommendRow, i: number) => {
    const extra = [
      c.city,
      c.address,
      equipmentLabels(c.equipment),
      (c.specialties ?? []).slice(0, 4).join(", "),
    ]
      .filter(Boolean)
      .join(" · ");
    return `${i + 1}. ${c.name} | /centro/${c.slug}${extra ? ` | ${extra}` : ""}`;
  };

  if (language === "en") {
    if (!recs.length) {
      return `AIKINORA CLINICS (PATIENT CONSULTA — CRITICAL):
There are NO registered, listed clinics to recommend right now${cityLabel ? ` in ${cityLabel}` : ""}.
Include a short section titled exactly:
Clinics on AIKinora near you
Say honestly that none are listed yet and they can look later in Search. NEVER invent clinic names, addresses, or services. Do NOT ask the patient to enter their city.`;
    }
    const scope = cityLabel
      ? `Patient city: ${cityLabel}. Prefer these local clinics.`
      : `The patient did not share a city (optional). Rank by injury fit (equipment/specialties). Always mention each clinic's city. Do NOT ask them to add a city.`;
    return `AIKINORA CLINICS — USE ONLY THIS LIST (CRITICAL — NEVER INVENT NAMES):
${scope}
${recs.map(lineFor).join("\n")}
RULES:
- In EVERY Consulta reply include section titled exactly: Clinics on AIKinora near you
- Recommend 2–3 from this list (or all if fewer). Prefer clinics whose equipment/specialties fit the injury (e.g. ultrasound → clinic with Ecógrafo).
- You may say why it fits ONLY using listed equipment/specialties/city. Do not invent a service that is not listed.
- Link as /centro/{slug}. Do not invent URLs.`;
  }

  if (!recs.length) {
    return `CLÍNICAS AIKINORA (CONSULTA PACIENTE — CRÍTICO):
AHORA MISMO no hay clínicas registradas y visibles para recomendar${cityLabel ? ` en ${cityLabel}` : ""}.
Incluye una sección breve titulada exactamente:
Clínicas en AIKinora cerca de ti
Di con honestidad que aún no hay centros de AIKinora listados y que puede mirar más adelante en Buscar. NUNCA inventes nombres, direcciones ni servicios. NO pidas la ciudad.`;
  }
  const scope = cityLabel
    ? `Ciudad del paciente: ${cityLabel}. Prioriza estas clínicas locales.`
    : `El paciente no ha indicado ciudad (es opcional). Ordena por encaje con la lesión (equipo/especialidades). Menciona la ciudad de cada clínica. NO pidas que añada su ciudad.`;
  return `CLÍNICAS REGISTRADAS EN AIKINORA — USA SOLO ESTA LISTA (CRÍTICO — NO INVENTES NOMBRES):
${scope}
${recs.map(lineFor).join("\n")}
REGLAS:
- En CADA respuesta de Consulta incluye la sección titulada exactamente: Clínicas en AIKinora cerca de ti
- Recomienda 2–3 de esta lista (o todas si hay menos). Prioriza las que encajen con la lesión (p. ej. si hace falta ecografía, prefiere las que tengan Ecógrafo).
- Explica por qué encaja SOLO con el equipo/especialidades/ciudad listados. No inventes un servicio que no figure.
- Enlaza como /centro/{slug}. No inventes URLs.`;
}
