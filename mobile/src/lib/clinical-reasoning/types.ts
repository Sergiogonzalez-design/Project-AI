import type { BodyPartId } from "../body-parts";

export type HypothesisProbability = "alta" | "media" | "baja";

export type ClinicalHypothesis = {
  name: string;
  probability: HypothesisProbability;
  rationale: string;
};

export type ReasoningBranch = {
  /** Shown on the Positive / Negative button when useful */
  label?: string;
  nextId: string;
};

export type ClinicalTestNode = {
  type: "test";
  id: string;
  /** Matches `ClinicalTestImage.id` in clinical-test-images.ts */
  testId: string;
  title: string;
  description: string;
  /** How to perform — shown to physio */
  procedure: string;
  /** Brief evidence-oriented note (PubMed / guías clínicas) */
  evidenceNote?: string;
  positive: ReasoningBranch;
  negative: ReasoningBranch;
};

export type ClinicalConclusionNode = {
  type: "conclusion";
  id: string;
  title: string;
  summary: string;
  hypotheses: ClinicalHypothesis[];
  /** Optional follow-up test if not terminal */
  nextTestId?: string;
  nextNodeId?: string;
};

export type ClinicalReasoningNode = ClinicalTestNode | ClinicalConclusionNode;

export type ClinicalReasoningTree = {
  bodyPart: BodyPartId;
  title: string;
  /** Default first node when report tests cannot be matched */
  entryNodeId: string;
  /** Optional: start at a specific node when report lists this test first */
  entryByTestId?: Partial<Record<string, string>>;
  nodes: Record<string, ClinicalReasoningNode>;
};

export type ParsedManiobraLine = {
  line: string;
  testId: string | null;
  title: string | null;
};

export type ReasoningSessionStep = {
  nodeId: string;
  result?: "positive" | "negative";
  at: string;
};

export type ReasoningSession = {
  reportId: string;
  bodyPart: BodyPartId;
  entryNodeId: string;
  currentNodeId: string;
  steps: ReasoningSessionStep[];
};
