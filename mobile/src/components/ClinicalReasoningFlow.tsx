import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../lib/colors";
import { bodyPartLabel } from "../lib/body-parts";
import { CLINICAL_TEST_IMAGES } from "../lib/clinical-test-images";
import {
  advanceFromConclusion,
  applyAnswer,
  createSession,
  getNode,
  getTreeForSession,
  goBack,
  pushStep,
  type ReasoningSession,
} from "../lib/clinical-reasoning";
import type {
  ClinicalConclusionNode,
  ClinicalTestNode,
  HypothesisProbability,
} from "../lib/clinical-reasoning/types";

function probabilityBadge(p: HypothesisProbability) {
  if (p === "alta") return { bg: "#FEE2E2", fg: "#991B1B", label: "Alta probabilidad" };
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

  return (
    <View style={styles.cardInner}>
      <Text style={styles.testTitle}>{node.title}</Text>
      <Text style={styles.testDesc}>{node.description}</Text>
      {node.evidenceNote ? (
        <View style={styles.evidenceBox}>
          <Text style={styles.evidenceText}>{node.evidenceNote}</Text>
        </View>
      ) : null}

      {image ? (
        <Image
          source={{ uri: image.src }}
          style={styles.testImage}
          resizeMode="contain"
          accessibilityLabel={image.title}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Ilustración no disponible</Text>
        </View>
      )}

      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoLabel}>Vídeo demostrativo</Text>
        <Text style={styles.placeholderText}>
          Espacio reservado — podrás añadir el vídeo más adelante.
        </Text>
      </View>

      <View style={styles.answerRow}>
        <Pressable
          style={({ pressed }) => [styles.positiveBtn, pressed && styles.pressed]}
          onPress={() => onAnswer("positive")}
        >
          <Text style={styles.answerBtnTitle}>Positivo</Text>
          {node.positive.label ? (
            <Text style={styles.answerBtnSub}>{node.positive.label}</Text>
          ) : null}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.negativeBtn, pressed && styles.pressed]}
          onPress={() => onAnswer("negative")}
        >
          <Text style={styles.answerBtnTitle}>Negativo</Text>
          {node.negative.label ? (
            <Text style={styles.answerBtnSubDark}>{node.negative.label}</Text>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

function ConclusionCard({
  node,
  onContinue,
  canContinue,
}: {
  node: ClinicalConclusionNode;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <View style={styles.cardInner}>
      <Text style={styles.testTitle}>{node.title}</Text>
      <Text style={styles.testDesc}>{node.summary}</Text>

      <Text style={styles.hypothesesLabel}>Hipótesis orientativas</Text>
      {node.hypotheses.map((h) => {
        const badge = probabilityBadge(h.probability);
        return (
          <View key={h.name} style={styles.hypothesisCard}>
            <View style={styles.hypothesisHeader}>
              <Text style={styles.hypothesisName}>{h.name}</Text>
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

      {canContinue ? (
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && styles.pressed]}
          onPress={onContinue}
        >
          <Text style={styles.continueBtnText}>Continuar con otra prueba</Text>
        </Pressable>
      ) : (
        <Text style={styles.endNote}>
          Has llegado al final de este recorrido. Puedes volver atrás o cerrar
          para contrastar con el informe completo.
        </Text>
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
        <Pressable style={styles.backRow} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
          <Text style={styles.backText}>Volver al informe</Text>
        </Pressable>
        <View style={styles.emptyCard}>
          <Text style={styles.testDesc}>
            No hay un árbol de razonamiento clínico disponible para esta consulta.
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
      <View style={styles.topBar}>
        <Pressable style={styles.backRow} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
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
        <Text style={styles.eyebrow}>Árbol de razonamiento clínico</Text>
        <Text style={styles.pageTitle}>{tree.title}</Text>
        <Text style={styles.meta}>
          {patientName ? `${patientName} · ` : ""}
          {bodyArea || bodyPartLabel(session.bodyPart)}
        </Text>
        <Text style={styles.disclaimer}>
          Guía interactiva basada en las pruebas del informe. Orientativa — no
          sustituye el juicio clínico.
        </Text>

        <View style={styles.card}>
          {currentNode.type === "test" ? (
            <TestCard node={currentNode} onAnswer={handleAnswer} />
          ) : (
            <ConclusionCard
              node={currentNode}
              onContinue={handleContinue}
              canContinue={canContinue}
            />
          )}
        </View>

        <View style={styles.actionsRow}>
          {session.steps.length > 1 ? (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => setSession((prev) => (prev ? goBack(prev) : prev))}
            >
              <Text style={styles.secondaryBtnText}>← Paso anterior</Text>
            </Pressable>
          ) : null}
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
            <Text style={styles.secondaryBtnText}>Reiniciar árbol</Text>
          </Pressable>
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
    paddingTop: 8,
    paddingBottom: 4,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  backText: { fontSize: 14, fontWeight: "600", color: Colors.text },
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
    padding: 16,
  },
  cardInner: { gap: 12 },
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
  testImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  imagePlaceholder: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  videoPlaceholder: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    gap: 4,
  },
  videoLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    color: Colors.textLight,
  },
  placeholderText: { fontSize: 13, color: Colors.textLight, textAlign: "center" },
  answerRow: { gap: 10, marginTop: 4 },
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
    color: Colors.primary,
    marginTop: 4,
  },
  hypothesisCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  hypothesisHeader: { gap: 6 },
  hypothesisName: { fontSize: 14, fontWeight: "700", color: Colors.text },
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
  endNote: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textLight,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
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
