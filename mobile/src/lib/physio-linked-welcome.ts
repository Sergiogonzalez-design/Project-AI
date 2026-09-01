/**
 * Welcome copy for the patient Fisioterapia flow (after entering a physio code).
 */

import {
  findFunctionalProtocolLoose,
  t,
  type AppLocale,
} from "./consulta-functional-protocols";
import {
  FUNCTIONAL_TEST_QUESTIONS,
  resolveFunctionalRegion,
} from "./consulta-functional-tests";
import {
  splitFunctionalTests,
  type FunctionalTestItem,
} from "./functional-test-answers";
import {
  mediaIdForProtocolItem,
  resolveFunctionalTestMedia,
  withFunctionalMediaMarker,
} from "./functional-test-media";

export function physioDisplayName(
  physioName: string | null | undefined,
  language: AppLocale = "es"
): string {
  const trimmed = physioName?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;
  return language === "en" ? "your physiotherapist" : "tu fisioterapeuta";
}

/** Short greeting on the Physio intro screen before chat. */
export function buildPhysioLinkedIntroGreeting(
  physioName: string | null | undefined,
  language: AppLocale = "es"
): string {
  const name = physioDisplayName(physioName, language);
  if (language === "en") {
    return `Hi! I'm Physio. ${name} asked you to complete this consultation. When you finish — including a short set of functional tests — they will receive a report to better understand your case before the appointment.`;
  }
  return `¡Hola! Soy Physio. ${name} te ha pedido que completes esta consulta. Al terminar —incluido un breve bloque de pruebas funcionales—, recibirá un informe para entender mejor tu caso antes de la cita.`;
}

/** First assistant bubble once the chat opens. */
export function buildPhysioLinkedWelcome(
  physioName: string | null | undefined,
  opts?: { guest?: boolean; clinicName?: string | null; language?: AppLocale }
): string {
  const language = opts?.language ?? "es";
  const name = physioDisplayName(physioName, language);
  const clinic = opts?.clinicName?.trim();
  const who = clinic ? `**${name}**, **${clinic}**` : `**${name}**`;
  if (language === "en") {
    const keepTalking = opts?.guest
      ? "If you want to keep talking with the AI afterwards, you can create an account when you finish."
      : "If you have other general questions or want to chat freely with the AI, use the **Consulta** tab.";
    return `Hi. I'm Physio, AIKinora's assistant. Your physiotherapist ${who} sent you here to prepare a **clinical report** they will see on their dashboard before the appointment.

Tell me what bothers you (where, when it started, and how it affects you). I'll ask questions and a few simple **functional tests**. When you send those results, I'll generate the report for ${who}.

${keepTalking}

When you're ready, start by describing your complaint.

AIKinora is guidance only and does not replace an in-person assessment.`;
  }
  const keepTalking = opts?.guest
    ? "Si quieres seguir hablando con la IA después, podrás crear una cuenta al terminar."
    : "Si tienes otras dudas generales o quieres hablar libremente con la IA, usa la pestaña **Consulta**.";
  return `Hola. Soy Physio, el asistente de AIKinora. Tu fisioterapeuta ${who} te ha enviado aquí para preparar un **informe clínico** que verá en su panel antes de la cita.

Cuéntame qué te molesta (dónde, cuándo empezó y cómo te afecta), te haré preguntas y te pediré unas **pruebas funcionales** sencillas. Cuando me envíes esos resultados, generaré el informe para ${who}.

${keepTalking}

Cuando quieras, empieza describiendo tu molestia.

AIKinora es una IA orientativa: no sustituye una valoración presencial.`;
}

function stripYesNoHint(q: string): string {
  return q.replace(/\s*\((?:S[IÍ]\/NO|YES\/NO|Yes\/No)\)\s*$/i, "").trim();
}

function testsLookLikeLanguage(
  tests: FunctionalTestItem[],
  language: AppLocale
): boolean {
  const sample = tests.map((t) => t.prompt).join(" ");
  const hasSpanish =
    /[áéíóúüñ¿¡]/i.test(sample) ||
    /\b(puedes|duele|dolor|cuando|hacia|sin|con|el|la|los|las|una|unos|este|esta|fuerte|espalda|rodilla|hombro|codo)\b/i.test(
      sample
    );
  const hasEnglish =
    /\b(can you|does|when you|without|with the|your|pain|hurt|knee|shoulder|elbow|back|wrist|ankle|strong)\b/i.test(
      sample
    );
  if (language === "en") return hasEnglish || !hasSpanish;
  return hasSpanish || !hasEnglish;
}

