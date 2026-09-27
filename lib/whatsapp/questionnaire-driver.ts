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

/** WhatsApp list/button title. Prefer text before "(" for short readable titles. */
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

/** Unique short titles so WhatsApp does not reject the message (duplicate button titles). */
export function uniqueWaTitles(
  options: readonly string[],
  max: number
): { option: string; title: string }[] {
  const used = new Set<string>();
  return options.map((option) => {
    let title = waOptionListTitle(option, max);
    if (used.has(title.toLowerCase())) {
      const paren = /\(([^)]+)\)/.exec(option);
      if (paren?.[1]) {
        title = waOptionListTitle(paren[1].trim(), max);
      }
    }
    if (used.has(title.toLowerCase())) {
      const words = option
        .replace(/[()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean);
      const tail = words.slice(-2).join(" ");
      if (tail) title = waOptionListTitle(tail, max);
    }
    if (!title.trim() || used.has(title.toLowerCase())) {
      const base = (title.trim() || "Opción").slice(0, Math.max(1, max - 2));
      let n = 2;
      title = `${base}${n}`;
      while (used.has(title.toLowerCase()) && n < 9) {
        n += 1;
        title = `${base}${n}`;
      }
    }
    used.add(title.toLowerCase());
    return { option, title };
  });
}

/** Map a tap/typed reply to the full option (truncated button titles included). */
export function matchQuestionOption(
  raw: string,
  options: readonly string[]
): string | undefined {
  const text = raw.trim();
  if (!text || options.length === 0) return undefined;
  const lower = text.toLowerCase();
  const exact = options.find((o) => o.toLowerCase() === lower);
  if (exact) return exact;
  for (const max of [20, 24]) {
    const hit = uniqueWaTitles(options, max).find(
      (row) =>
        row.title.toLowerCase() === lower ||
        row.title.replace(/…$/u, "").toLowerCase() ===
          text.replace(/…$/u, "").toLowerCase()
    );
    if (hit) return hit.option;
  }
  if (lower.length < 4) return undefined;
  return options.find(
    (o) =>
      o.toLowerCase().startsWith(lower) ||
      lower.startsWith(o.toLowerCase().slice(0, Math.min(12, o.length)))
  );
}

/** Strip web-only parentheticals; keep multi-select guidance for WhatsApp. */
export function waQuestionLabel(
  q: WaQuestionDef,
  selected: readonly string[] = []
): string {
  let label = q.label
    .replace(/\s*\(elige una\)/gi, "")
    .trim();
  if (q.type === "multi") {
    const picked =
      selected.length > 0
        ? `\n\nElegido: ${selected.join(", ")}.`
        : "";
    label = `${label}${picked}\n\nPuedes marcar varias. Pulsa Listo cuando termines.`;
  }
  return label;
}

function numberOptions(options: readonly string[]): string {
  return options.map((o, i) => `${i + 1}. ${o}`).join("\n");
}

/** Keep the full option list visible; never truncate option wording. */
function questionBodyWithOptions(
  label: string,
  options: readonly string[],
  footer: string
): string {
  const block = options.length > 0 ? `\n\n${numberOptions(options)}` : "";
  const tail = footer ? `\n\n${footer}` : "";
  const full = `${label}${block}${tail}`;
  if (full.length <= 1024) return full;
  // Prefer keeping every option; trim the question label if needed.
  const keep = 1024 - block.length - tail.length;
  if (keep >= 24) return `${label.slice(0, keep - 1).trimEnd()}…${block}${tail}`;
  return full.slice(0, 1024);
}

/** Options like "Ninguna" end multi-select immediately. */
export function isMultiExclusiveOption(option: string): boolean {
  const t = option.trim().toLowerCase();
  if (!t) return false;
  if (/^ningun[oaá]?(\s+de\s+estas)?$/i.test(t)) return true;
  if (/ninguna de estas/i.test(t)) return true;
  if (t === "nada" || t === "no" || t === "ninguno de estos") return true;
  return false;
}

export type QuestionOutboundOpts = {
  selected?: readonly string[];
  /** 0-based page when there are more options than fit on reply buttons. */
  page?: number;
};

/**
 * Prefer reply buttons (shown directly). WhatsApp allows max 3 buttons.
 * First screen: 2 options + "Más". Tapping Más opens the remaining options
 * as a list (full wording in the message + row description).
 */
export function questionToOutbound(
  q: WaQuestionDef,
  opts: QuestionOutboundOpts = {}
): WhatsAppOutbound {
  return questionToMessages(q, opts)[0] ?? { type: "text", text: q.label };
}

