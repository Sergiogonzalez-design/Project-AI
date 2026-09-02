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
    .map((id) => {
      const known = EQUIPMENT_LABELS[id];
      if (known) return known;
      // custom:{categoryId}:{label} from clinic profile «Otro»
      if (id.startsWith("custom:")) {
        const rest = id.slice("custom:".length);
        const colon = rest.indexOf(":");
        if (colon > 0) return rest.slice(colon + 1).trim() || id;
      }
      return id;
    })
    .filter(Boolean)
    .slice(0, 6)
    .join(", ");
}

/**
 * PRIORIDAD ALTA: replace AIKinora clinics with hospital / ER guidance.
 * Uses profile city when available (no GPS yet).
 */
export function buildHospitalRecommendPrompt(
  city: string | null,
  language: "es" | "en"
): string {
  const cityLabel = city?.trim() || "";

  if (language === "en") {
    if (cityLabel) {
      return `HOSPITALS / ER — HIGH PRIORITY (CRITICAL — DO NOT RECOMMEND AIKINORA CLINICS):
Patient location (city on profile): ${cityLabel}.
Include a section titled exactly:
Hospitals / ER near you
RULES:
- Do NOT include **Clinics on AIKinora near you**. Clinics are wrong when the patient must go to hospital now.
- Name 2–3 well-known public hospitals / emergency departments in or very near ${cityLabel} that typically have ER (Urgencias). Prefer major reference / university / public hospitals if you know them for that city.
- Do NOT invent street addresses, phone numbers, wait times, or Google Maps links. If unsure of a name, say go to the nearest Hospital Emergency Department in ${cityLabel} and open Maps with “emergency room near me” / “urgencias ${cityLabel}”.
- Remind: if symptoms worsen (loss of consciousness, chest pain, inability to breathe, severe bleeding) call emergency services (112 in Spain / local equivalent).
- Make clear the priority is HOSPITAL / ER NOW, not physiotherapy clinics.
- Do NOT write /centro/… paths for hospitals (they are not app profiles / not tappable buttons).`;
    }
    return `HOSPITALS / ER — HIGH PRIORITY (CRITICAL — DO NOT RECOMMEND AIKINORA CLINICS):
The patient has NO city/location on their profile.
Include a section titled exactly:
Hospitals / ER near you
RULES:
- Do NOT include **Clinics on AIKinora near you**.
- Do NOT invent a specific hospital name for a city you do not know.
- Tell them to go NOW to the nearest Hospital Emergency Department (Urgencias).
- Tell them how to find it: open Google Maps / Apple Maps and search “emergency room near me” or “urgencias hospital”; or ask someone nearby / taxi / emergency services.
- If severe or unsure how to get there: call 112 (Spain) or local emergency number.
- Still name the destination clearly: Hospital / Emergency Department — not a physio clinic.
- Do NOT write /centro/… paths for hospitals (they are not app profiles / not tappable buttons).`;
  }

  if (cityLabel) {
    return `HOSPITALES / URGENCIAS — PRIORIDAD ALTA (CRÍTICO — NO RECOMIENDES CLÍNICAS AIKINORA):
Ubicación del paciente (ciudad en el perfil): ${cityLabel}.
Incluye una sección titulada exactamente:
Hospitales / Urgencias cerca de ti
REGLAS:
- NO incluyas **Clínicas en AIKinora cerca de ti**. Con PRIORIDAD ALTA las clínicas de fisio no aplican: debe ir a hospital.
- Nombra 2–3 hospitales públicos / servicios de Urgencias bien conocidos en o muy cerca de ${cityLabel}. Prioriza hospitales de referencia / universitarios / públicos si los conoces para esa ciudad.
- NO inventes direcciones exactas, teléfonos, tiempos de espera ni enlaces de Maps. Si no estás seguro de un nombre, di que vaya a Urgencias del hospital más cercano en ${cityLabel} y busque en Maps «urgencias ${cityLabel}» o «hospital urgencias cerca».
- Recuerda: si empeora (pérdida de consciencia, dolor torácico, no puede respirar, sangrado grave) llame al 112.
- Deja claro que la prioridad es HOSPITAL / URGENCIAS YA, no una clínica de fisioterapia.
- NO uses rutas /centro/… para hospitales (no son fichas de la app / no son botones).`;
  }

  return `HOSPITALES / URGENCIAS — PRIORIDAD ALTA (CRÍTICO — NO RECOMIENDES CLÍNICAS AIKINORA):
El paciente NO tiene ciudad/ubicación en el perfil.
Incluye una sección titulada exactamente:
Hospitales / Urgencias cerca de ti
REGLAS:
- NO incluyas **Clínicas en AIKinora cerca de ti**.
- NO inventes el nombre de un hospital concreto de una ciudad que no conoces.
- Di que debe ir YA a Urgencias del hospital más cercano.
- Cómo encontrarlo: abrir Google Maps / Apple Maps y buscar «urgencias cerca de mí» o «hospital urgencias»; o pedir ayuda a alguien / taxi / 112.
- Si es grave o no sabe cómo llegar: llamar al 112.
- Nombra el destino con claridad: Hospital / Urgencias — no una clínica de fisioterapia.
- NO uses rutas /centro/… para hospitales (no son fichas de la app / no son botones).`;
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
Say honestly that none are listed yet and they can look later in Search. NEVER invent clinic names, addresses, or services. Do NOT ask the patient to enter their city.
If THIS case is hospital-urgent / HIGH PRIORITY: omit the clinics section and use Hospitals / ER near you instead (do not recommend physio clinics).`;
    }
    const scope = cityLabel
      ? `Patient city: ${cityLabel}. Prefer these local clinics.`
      : `The patient did not share a city (optional). Rank by injury fit (equipment/specialties). Always mention each clinic's city. Do NOT ask them to add a city.`;
    return `AIKINORA CLINICS — USE ONLY THIS LIST (CRITICAL — NEVER INVENT NAMES):
${scope}
${recs.map(lineFor).join("\n")}
RULES:
- In EVERY non-urgent Consulta reply include section titled exactly: Clinics on AIKinora near you
- If HIGH PRIORITY / hospital: omit clinics entirely; use Hospitals / ER near you instead.
- Recommend 2–3 from this list (or all if fewer). Prefer clinics whose equipment/specialties fit the injury (e.g. ultrasound → clinic with Ecógrafo).
- You may say why it fits ONLY using listed equipment/specialties/city. Do not invent a service that is not listed.
- BUTTON FORMAT (CRITICAL — app turns these into tappable buttons): write EACH clinic on its own line exactly like:
  1. Clinic Name | /centro/{slug} | city · key equipment
  Always include the /centro/{slug} path from the list. Never invent slugs.
- Hospitals / ER names must NEVER use /centro/… (they have no profile in the app).`;
  }

  if (!recs.length) {
    return `CLÍNICAS AIKINORA (CONSULTA PACIENTE — CRÍTICO):
AHORA MISMO no hay clínicas registradas y visibles para recomendar${cityLabel ? ` en ${cityLabel}` : ""}.
Incluye una sección breve titulada exactamente:
Clínicas en AIKinora cerca de ti
Di con honestidad que aún no hay centros de AIKinora listados y que puede mirar más adelante en Buscar. NUNCA inventes nombres, direcciones ni servicios. NO pidas la ciudad.
Si ESTE caso es PRIORIDAD ALTA / hospital: omite clínicas y usa Hospitales / Urgencias cerca de ti.`;
  }
  const scope = cityLabel
    ? `Ciudad del paciente: ${cityLabel}. Prioriza estas clínicas locales.`
    : `El paciente no ha indicado ciudad (es opcional). Ordena por encaje con la lesión (equipo/especialidades). Menciona la ciudad de cada clínica. NO pidas que añada su ciudad.`;
  return `CLÍNICAS REGISTRADAS EN AIKINORA — USA SOLO ESTA LISTA (CRÍTICO — NO INVENTES NOMBRES):
${scope}
${recs.map(lineFor).join("\n")}
REGLAS:
- En CADA respuesta de Consulta NO urgente incluye la sección titulada exactamente: Clínicas en AIKinora cerca de ti
- Si PRIORIDAD ALTA / hospital: omite clínicas por completo; usa Hospitales / Urgencias cerca de ti.
- Recomienda 2–3 de esta lista (o todas si hay menos). Prioriza las que encajen con la lesión (p. ej. si hace falta ecografía, prefiere las que tengan Ecógrafo).
- Explica por qué encaja SOLO con el equipo/especialidades/ciudad listados. No inventes un servicio que no figure.
- FORMATO BOTÓN (CRÍTICO — la app convierte cada línea en un botón): escribe CADA clínica en su propia línea exactamente así:
  1. Nombre de la clínica | /centro/{slug} | ciudad · equipo clave
  Incluye SIEMPRE la ruta /centro/{slug} de la lista. Nunca inventes slugs.
- Los hospitales / urgencias NUNCA llevan /centro/… (no tienen ficha en la app).`;
}
