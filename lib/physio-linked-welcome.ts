/**
 * Welcome copy for the patient Fisioterapia flow (after entering a physio code).
 */

import {
  findFunctionalProtocolLoose,
  t,
  type AppLocale,
} from "@/lib/consulta-functional-protocols";
import {
  FUNCTIONAL_TEST_QUESTIONS,
  resolveFunctionalRegion,
} from "@/lib/consulta-functional-tests";
import {
  splitFunctionalTests,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";

export function physioDisplayName(physioName: string | null | undefined): string {
  const trimmed = physioName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "tu fisioterapeuta";
}

/** Short greeting on the Physio intro screen before chat. */
export function buildPhysioLinkedIntroGreeting(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `¡Hola! Soy Physio. ${name} te ha pedido que completes esta consulta. Al terminar —incluido un breve bloque de pruebas funcionales—, recibirá un informe para entender mejor tu caso antes de la cita.`;
}

/** First assistant bubble once the chat opens. */
export function buildPhysioLinkedWelcome(
  physioName: string | null | undefined,
  opts?: { guest?: boolean }
): string {
  const name = physioDisplayName(physioName);
  const keepTalking = opts?.guest
    ? "Si quieres seguir hablando con la IA después, podrás crear una cuenta al terminar."
    : "Si tienes otras dudas generales o quieres hablar libremente con la IA, usa la pestaña **Consulta**.";
  return `Hola. Soy Physio, el asistente de AIKinora. Tu fisioterapeuta **${name}** te ha enviado aquí para preparar un **informe clínico** que verá en su panel antes de la cita.

Cuéntame qué te molesta (dónde, cuándo empezó y cómo te afecta), te haré preguntas y te pediré unas **pruebas funcionales** sencillas. Cuando me envíes esos resultados, generaré el informe para **${name}**.

${keepTalking}

Cuando quieras, empieza describiendo tu molestia.

AIKinora es una IA orientativa: no sustituye una valoración presencial.`;
}

function stripYesNoHint(prompt: string): string {
  return prompt.replace(/\s*\(SÍ\/NO\)\s*$/i, "").trim();
}

function fallbackFunctionalTests(
  bodyArea: string,
  language: AppLocale
): FunctionalTestItem[] {
  const protocol = findFunctionalProtocolLoose(bodyArea);
  if (protocol?.items.length) {
    return protocol.items.slice(0, 6).map((item, i) => ({
      n: i + 1,
      prompt: stripYesNoHint(t(item.question, language)),
    }));
  }
  const region = resolveFunctionalRegion(bodyArea);
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
  const name = physioDisplayName(opts.physioName);
  const ack =
    language === "en"
      ? `Thanks for sharing your answers.

**${name}** has already received them.

To complete the report, do these **functional tests** (at home, carefully) and tap **Yes** or **No** for each one.`
      : `Gracias por compartir tus respuestas.

**${name}** ya las ha recibido.

Para completar el informe, haz estas **pruebas funcionales** (en casa, con cuidado) y pulsa **Sí** o **No** en cada una.`;

  const tests =
    splitFunctionalTests(opts.aiText)?.tests ??
    fallbackFunctionalTests(opts.bodyArea ?? "", language);
  if (tests.length < 2) return ack;

  const heading = language === "en" ? "Functional tests" : "Pruebas funcionales";
  const list = tests.map((item) => `${item.n}. ${item.prompt}`).join("\n");
  return `${ack}\n\n**${heading}**\n\n${list}`;
}

/** If the patient writes something else before answering the tests. */
export function buildPhysioLinkedFunctionalTestsPrompt(
  physioName: string | null | undefined,
  language: AppLocale = "es"
): string {
  const name = physioDisplayName(physioName);
  if (language === "en") {
    return `To complete the report for **${name}**, tap **Yes** or **No** on each **functional test** above. Nothing else to write.`;
  }
  return `Para completar el informe de **${name}**, pulsa **Sí** o **No** en cada **prueba funcional** de arriba. No hace falta escribir nada más.`;
}

/** Short chat bubble saved after the physio report is sent (patient does not see clinical summary). */
export function buildPhysioLinkedCompletionMessage(
  physioName: string | null | undefined,
  opts?: { guest?: boolean }
): string {
  const name = physioDisplayName(physioName);
  const keepTalking = opts?.guest
    ? "Si quieres seguir hablando con la IA, crea una cuenta."
    : "Si quieres seguir usando la IA, abre la pestaña **Consulta**.";
  return `¡Gracias por tu tiempo!

**${name}** ya ha recibido la información de tu molestia **y los resultados de las pruebas funcionales**, y podrá prepararse mejor para tu tratamiento.

${keepTalking}

AIKinora es una IA orientativa: no sustituye una valoración presencial.`;
}