function fallbackFunctionalTests(
  bodyArea: string,
  language: AppLocale
): FunctionalTestItem[] {
  const protocol = findFunctionalProtocolLoose(bodyArea);
  if (protocol?.items.length) {
    return protocol.items.slice(0, 6).map((item, i) => ({
      n: i + 1,
      prompt: withFunctionalMediaMarker(
        stripYesNoHint(t(item.question, language)),
        mediaIdForProtocolItem(item.id)
      ),
    }));
  }
  const region = resolveFunctionalRegion(bodyArea);
  if (language === "en") {
    const enGeneric = [
      "Can you move the affected area without strong pain?",
      "Does the pain also appear at rest?",
      "Can you put weight on / use that area for 20–30 seconds without intense pain?",
      "Does a short walk or light activity clearly worsen it?",
      "Does coughing, sneezing, or a deep breath increase the pain?",
    ];
    return enGeneric.map((q, i) => ({ n: i + 1, prompt: q }));
  }
  const questions =
    FUNCTIONAL_TEST_QUESTIONS[region] ?? FUNCTIONAL_TEST_QUESTIONS.generic;
  return questions.slice(0, 6).map((q, i) => ({
    n: i + 1,
    prompt: stripYesNoHint(q),
  }));
}

/**
 * Patient-visible reply after the questionnaire: thanks + physio received answers +
 * Sí/No functional tests. Never includes possible injuries.
 */
export function buildPhysioLinkedPostQuestionnaireMessage(opts: {
  physioName?: string | null;
  aiText: string;
  bodyArea?: string;
  language?: AppLocale;
}): string {
  const language = opts.language ?? "es";
  const name = physioDisplayName(opts.physioName, language);
  const ack =
    language === "en"
      ? `Thanks for sharing your answers.

We're preparing the clinical report for **${name}**.

To complete it, answer the following questions and do these tests (at home, carefully). Tap **Yes** or **No** for each one.`
      : `Gracias por compartir tus respuestas.

Estamos preparando el informe clínico para **${name}**.

Para completarlo, responde a las siguientes preguntas y haz estas pruebas (en casa, con cuidado). Pulsa **Sí** o **No** en cada una.`;

  const fromAi = splitFunctionalTests(opts.aiText)?.tests ?? [];
  const fallback = fallbackFunctionalTests(opts.bodyArea ?? "", language);
  const tests =
    fromAi.length >= 2 && testsLookLikeLanguage(fromAi, language)
      ? fromAi
      : fallback.length >= 2
        ? fallback
        : fromAi;
  if (tests.length < 2) return ack;

  const heading =
    language === "en"
      ? "Questions / tests to complete the report"
      : "Preguntas / pruebas para completar el informe";
  const list = tests
    .map((item) => {
      const media = resolveFunctionalTestMedia({ prompt: item.prompt });
      return `${item.n}. ${withFunctionalMediaMarker(item.prompt, media?.id)}`;
    })
    .join("\n");
  return `${ack}\n\n**${heading}**\n\n${list}`;
}

/** If the patient writes something else before answering the tests. */
export function buildPhysioLinkedFunctionalTestsPrompt(
  physioName: string | null | undefined,
  language: AppLocale = "es"
): string {
  const name = physioDisplayName(physioName, language);
  if (language === "en") {
    return `To complete the report for **${name}**, answer the questions / do the tests above and tap **Yes** or **No** on each one. Nothing else to write.`;
  }
  return `Para completar el informe de **${name}**, responde a las preguntas / haz las pruebas de arriba y pulsa **Sí** o **No** en cada una. No hace falta escribir nada más.`;
}

/** Short chat bubble saved after the physio report is sent (patient does not see clinical summary). */
export function buildPhysioLinkedCompletionMessage(
  physioName: string | null | undefined,
  opts?: { guest?: boolean; language?: AppLocale }
): string {
  const language = opts?.language ?? "es";
  const name = physioDisplayName(physioName, language);
  if (language === "en") {
    const keepTalking = opts?.guest
      ? "If you want to keep talking with the AI, create an account."
      : "If you want to keep using the AI, open the **Consulta** tab.";
    return `Thank you for your time!

**${name}** has already received the information about your complaint **and the functional test results**, and will be better prepared for your treatment.

${keepTalking}

AIKinora is guidance only and does not replace an in-person assessment.`;
  }
  const keepTalking = opts?.guest
    ? "Si quieres seguir hablando con la IA, crea una cuenta."
    : "Si quieres seguir usando la IA, abre la pestaña **Consulta**.";
  return `¡Gracias por tu tiempo!

**${name}** ya ha recibido la información de tu molestia **y los resultados de las pruebas funcionales**, y podrá prepararse mejor para tu tratamiento.

${keepTalking}

AIKinora es una IA orientativa: no sustituye una valoración presencial.`;
}
