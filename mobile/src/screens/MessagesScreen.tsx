import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";
import { THERAPIST } from "../lib/therapist";

type TherapistMessage = {
  id: string;
  sender_role: "user" | "therapist";
  content: string;
  created_at: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesScreen() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TherapistMessage[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Inicia sesión para ver tus mensajes.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .maybeSingle();
      setIsPremium(profile?.is_premium ?? false);

      let tid: string | null = null;
      const { data: existing } = await supabase
        .from("therapist_threads")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        tid = existing.id;
      } else {
        const { data: created, error: createErr } = await supabase
          .from("therapist_threads")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        if (createErr) {
          setError(createErr.message);
          setLoading(false);
          return;
        }
        tid = created.id;
      }

      setThreadId(tid);

      const { data: msgs, error: msgsErr } = await supabase
        .from("therapist_messages")
        .select("id, sender_role, content, created_at")
        .eq("thread_id", tid)
        .order("created_at", { ascending: true });

      if (msgsErr) setError(msgsErr.message);
      else setMessages((msgs as TherapistMessage[]) ?? []);

      channel = supabase
        .channel(`therapist-messages-${tid}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "therapist_messages",
            filter: `thread_id=eq.${tid}`,
          },
          (payload) => {
            const row = payload.new as TherapistMessage;
            setMessages((prev) =>
              prev.some((m) => m.id === row.id) ? prev : [...prev, row]
            );
          }
        )
        .subscribe();

      setLoading(false);
    }

    init();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!loading) scrollToEnd();
  }, [messages, loading, scrollToEnd]);

  async function handleSend() {
    if (!input.trim() || !threadId || !isPremium || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    setError(null);

    const { error: sendErr } = await supabase.from("therapist_messages").insert({
      thread_id: threadId,
      sender_role: "user",
      content: text,
    });

    if (sendErr) {
      setError(sendErr.message);
      setInput(text);
    }
    setSending(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.therapistCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{THERAPIST.initials}</Text>
        </View>
        <View style={styles.therapistInfo}>
          <Text style={styles.therapistName}>{THERAPIST.name}</Text>
          <Text style={styles.therapistRole}>{THERAPIST.role}</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>Premium</Text>
        </View>
      </View>

      {!isPremium && (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumTitle}>Función Premium</Text>
          <Text style={styles.premiumBody}>
            Pronto podrás enviar mensajes directos a David. Por ahora puedes leer su
            mensaje de bienvenida.
          </Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToEnd}
          renderItem={({ item: msg }) => {
            const isUser = msg.sender_role === "user";
            return (
              <View
                style={[
                  styles.bubbleRow,
                  isUser ? styles.bubbleRowUser : styles.bubbleRowTherapist,
                ]}
              >
                {!isUser && (
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>{THERAPIST.initials}</Text>
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleTherapist]}>
                  <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                    {msg.content}
                  </Text>
                  <Text style={[styles.time, isUser && styles.timeUser]}>
                    {formatTime(msg.created_at)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={[styles.input, !isPremium && styles.inputDisabled]}
          placeholder={
            isPremium ? "Escribe tu mensaje para David..." : "Activa Premium para enviar"
          }
          placeholderTextColor={Colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
          editable={isPremium && !sending}
        />
        <Pressable
          style={[
            styles.sendBtn,
            (!isPremium || !input.trim() || sending) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!isPremium || !input.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Ionicons name="send" size={18} color={Colors.white} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  therapistCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  therapistInfo: { flex: 1 },
  therapistName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  therapistRole: { fontSize: 13, color: Colors.primary, marginTop: 2 },
  premiumBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B45309",
    textTransform: "uppercase",
  },
  premiumBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  premiumTitle: { fontSize: 13, fontWeight: "700", color: "#92400E" },
  premiumBody: { fontSize: 12, color: "#B45309", marginTop: 4, lineHeight: 18 },
  error: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  messageList: { padding: 16, paddingBottom: 8, gap: 10 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowTherapist: { justifyContent: "flex-start" },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  smallAvatarText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTherapist: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  bubbleTextUser: { color: Colors.white },
  time: { fontSize: 10, color: Colors.textLight, marginTop: 6 },
  timeUser: { color: "rgba(255,255,255,0.7)" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    maxHeight: 100,
  },
  inputDisabled: { opacity: 0.6 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: Colors.textLight },
});
