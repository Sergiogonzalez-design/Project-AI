/**
 * Map patient-facing functional Sí/No prompts (and protocol item ids)
 * to CLINICAL_TEST_IMAGES / video ids. Separate from physio special-test aliases
 * so everyday wording does not pollute the clinical chat matcher.
 */

import {
  CLINICAL_TEST_IMAGES,
  findClinicalTestImage,
  type ClinicalTestImage,
} from "./clinical-test-images";

/** Protocol item id → catalog media id */
export const PROTOCOL_ITEM_MEDIA_ID: Readonly<Record<string, string>> = {
  test_single_heel_raise: "heel-raise",
  test_heel_raise_arch: "heel-raise",
  test_pain_tiptoes: "heel-raise",
  test_forefoot_tiptoe: "heel-raise",
  test_windlass_hallux: "windlass",
  test_hop_hip: "hop-test",
  test_single_leg_stance: "trendelenburg",
  test_sls_knee: "trendelenburg",
  test_sls_hip: "trendelenburg",
  test_sls_lumbar: "trendelenburg",
  test_prayer_tingle: "phalen",
  test_night_tingling_median: "phalen",
  test_resisted_wrist: "cozen",
  test_grip_pain: "cozen",
  test_er_at_90: "apprehension",
  test_overhead_elevation: "painful-arc",
  test_hold_light_front: "speed",
  test_socks_cross_legs: "faber",
  test_hip_screen_knee: "faber",
  test_forward_bend: "schober",
  test_cough_sneeze: "slr-lasegue",
  test_neck_screen_shoulder: "spurling",
  test_neck_screen_elbow: "spurling",
  test_neck_rotation: "spurling",
  test_look_up_down: "spurling",
  test_sustained_look_up: "spurling",
  test_neck_worsens_headache: "spurling",
  test_palm_load: "thumb-axial-load",
  test_pinch_strength: "thumb-ucl-stress",
  test_can_flex_elbow: "elbow-flexion-cubital",
  test_elbow_full_rom: "elbow-flexion-cubital",
  test_elbow_extend_flex_painless: "elbow-flexion-cubital",
  test_can_flex_with_weight: "elbow-flexion-cubital",
};

type PromptAlias = { id: string; aliases: readonly string[] };

