import { callEdgeJson } from "./consulta-api";
import type { AppLocale } from "./i18n/translations";
import {
  findFunctionalProtocolLoose,
  generalRetestReminderCopy,
  hamstringRetestReminderCopy,
  calfRetestReminderCopy,
  achillesRetestReminderCopy,
  adductorRetestReminderCopy,
  bicepsRetestReminderCopy,
  pectoralRetestReminderCopy,
  pectoralSecondRetestReminderCopy,
  tricepsRetestReminderCopy,
  quadRetestReminderCopy,
  UNIVERSAL_REST_HOURS,
} from "./consulta-functional-protocols";
import {
  scheduleReminders,
  type ScheduledReminder,
} from "./notifications";
import { supabase } from "./supabase";

type InjuryContext = {
  bodyArea: string;
  description: string;
  painLevel: number | null;
  symptomSummary: string;
};

function normalizeArea(area: string, locale: AppLocale): string {
  const lower = area.toLowerCase();
  if (/hombro|shoulder/.test(lower)) return locale === "en" ? "shoulder" : "hombro";
  if (/codo|elbow/.test(lower)) return locale === "en" ? "elbow" : "codo";
  if (/muñeca|muneca|wrist|mano|hand/.test(lower)) {
    return locale === "en" ? "wrist/hand" : "muñeca/mano";
  }
  if (/dedo|finger/.test(lower)) return locale === "en" ? "finger" : "dedos";
  return area || (locale === "en" ? "your injury" : "tu lesión");
}

function fallbackReminders(
  injury: InjuryContext,
  locale: AppLocale
): ScheduledReminder[] {
  const area = normalizeArea(injury.bodyArea, locale);
  const pain =
    injury.painLevel != null && injury.painLevel >= 0
      ? injury.painLevel
      : null;

  if (locale === "en") {
    return [
      {
        dayOffset: 0,
        hour: 10,
        title: `Gentle mobility — ${area}`,
        body: `Take 5 quiet minutes for pain-free mobility around your ${area}. Stop if symptoms spike.`,
      },
      {
        dayOffset: 1,
        hour: 18,
        title: "Load check-in",
        body: `How does your ${area} feel after today? Note pain (0–10)${
          pain != null ? ` — last recorded: ${pain}/10` : ""
        } and avoid sudden spikes in training.`,
      },
      {
        dayOffset: 2,
        hour: 10,
        title: "Recovery habit",
        body: `Short activation + controlled range for your ${area}. Quality over intensity.`,
      },
      {
        dayOffset: 3,
        hour: 19,
        title: "Sleep & tissue recovery",
        body: `Protect recovery tonight: hydrate, easy evening, and avoid sleeping positions that irritate your ${area}.`,
      },
      {
        dayOffset: 5,
        hour: 11,
        title: "Progress check",
        body: `Compare today with day one. If night pain, swelling, or weakness is rising, reopen Kinora or see a clinician.`,
      },
      {
        dayOffset: 7,
        hour: 10,
        title: "Weekly follow-up",
        body: `Time for a Kinora check-in about your ${area}. Share what improved and what still limits you.`,
      },
    ];
  }

  return [
    {
      dayOffset: 0,
      hour: 10,
      title: `Movilidad suave — ${area}`,
      body: `Dedica 5 minutos a movilidad sin dolor en ${area}. Para si el síntoma sube de golpe.`,
    },
    {
      dayOffset: 1,
      hour: 18,
      title: "Revisión de carga",
      body: `¿Cómo está tu ${area} tras el día? Anota el dolor (0–10)${
        pain != null ? ` — último registro: ${pain}/10` : ""
      } y evita picos bruscos de entrenamiento.`,
    },
    {
      dayOffset: 2,
      hour: 10,
      title: "Hábito de recuperación",
      body: `Activación breve + rango controlado para ${area}. Prioriza calidad, no intensidad.`,
    },
    {
      dayOffset: 3,
      hour: 19,
      title: "Sueño y recuperación",
      body: `Cuida la recuperación esta noche: hidrátate, noche tranquila y evita posturas que irriten ${area}.`,
    },
    {
      dayOffset: 5,
      hour: 11,
      title: "Chequeo de progreso",
      body: `Compara con el primer día. Si sube el dolor nocturno, la inflamación o la debilidad, vuelve a Kinora o consulta a un profesional.`,
    },
    {
      dayOffset: 7,
      hour: 10,
      title: "Seguimiento semanal",
      body: `Momento de un check-in en Kinora sobre ${area}. Cuenta qué mejoró y qué aún te limita.`,
    },
  ];
}

