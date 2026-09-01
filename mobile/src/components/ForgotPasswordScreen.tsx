import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthBackBar } from "./AuthBackBar";
import { AuthTextField, authEmailProps } from "./AuthTextField";
import { DismissKeyboard } from "./DismissKeyboard";
import { Colors } from "../lib/colors";
import { WEB_APP_URL } from "../lib/admin-api";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";

type Props = {
  onBack: () => void;
};

export function ForgotPasswordScreen({ onBack }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setError(t.auth.emailPasswordRequired);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${WEB_APP_URL}/auth/callback?next=/auth/reset-password`,
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <DismissKeyboard>
        <AuthBackBar onPress={onBack} />
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <View style={styles.header}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>{t.auth.forgotTitle}</Text>
            <Text style={styles.subtitle}>{t.auth.forgotSubtitle}</Text>
          </View>

          <View style={styles.card}>
            {sent ? (
              <Text style={styles.sent}>{t.auth.forgotSent}</Text>
            ) : (
              <>
                <AuthTextField
                  label={t.auth.email}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                  {...authEmailProps}
                  onSubmitEditing={() => void handleSend()}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={() => void handleSend()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <Text style={styles.buttonText}>{t.auth.forgotSend}</Text>
                  )}
                </Pressable>
              </>
            )}
            <Pressable style={styles.backRow} onPress={onBack}>
              <Text style={styles.backText}>{t.auth.forgotBack}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 28 },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.6,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sent: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
    textAlign: "center",
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonPressed: { backgroundColor: Colors.primaryDark },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  backRow: { marginTop: 20, alignItems: "center" },
  backText: { fontSize: 14, fontWeight: "700", color: Colors.primary },
});
