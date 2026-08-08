export type {
  ClinicalHypothesis,
  ClinicalReasoningNode,
  ClinicalReasoningTree,
  ClinicalTestNode,
  ClinicalConclusionNode,
  HypothesisProbability,
  ParsedManiobraLine,
  ReasoningSession,
} from "@/lib/clinical-reasoning/types";

export {
  applyAnswer,
  advanceFromConclusion,
  createSession,
  getNode,
  getTreeForBodyPart,
  getTreeForSession,
  goBack,
  hasClinicalReasoningForReport,
  pushStep,
  resolveEntryNodeId,
} from "@/lib/clinical-reasoning/engine";

export {
  extractManiobrasFromReport,
  hasManiobrasSection,
  resolveBodyPartFromArea,
} from "@/lib/clinical-reasoning/parse-report";

export { CLINICAL_REASONING_TREES } from "@/lib/clinical-reasoning/trees";
