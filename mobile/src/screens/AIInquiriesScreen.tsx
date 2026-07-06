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
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

const EDGE_URL = "https://klxlzzgrymkexvuelzex.supabase.co/functions/v1/ai-consult";

/** Renders a string that may contain **bold** sections as React Native Text. */
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

const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Message = { id: string; role: "user" | "assistant"; content: string };

async function callEdge(
  bodyArea: string,
  onsetType: string,
  painLevel: number,
  hadTrauma: string,
  description: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const session = (await supabase.auth.getSession()).data.session;
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify({
      bodyArea,
      onsetType,
      painLevel,
      hadTrauma,
      description,
      conversationHistory: history,
    }),
  });
  if (!res.ok) throw new Error("Error de red");
  const data = await res.json() as { answer: string };
  return data.answer;
}

export function AIInquiriesScreen() {
  // Form state
  const [area, setArea] = useState("");
  const [onset, setOnset] = useState("");
  const [pain, setPain] = useState<number>(5);
  const [hadTrauma, setHadTrauma] = useState<"No" | "Sí">("No");
  const [traumaDetail, setTraumaDetail] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Chat state
  const [view, setView] = useState<"form" | "chat">("form");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  function resetAll() {
    setArea(""); setOnset(""); setPain(5); setHadTrauma("No");
    setTraumaDetail(""); setDescription(""); setFormError(null);
    setMessages([]); setChatInput("");
    setView("form");
  }

  async function handleFormSubmit() {
    setFormError(null);
    if (!area.trim()) { setFormError("Indica la zona del cuerpo."); return; }
    if (!onset.trim()) { setFormError("Describe cómo y cuándo empezó."); return; }
    if (hadTrauma === "Sí" && !traumaDetail.trim()) {
      setFormError("Describe el golpe o gesto brusco."); return;
    }
    setSubmitting(true);

    const hadTraumaVal = hadTrauma === "No" ? "No" : `Sí: ${traumaDetail.trim()}`;

    // Save to consultas table
    await supabase.from("consultas").insert({
      body_area: area,
      started_when: onset.trim() || "No especificado",
      onset_type: onset.trim() || "No especificado",
      pain_level: pain,
      had_trauma: hadTraumaVal,
      description: description.trim() || null,
    });

    const userSummary = [
      `Zona afectada: ${area}`,
      `Cómo empezó: ${onset.trim()}`,
      `Dolor: ${pain}/10`,
      `Traumatismo: ${hadTraumaVal}`,
      description.trim() ? `Detalles: ${description.trim()}` : "",
    ].filter(Boolean).join("\n");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userSummary,
    };

    setMessages([userMsg]);
    setView("chat");

    try {
      const answer = await callEdge(area, onset.trim(), pain, hadTraumaVal, description.trim(), []);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          content: "No pude obtener una respuesta. Inténtalo de nuevo.",
        },
      ]);
    } finally {
      setSubmitting(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  async function handleSendFollowUp() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatLoading(true);

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const answer = await callEdge("seguimiento", text, 0, "No", "", history);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          content: "No pude conectar. Revisa tu conexión e inténtalo de nuevo.",
        },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  /* ── FORM VIEW ── */
  if (view === "form") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.root}
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Nueva consulta</Text>
          <Text style={styles.pageSubtitle}>
            Describe tus síntomas para recibir orientación de la IA.
          </Text>

          <Text style={styles.sectionLabel}>Zona del cuerpo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Hombro derecho, rodilla izquierda..."
            placeholderTextColor={Colors.textLight}
            value={area}
            onChangeText={setArea}
          />

          <Text style={styles.sectionLabel}>¿Cómo y cuándo empezó?</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Ej: Empezó hace 3 días jugando al fútbol..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={3}
            value={onset}
            onChangeText={setOnset}
          />

          <Text style={styles.sectionLabel}>Nivel de dolor (1–10)</Text>
          <View style={styles.painRow}>
            {painLevels.map((n) => (
              <Pressable
                key={n}
                style={[styles.painChip, pain === n && styles.painChipSelected]}
                onPress={() => setPain(n)}
              >
                <Text style={[styles.painText, pain === n && styles.painTextSelected]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>¿Hubo golpe o caída?</Text>
          <View style={styles.toggleRow}>
            {(["No", "Sí"] as const).map((v) => (
              <Pressable
                key={v}
                style={[styles.toggle, hadTrauma === v && styles.toggleSelected]}
                onPress={() => setHadTrauma(v)}
              >
                <Text style={[styles.toggleText, hadTrauma === v && styles.toggleTextSelected]}>
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>
          {hadTrauma === "Sí" && (
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Describe el golpe o gesto brusco"
              placeholderTextColor={Colors.textLight}
              value={traumaDetail}
              onChangeText={setTraumaDetail}
            />
          )}

          <Text style={styles.sectionLabel}>Información adicional (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Cualquier detalle que quieras añadir..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          {formError ? <Text style={styles.error}>{formError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.submitBtnPressed,
              submitting && { opacity: 0.7 },
            ]}
            onPress={handleFormSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>Enviar consulta</Text>
          </Pressable>
        </ScrollView>

        <Modal visible={submitting} transparent animationType="fade">
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

  /* ── CHAT VIEW ── */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Top bar */}
      <View style={styles.chatTopBar}>
        <Text style={styles.chatTopBarTitle} numberOfLines={1}>
          Consulta — {area}
        </Text>
        <Pressable style={styles.newBtn} onPress={resetAll}>
          <Ionicons name="add" size={16} color={Colors.white} />
          <Text style={styles.newBtnText}>Nueva</Text>
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
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
                <Text style={[styles.bubbleText, styles.bubbleTextUser]}>
                  {msg.content}
                </Text>
              ) : (
                <BoldText
                  text={msg.content}
                  style={styles.bubbleText}
                  boldStyle={styles.bubbleBold}
                />
              )}
              {msg.role === "assistant" && (
                <Text style={styles.bubbleDisclaimer}>
                  Orientación informativa, no diagnóstico médico.
                </Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          (submitting || chatLoading) ? (
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

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.chatInput}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor={Colors.textLight}
          value={chatInput}
          onChangeText={setChatInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSendFollowUp}
          blurOnSubmit={false}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendBtn,
            (!chatInput.trim() || chatLoading || submitting) && styles.sendBtnDisabled,
            pressed && styles.sendBtnPressed,
          ]}
          onPress={handleSendFollowUp}
          disabled={!chatInput.trim() || chatLoading || submitting}
        >
          <Ionicons name="send" size={18} color={Colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  formContainer: { padding: 20, paddingBottom: 48 },

  pageTitle: {
    fontSize: 24, fontWeight: "700", color: Colors.text,
    letterSpacing: -0.5, marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14, fontWeight: "600", color: Colors.text,
    marginTop: 20, marginBottom: 10,
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, backgroundColor: Colors.surface,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  chipTextSelected: { color: Colors.white, fontWeight: "600" },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.text, backgroundColor: Colors.surface,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  painRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  painChip: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1.5,
    borderColor: Colors.border, alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  painChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  painText: { fontSize: 14, fontWeight: "600", color: Colors.text },
  painTextSelected: { color: Colors.white },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggle: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingVertical: 12, alignItems: "center", backgroundColor: Colors.surface,
  },
  toggleSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleText: { fontSize: 15, fontWeight: "600", color: Colors.text },
  toggleTextSelected: { color: Colors.white },
  error: { marginTop: 14, fontSize: 13, color: Colors.danger, textAlign: "center" },
  submitBtn: {
    marginTop: 28, backgroundColor: Colors.primary,
    borderRadius: 14, paddingVertical: 16, alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  submitBtnPressed: { backgroundColor: Colors.primaryDark },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center", padding: 24,
  },
  modalBox: {
    width: "100%", maxWidth: 320, backgroundColor: Colors.white,
    borderRadius: 20, padding: 28, alignItems: "center",
  },
  modalTitle: {
    marginTop: 16, fontSize: 16, fontWeight: "700",
    color: Colors.text, textAlign: "center",
  },
  modalSub: {
    marginTop: 8, fontSize: 14, color: Colors.textSecondary, textAlign: "center",
  },

  // Chat styles
  chatTopBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  chatTopBarTitle: {
    flex: 1, fontSize: 14, fontWeight: "600", color: Colors.text, marginRight: 10,
  },
  newBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  newBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },

  messageList: { padding: 14, paddingBottom: 8, gap: 12 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  aiBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "80%", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white },
  bubbleBold: { fontWeight: "700", color: Colors.primary },
  bubbleDisclaimer: {
    fontSize: 10, color: Colors.textSecondary, marginTop: 6, lineHeight: 14,
  },
  loadingBubble: { paddingVertical: 14, paddingHorizontal: 20 },

  inputBar: {
    flexDirection: "row", alignItems: "flex-end", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chatInput: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: Colors.text, backgroundColor: Colors.surface,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  sendBtnPressed: { backgroundColor: Colors.primaryDark },
  sendBtnDisabled: { backgroundColor: Colors.textLight, shadowOpacity: 0 },
});