/** Longest aliases first when matching. */
const PROMPT_MEDIA_ALIASES: readonly PromptAlias[] = [
  {
    id: "heel-raise",
    aliases: [
      "elevaciones de talon",
      "elevacion de talon",
      "heel raises",
      "heel raise",
      "single-leg heel",
      "puntillas",
      "tiptoes",
      "tiptoe",
    ],
  },
  {
    id: "hop-test",
    aliases: [
      "salto a una sola pierna",
      "saltar a la pata coja",
      "single-leg hop",
      "single leg hop",
      "hop on one",
    ],
  },
  {
    id: "windlass",
    aliases: [
      "extender el dedo gordo",
      "dedo gordo hacia arriba",
      "extend the big toe",
      "big toe up",
      "windlass",
    ],
  },
  {
    id: "trendelenburg",
    aliases: [
      "pata coja",
      "single-leg stance",
      "single leg stance",
      "stand on one leg",
      "standing on one leg",
    ],
  },
  {
    id: "phalen",
    aliases: [
      "posicion de rezo",
      "posicion de oracion",
      "prayer position",
      "prayer pose",
      "phalen",
    ],
  },
  {
    id: "cozen",
    aliases: [
      "levantar la muneca",
      "muneca contra resistencia",
      "resisted wrist",
      "wrist against resistance",
      "cerrar el puno",
      "grip with the elbow",
    ],
  },
  {
    id: "apprehension",
    aliases: [
      "se salga",
      "pop out",
      "brazo a 90",
      "arm at 90",
      "rotate the palm",
      "rotar la palma",
    ],
  },
  {
    id: "painful-arc",
    aliases: [
      "por encima de la cabeza",
      "elevar el brazo",
      "raise the arm overhead",
      "arm overhead",
      "overhead",
    ],
  },
  {
    id: "speed",
    aliases: [
      "brazo extendido al frente",
      "arm straight out in front",
      "objeto ligero",
      "light object",
    ],
  },
  {
    id: "faber",
    aliases: [
      "ponerte los calcetines",
      "putting on socks",
      "put on socks",
      "cruzar la pierna",
      "cross the leg",
      "figure 4",
      "faber",
    ],
  },
  {
    id: "schober",
    aliases: [
      "inclinarte hacia delante",
      "bend forward",
      "forward bend",
      "tocar las rodillas",
      "touch your toes",
    ],
  },
  {
    id: "slr-lasegue",
    aliases: [
      "toser/estornudar",
      "toser o estornudar",
      "coughing or sneezing",
      "coughing, sneezing",
      "cough sneeze",
    ],
  },
  {
    id: "spurling",
    aliases: [
      "girar o inclinar la cabeza",
      "girar la cabeza",
      "turning or tilting the head",
      "turn your head",
      "mirar arriba",
      "look up",
    ],
  },
  {
    id: "thumb-axial-load",
    aliases: [
      "apoyar la palma",
      "palm and load",
      "put weight through the palm",
      "cargar un poco de peso",
    ],
  },
  {
    id: "thumb-ucl-stress",
    aliases: [
      "pellizcar",
      "pinch (thumb",
      "thumb-index",
      "pulgar-indice",
      "pulgar indice",
    ],
  },
  {
    id: "elbow-flexion-cubital",
    aliases: [
      "flexionar y extender el codo",
      "flex and extend the elbow",
      "bend and straighten the elbow",
      "can you flex the elbow",
    ],
  },
  {
    id: "anterior-drawer-ankle",
    aliases: [
      "maleolo lateral",
      "lateral malleolus",
      "outer ankle",
      "tobillo por fuera",
    ],
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getClinicalTestImageById(id: string): ClinicalTestImage | null {
  return CLINICAL_TEST_IMAGES.find((t) => t.id === id) ?? null;
}

/** Trailing marker embedded in assistant messages: "…prompt ⟦hop-test⟧" */
const MEDIA_MARKER = /⟦([a-z0-9-]+)⟧\s*$/i;

export function stripFunctionalMediaMarker(prompt: string): string {
  return prompt.replace(MEDIA_MARKER, "").trim();
}

export function parseFunctionalMediaMarker(prompt: string): string | null {
  const m = MEDIA_MARKER.exec(prompt);
  return m?.[1] ?? null;
}

export function withFunctionalMediaMarker(
  prompt: string,
  mediaId: string | null | undefined
): string {
  if (!mediaId) return prompt;
  const clean = stripFunctionalMediaMarker(prompt);
  return `${clean} ⟦${mediaId}⟧`;
}

export function resolveFunctionalTestMedia(opts: {
  prompt: string;
  protocolItemId?: string | null;
  mediaId?: string | null;
}): ClinicalTestImage | null {
  if (opts.mediaId) {
    const byExplicit = getClinicalTestImageById(opts.mediaId);
    if (byExplicit) return byExplicit;
  }

  const marked = parseFunctionalMediaMarker(opts.prompt);
  if (marked) {
    const byMark = getClinicalTestImageById(marked);
    if (byMark) return byMark;
  }

  if (opts.protocolItemId) {
    const mapped = PROTOCOL_ITEM_MEDIA_ID[opts.protocolItemId];
    if (mapped) {
      const byProtocol = getClinicalTestImageById(mapped);
      if (byProtocol) return byProtocol;
    }
  }

  const normalized = normalize(stripFunctionalMediaMarker(opts.prompt));
  if (!normalized) return null;

  let best: { id: string; len: number } | null = null;
  for (const row of PROMPT_MEDIA_ALIASES) {
    for (const alias of row.aliases) {
      const a = normalize(alias);
      if (!a) continue;
      if (normalized.includes(a) && (!best || a.length > best.len)) {
        best = { id: row.id, len: a.length };
      }
    }
  }
  if (best) {
    const hit = getClinicalTestImageById(best.id);
    if (hit) return hit;
  }

  // Last resort: only match clinical names that are still patient-safe demos
  // (heel raise, hop, etc.). Never attach Lachman/Neer/… clinician videos
  // to patient Sí/No prompts just because the AI used a catalog name.
  const clinical = findClinicalTestImage(stripFunctionalMediaMarker(opts.prompt));
  if (!clinical) return null;
  const PATIENT_SAFE_CLINICAL_MEDIA = new Set([
    "heel-raise",
    "hop-test",
    "windlass",
    "trendelenburg",
    "phalen",
    "painful-arc",
    "drop-arm",
    "speed",
    "cozen",
    "schober",
    "elbow-flexion-cubital",
  ]);
  return PATIENT_SAFE_CLINICAL_MEDIA.has(clinical.id) ? clinical : null;
}

export function mediaIdForProtocolItem(itemId: string): string | null {
  return PROTOCOL_ITEM_MEDIA_ID[itemId] ?? null;
}
