import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../lib/colors";
import { screenHeaderBarPadding } from "../lib/screen-header-insets";
import { bodyPartLabel } from "../lib/body-parts";
import { isThighOrHamstringComplaint } from "../lib/detect-body-part";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import { CLINICAL_TEST_IMAGES } from "../lib/clinical-test-images";
import {
  advanceFromConclusion,
  applyAnswer,
  countCompletedManiobras,
  createSession,
  getNode,
  getTreeForSession,
  goBack,
  pushStep,
  type ReasoningSession,
} from "../lib/clinical-reasoning";
import type {
  ClinicalConclusionNode,
  ClinicalHypothesis,
  ClinicalTestNode,
  HypothesisProbability,
} from "../lib/clinical-reasoning/types";

const PROBABILITY_ORDER: Record<HypothesisProbability, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

function sortHypotheses(hypotheses: ClinicalHypothesis[]): ClinicalHypothesis[] {
  return [...hypotheses].sort(
    (a, b) => PROBABILITY_ORDER[a.probability] - PROBABILITY_ORDER[b.probability]
  );
}

function probabilityBadge(p: HypothesisProbability) {
  if (p === "alta") return { bg: "#DBEAFE", fg: "#1E40AF", label: "Alta probabilidad" };
  if (p === "media") return { bg: "#FEF3C7", fg: "#92400E", label: "Probabilidad media" };
  return { bg: "#F3F4F6", fg: "#374151", label: "Baja probabilidad" };
}

function TestCard({
  node,
  onAnswer,
}: {
  node: ClinicalTestNode;
  onAnswer: (result: "positive" | "negative") => void;
}) {
  const image = CLINICAL_TEST_IMAGES.find((t) => t.id === node.testId);
  const isRouteNode = node.testId.startsWith("route-");
  const positiveTitle = isRouteNode ? "Sí" : "Positivo";
  const negativeTitle = isRouteNode ? "No" : "Negativo";

  return (
    <View style={styles.cardInner}>
      <View style={styles.testHeader}>
        <Text style={styles.testTitle}>{node.title}</Text>
        <Text style={styles.testDesc}>{node.description}</Text>
        {node.evidenceNote ? (
          <View style={styles.evidenceBox}>
            <Text style={styles.evidenceText}>{node.evidenceNote}</Text>
          </View>
        ) : null}
      </View>

      {!isRouteNode && image ? (
        <ClinicalTestMediaBlock test={image} />
      ) : null}

      <View style={styles.answerRow}>
        <Pressable
          style={({ pressed }) => [styles.positiveBtn, pressed && styles.pressed]}
          onPress={() => onAnswer("positive")}
        >
          <Text style={styles.answerBtnTitle}>{positiveTitle}</Text>
          {node.positive.label ? (
            <Text style={styles.answerBtnSub}>{node.positive.label}</Text>
          ) : null}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.negativeBtn, pressed && styles.pressed]}
          onPress={() => onAnswer("negative")}
        >
          <Text style={styles.answerBtnTitle}>{negativeTitle}</Text>
          {node.negative.label ? (
            <Text style={styles.answerBtnSubDark}>{node.negative.label}</Text>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

function hypothesisCardStyle(p: HypothesisProbability, isFinal: boolean) {
  const accent =
    p === "alta"
      ? { borderLeftColor: "#3B82F6", borderColor: "#BFDBFE" }
      : p === "media"
        ? { borderLeftColor: "#FBBF24", borderColor: "#FDE68A" }
        : { borderLeftColor: "#9CA3AF", borderColor: "#E5E7EB" };
  return {
    ...styles.hypothesisCard,
    ...(isFinal ? styles.hypothesisCardFinal : null),
    borderLeftWidth: 4,
    ...accent,
  };
}

function ConclusionCard({
  node,
  onContinue,
  canContinue,
  hadPriorManiobra,
}: {
  node: ClinicalConclusionNode;
  onContinue: () => void;
  canContinue: boolean;
  hadPriorManiobra: boolean;
}) {
  const isFinal = !canContinue;
  const continueLabel = hadPriorManiobra
    ? "Continuar con otra maniobra →"
    : "Continuar con maniobra →";
  const continueHint = hadPriorManiobra
    ? "Continúa con otra maniobra para afinar el razonamiento diferencial."
    : "Continúa con una maniobra para afinar el razonamiento diferencial.";

  return (
    <View style={styles.cardInner}>
      {isFinal ? (
        <View style={styles.finalBanner}>
          <Text style={styles.finalBannerEyebrow}>Conclusión clínica final</Text>
          <Text style={styles.finalBannerTitle}>
            Secuencia exploratoria concluida — hipótesis más probables según los
            hallazgos registrados
          </Text>
        </View>
      ) : (
        <View style={styles.intermediateBanner}>
          <Text style={styles.intermediateBannerTitle}>Conclusión parcial</Text>
          <Text style={styles.intermediateBannerText}>{continueHint}</Text>
        </View>
      )}

      <Text style={styles.testTitle}>{node.title}</Text>
      <Text style={styles.testDesc}>{node.summary}</Text>

      <View style={[styles.hypothesesPanel, isFinal && styles.hypothesesPanelFinal]}>
        <View style={styles.hypothesesHeader}>
          <View style={[styles.hypothesesIcon, isFinal && styles.hypothesesIconFinal]}>
            <Text style={styles.hypothesesIconText}>?</Text>
          </View>
          <Text style={[styles.hypothesesLabel, isFinal && styles.hypothesesLabelFinal]}>
            Hipótesis orientativas
          </Text>
        </View>
        {sortHypotheses(node.hypotheses).map((h) => {
          const badge = probabilityBadge(h.probability);
          return (
            <View key={h.name} style={hypothesisCardStyle(h.probability, isFinal)}>
              <View style={styles.hypothesisHeader}>
                <Text style={[styles.hypothesisName, isFinal && styles.hypothesisNameFinal]}>
                  {h.name}
                </Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.fg }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.hypothesisRationale}>{h.rationale}</Text>
            </View>
          );
        })}
      </View>

      {canContinue ? (
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && styles.pressed]}
          onPress={onContinue}
        >
          <Text style={styles.continueBtnText}>{continueLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.finalNote}>
          <View style={styles.finalNoteHeader}>
            <View style={styles.finalCheck}>
              <Text style={styles.finalCheckText}>✓</Text>
            </View>
            <Text style={styles.finalNoteTitle}>Exploración concluida</Text>
          </View>
          <Text style={styles.finalNoteText}>
            No quedan maniobras en esta secuencia. Puedes retroceder para revisar
            hallazgos o cerrar y contrastar con el informe completo.
          </Text>
        </View>
      )}
    </View>
  );
}

