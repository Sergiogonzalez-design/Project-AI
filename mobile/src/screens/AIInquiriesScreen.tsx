import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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

const bodyAreas = [
  "Hombro", "Codo", "Muñeca / Mano", "Espalda alta",
  "Espalda baja", "Cadera", "Rodilla", "Tobillo / Pie", "Otro",
];
const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function AIInquiriesScreen() {
  const [area, setArea] = useState("");
  const [onset, setOnset] = useState("");
  const [pain, setPain] = useState<number>(5);
  const [hadTrauma, setHadTrauma] = useState<"No" | "Sí">("No");
  const [traumaDetail, setTraumaDetail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const EDGE_URL = "https://klxlzzgrymkexvuelzex.supabase.co/functions/v1/ai-consult";

  async function handleSubmit() {
    setErrorMsg(null);
    if (!area) { setErrorMsg("Selecciona la zona del cuerpo."); return; }
    if (!onset.trim()) { setErrorMsg("Describe cómo y cuándo empezó."); return; }
    if (hadTrauma === "Sí" && !traumaDetail.trim()) {
      setErrorMsg("Describe el golpe o gesto brusco."); return;
    }
    setStatus("saving");
    const { error } = await supabase.from("consultas").insert({
      body_area: area,
      started_when: "Reciente",
      onset_type: onset.trim(),
      pain_level: pain,
      had_trauma: hadTrauma === "No" ? "No" : `Sí: ${traumaDetail.trim()}`,
      description: description.trim() || null,
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    // Call the RAG AI endpoint via Supabase Edge or the web API
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          bodyArea: area,
          onsetType: onset.trim(),
          painLevel: pain,
          hadTrauma: hadTrauma === "No" ? "No" : `Sí: ${traumaDetail.trim()}`,
          description: description.trim() || "",
        }),
      });
      if (res.ok) {
        const data = await res.json() as { answer: string };
        setAiAnswer(data.answer);
      }
    } catch {
      // AI is optional — form save already succeeded
    }

    setStatus("success");
  }

  function handleReset() {
    setArea(""); setOnset(""); setPain(5); setHadTrauma("No");
    setTraumaDetail(""); setDescription(""); setStatus("idle"); setErrorMsg(null);
  }

  if (status === "success") {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Consulta enviada</Text>
        <Text style={styles.successBody}>
          Hemos recibido tu consulta. Tu entrenador atlético podrá revisarla.
        </Text>
        {!aiAnswer && (
          <Text style={{ textAlign: "center", color: Colors.textSecondary, fontSize: 14, marginBottom: 16 }}>
            Analizando con IA…
          </Text>
        )}
        {aiAnswer && (
          <View style={styles.aiCard}>
            <Text style={styles.aiCardLabel}>Orientación IA</Text>
            <Text style={styles.aiCardText}>{aiAnswer}</Text>
            <Text style={styles.aiCardDisclaimer}>
              ⚠️ Esta orientación no sustituye la valoración de un profesional.
            </Text>
          </View>
        )}
        <Pressable style={[styles.resetBtn, { marginTop: 24 }]} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Nueva consulta</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Consulta IA</Text>
        <Text style={styles.pageSubtitle}>
          Responde las preguntas para orientar tu valoración.
        </Text>

        {/* Body area */}
        <Text style={styles.sectionLabel}>Zona del cuerpo</Text>
        <View style={styles.chipGrid}>
          {bodyAreas.map((a) => (
            <Pressable
              key={a}
              style={[styles.chip, area === a && styles.chipSelected]}
              onPress={() => setArea(a)}
            >
              <Text style={[styles.chipText, area === a && styles.chipTextSelected]}>
                {a}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Onset */}
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

        {/* Pain level */}
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

        {/* Trauma */}
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
        {hadTrauma === "Sí" ? (
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Describe el golpe o gesto brusco"
            placeholderTextColor={Colors.textLight}
            value={traumaDetail}
            onChangeText={setTraumaDetail}
          />
        ) : null}

        {/* Free description */}
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

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
            status === "saving" && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={status === "saving"}
        >
          {status === "saving" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Enviar consulta</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 48 },
  centered: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: "center", justifyContent: "center", padding: 32,
  },
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
  chipGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8,
  },
  chip: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
  },
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
  error: {
    marginTop: 14, fontSize: 13, color: Colors.danger, textAlign: "center",
  },
  submitBtn: {
    marginTop: 28, backgroundColor: Colors.primary,
    borderRadius: 14, paddingVertical: 16, alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  submitBtnPressed: { backgroundColor: Colors.primaryDark },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: {
    fontSize: 22, fontWeight: "700", color: Colors.text, marginBottom: 8,
  },
  successBody: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: "center", lineHeight: 22, marginBottom: 32,
  },
  resetBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32, alignSelf: "center",
  },
  resetBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  aiCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 14,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  aiCardLabel: {
    fontSize: 11, fontWeight: "700", color: Colors.primary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
  },
  aiCardText: {
    fontSize: 14, color: Colors.text, lineHeight: 22,
  },
  aiCardDisclaimer: {
    marginTop: 10, fontSize: 11, color: Colors.textSecondary,
  },
});
