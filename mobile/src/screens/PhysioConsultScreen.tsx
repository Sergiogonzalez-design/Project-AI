import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AssistantMessageWithSources } from "../components/AssistantMessageWithSources";
import { PhysioAssistantBody } from "../components/PhysioAssistantBody";
import { PhysioAvatar } from "../components/PhysioAvatar";
import { PhysioIntro } from "../components/PhysioIntro";
import { TypingIndicator } from "../components/TypingIndicator";
import {
  composerBottomInset,
  useKeyboardHeight,
} from "../hooks/useKeyboardHeight";
import { Colors } from "../lib/colors";
import { pickIllustratedTestsForPruebasQuery } from "../lib/clinical-test-images";
import {
  consultAttachmentCaption,
  consultVisionUrl,
  isConsultImageMime,
  isConsultPdfUrl,
  MAX_CONSULT_ATTACHMENT_BYTES,
  uploadConsultPhotoFromUri,
} from "../lib/consult-photo";
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
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const bottomInset = composerBottomInset(keyboardHeight, insets.bottom);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [physioIntro, setPhysioIntro] = useState(true);
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const [attachedName, setAttachedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
    setAttachedName(null);
  }

  async function takeConsultPhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return;
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setAttachedUri(result.assets[0].uri);
        setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
        setAttachedName(null);
      }
    } catch {
      // ignore picker errors
    }
  }

  async function pickFromGallery() {
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
        setAttachedName(result.assets[0].fileName ?? null);
      }
    } catch {
      // ignore picker errors
    }
  }

  async function pickConsultFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      if (asset.size && asset.size > MAX_CONSULT_ATTACHMENT_BYTES) {
        Alert.alert("Error", "El archivo es demasiado grande (máx. 10 MB).");
        return;
      }
      const mime =
        asset.mimeType ??
        (asset.name?.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      setAttachedUri(asset.uri);
      setAttachedMime(mime);
      setAttachedName(asset.name ?? null);
    } catch {
      // ignore picker errors
    }
  }

  function pickConsultAttachment() {
    Alert.alert("Adjuntar", undefined, [
      { text: "Foto de la galería", onPress: () => void pickFromGallery() },
      { text: "Archivo o PDF", onPress: () => void pickConsultFile() },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function uploadOutgoingPhoto() {
    if (!attachedUri) return null;
    const url = await uploadConsultPhotoFromUri(attachedUri, attachedMime);
    clearAttachment();
    return url;
  }

  async function sendClinicalChat() {
    const text =
      chatInput.trim() ||
      (attachedUri ? consultAttachmentCaption("es", attachedMime, attachedName) : "");
    if ((!text && !attachedUri) || chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    setError(null);
    try {
      const attachmentUrl = await uploadOutgoingPhoto();
      const imageUrl = consultVisionUrl(attachmentUrl);
      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: text,
        image_url: attachmentUrl,
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
    <View style={[styles.root, { paddingBottom: bottomInset }]}>
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
            {chatMessages.map((m, msgIndex) => {
              const prevUser =
                m.role === "assistant"
                  ? [...chatMessages.slice(0, msgIndex)]
                      .reverse()
                      .find((x) => x.role === "user")
                  : undefined;
              const pruebasFallback = prevUser
                ? pickIllustratedTestsForPruebasQuery(prevUser.content)
                : [];
              return (
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
                        isConsultPdfUrl(m.image_url) ? (
                          <View style={styles.fileChipUser}>
                            <Ionicons name="document-text-outline" size={16} color={Colors.white} />
                            <Text style={styles.fileChipTextUser}>PDF</Text>
                          </View>
                        ) : (
                          <Image
                            source={{ uri: m.image_url }}
                            style={styles.chatImage}
                            resizeMode="cover"
                          />
                        )
                      ) : null}
                      {m.content ? (
                        <Text style={styles.chatUserText}>{m.content}</Text>
                      ) : null}
                    </View>
                  ) : (
                    <AssistantMessageWithSources
                      content={m.content}
                      renderBody={(body) => (
                        <PhysioAssistantBody
                          text={body}
                          fallbackTests={pruebasFallback}
                        />
                      )}
                    />
                  )}
                </View>
              </View>
              );
            })}
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
                {isConsultImageMime(attachedMime) ? (
                  <Image source={{ uri: attachedUri }} style={styles.attachPreview} />
                ) : (
                  <View style={styles.fileChipPreview}>
                    <Ionicons name="document-text-outline" size={20} color={Colors.text} />
                    <Text style={styles.fileChipPreviewText} numberOfLines={1}>
                      {attachedName ?? "PDF"}
                    </Text>
                  </View>
                )}
                <Pressable onPress={clearAttachment} hitSlop={8}>
                  <Text style={styles.removePhotoText}>Quitar</Text>
                </Pressable>
              </View>
            ) : null}
            <View style={styles.chatInputBar}>
              <Pressable
                onPress={pickConsultAttachment}
                disabled={chatLoading}
                style={({ pressed }) => [
                  styles.attachBtn,
                  pressed && { backgroundColor: Colors.primarySoft },
                  chatLoading && { opacity: 0.5 },
                ]}
                accessibilityLabel="Adjuntar"
              >
                <Ionicons name="add" size={22} color={Colors.text} />
              </Pressable>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Pregunta clínica…"
                placeholderTextColor={Colors.textLight}
                style={styles.input}
              />
              <Pressable
                onPress={() => void takeConsultPhoto()}
                disabled={chatLoading}
                style={({ pressed }) => [
                  styles.attachBtn,
                  pressed && { backgroundColor: Colors.primarySoft },
                  chatLoading && { opacity: 0.5 },
                ]}
                accessibilityLabel="Hacer foto"
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
    </View>
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
    paddingBottom: 0,
  },
  attachPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  attachPreview: { width: 56, height: 56, borderRadius: 10 },
  fileChipUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  fileChipTextUser: { color: Colors.white, fontSize: 13, fontWeight: "600" },
  fileChipPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "70%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
  },
  fileChipPreviewText: { flexShrink: 1, fontSize: 13, fontWeight: "600", color: Colors.text },
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
