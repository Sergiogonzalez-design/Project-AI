import type { BodyPartId } from "@/lib/body-parts";
import {
  extractManiobrasFromReport,
  resolveBodyPartFromArea,
} from "@/lib/clinical-reasoning/parse-report";
import { CLINICAL_REASONING_TREES } from "@/lib/clinical-reasoning/trees";
import { isThighOrHamstringComplaint } from "@/lib/detect-body-part";
import type {
  ClinicalReasoningNode,
  ClinicalReasoningTree,
  ClinicalTestNode,
  ReasoningSession,
  ReasoningSessionStep,
} from "@/lib/clinical-reasoning/types";

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

  // Espalda/lumbar: prefer the full multi-test battery (SLR→…→Schober), never a leaf-only jump.
  if (tree.bodyPart === "back") {
    const preferred = [
      "slr-lasegue",
      "crossed-slr",
      "kemp",
      "faber",
      "schober",
    ] as const;
    const listed = new Set(
      maniobras.map((m) => m.testId).filter((id): id is string => Boolean(id))
    );
    for (const id of preferred) {
      if (!listed.has(id)) continue;
      const mapped = tree.entryByTestId?.[id];
      if (mapped && tree.nodes[mapped]) return mapped;
    }
    // Even without a matched line, start the battery if the tree defines it.
    if (tree.nodes.bk_slr) return "bk_slr";
    return tree.entryNodeId;
  }

  for (const line of maniobras) {
    if (!line.testId) continue;
    // Ignore ankle/foot-only shortcuts when this tree is not ankle_foot
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

function isPhysicalTestNode(
  node: ClinicalReasoningNode | null | undefined
): node is ClinicalTestNode {
  return Boolean(
    node &&
      node.type === "test" &&
      node.testId &&
      !node.testId.startsWith("route-")
  );
}

/** Prior Positivo/Negativo for each physical special-test id already answered. */
export function answeredPhysicalResults(
  session: ReasoningSession,
  tree: ClinicalReasoningTree
): Map<string, "positive" | "negative"> {
  const map = new Map<string, "positive" | "negative">();
  for (const step of session.steps) {
    if (!step.result) continue;
    const node = tree.nodes[step.nodeId];
    if (!isPhysicalTestNode(node)) continue;
    map.set(node.testId, step.result);
  }
  return map;
}

/**
 * Resolve the next node after an answer. If the destination (or chain) repeats a
 * physical testId already answered in this session, auto-follow using that prior
 * result so the same video/maneuver is never shown twice.
 */
export function resolveNextNodeId(
  tree: ClinicalReasoningTree,
  session: ReasoningSession,
  fromNodeId: string,
  result: "positive" | "negative"
): string | null {
  const from = tree.nodes[fromNodeId];
  if (!from || from.type !== "test") return null;

  const answered = answeredPhysicalResults(session, tree);
  if (isPhysicalTestNode(from)) {
    answered.set(from.testId, result);
  }

  let nextId: string | null =
    result === "positive" ? from.positive.nextId : from.negative.nextId;
  if (!nextId || !tree.nodes[nextId]) return null;

  const guard = new Set<string>([fromNodeId]);
  while (nextId && tree.nodes[nextId]) {
    if (guard.has(nextId)) return nextId;
    guard.add(nextId);

    const node: ClinicalReasoningNode = tree.nodes[nextId]!;
    if (node.type !== "test" || !isPhysicalTestNode(node)) break;

    const prior = answered.get(node.testId);
    if (!prior) break;

    const skipTo: string =
      prior === "positive" ? node.positive.nextId : node.negative.nextId;
    if (!skipTo || !tree.nodes[skipTo] || skipTo === nextId) break;
    nextId = skipTo;
  }

  return nextId && tree.nodes[nextId] ? nextId : null;
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

/**
 * Advance after Continuar on a conclusion, skipping physical tests already done.
 */
export function resolveContinueNodeId(
  tree: ClinicalReasoningTree,
  session: ReasoningSession,
  conclusionNodeId: string
): string | null {
  let nextId = advanceFromConclusion(tree, conclusionNodeId);
  if (!nextId) return null;

  const answered = answeredPhysicalResults(session, tree);
  const guard = new Set<string>([conclusionNodeId]);
  while (nextId && tree.nodes[nextId]) {
    if (guard.has(nextId)) return nextId;
    guard.add(nextId);
    const node: ClinicalReasoningNode = tree.nodes[nextId]!;
    if (node.type !== "test" || !isPhysicalTestNode(node)) break;
    const prior = answered.get(node.testId);
    if (!prior) break;
    const skipTo: string =
      prior === "positive" ? node.positive.nextId : node.negative.nextId;
    if (!skipTo || !tree.nodes[skipTo] || skipTo === nextId) break;
    nextId = skipTo;
  }
  return nextId && tree.nodes[nextId] ? nextId : null;
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

/** Record Positivo/Negativo on the answered node, then move to the next node. */
export function recordAnswerAndAdvance(
  session: ReasoningSession,
  answeredNodeId: string,
  result: "positive" | "negative",
  nextNodeId: string
): ReasoningSession {
  const now = new Date().toISOString();
  const steps = [...session.steps];
  const last = steps[steps.length - 1];
  if (last?.nodeId === answeredNodeId) {
    steps[steps.length - 1] = { ...last, result, at: now };
  } else {
    steps.push({ nodeId: answeredNodeId, result, at: now });
  }
  steps.push({ nodeId: nextNodeId, at: new Date().toISOString() });
  return {
    ...session,
    currentNodeId: nextNodeId,
    steps,
  };
}

export function goBack(session: ReasoningSession): ReasoningSession | null {
  if (session.steps.length <= 1) return null;
  const nextSteps = session.steps.slice(0, -1);
  const prev = nextSteps[nextSteps.length - 1];
  // Clear result on the restored node so it can be answered again.
  const cleaned = nextSteps.map((s, i) =>
    i === nextSteps.length - 1 ? { nodeId: s.nodeId, at: s.at } : s
  );
  return {
    ...session,
    currentNodeId: prev.nodeId,
    steps: cleaned,
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
