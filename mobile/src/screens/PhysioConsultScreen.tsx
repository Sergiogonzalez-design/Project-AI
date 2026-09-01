import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBurgerMenu } from "../components/AppBurgerMenu";
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
import { screenHeaderTopInset } from "../lib/screen-header-insets";
import { useI18n } from "../lib/i18n";
import { pickIllustratedTestsForPruebasQuery } from "../lib/clinical-test-images";
import {
  consultAttachmentCaption,
  consultPhotoAccessUrl,
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

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

type ConversationGroup = { label: string; items: Conversation[] };

const WELCOME_ID = "welcome";
const WELCOME_MESSAGE =
  "Hola. Soy Physio, el asistente clínico de AIKinora para fisioterapeutas. Pregúntame por diferenciales, maniobras (Neer, Hawkins, Lachman, Spurling…), interpretación de hallazgos o criterio de imagen.";

function welcomeMessage(): ChatMessage {
  return { id: WELCOME_ID, role: "assistant", content: WELCOME_MESSAGE };
}

function formatDate(iso: string, locale: "es" | "en") {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "short",
  });
}

function groupConversationsByDate(
  conversations: Conversation[],
  labels: { today: string; yesterday: string; last7Days: string; older: string }
): ConversationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86_400_000);
  const buckets: Record<"today" | "yesterday" | "week" | "older", Conversation[]> = {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  };
  for (const c of conversations) {
    const d = new Date(c.created_at);
    if (d >= startOfToday) buckets.today.push(c);
    else if (d >= startOfYesterday) buckets.yesterday.push(c);
    else if (d >= startOfWeek) buckets.week.push(c);
    else buckets.older.push(c);
  }
  return [
    { label: labels.today, items: buckets.today },
    { label: labels.yesterday, items: buckets.yesterday },
    { label: labels.last7Days, items: buckets.week },
    { label: labels.older, items: buckets.older },
  ].filter((g) => g.items.length > 0);
}

