import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PhysioAvatar } from "../components/PhysioAvatar";
import { PhysioIntro } from "../components/PhysioIntro";
import { TypingIndicator } from "../components/TypingIndicator";
import { Colors } from "../lib/colors";
import { photoOnlyCaption, uploadConsultPhotoFromUri } from "../lib/consult-photo";
import { supabase } from "../lib/supabase";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
};

const WELCOME_MESSAGE =
  "Hola. Soy Physio, el asistente clínico de AIKinora para fisioterapeutas. Pregúntame por diferenciales, maniobras (Neer, Hawkins, Lachman, Spurling…), interpretación de hallazgos o criterio de imagen.";

/** Physio-facing clinical AI chat (matches web /fisio/consulta). */
export function PhysioConsultScreen() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [physioIntro, setPhysioIntro] = useState(true);
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const [error, setError] = useState<string | null>(null);

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
  }

  async function pickConsultPhoto() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setAttachedUri(result.assets[0].uri);
        setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
      }
    } catch {
      // ignore picker errors
    }
  }

  async function uploadOutgoingPhoto() {
    if (!attachedUri) return null;
    const url = await uploadConsultPhotoFromUri(attachedUri, attachedMime);
    clearAttachment();
    return url;
  }

  async function sendClinicalChat() {
    const text = chatInput.trim() || (attachedUri ? photoOnlyCaption("es") : "");
    if ((!text && !attachedUri) || chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    setError(null);
    try {
      const imageUrl = await uploadOutgoingPhoto();
      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: text,
        image_url: imageUrl,
      };
      setChatMessages((prev) => [...prev, userMsg]);
      const history = [...chatMessages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      const { data, error: fnError } = await supabase.functions.invoke("ai-consult", {
        body: {
          mode: "physio_chat",
          message: text,
          conversationHistory: history.slice(-12),
          language: "es",
          ...(imageUrl ? { imageUrl } : {}),
        },
      });
      if (fnError) throw fnError;
      const answer =
        (data as { answer?: string } | null)?.answer?.trim() ||
        "No he podido generar una respuesta.";
      setChatMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", content: answer },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la consulta clínica.");
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      {physioIntro ? (
        <PhysioIntro
          greeting="¡Hola! Soy Physio. Esta consulta es técnica, pensada para fisioterapeutas. ¿En qué puedo ayudarte?"
          onSkip={() => setPhysioIntro(false)}
        />
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.messages}
            keyboardShouldPersistTaps="handled"
          >
            {chatMessages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.chatRow,
                  m.role === "user" ? styles.chatRowUser : styles.chatRowAssistant,
                ]}
              >
                {m.role === "assistant" ? (
                  <PhysioAvatar size={32} style={{ marginRight: 8 }} />
                ) : null}
                <View
                  style={[
                    styles.chatBubble,
                    m.role === "user" ? styles.chatUser : styles.chatAssistant,
                  ]}
                >
                  {m.role === "user" ? (
                    <View>
                      {m.image_url ? (
                        <Image
                          source={{ uri: m.image_url }}
                          style={styles.chatImage}
                          resizeMode="cover"
                        />
                      ) : null}
                      {m.content ? (
                        <Text style={styles.chatUserText}>{m.content}</Text>
                      ) : null}
                    </View>
                  ) : (
                    <Text style={styles.chatAssistantText}>{m.content}</Text>
                  )}
                </View>
              </View>
            ))}
            {chatLoading ? (
              <View style={[styles.chatRow, styles.chatRowAssistant]}>
                <PhysioAvatar size={32} style={{ marginRight: 8 }} />
                <View style={[styles.chatBubble, styles.chatAssistant, styles.loadingBubble]}>
                  <TypingIndicator />
                </View>
              </View>
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
          <View style={styles.chatInputWrap}>
            {attachedUri ? (
              <View style={styles.attachPreviewRow}>
                <Image source={{ uri: attachedUri }} style={styles.attachPreview} />
                <Pressable onPress={clearAttachment} hitSlop={8}>
                  <Text style={styles.removePhotoText}>Quitar foto</Text>
                </Pressable>
              </View>
            ) : null}
            <View style={styles.chatInputBar}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Pregunta clínica…"
                placeholderTextColor={Colors.textLight}
                style={styles.input}
              />
              <Pressable
                onPress={() => void pickConsultPhoto()}
                disabled={chatLoading}
                style={({ pressed }) => [
                  styles.attachBtn,
                  pressed && { backgroundColor: Colors.primarySoft },
                  chatLoading && { opacity: 0.5 },
                ]}
                accessibilityLabel="Adjuntar foto"
              >
                <Ionicons name="camera-outline" size={20} color={Colors.text} />
              </Pressable>
              <Pressable
                onPress={() => void sendClinicalChat()}
                disabled={chatLoading || (!chatInput.trim() && !attachedUri)}
                style={({ pressed }) => [
                  styles.sendBtn,
                  pressed && { opacity: 0.9 },
                  (chatLoading || (!chatInput.trim() && !attachedUri)) && { opacity: 0.5 },
                ]}
              >
                <Ionicons name="send" size={18} color={Colors.white} />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  messages: { padding: 16, paddingBottom: 24 },
  chatRow: { flexDirection: "row", marginBottom: 12 },
  chatRowUser: { justifyContent: "flex-end" },
  chatRowAssistant: { justifyContent: "flex-start" },
  chatBubble: { maxWidth: "82%", borderRadius: 16, padding: 12 },
  chatUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  chatAssistant: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  chatUserText: { color: Colors.white, fontSize: 15, lineHeight: 21 },
  chatAssistantText: { color: Colors.text, fontSize: 15, lineHeight: 21 },
  chatImage: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#00000020",
  },
  loadingBubble: { paddingVertical: 10, paddingHorizontal: 14 },
  error: { color: Colors.danger, fontSize: 13, textAlign: "center", marginTop: 8 },
  chatInputWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  attachPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  attachPreview: { width: 56, height: 56, borderRadius: 10 },
  removePhotoText: { color: Colors.primary, fontWeight: "600", fontSize: 13 },
  chatInputBar: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
});
