import {
  defaultElbowAdaptiveAnswers,
  formatElbowAdaptive,
  getVisibleElbowQuestions,
  type ElbowAdaptiveAnswers,
  type ElbowQuestionDef,
} from "@/lib/consulta-elbow-adaptive";
import {
  defaultShoulderAdaptiveAnswers,
  formatShoulderAdaptive,
  getVisibleShoulderQuestions,
  type ShoulderAdaptiveAnswers,
  type ShoulderQuestionDef,
} from "@/lib/consulta-shoulder-adaptive";
import {
  defaultKneeAdaptiveAnswers,
  formatKneeAdaptive,
  getVisibleKneeQuestions,
  type KneeAdaptiveAnswers,
  type KneeQuestionDef,
} from "@/lib/consulta-knee-adaptive";
import {
  defaultHipAdaptiveAnswers,
  formatHipAdaptive,
  getVisibleHipQuestions,
  type HipAdaptiveAnswers,
  type HipQuestionDef,
} from "@/lib/consulta-hip-adaptive";
import {
  defaultNeckAdaptiveAnswers,
  formatNeckAdaptive,
  getVisibleNeckQuestions,
  type NeckAdaptiveAnswers,
  type NeckQuestionDef,
} from "@/lib/consulta-neck-adaptive";
import {
  defaultBackAdaptiveAnswers,
  formatBackAdaptive,
  getVisibleBackQuestions,
  type BackAdaptiveAnswers,
  type BackQuestionDef,
} from "@/lib/consulta-back-adaptive";
import {
  defaultWristAdaptiveAnswers,
  formatWristAdaptive,
  getVisibleWristQuestions,
  type WristAdaptiveAnswers,
  type WristQuestionDef,
} from "@/lib/consulta-wrist-adaptive";
import {
  defaultFingerAdaptiveAnswers,
  formatFingerAdaptive,
  getVisibleFingerQuestions,
  type FingerAdaptiveAnswers,
  type FingerQuestionDef,
} from "@/lib/consulta-finger-adaptive";
import {
  defaultHeadAdaptiveAnswers,
  formatHeadAdaptive,
  getVisibleHeadQuestions,
  type HeadAdaptiveAnswers,
  type HeadQuestionDef,
} from "@/lib/consulta-head-adaptive";
import {
  defaultLowerLegAdaptiveAnswers,
  formatLowerLegAdaptive,
  getVisibleLowerLegQuestions,
  type LowerLegAdaptiveAnswers,
  type LowerLegQuestionDef,
} from "@/lib/consulta-lower-leg-adaptive";
import {
  defaultGenericConsultaAnswers,
  formatGenericConsulta,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";
import {
  isAdaptiveQuestionnairePart,
  type AdaptiveQuestionnairePart,
} from "@/lib/consulta-triage";
import { detectBodyPartsFromText } from "@/lib/detect-body-part";
import type { WhatsAppOutbound } from "./types";

export type WaQuestionDef = {
  id: string;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
};

type PartDriver = {
  defaultAnswers: () => Record<string, unknown>;
  getVisible: (answers: Record<string, unknown>) => WaQuestionDef[];
  format: (answers: Record<string, unknown>, intro: string) => string;
};

function mapQ(q: {
  id: string;
  label: string;
  type: string;
  options?: readonly string[];
  required?: boolean;
}): WaQuestionDef {
  const type =
    q.type === "multi" || q.type === "text" || q.type === "slider"
      ? q.type
      : "single";
  return {
    id: q.id,
    label: q.label,
    type,
    options: q.options,
    required: q.required,
  };
}

/** WhatsApp v1: short path — no red flags, core only, hard cap. */
const WA_MAX_QUESTIONS = 7;

function keepForWhatsApp(q: { id: string; section?: string }): boolean {
  if (q.id.startsWith("rf_")) return false;
  if (/urgencia|cola_caballo|red_flag/i.test(q.id)) return false;
  // Keep non-rf items even if tagged under red_flags (e.g. evolucion).
  if (q.section === "red_flags") return true;
  // Drop deep follow-up branches on WhatsApp.
  if (q.section && q.section !== "core") return false;
  return true;
}

function mapAdaptiveForWhatsApp<
  T extends { id: string; section?: string; label: string; type: string; options?: readonly string[]; required?: boolean },
>(questions: T[]): WaQuestionDef[] {
  return questions
    .filter(keepForWhatsApp)
    .slice(0, WA_MAX_QUESTIONS)
    .map(mapQ);
}

/** Prefill skipped red-flag fields so formatters stay coherent. */
export function prefillsWhatsAppSkippedAnswers(
  answers: Record<string, unknown>
): Record<string, unknown> {
  const next = { ...answers };
  for (const key of Object.keys(next)) {
    if (!key.startsWith("rf_")) continue;
    const v = next[key];
    if (v === "" || v == null || (Array.isArray(v) && v.length === 0)) {
      next[key] = "No";
    }
  }
  if (next.acortar_por_urgencia === "" || next.acortar_por_urgencia == null) {
    next.acortar_por_urgencia = false;
  }
  return next;
}

/** WhatsApp list row title ≤24 chars. Prefer text before "(" for short readable titles. */
export function waOptionListTitle(option: string, max = 24): string {
  const t = option.trim().replace(/\s+/g, " ");
  const beforeParen = /^([^(]+?)\s*\(/.exec(t);
  if (beforeParen) {
    const short = beforeParen[1].trim();
    if (short.length > 0 && short.length <= max) return short;
  }
  // e.g. "No puedo apoyar / caminar" → "No puedo apoyar"
  const slashParts = t.split(/\s*\/\s*/);
  if (slashParts.length > 1) {
    const head = slashParts[0].trim();
    if (head.length >= 3 && head.length <= max) return head;
  }
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Strip web multi-select hints — WhatsApp lists only allow one choice. */
export function waQuestionLabel(q: WaQuestionDef): string {
  let label = q.label
    .replace(/\s*\(puedes marcar varias(?: zonas)?\)/gi, "")
    .replace(/\s*\(puedes marcar varios\)/gi, "")
    .replace(/\s*\(elige una\)/gi, "")
    .trim();
  if (q.type === "multi") {
    label = `${label}\n\nElige una opción (la que mejor describa tu caso).`;
  }
  return label;
}

const GENERIC_QUESTIONS: WaQuestionDef[] = [
  {
    id: "zona",
    label: "¿Dónde te duele o te molesta?",
    type: "text",
    required: true,
  },
  {
    id: "evolucion",
    label: "¿Cuánto tiempo llevas con el problema?",
    type: "single",
    options: GENERIC_FIELD_OPTIONS.evolution,
    required: true,
  },
  {
    id: "inicio",
    label: "¿Cómo fue el inicio?",
    type: "single",
    options: GENERIC_FIELD_OPTIONS.onset,
    required: true,
  },
  {
    id: "mecanismo",
    label: "¿Qué pudo provocarlo? (elige una)",
    type: "single",
    options: GENERIC_FIELD_OPTIONS.mechanism,
    required: true,
  },
  {
    id: "intensidad_dolor",
    label: "Intensidad del dolor (0–10)",
    type: "slider",
    required: true,
  },
];

const DRIVERS: Record<string, PartDriver> = {
  elbow: {
    defaultAnswers: () => defaultElbowAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleElbowQuestions(a as unknown as ElbowAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatElbowAdaptive(a as unknown as ElbowAdaptiveAnswers, intro),
  },
  shoulder: {
    defaultAnswers: () =>
      defaultShoulderAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleShoulderQuestions(a as unknown as ShoulderAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatShoulderAdaptive(a as unknown as ShoulderAdaptiveAnswers, intro),
  },
  knee: {
    defaultAnswers: () => defaultKneeAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleKneeQuestions(a as unknown as KneeAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatKneeAdaptive(a as unknown as KneeAdaptiveAnswers, intro),
  },
  hip: {
    defaultAnswers: () => defaultHipAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleHipQuestions(a as unknown as HipAdaptiveAnswers)
      ),
    format: (a, intro) => formatHipAdaptive(a as unknown as HipAdaptiveAnswers, intro),
  },
  neck: {
    defaultAnswers: () => defaultNeckAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleNeckQuestions(a as unknown as NeckAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatNeckAdaptive(a as unknown as NeckAdaptiveAnswers, intro),
  },
  back: {
    defaultAnswers: () => defaultBackAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleBackQuestions(a as unknown as BackAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatBackAdaptive(a as unknown as BackAdaptiveAnswers, intro),
  },
  wrist_hand: {
    defaultAnswers: () =>
      defaultWristAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleWristQuestions(a as unknown as WristAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatWristAdaptive(a as unknown as WristAdaptiveAnswers, intro),
  },
  finger: {
    defaultAnswers: () =>
      defaultFingerAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleFingerQuestions(a as unknown as FingerAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatFingerAdaptive(a as unknown as FingerAdaptiveAnswers, intro),
  },
  head: {
    defaultAnswers: () => defaultHeadAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleHeadQuestions(a as unknown as HeadAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatHeadAdaptive(a as unknown as HeadAdaptiveAnswers, intro),
  },
  ankle_foot: {
    defaultAnswers: () =>
      defaultLowerLegAdaptiveAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) =>
      mapAdaptiveForWhatsApp(
        getVisibleLowerLegQuestions(a as unknown as LowerLegAdaptiveAnswers)
      ),
    format: (a, intro) =>
      formatLowerLegAdaptive(a as unknown as LowerLegAdaptiveAnswers, intro),
  },
  generic: {
    defaultAnswers: () =>
      defaultGenericConsultaAnswers() as unknown as Record<string, unknown>,
    getVisible: (a) => {
      const answers = a as unknown as GenericConsultaAnswers;
      return GENERIC_QUESTIONS.filter((q) => {
        if (q.id === "mecanismo_otro") {
          return answers.mecanismo?.includes("Otro");
        }
        return true;
      }).slice(0, WA_MAX_QUESTIONS);
    },
    format: (a, intro) =>
      formatGenericConsulta(a as unknown as GenericConsultaAnswers, intro),
  },
};

export function resolveQuestionnairePart(
  intakeText: string
): AdaptiveQuestionnairePart | "generic" {
  const detected = detectBodyPartsFromText(intakeText);
  const first = detected[0];
  if (first && isAdaptiveQuestionnairePart(first)) return first;
  return "generic";
}

export function getPartDriver(part: string): PartDriver {
  return DRIVERS[part] ?? DRIVERS.generic;
}

export function isAnswered(q: WaQuestionDef, answers: Record<string, unknown>): boolean {
  const v = answers[q.id];
  if (q.type === "multi") return Array.isArray(v) && v.length > 0;
  if (q.type === "slider") return typeof v === "number" && !Number.isNaN(v);
  if (typeof v === "string") return v.trim().length > 0;
  return v != null && v !== "";
}

export function nextUnansweredQuestion(
  part: string,
  answers: Record<string, unknown>
): WaQuestionDef | null {
  const driver = getPartDriver(part);
  const visible = driver.getVisible(answers);
  return visible.find((q) => !isAnswered(q, answers)) ?? null;
}

export function applyAnswer(
  answers: Record<string, unknown>,
  q: WaQuestionDef,
  raw: string
): Record<string, unknown> {
  const next = { ...answers };
  const text = raw.trim();
  const isMulti = q.type === "multi" || Array.isArray(answers[q.id]);
  if (isMulti) {
    const opts = q.options ?? [];
    const picked = opts.find(
      (o) => o.toLowerCase() === text.toLowerCase()
    );
    const value = picked ?? text;
    if (value) {
      next[q.id] = [value];
    }
    return next;
  }
  if (q.type === "slider") {
    const n = Number(text.replace(",", "."));
    next[q.id] = Number.isFinite(n) ? Math.min(10, Math.max(0, Math.round(n))) : 5;
    return next;
  }
  if (q.options?.length) {
    const match = q.options.find((o) => o.toLowerCase() === text.toLowerCase());
    if (match) {
      next[q.id] = match;
      return next;
    }
    const idx = Number(text);
    if (Number.isInteger(idx) && idx >= 1 && idx <= q.options.length) {
      next[q.id] = q.options[idx - 1];
      return next;
    }
  }
  next[q.id] = text;
  return next;
}

export function questionToOutbound(q: WaQuestionDef): WhatsAppOutbound {
  const label = waQuestionLabel(q);
  if (q.type === "text" || q.type === "slider") {
    const hint =
      q.type === "slider"
        ? "\n\nResponde con un número del 0 al 10."
        : "";
    return { type: "text", text: `${label}${hint}` };
  }

  const opts = [...(q.options ?? [])];
  if (opts.length === 0) {
    return { type: "text", text: label };
  }

  // Yes/No → reply buttons
  if (
    opts.length === 2 &&
    opts.some((o) => /^s[ií]$/i.test(o)) &&
    opts.some((o) => /^no$/i.test(o))
  ) {
    return {
      type: "buttons",
      text: label,
      buttons: opts.map((o) => ({
        id: `opt:${o}`,
        title: waOptionListTitle(o, 20),
      })),
    };
  }

  if (opts.length <= 3) {
    return {
      type: "buttons",
      text: label,
      buttons: opts.map((o) => ({
        id: `opt:${o}`,
        title: waOptionListTitle(o, 20),
      })),
    };
  }

  // List: numbered body; short titles (≤24) + full description (≤72).
  // WhatsApp lists are single-select only — never promise multi-select.
  const listed = opts.slice(0, 10);
  const bodyList = listed.map((o, i) => `${i + 1}. ${o}`).join("\n");
  return {
    type: "list",
    text: `${label}\n\n${bodyList}`,
    buttonLabel: "Ver opciones",
    sections: [
      {
        title: "Opciones",
        rows: listed.map((o) => {
          const title = waOptionListTitle(o, 24);
          const description = o.slice(0, 72);
          return {
            id: `opt:${o}`,
            title,
            // Always show full option under the short title when they differ.
            description: description !== title ? description : undefined,
          };
        }),
      },
    ],
  };
}

export function parseOptionReply(
  text: string,
  buttonId?: string | null
): string {
  if (buttonId?.startsWith("opt:")) return buttonId.slice(4);
  return text.trim();
}