export async function fetchLatestInjuryContext(): Promise<InjuryContext | null> {
  const { data: consulta } = await supabase
    .from("consultas")
    .select("body_area, description, pain_level, symptom_details, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (consulta) {
    const details = consulta.symptom_details as Record<string, unknown> | null;
    const summaryParts = [
      consulta.description ? String(consulta.description) : "",
      details?.questionnairePart
        ? `Cuestionario: ${String(details.questionnairePart)}`
        : "",
      details?.redFlagsUrgent ? "Banderas rojas: sí" : "",
    ].filter(Boolean);

    return {
      bodyArea: String(consulta.body_area ?? ""),
      description: String(consulta.description ?? ""),
      painLevel:
        typeof consulta.pain_level === "number" ? consulta.pain_level : null,
      symptomSummary: summaryParts.join("\n"),
    };
  }

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!conv) return null;

  return {
    bodyArea: String(conv.title ?? ""),
    description: String(conv.title ?? ""),
    painLevel: null,
    symptomSummary: String(conv.title ?? ""),
  };
}

function parseAiReminders(raw: unknown): ScheduledReminder[] | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const list = data.reminders;
  if (!Array.isArray(list) || list.length === 0) return null;

  const parsed: ScheduledReminder[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const body = typeof row.body === "string" ? row.body.trim() : "";
    if (!title || !body) continue;
    const dayOffset =
      typeof row.dayOffset === "number"
        ? Math.max(0, Math.min(14, Math.round(row.dayOffset)))
        : parsed.length;
    const hour =
      typeof row.hour === "number"
        ? Math.max(7, Math.min(21, Math.round(row.hour)))
        : 10;
    parsed.push({ title, body, dayOffset, hour });
  }

  return parsed.length > 0 ? parsed.slice(0, 8) : null;
}

export async function generateInjuryReminders(
  locale: AppLocale
): Promise<{ reminders: ScheduledReminder[]; source: "ai" | "fallback"; hasInjury: boolean }> {
  const injury = await fetchLatestInjuryContext();
  if (!injury) {
    return {
      reminders: fallbackReminders(
        {
          bodyArea: locale === "en" ? "recovery" : "recuperación",
          description: "",
          painLevel: null,
          symptomSummary: "",
        },
        locale
      ),
      source: "fallback",
      hasInjury: false,
    };
  }

  let reminders: ScheduledReminder[] = [];
  let source: "ai" | "fallback" = "fallback";

  try {
    const raw = await callEdgeJson({
      mode: "reminders",
      language: locale,
      bodyArea: injury.bodyArea,
      description: injury.description,
      painLevel: injury.painLevel ?? 0,
      symptomContext: injury.symptomSummary,
    });
    const ai = parseAiReminders(raw);
    if (ai) {
      reminders = ai;
      source = "ai";
    }
  } catch {
    // Fall through to local adaptive templates.
  }

  if (reminders.length === 0) {
    reminders = fallbackReminders(injury, locale);
  }

  const hay = `${injury.bodyArea}\n${injury.description}\n${injury.symptomSummary}`;
  const protocol = findFunctionalProtocolLoose(hay);
  const alreadyRetest = reminders.some((r) =>
    /retest|test de nuevo|repeat|repite los tests|repite el test/i.test(
      `${r.title} ${r.body}`
    )
  );

  if (!alreadyRetest) {
    const copy =
      protocol?.id === "quad"
        ? quadRetestReminderCopy(locale)
        : protocol?.id === "hamstring"
          ? hamstringRetestReminderCopy(locale)
          : protocol?.id === "calf"
            ? calfRetestReminderCopy(locale)
            : protocol?.id === "achilles"
              ? achillesRetestReminderCopy(locale)
              : protocol?.id === "adductor"
                ? adductorRetestReminderCopy(locale)
                : protocol?.id === "biceps"
                  ? bicepsRetestReminderCopy(locale)
                  : protocol?.id === "pectoral"
                    ? pectoralRetestReminderCopy(locale)
                    : protocol?.id === "triceps"
                      ? tricepsRetestReminderCopy(locale)
                      : generalRetestReminderCopy(locale, normalizeArea(injury.bodyArea, locale));
    const firstHours =
      protocol?.retestNotifyHours ?? UNIVERSAL_REST_HOURS.notify;
    reminders = [
      {
        title: copy.title,
        body: copy.body,
        dayOffset: 1,
        hour: 10,
        hoursFromNow: firstHours,
      },
      ...(protocol?.id === "pectoral" && protocol.secondRetestNotifyHours
        ? [
            {
              ...pectoralSecondRetestReminderCopy(locale),
              dayOffset: 2,
              hour: 10,
              hoursFromNow:
                firstHours + protocol.secondRetestNotifyHours,
            },
          ]
        : []),
      ...reminders,
    ].slice(0, 8);
  }

  return { reminders, source, hasInjury: true };
}

export async function refreshSmartReminders(locale: AppLocale): Promise<{
  scheduled: number;
  hasInjury: boolean;
  source: "ai" | "fallback";
}> {
  const { reminders, source, hasInjury } = await generateInjuryReminders(locale);
  const scheduled = await scheduleReminders(reminders);
  return { scheduled, hasInjury, source };
}
