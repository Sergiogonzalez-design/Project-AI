import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../lib/colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const contactMethods: {
  id: string;
  icon: IoniconsName;
  label: string;
  value: string;
}[] = [
  { id: "email", icon: "mail-outline", label: "Correo electrónico", value: "at@physioguidea.com" },
  { id: "phone", icon: "call-outline", label: "Teléfono / WhatsApp", value: "+34 600 000 000" },
];

export function ContactScreen() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <View style={styles.centered}>
        <View style={styles.sentIconCircle}>
          <Ionicons name="checkmark" size={36} color={Colors.white} />
        </View>
        <Text style={styles.sentTitle}>Mensaje enviado</Text>
        <Text style={styles.sentBody}>
          Tu entrenador atlético recibirá tu mensaje y te responderá lo antes posible.
        </Text>
        <Pressable style={styles.backBtn} onPress={() => setSent(false)}>
          <Text style={styles.backBtnText}>Enviar otro mensaje</Text>
        </Pressable>
      </View>
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
        <Text style={styles.pageTitle}>Contacto</Text>
        <Text style={styles.pageSubtitle}>
          Contacta directamente con tu entrenador atlético.
        </Text>

        <Text style={styles.sectionLabel}>Contacto directo</Text>
        {contactMethods.map((m) => (
          <Pressable
            key={m.id}
            style={({ pressed }) => [
              styles.contactCard,
              pressed && styles.contactCardPressed,
            ]}
            onPress={() => {
              if (m.id === "email") Linking.openURL(`mailto:${m.value}`);
              else Linking.openURL(`tel:${m.value.replace(/\s/g, "")}`);
            }}
          >
            <View style={styles.contactIconCircle}>
              <Ionicons name={m.icon} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{m.label}</Text>
              <Text style={styles.contactValue}>{m.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </Pressable>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Enviar mensaje</Text>

        <Text style={styles.fieldLabel}>Tu nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre y apellidos"
          placeholderTextColor={Colors.textLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          placeholder="Escribe tu consulta o comentario..."
          placeholderTextColor={Colors.textLight}
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <Pressable
          style={({ pressed }) => [
            styles.sendBtn,
            pressed && styles.sendBtnPressed,
            (!name.trim() || !message.trim() || sending) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!name.trim() || !message.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.sendBtnInner}>
              <Ionicons name="send" size={16} color={Colors.white} />
              <Text style={styles.sendBtnText}>Enviar mensaje</Text>
            </View>
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
    fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 10,
  },
  contactCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  contactCardPressed: { backgroundColor: Colors.primaryLight },
  contactIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: "center", justifyContent: "center",
  },
  contactLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  contactValue: { fontSize: 15, fontWeight: "600", color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 24 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.text, backgroundColor: Colors.surface,
  },
  inputMulti: { minHeight: 100, textAlignVertical: "top" },
  sendBtn: {
    marginTop: 24, backgroundColor: Colors.primary,
    borderRadius: 14, paddingVertical: 16, alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  sendBtnPressed: { backgroundColor: Colors.primaryDark },
  sendBtnDisabled: { backgroundColor: Colors.textLight, shadowOpacity: 0 },
  sendBtnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  sendBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  sentIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  sentTitle: { fontSize: 22, fontWeight: "700", color: Colors.text, marginBottom: 8 },
  sentBody: {
    fontSize: 15, color: Colors.textSecondary,
    textAlign: "center", lineHeight: 22, marginBottom: 32,
  },
  backBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  backBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
