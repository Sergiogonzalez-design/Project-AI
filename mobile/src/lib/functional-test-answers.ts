export type FunctionalTestItem = {
  n: number;
  prompt: string;
};

export type FunctionalTestAnswer = "si" | "no";

const SECTION_HEADING = /^(Pruebas funcionales|Functional tests)\b/i;
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
      heading = /functional tests/i.test(trimmed)
        ? "Functional tests"
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

  return {
    before: lines.slice(0, headingIndex).join("\n").trimEnd(),
    heading,
    tests,
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
    return `${t.n}. ${ans} — ${t.prompt}`;
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
