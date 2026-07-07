import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ConsultaAdaptiveShoulder,
  isLastShoulderSection,
} from "../components/ConsultaAdaptiveShoulder";
import { ConsultaGenericFields } from "../components/ConsultaGenericFields";
import { bodyPartLabel } from "../lib/body-parts";
import {
  defaultGenericConsultaAnswers,
  formatGenericConsulta,
  validateGenericConsulta,
  type GenericConsultaAnswers,
} from "../lib/consulta-generic";
import {
  defaultShoulderAdaptiveAnswers,
  detectRedFlags,
  formatShoulderAdaptive,
  getVisibleShoulderSections,
  validateShoulderAdaptive,
  validateShoulderSection,
  type ShoulderAdaptiveAnswers,
} from "../lib/consulta-shoulder-adaptive";
import {
  questionnaireForText,
  questionnaireIntroMessage,
} from "../lib/detect-body-part";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

const EDGE_URL = "https://klxlzzgrymkexvuelzex.supabase.co/functions/v1/ai-consult";
const WELCOME_MESSAGE = "¿Qué te duele? Cuéntanos en detalle qué te pasa.";
const WELCOME_ID = "welcome";

type Phase = "intro" | "questionnaire" | "followup";
type Message = { id: string; role: "user" | "assistant"; content: string };