/** One or two outbound messages: full visible text, then buttons/list. */
export function questionToMessages(
  q: WaQuestionDef,
  opts: QuestionOutboundOpts = {}
): WhatsAppOutbound[] {
  const selected = [...(opts.selected ?? [])];
  const page = Math.max(0, opts.page ?? 0);
  const label = waQuestionLabel(q, selected);

  if (q.type === "text" || q.type === "slider") {
    const hint =
      q.type === "slider"
        ? "\n\nResponde con un número del 0 al 10."
        : "";
    return [{ type: "text", text: `${label}${hint}` }];
  }

  const allOpts = [...(q.options ?? [])];
  if (allOpts.length === 0) {
    return [{ type: "text", text: label }];
  }

  const available =
    q.type === "multi"
      ? allOpts.filter((o) => !selected.some((s) => s.toLowerCase() === o.toLowerCase()))
      : allOpts;

  if (q.type === "multi" && available.length === 0) {
    return [
      {
        type: "buttons",
        text: questionBodyWithOptions(label, selected, "Pulsa Listo para continuar."),
        buttons: [{ id: "multi:done", title: "Listo" }],
      },
    ];
  }

  const showListo = q.type === "multi" && selected.length > 0;
  const overflow = available.length > 3 || (showListo && available.length > 2);

  // After Más: open remaining options as a list (full text in body + description).
  if (page > 0 && overflow) {
    const rest = available.slice(showListo ? 1 : 2);
    const rows = uniqueWaTitles(rest.length > 0 ? rest : available, 24).map(
      (row) => ({
        id: `opt:${row.option}`,
        title: row.title,
        description: row.option.slice(0, 72),
      })
    );
    if (rows.length === 0) {
      return questionToMessages(q, { selected, page: 0 });
    }
    const shown = rest.length > 0 ? rest : available;
    const footer = showListo
      ? "Abre Elegir para marcar otra, o pulsa Listo."
      : "Abre Elegir y marca la opción concreta.";
    const fullText = questionBodyWithOptions(label, shown, footer);
    const listMsg: WhatsAppOutbound = {
      type: "list",
      text: "Abre Elegir para ver y marcar una opción.",
      buttonLabel: "Elegir",
      sections: [{ title: "Opciones", rows: rows.slice(0, 10) }],
    };
    if (showListo) {
      return [
        { type: "text", text: fullText },
        listMsg,
        {
          type: "buttons",
          text: "Cuando termines, pulsa Listo.",
          buttons: [
            { id: "page:prev", title: "Anterior" },
            { id: "multi:done", title: "Listo" },
          ],
        },
      ];
    }
    return [
      { type: "text", text: fullText },
      listMsg,
      {
        type: "buttons",
        text: "¿Volver a las primeras opciones?",
        buttons: [{ id: "page:prev", title: "Anterior" }],
      },
    ];
  }

  let pageSize = overflow ? 2 : Math.min(3, available.length);
  if (showListo && overflow) pageSize = 1;
  else if (showListo) pageSize = Math.min(2, available.length);

  const slice = available.slice(0, pageSize);
  const titled = uniqueWaTitles(slice, 20);
  const buttons: { id: string; title: string }[] = titled.map((row) => ({
    id: `opt:${row.option}`,
    title: row.title,
  }));

  if (showListo && overflow) {
    buttons.length = Math.min(buttons.length, 1);
    buttons.push({ id: "page:next", title: "Más" });
    buttons.push({ id: "multi:done", title: "Listo" });
  } else if (showListo) {
    buttons.push({ id: "multi:done", title: "Listo" });
  } else if (overflow) {
    buttons.push({ id: "page:next", title: "Más" });
  }

  if (buttons.length === 0 && available.length > 0) {
    return questionToMessages(q, { selected, page: 0 });
  }

  const footer = overflow
    ? "Pulsa Más para abrir el resto de opciones (completas)."
    : showListo
      ? "Pulsa Listo cuando termines."
      : "Elige una opción.";

  const fullText = questionBodyWithOptions(label, available, footer);
  return [
    { type: "text", text: fullText },
    {
      type: "buttons",
      text: overflow
        ? "Elige una opción o pulsa Más para ver el resto."
        : "Elige una opción.",
      buttons: buttons.slice(0, 3),
    },
  ];
}

export function parseOptionReply(
  text: string,
  buttonId?: string | null
): string {
  if (buttonId?.startsWith("opt:")) return buttonId.slice(4);
  return text.trim();
}

export function isPageNavButton(
  buttonId?: string | null,
  text?: string
): "next" | "prev" | null {
  if (buttonId === "page:next") return "next";
  if (buttonId === "page:prev") return "prev";
  const t = (text ?? "").trim().toLowerCase();
  if (/^(más|mas|otras|otras opciones)$/i.test(t)) return "next";
  if (/^(anterior|atrás|atras)$/i.test(t)) return "prev";
  return null;
}

export function isMultiDoneButton(buttonId?: string | null, text?: string): boolean {
  if (buttonId === "multi:done") return true;
  return /^(listo|hecho|continuar|siguiente|ok|vale)$/i.test((text ?? "").trim());
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
    id: "mecanismo",
    label: "¿Qué pudo provocarlo? (elige una)",
    type: "single",
    options: GENERIC_FIELD_OPTIONS.mechanism,
    required: true,
  },
  {
    id: "alertas",
    label: "¿Te ocurre alguna de estas cosas?",
    type: "multi",
    options: GENERIC_FIELD_OPTIONS.alertas,
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
  if (!text) return next;

  const isMulti = q.type === "multi";
  if (isMulti) {
    const opts = q.options ?? [];
    const picked = matchQuestionOption(text, opts);
    const value = picked ?? text;
    if (isMultiExclusiveOption(value)) {
      next[q.id] = [value];
      return next;
    }
    const prev = Array.isArray(answers[q.id])
      ? [...(answers[q.id] as string[])]
      : [];
    if (!prev.some((p) => p.toLowerCase() === value.toLowerCase())) {
      prev.push(value);
    }
    next[q.id] = prev;
    return next;
  }
  if (q.type === "slider") {
    const n = Number(text.replace(",", "."));
    next[q.id] = Number.isFinite(n) ? Math.min(10, Math.max(0, Math.round(n))) : 5;
    return next;
  }
  if (q.options?.length) {
    const match = matchQuestionOption(text, q.options);
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

