import type { BodyPartId } from "../body-parts";
import {
  extractManiobrasFromReport,
  resolveBodyPartFromArea,
} from "./parse-report";
import { CLINICAL_REASONING_TREES } from "./trees";
import { isThighOrHamstringComplaint } from "../detect-body-part";
import type {
  ClinicalReasoningNode,
  ClinicalReasoningTree,
  ReasoningSession,
  ReasoningSessionStep,
} from "./types";

export function getTreeForBodyPart(
  bodyPart: BodyPartId
): ClinicalReasoningTree | null {
  return CLINICAL_REASONING_TREES[bodyPart] ?? null;
}

export function hasClinicalReasoningForReport(opts: {
  bodyArea: string | null;
  physioReport: string;
}): boolean {
  const bodyPart = resolveBodyPartFromArea(opts.bodyArea);
  if (!bodyPart) return false;
  const tree = getTreeForBodyPart(bodyPart);
  if (!tree) return false;
  return extractManiobrasFromReport(opts.physioReport).length > 0;
}

export function resolveEntryNodeId(
  tree: ClinicalReasoningTree,
  physioReport: string,
  bodyArea: string | null = null
): string {
  // Muslo/isquio: no saltar a Hop/trauma por maniobras de tobillo mal listadas en el informe.
  if (
    bodyArea &&
    tree.bodyPart === "hip" &&
    isThighOrHamstringComplaint(bodyArea)
  ) {
    if (
      /isquio|hamstring|posterior|gl[uú]teo|muslo\s*posterior/i.test(bodyArea) &&
      tree.nodes.hp_route_posterior
    ) {
      return "hp_route_posterior";
    }
    return tree.entryNodeId;
  }

  const maniobras = extractManiobrasFromReport(physioReport);
  for (const line of maniobras) {
    if (!line.testId) continue;
    if (
      tree.bodyPart !== "ankle_foot" &&
      (line.testId === "anterior-drawer-ankle" ||
        line.testId === "thompson" ||
        line.testId === "windlass" ||
        line.testId === "heel-raise" ||
        line.testId === "matles")
    ) {
      continue;
    }
    const mapped = tree.entryByTestId?.[line.testId];
    if (mapped && tree.nodes[mapped]) return mapped;
  }
  return tree.entryNodeId;
}

export function createSession(opts: {
  reportId: string;
  bodyArea: string | null;
  physioReport: string;
}): ReasoningSession | null {
  const bodyPart = resolveBodyPartFromArea(opts.bodyArea);
  if (!bodyPart) return null;
  const tree = getTreeForBodyPart(bodyPart);
  if (!tree) return null;

  const entryNodeId = resolveEntryNodeId(tree, opts.physioReport, opts.bodyArea);
  if (!tree.nodes[entryNodeId]) return null;

  return {
    reportId: opts.reportId,
    bodyPart,
    entryNodeId,
    currentNodeId: entryNodeId,
    steps: [{ nodeId: entryNodeId, at: new Date().toISOString() }],
  };
}

export function getNode(
  tree: ClinicalReasoningTree,
  nodeId: string
): ClinicalReasoningNode | null {
  return tree.nodes[nodeId] ?? null;
}

export function applyAnswer(
  tree: ClinicalReasoningTree,
  currentNodeId: string,
  result: "positive" | "negative"
): string | null {
  const node = tree.nodes[currentNodeId];
  if (!node || node.type !== "test") return null;
  const nextId =
    result === "positive" ? node.positive.nextId : node.negative.nextId;
  return tree.nodes[nextId] ? nextId : null;
}

export function advanceFromConclusion(
  tree: ClinicalReasoningTree,
  conclusionNodeId: string
): string | null {
  const node = tree.nodes[conclusionNodeId];
  if (!node || node.type !== "conclusion" || !node.nextNodeId) return null;
  return tree.nodes[node.nextNodeId] ? node.nextNodeId : null;
}

export function pushStep(
  session: ReasoningSession,
  nodeId: string,
  result?: "positive" | "negative"
): ReasoningSession {
  const step: ReasoningSessionStep = {
    nodeId,
    result,
    at: new Date().toISOString(),
  };
  return {
    ...session,
    currentNodeId: nodeId,
    steps: [...session.steps, step],
  };
}

export function goBack(session: ReasoningSession): ReasoningSession | null {
  if (session.steps.length <= 1) return null;
  const nextSteps = session.steps.slice(0, -1);
  const prev = nextSteps[nextSteps.length - 1];
  return {
    ...session,
    currentNodeId: prev.nodeId,
    steps: nextSteps,
  };
}

export function getTreeForSession(
  session: ReasoningSession
): ClinicalReasoningTree | null {
  return getTreeForBodyPart(session.bodyPart);
}

/** Special tests already answered — excludes route/branch questions. */
export function countCompletedManiobras(
  session: ReasoningSession,
  tree: ClinicalReasoningTree
): number {
  let n = 0;
  for (const step of session.steps) {
    if (!step.result) continue;
    const node = tree.nodes[step.nodeId];
    if (node?.type !== "test") continue;
    if (node.testId.startsWith("route-")) continue;
    n += 1;
  }
  return n;
}
