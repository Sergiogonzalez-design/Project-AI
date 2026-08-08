import { getTestMeta } from "@/lib/clinical-reasoning/test-catalog";
import type {
  ClinicalConclusionNode,
  ClinicalHypothesis,
  ClinicalTestNode,
  ReasoningBranch,
} from "@/lib/clinical-reasoning/types";

export function branch(
  nextId: string,
  label?: string
): ReasoningBranch {
  return { nextId, label };
}

export function testNode(
  id: string,
  testId: string,
  positive: ReasoningBranch,
  negative: ReasoningBranch,
  overrides?: Partial<
    Pick<ClinicalTestNode, "title" | "description" | "procedure" | "evidenceNote">
  >
): ClinicalTestNode {
  const meta = getTestMeta(testId);
  return {
    type: "test",
    id,
    testId,
    title: overrides?.title ?? meta?.title ?? testId,
    description:
      overrides?.description ??
      meta?.procedure ??
      "Realiza la maniobra según protocolo clínico estándar.",
    procedure: overrides?.procedure ?? meta?.procedure ?? "",
    evidenceNote: overrides?.evidenceNote ?? meta?.evidenceNote,
    positive,
    negative,
  };
}

export function conclusionNode(
  id: string,
  title: string,
  summary: string,
  hypotheses: ClinicalHypothesis[],
  next?: { nextNodeId: string; nextTestId?: string }
): ClinicalConclusionNode {
  return {
    type: "conclusion",
    id,
    title,
    summary,
    hypotheses,
    nextNodeId: next?.nextNodeId,
    nextTestId: next?.nextTestId,
  };
}