function BoldText({ text, style, boldStyle }: {
  text: string;
  style?: object;
  boldStyle?: object;
}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={i} style={[style, boldStyle ?? { fontWeight: "700" }]}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

function welcomeMessage(): Message {
  return { id: WELCOME_ID, role: "assistant", content: WELCOME_MESSAGE };
}

async function callEdge(body: Record<string, unknown>): Promise<string> {
  const session = (await supabase.auth.getSession()).data.session;
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error de red");
  const data = await res.json() as { answer: string };
  return data.answer;
}

function titleFromText(text: string): string {
  const short = text.trim().slice(0, 40);
  return short.length < text.trim().length ? `${short}…` : short;
}

export function AIInquiriesScreen() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [initialMessage, setInitialMessage] = useState("");
  const [questionnairePart, setQuestionnairePart] = useState<"shoulder" | "generic">("shoulder");
  const [shoulderAnswers, setShoulderAnswers] = useState(defaultShoulderAdaptiveAnswers());
  const [genericAnswers, setGenericAnswers] = useState(defaultGenericConsultaAnswers());
  const [shoulderSectionIndex, setShoulderSectionIndex] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);

  function resetAll() {
    setMessages([welcomeMessage()]);
    setPhase("intro");
    setInitialMessage("");
    setQuestionnairePart("shoulder");
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setFormError(null);
    setChatInput("");
  }

  function buildSymptomContext(): string {
    const introBlock = `Descripción inicial del paciente:\n${initialMessage}`;
    if (questionnairePart === "shoulder") {
      return [introBlock, "", formatShoulderAdaptive(shoulderAnswers, introBlock)].join("\n");
    }
    return formatGenericConsulta(genericAnswers, introBlock);
  }

  function handleIntroSubmit() {
    const text = chatInput.trim();
    if (!text || phase !== "intro") return;
    setChatInput("");

    const { part } = questionnaireForText(text);
    setInitialMessage(text);
    setQuestionnairePart(part);
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setFormError(null);

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: text },
      {
        id: `q-intro-${Date.now()}`,
        role: "assistant",
        content: questionnaireIntroMessage(part),
      },
    ]);
    setPhase("questionnaire");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  async function handleQuestionnaireSubmit() {
    setFormError(null);

    if (questionnairePart === "shoulder") {
      const sections = getVisibleShoulderSections(shoulderAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateShoulderSection(lastSection, shoulderAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setShoulderSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateShoulderAdaptive(shoulderAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else {
      const err = validateGenericConsulta(genericAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    }

    setChatLoading(true);
    setLoadingModal(true);

    const symptomContext = buildSymptomContext();
    const { detected } = questionnaireForText(initialMessage);
    const areaLabel =
      questionnairePart === "shoulder"
        ? "Hombro"
        : detected.length > 0
          ? detected.map((p) => bodyPartLabel(p)).join(", ")
          : titleFromText(initialMessage);
    const painLevel =
      questionnairePart === "shoulder"
        ? shoulderAnswers.intensidad_dolor
        : genericAnswers.intensidad_dolor;
    const onsetType =
      questionnairePart === "shoulder"
        ? `${shoulderAnswers.inicio} — ${shoulderAnswers.evolucion}. Mecanismo: ${shoulderAnswers.mecanismo}`
        : `${genericAnswers.inicio} — ${genericAnswers.evolucion}. Mecanismo: ${genericAnswers.mecanismo}`;
    const hadTraumaVal =
      questionnairePart === "shoulder"
        ? shoulderAnswers.mecanismo === "Caída" || shoulderAnswers.mecanismo === "Golpe directo"
          ? `Sí: ${shoulderAnswers.mecanismo}`
          : "No"
        : genericAnswers.mecanismo === "Caída" || genericAnswers.mecanismo === "Golpe directo"
          ? `Sí: ${genericAnswers.mecanismo}`
          : "No";
    const redFlagsUrgent =
      questionnairePart === "shoulder"
        ? detectRedFlags(shoulderAnswers).urgent
        : genericAnswers.rf_deformidad === "Sí" ||
          genericAnswers.rf_fiebre === "Sí" ||
          genericAnswers.rf_perdida_sensibilidad === "Sí";
    const contextForAi = redFlagsUrgent
      ? `⚠️ PRIORIDAD ALTA — BANDERAS ROJAS DETECTADAS\n\n${symptomContext}`
      : symptomContext;

    try {
      await supabase.from("consultas").insert({
        body_area: areaLabel,
        started_when: onsetType,
        onset_type: onsetType,
        pain_level: painLevel,
        had_trauma: hadTraumaVal,
        description: initialMessage,
        symptom_details: {
          questionnaireVersion: 4,
          mode: "chat-then-questionnaire",
          initialMessage,
          questionnairePart,
          shoulder: questionnairePart === "shoulder" ? shoulderAnswers : null,
          generic: questionnairePart === "generic" ? genericAnswers : null,
          redFlagsUrgent,
        },
      });

      const answer = await callEdge({
        bodyArea: areaLabel,
        onsetType,
        painLevel,
        hadTrauma: hadTraumaVal,
        description: initialMessage,
        symptomContext: contextForAi,
        conversationHistory: [],
      });

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", content: answer },
      ]);
      setPhase("followup");
    } catch {
      setFormError("No se pudo obtener la respuesta. Inténtalo de nuevo.");
    } finally {
      setChatLoading(false);
      setLoadingModal(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  async function handleFollowupSubmit() {
    const text = chatInput.trim();
    if (!text || phase !== "followup" || chatLoading) return;
    setChatInput("");
    setChatLoading(true);

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const history = messages
        .filter(
          (m) =>
            m.id !== WELCOME_ID &&
            !m.id.startsWith("q-intro")
        )
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const answer = await callEdge({
        bodyArea: "seguimiento",
        onsetType: text,
        painLevel: 0,
        hadTrauma: "No",
        description: "",
        conversationHistory: history,
      });

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setChatLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  const showChatInput = phase === "intro" || phase === "followup";

  if (phase === "questionnaire") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.chatTopBar}>
          <Text style={styles.chatTopBarTitle}>Consulta</Text>
          <Pressable style={styles.newBtn} onPress={resetAll}>
            <Ionicons name="add" size={16} color={Colors.white} />
            <Text style={styles.newBtnText}>Nueva</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.bubbleRow,
                msg.role === "user" ? styles.bubbleRowUser : styles.bubbleRowAI,
              ]}
            >
              {msg.role === "assistant" && (
                <View style={styles.aiBadge}>
                  <Ionicons name="sparkles" size={13} color={Colors.white} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
                ]}
              >
                {msg.role === "user" ? (
                  <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{msg.content}</Text>
                ) : (
                  <BoldText text={msg.content} style={styles.bubbleText} boldStyle={styles.bubbleBold} />
                )}
              </View>
            </View>
          ))}

          <View style={styles.questionnaireCard}>
            {questionnairePart === "shoulder" ? (
              <>
                <ConsultaAdaptiveShoulder
                  value={shoulderAnswers}
                  onChange={setShoulderAnswers}
                  sectionIndex={shoulderSectionIndex}
                  onSectionIndexChange={setShoulderSectionIndex}
                  sectionError={formError}
                  onSectionError={setFormError}
                />
                {isLastShoulderSection(shoulderAnswers, shoulderSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>Obtener orientación de la IA</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <ConsultaGenericFields value={genericAnswers} onChange={setGenericAnswers} />
                {formError ? <Text style={styles.error}>{formError}</Text> : null}
                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                  onPress={handleQuestionnaireSubmit}
                >
                  <Text style={styles.submitBtnText}>Obtener orientación de la IA</Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

        <Modal visible={loadingModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.modalTitle}>Nuestra IA está analizando tu caso</Text>
              <Text style={styles.modalSub}>Estaremos contigo en breve.</Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.chatTopBar}>
        <Text style={styles.chatTopBarTitle}>Consulta</Text>
        <Pressable style={styles.newBtn} onPress={resetAll}>
          <Ionicons name="add" size={16} color={Colors.white} />
          <Text style={styles.newBtnText}>Nueva</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item: msg }) => (
          <View
            style={[
              styles.bubbleRow,
              msg.role === "user" ? styles.bubbleRowUser : styles.bubbleRowAI,
            ]}
          >
            {msg.role === "assistant" && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={13} color={Colors.white} />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
              ]}
            >
              {msg.role === "user" ? (
                <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{msg.content}</Text>
              ) : (
                <BoldText text={msg.content} style={styles.bubbleText} boldStyle={styles.bubbleBold} />
              )}
              {msg.role === "assistant" && msg.id !== WELCOME_ID && phase === "followup" && (
                <Text style={styles.bubbleDisclaimer}>
                  Orientación informativa, no diagnóstico médico.
                </Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          chatLoading && !loadingModal ? (
            <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={13} color={Colors.white} />
              </View>
              <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            </View>
          ) : null
        }
      />

      {showChatInput && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.chatInput}
            placeholder={phase === "intro" ? "Cuéntanos qué te pasa…" : "Escribe tu pregunta…"}
            placeholderTextColor={Colors.textLight}
            value={chatInput}
            onChangeText={setChatInput}
            multiline
            maxLength={2000}
            editable={!chatLoading}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              (!chatInput.trim() || chatLoading) && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}
            onPress={phase === "intro" ? handleIntroSubmit : handleFollowupSubmit}
            disabled={!chatInput.trim() || chatLoading}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </Pressable>
        </View>
      )}

      <Modal visible={loadingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.modalTitle}>Nuestra IA está analizando tu caso</Text>
            <Text style={styles.modalSub}>Estaremos contigo en breve.</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatTopBarTitle: { flex: 1, fontSize: 14, fontWeight: "600", color: Colors.text },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newBtnText: { color: Colors.white, fontSize: 13, fontWeight: "600" },
  messageList: { padding: 16, paddingBottom: 8 },
  bubbleRow: { flexDirection: "row", marginBottom: 16, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  aiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: { maxWidth: "82%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: Colors.primary },
  bubbleAI: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  bubbleText: { fontSize: 15, lineHeight: 22, color: Colors.text },
  bubbleTextUser: { color: Colors.white },
  bubbleBold: { color: Colors.primary, fontWeight: "700" },
  bubbleDisclaimer: { marginTop: 8, fontSize: 11, color: Colors.textLight },
  loadingBubble: { paddingVertical: 14, paddingHorizontal: 20 },
  questionnaireCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginTop: 8,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitBtnPressed: { backgroundColor: Colors.primaryDark },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  error: { color: Colors.danger, fontSize: 13, marginBottom: 8 },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chatInput: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnPressed: { backgroundColor: Colors.primaryDark },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalBox: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
  },
  modalTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  modalSub: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