/** Physio-facing clinical AI chat (matches web /fisio/consulta). */
export function PhysioConsultScreen() {
  const navigation = useNavigation();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const bottomInset = composerBottomInset(keyboardHeight, insets.bottom);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [physioIntro, setPhysioIntro] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState("");
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const [attachedName, setAttachedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation])
  );

  useEffect(() => {
    if (!activeId) setActiveTitle(t.consulta.newClinical);
  }, [t.consulta.newClinical, activeId]);

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
    setAttachedName(null);
  }

  const loadConversations = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .ilike("title", "Clínica%")
      .order("created_at", { ascending: false })
      .limit(30);
    setConversations((data as Conversation[]) ?? []);
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  function startNewConsultation() {
    setActiveId(null);
    setActiveTitle(t.consulta.newClinical);
    setChatMessages([welcomeMessage()]);
    setPhysioIntro(false);
    setChatInput("");
    setError(null);
    setHistoryOpen(false);
    clearAttachment();
  }

  async function openConversation(id: string, title: string) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, role, content, image_url")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setActiveId(id);
    setActiveTitle(title);
    setChatMessages(
      ((msgs as ChatMessage[]) ?? []).length > 0
        ? ((msgs as ChatMessage[]) ?? [])
        : [welcomeMessage()]
    );
    setPhysioIntro(false);
    setHistoryOpen(false);
    setError(null);
    clearAttachment();
  }

  function deleteConversation(id: string) {
    Alert.alert(
      t.consulta.deleteTitle,
      t.consulta.deleteBody,
      [
        { text: t.consulta.cancel, style: "cancel" },
        {
          text: t.consulta.delete,
          style: "destructive",
          onPress: () => {
            void (async () => {
              setDeletingId(id);
              const { error: delErr } = await supabase
                .from("conversations")
                .delete()
                .eq("id", id);
              setDeletingId(null);
              if (delErr) {
                Alert.alert(t.common.error, t.consulta.deleteError);
                return;
              }
              setConversations((prev) => prev.filter((c) => c.id !== id));
              if (activeId === id) startNewConsultation();
            })();
          },
        },
      ]
    );
  }

  async function takeConsultPhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t.common.error, t.consulta.photoPermission);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setAttachedUri(result.assets[0].uri);
        setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
        setAttachedName(null);
      }
    } catch {
      Alert.alert(t.common.error, t.consulta.photoPermission);
    }
  }

  async function pickFromGallery() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t.common.error, t.consulta.photoPermission);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setAttachedUri(result.assets[0].uri);
        setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
        setAttachedName(result.assets[0].fileName ?? null);
      }
    } catch {
      Alert.alert(t.common.error, t.consulta.photoPermission);
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
        Alert.alert(t.common.error, t.consulta.fileTooLarge);
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
    Alert.alert(t.consulta.attachFile, undefined, [
      { text: t.consulta.takePhoto, onPress: () => void takeConsultPhoto() },
      { text: t.consulta.choosePhoto, onPress: () => void pickFromGallery() },
      { text: t.consulta.chooseFile, onPress: () => void pickConsultFile() },
      { text: t.consulta.cancel, style: "cancel" },
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
      const imageUrl = await consultPhotoAccessUrl(attachmentUrl);
      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: text,
        image_url: attachmentUrl,
      };
      setChatMessages((prev) => [...prev, userMsg]);
      const history = [...chatMessages, userMsg]
        .filter((m) => m.id !== WELCOME_ID)
        .map((m) => ({ role: m.role, content: m.content }));
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");

      let conversationId = activeId;
      if (!conversationId) {
        const title = `Clínica — ${new Date().toLocaleDateString("es-ES")}`;
        const { data: conv, error: convErr } = await supabase
          .from("conversations")
          .insert({ title, user_id: user.id })
          .select("id, title, created_at")
          .single();
        if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");
        conversationId = conv.id;
        setActiveId(conv.id);
        setActiveTitle(conv.title);
        setConversations((prev) => [conv as Conversation, ...prev].slice(0, 30));
        await supabase.from("messages").insert({
          conversation_id: conv.id,
          role: "assistant",
          content: WELCOME_MESSAGE,
        });
      }

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: text,
        image_url: attachmentUrl ?? null,
      });

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
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: answer,
        })
        .select("id, role, content")
        .single();
      setChatMessages((prev) => [
        ...prev,
        {
          id: (aiMsg as ChatMessage | null)?.id ?? `${Date.now()}-a`,
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la consulta clínica.");
    } finally {
      setChatLoading(false);
    }
  }

  function renderTopBar() {
    return (
      <View style={[styles.chatTopBar, { paddingTop: screenHeaderTopInset(insets) }]}>
        <Pressable
          style={styles.menuBtn}
          onPress={() => {
            setHistorySearch("");
            setHistoryOpen(true);
          }}
          accessibilityLabel={t.consulta.myConsultas}
        >
          <Ionicons name="menu" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.chatTopBarTitle} numberOfLines={1}>
          {activeTitle}
        </Text>
        <View style={styles.chatTopBarActions}>
          <AppBurgerMenu isPhysio />
        </View>
      </View>
    );
  }

  function renderHistoryDrawer() {
    const query = historySearch.trim().toLowerCase();
    const filtered = query
      ? conversations.filter((c) => c.title.toLowerCase().includes(query))
      : conversations;
    const groups = groupConversationsByDate(filtered, {
      today: t.consulta.today,
      yesterday: t.consulta.yesterday,
      last7Days: t.consulta.last7Days,
      older: t.consulta.older,
    });

    return (
      <Modal
        visible={historyOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setHistoryOpen(false)}
      >
        <View style={styles.historyOverlay}>
          <View
            style={[
              styles.historyPanel,
              {
                paddingTop: screenHeaderTopInset(insets),
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.historyHeaderTitle}>{t.consulta.clinicalHistory}</Text>
              <Pressable
                style={styles.historyCloseBtn}
                onPress={() => setHistoryOpen(false)}
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [styles.historyNewBtn, pressed && styles.historyNewBtnPressed]}
              onPress={startNewConsultation}
            >
              <Ionicons name="add" size={16} color={Colors.white} />
              <Text style={styles.historyNewBtnText}>{t.consulta.newConsulta}</Text>
            </Pressable>
            {conversations.length > 0 ? (
              <View style={styles.historySearchWrap}>
                <Ionicons name="search" size={15} color={Colors.textLight} />
                <TextInput
                  style={styles.historySearchInput}
                  value={historySearch}
                  onChangeText={setHistorySearch}
                  placeholder={t.consulta.searchConsultas}
                  placeholderTextColor={Colors.textLight}
                  returnKeyType="search"
                />
                {historySearch.length > 0 ? (
                  <Pressable onPress={() => setHistorySearch("")} hitSlop={8}>
                    <Ionicons name="close-circle" size={16} color={Colors.textLight} />
                  </Pressable>
                ) : null}
              </View>
            ) : null}
            <ScrollView style={styles.historyList} keyboardShouldPersistTaps="handled">
              {conversations.length === 0 ? (
                <Text style={styles.historyEmpty}>{t.consulta.emptyHistory}</Text>
              ) : null}
              {conversations.length > 0 && filtered.length === 0 ? (
                <Text style={styles.historyEmpty}>{t.consulta.noMatchConsultas}</Text>
              ) : null}
              {groups.map((group) => (
                <View key={group.label} style={styles.historyGroup}>
                  <Text style={styles.historyGroupLabel}>{group.label}</Text>
                  {group.items.map((c) => {
                    const isActive = activeId === c.id;
                    return (
                      <View
                        key={c.id}
                        style={[styles.historyItem, isActive && styles.historyItemActive]}
                      >
                        <Pressable
                          style={styles.historyItemMain}
                          onPress={() => void openConversation(c.id, c.title)}
                        >
                          <Text
                            style={[
                              styles.historyItemTitle,
                              isActive && styles.historyItemTitleActive,
                            ]}
                            numberOfLines={2}
                          >
                            {c.title}
                          </Text>
                          <Text
                            style={[
                              styles.historyItemDate,
                              isActive && styles.historyItemDateActive,
                            ]}
                          >
                            {formatDate(c.created_at, locale)}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={styles.historyDeleteBtn}
                          onPress={() => deleteConversation(c.id)}
                          disabled={deletingId === c.id}
                          accessibilityLabel={`Eliminar consulta: ${c.title}`}
                        >
                          {deletingId === c.id ? (
                            <ActivityIndicator
                              size="small"
                              color={isActive ? Colors.white : Colors.textLight}
                            />
                          ) : (
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color={isActive ? "#BFDBFE" : Colors.textLight}
                            />
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
            <View style={styles.historyFooter}>
              <Ionicons name="lock-closed" size={11} color={Colors.textLight} />
              <Text style={styles.historyFooterText}>
                {t.consulta.historyPrivate}
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.historyBackdrop}
            onPress={() => setHistoryOpen(false)}
            accessibilityLabel="Cerrar menú"
          />
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: bottomInset }]}>
      {renderTopBar()}
      {renderHistoryDrawer()}
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
                <View style={m.role === "assistant" ? styles.chatBubbleColumn : undefined}>
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
              </View>
              );
            })}
            {chatLoading ? (
              <View style={[styles.chatRow, styles.chatRowAssistant]}>
                <PhysioAvatar size={32} style={{ marginRight: 8 }} />
                <View style={styles.chatBubbleColumn}>
                  <View style={[styles.chatBubble, styles.chatAssistant, styles.loadingBubble]}>
                    <TypingIndicator />
                  </View>
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
                <Ionicons name="arrow-up" size={20} color={Colors.white} />
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
  chatTopBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },
  chatTopBarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  chatTopBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 40,
    justifyContent: "flex-end",
  },
  historyOverlay: { flex: 1, flexDirection: "row" },
  historyBackdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.35)" },
  historyPanel: {
    width: "82%",
    maxWidth: 320,
    alignSelf: "stretch",
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  historyHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  historyCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  historySearchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
  },
  historySearchInput: { flex: 1, fontSize: 13, color: Colors.text, padding: 0 },
  historyList: { flex: 1, paddingHorizontal: 12 },
  historyGroup: { marginBottom: 8 },
  historyGroupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  historyEmpty: {
    paddingHorizontal: 4,
    paddingVertical: 16,
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 18,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 14,
    marginBottom: 6,
    overflow: "hidden",
    backgroundColor: Colors.primarySoft,
  },
  historyItemActive: { backgroundColor: Colors.primary },
  historyItemMain: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  historyItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
  },
  historyItemTitleActive: { color: Colors.white },
  historyItemDate: { marginTop: 3, fontSize: 11, fontWeight: "500", color: Colors.textLight },
  historyItemDateActive: { color: "#BFDBFE" },
  historyDeleteBtn: { width: 40, alignItems: "center", justifyContent: "center" },
  historyNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
  },
  historyNewBtnPressed: { backgroundColor: Colors.primaryDark },
  historyNewBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  historyFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  historyFooterText: { fontSize: 10.5, color: Colors.textLight, fontWeight: "500" },
  messages: { padding: 16, paddingBottom: 24 },
  chatRow: { flexDirection: "row", marginBottom: 12, width: "100%", alignItems: "flex-start" },
  chatRowUser: { justifyContent: "flex-end" },
  chatRowAssistant: { justifyContent: "flex-start" },
  chatBubbleColumn: { flex: 1, minWidth: 0, maxWidth: "100%" },
  chatBubble: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 12,
  },
  chatUser: {
    maxWidth: "82%",
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  chatAssistant: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  chatUserText: { color: Colors.white, fontSize: 15, lineHeight: 21, flexShrink: 1 },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.text,
  },
});
