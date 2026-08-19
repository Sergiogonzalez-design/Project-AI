import React, { useRef, useState } from "react";
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
  TextInput,
  View,
} from "react-native";
import {
  AuthTextField,
  authEmailProps,
  authPasswordProps,
} from "./AuthTextField";
import { DismissKeyboard } from "./DismissKeyboard";
import { Colors } from "../lib/colors";
import { WEB_APP_URL } from "../lib/admin-api";
import { useI18n } from "../lib/i18n";
import { parsePastedInviteCode } from "../lib/physio-invite";
import { supabase } from "../lib/supabase";

type Props = {
  onSwitch: () => void;
};

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Esta cuenta aún no está activa. Vuelve a registrarte o contacta con soporte.";
  }
  return message;
}

export function LoginScreen({ onSwitch }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const busy = loading || guestLoading;

  async function handleLogin() {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password.trim()) {
      setError("Introduce tu correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (signError) setError(translateAuthError(signError.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestCode() {
    setError(null);
    setGuestError(null);
    Keyboard.dismiss();
    const normalized = parsePastedInviteCode(inviteCode);
    if (normalized.length < 6) {
      setGuestError("Introduce el código que te ha dado tu fisioterapeuta.");
      return;
    }
    setGuestLoading(true);
    try {
      let email: string | undefined;
      let password: string | undefined;
      let apiError: string | undefined;

      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        "guest-physio",
        { body: { code: normalized } }
      );
      const fnPayload = fnData as { error?: string; email?: string; password?: string } | null;
      if (!fnError && fnPayload?.email && fnPayload?.password) {
        email = fnPayload.email;
        password = fnPayload.password;
      } else {
        const res = await fetch(`${WEB_APP_URL}/api/auth/guest-physio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: normalized }),
        });
        const payload = (await res.json()) as {
          error?: string;
          email?: string;
          password?: string;
        };
        if (res.ok && payload.email && payload.password) {
          email = payload.email;
          password = payload.password;
        } else {
          apiError =
            payload.error ??
            fnPayload?.error ??
            fnError?.message ??
            "No se pudo empezar la consulta.";
        }
      }

      if (!email || !password) {
        setGuestError(apiError ?? "No se pudo empezar la consulta.");
        return;
      }
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) setGuestError(translateAuthError(signError.message));
    } catch {
      setGuestError("No se pudo empezar la consulta. Inténtalo de nuevo.");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <DismissKeyboard>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>{t.auth.loginTitle}</Text>
          <Text style={styles.subtitle}>{t.auth.loginSubtitle}</Text>
        </View>

        <View style={styles.card}>
          <AuthTextField
            label={t.auth.email}
            value={email}
            onChangeText={setEmail}
            editable={!busy}
            {...authEmailProps}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label={t.auth.password}
            value={password}
            onChangeText={setPassword}
            editable={!busy}
            {...authPasswordProps}
            ref={passwordRef}
            onSubmitEditing={handleLogin}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              busy && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={busy}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>{t.auth.login}</Text>
            )}
          </Pressable>

          <Pressable style={styles.switchRow} onPress={onSwitch} disabled={busy}>
            <Text style={styles.switchText}>
              {t.auth.noAccount}
              <Text style={styles.switchLink}>{t.auth.signup}</Text>
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.guestTitle}>Código de tu fisioterapeuta</Text>
          <AuthTextField
            label="Código"
            value={inviteCode}
            onChangeText={(v) => setInviteCode(parsePastedInviteCode(v))}
            editable={!busy}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            placeholder="Ej. K7M2P9QX"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => void handleGuestCode()}
          />
          {guestError ? <Text style={styles.error}>{guestError}</Text> : null}
          <Pressable
            style={({ pressed }) => [
              styles.guestButton,
              pressed && styles.guestButtonPressed,
              busy && styles.buttonDisabled,
            ]}
            onPress={() => void handleGuestCode()}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Empezar consulta previa con código de fisioterapeuta"
          >
            {guestLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
            <Text style={styles.guestButtonText}>Empezar consulta previa</Text>
          )}
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
    paddingTop: 72,
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
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: Colors.textSecondary,
    letterSpacing: -0.1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
    lineHeight: 18,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonPressed: { backgroundColor: Colors.primaryDark },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  switchRow: { marginTop: 24, alignItems: "center" },
  switchText: { fontSize: 14, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: "700" },
  dividerRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  dividerText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
  },
  guestTitle: {
    marginTop: 18,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  guestHint: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  guestButton: {
    marginTop: 16,
    backgroundColor: Colors.primarySoft,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestButtonPressed: { opacity: 0.85 },
  guestButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  legalRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  legalLink: { fontSize: 12, fontWeight: "600", color: Colors.primary },
});