export function ClinicalReasoningFlow({
  reportId,
  bodyArea,
  physioReport,
  patientName,
  onClose,
}: {
  reportId: string;
  bodyArea: string | null;
  physioReport: string;
  patientName: string | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const topPad = screenHeaderBarPadding(insets);

  const initialSession = useMemo(
    () => createSession({ reportId, bodyArea, physioReport }),
    [reportId, bodyArea, physioReport]
  );

  const [session, setSession] = useState<ReasoningSession | null>(initialSession);

  const tree = session ? getTreeForSession(session) : null;
  const currentNode =
    session && tree ? getNode(tree, session.currentNodeId) : null;

  const handleAnswer = useCallback(
    (result: "positive" | "negative") => {
      if (!session || !tree || !currentNode || currentNode.type !== "test") return;
      const nextId = applyAnswer(tree, currentNode.id, result);
      if (!nextId) return;
      setSession(pushStep(session, nextId, result));
    },
    [session, tree, currentNode]
  );

  const handleContinue = useCallback(() => {
    if (!session || !tree || !currentNode || currentNode.type !== "conclusion")
      return;
    const nextId = advanceFromConclusion(tree, currentNode.id);
    if (!nextId) return;
    setSession(pushStep(session, nextId));
  }, [session, tree, currentNode]);

  if (!initialSession || !session || !tree || !currentNode) {
    return (
      <View style={styles.root}>
        <Pressable style={[styles.backRow, styles.backRowPad, topPad]} onPress={onClose}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
          <Text style={styles.backText}>Volver al informe</Text>
        </Pressable>
        <View style={styles.emptyCard}>
          <Text style={styles.testDesc}>
            No hay un flujo de razonamiento clínico disponible para esta consulta.
          </Text>
        </View>
      </View>
    );
  }

  const canContinue =
    currentNode.type === "conclusion" &&
    Boolean(currentNode.nextNodeId && tree.nodes[currentNode.nextNodeId]);

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, topPad]}>
        <Pressable style={styles.backRow} onPress={onClose} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
          <Text style={styles.backText}>Volver al informe</Text>
        </Pressable>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Paso {session.steps.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>Razonamiento clínico por pruebas</Text>
        <Text style={styles.pageTitle}>
          {bodyArea && isThighOrHamstringComplaint(bodyArea)
            ? `Razonamiento clínico — ${bodyArea}`
            : tree.title}
        </Text>
        <Text style={styles.meta}>
          {patientName ? `${patientName} · ` : ""}
          {bodyArea || bodyPartLabel(session.bodyPart)}
        </Text>
        <Text style={styles.disclaimer}>
          Secuencia interactiva de pruebas especiales según el informe. Los
          hallazgos orientan hipótesis probables — no sustituyen el juicio clínico
          ni pruebas complementarias.
        </Text>

        <View style={styles.card}>
          {currentNode.type === "test" ? (
            <TestCard node={currentNode} onAnswer={handleAnswer} />
          ) : (
            <ConclusionCard
              node={currentNode}
              onContinue={handleContinue}
              canContinue={canContinue}
              hadPriorManiobra={countCompletedManiobras(session, tree) > 0}
            />
          )}
        </View>

        <View style={styles.actionsRow}>
          {session.steps.length > 1 ? (
            <>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() =>
                  setSession((prev) => {
                    if (!prev) return prev;
                    return goBack(prev) ?? prev;
                  })
                }
              >
                <Text style={styles.secondaryBtnText}>← Paso anterior</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryBtn}
                onPress={() =>
                  setSession({
                    ...session,
                    currentNodeId: session.entryNodeId,
                    steps: [
                      {
                        nodeId: session.entryNodeId,
                        at: new Date().toISOString(),
                      },
                    ],
                  })
                }
              >
                <Text style={styles.secondaryBtnText}>Reiniciar secuencia</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    minHeight: 44,
  },
  backRowPad: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backText: { fontSize: 15, fontWeight: "600", color: Colors.text },
  stepBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadgeText: { fontSize: 11, fontWeight: "600", color: Colors.textLight },
  scroll: { padding: 16, paddingBottom: 40, gap: 8 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Colors.primary,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 2,
  },
  meta: { fontSize: 13, color: Colors.textLight, marginBottom: 4 },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textLight,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  cardInner: { gap: 24 },
  testHeader: { gap: 8 },
  emptyCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#fff",
  },
  testTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  testDesc: { fontSize: 14, lineHeight: 21, color: Colors.text },
  evidenceBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 10,
  },
  evidenceText: { fontSize: 12, lineHeight: 17, color: "#1E3A8A" },
  answerRow: { gap: 12 },
  positiveBtn: {
    backgroundColor: "#059669",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  negativeBtn: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  answerBtnTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  answerBtnSub: { marginTop: 4, fontSize: 12, color: "#D1FAE5", textAlign: "center" },
  answerBtnSubDark: {
    marginTop: 4,
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
  },
  pressed: { opacity: 0.9 },
  hypothesesLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#1E40AF",
    flex: 1,
  },
  hypothesesLabelFinal: {
    fontSize: 13,
    fontWeight: "800",
  },
  hypothesesPanel: {
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  hypothesesPanelFinal: {
    borderWidth: 2,
    borderColor: "#93C5FD",
    backgroundColor: "#F0F9FF",
  },
  hypothesesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#BFDBFE",
  },
  hypothesesIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  hypothesesIconFinal: {
    backgroundColor: "#2563EB",
  },
  hypothesesIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  finalBanner: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#93C5FD",
    backgroundColor: "#2563EB",
    padding: 16,
    gap: 6,
  },
  finalBannerEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#BFDBFE",
  },
  finalBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    color: "#fff",
  },
  intermediateBanner: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    padding: 12,
    gap: 4,
  },
  intermediateBannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
  },
  intermediateBannerText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#1D4ED8",
  },
  hypothesisCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    backgroundColor: "#fff",
  },
  hypothesisCardFinal: {
    borderWidth: 2,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  hypothesisHeader: { gap: 6 },
  hypothesisName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  hypothesisNameFinal: { fontSize: 15 },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  hypothesisRationale: { fontSize: 13, lineHeight: 19, color: Colors.textLight },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  continueBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  finalNote: {
    borderWidth: 2,
    borderColor: "#6EE7B7",
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  finalNoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  finalCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  finalCheckText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  finalNoteTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#065F46",
  },
  finalNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#047857",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: "600", color: Colors.text },
});
