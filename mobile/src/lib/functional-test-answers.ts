import {
  filterPatientSafeFunctionalTests,
} from "./patient-safe-functional-tests";

export type FunctionalTestItem = {
  n: number;
  /** May include a trailing ⟦media-id⟧ marker for demo video lookup. */
  prompt: string;
};

export type FunctionalTestAnswer = "si" | "no";

const SECTION_HEADING =
  /^(Pruebas funcionales|Functional tests|Preguntas\s*\/\s*pruebas para completar el informe|Questions\s*\/\s*tests to complete the report)\b/i;
const NEXT_HEADING = /^(?:\*\*)([^*]+)(?:\*\*)\s*$/;
const NUMBERED =
  /^(?:[-*]\s+)?(?:\*\*)?(\d+)[.)](?:\*\*)?\s+(?:\*\*)?(.+?)(?:\*\*)?\s*$/;

function stripStars(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

export function splitFunctionalTests(content: string): {
  before: string;
  heading: string;
  tests: FunctionalTestItem[];
  after: string;
} | null {
  const lines = content.split("\n");
  let headingIndex = -1;
  let heading = "Pruebas funcionales";

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim().replace(/\*/g, "");
    if (SECTION_HEADING.test(trimmed)) {
      headingIndex = i;
      heading = /questions\s*\/\s*tests|functional tests/i.test(trimmed)
        ? /questions\s*\/\s*tests/i.test(trimmed)
          ? "Questions / tests to complete the report"
          : "Functional tests"
        : /preguntas\s*\/\s*pruebas/i.test(trimmed)
          ? "Preguntas / pruebas para completar el informe"
          : "Pruebas funcionales";
      break;
    }
  }

  if (headingIndex === -1) return null;

  const tests: FunctionalTestItem[] = [];
  let lastTestLine = -1;
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    const headingMatch = NEXT_HEADING.exec(trimmed);
    if (headingMatch && !SECTION_HEADING.test(headingMatch[1].trim())) {
      break;
    }
    const numbered = NUMBERED.exec(trimmed);
    if (numbered) {
      lastTestLine = i;
      tests.push({
        n: Number(numbered[1]),
        prompt: stripStars(numbered[2]),
      });
    }
  }

  if (tests.length < 2) return null;

  // Drop clinician special tests (Lachman, Neer, …) — patient Sí/No is home only.
  const safe = filterPatientSafeFunctionalTests(tests);
  if (safe.length < 2) return null;

  return {
    before: lines.slice(0, headingIndex).join("\n").trimEnd(),
    heading,
    tests: safe,
    after: lines.slice(lastTestLine + 1).join("\n").trim(),
  };
}

export function formatFunctionalTestAnswers(
  tests: FunctionalTestItem[],
  answers: Record<number, FunctionalTestAnswer>,
  language: "es" | "en" = "es"
): string {
  const yes = language === "en" ? "Yes" : "Sí";
  const no = language === "en" ? "No" : "No";
  const title =
    language === "en"
      ? "Functional test results:"
      : "Resultados de las pruebas funcionales:";
  const lines = tests.map((t) => {
    const ans = answers[t.n] === "no" ? no : yes;
    const prompt = t.prompt.replace(/⟦[a-z0-9-]+⟧\s*$/i, "").trim();
    return `${t.n}. ${ans} — ${prompt}`;
  });
  return `${title}\n${lines.join("\n")}`;
}

export function latestUnansweredFunctionalTests(
  messages: { id: string; role: string; content: string }[]
): { messageId: string; tests: FunctionalTestItem[]; heading: string } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "user") {
      if (looksLikeFunctionalTestAnswers(msg.content)) return null;
      continue;
    }
    if (msg.role !== "assistant") continue;
    const parsed = splitFunctionalTests(msg.content);
    if (parsed) {
      return {
        messageId: msg.id,
        tests: parsed.tests,
        heading: parsed.heading,
      };
    }
  }
  return null;
}

function looksLikeFunctionalTestAnswers(text: string): boolean {
  const t = text.trim();
  if (/resultados de las pruebas funcionales|functional test results/i.test(t)) {
    return true;
  }
  const yesNoLines = t.match(/^\s*\d+[.)]\s*(s[ií]|yes|no)\b/gim);
  return (yesNoLines?.length ?? 0) >= 2;
}
