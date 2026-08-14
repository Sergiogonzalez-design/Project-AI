import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
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
import {
  AuthTextField,
  authEmailProps,
  authPasswordProps,
} from "./AuthTextField";
import { DismissKeyboard } from "./DismissKeyboard";
import { AuthBackBar } from "./AuthBackBar";
import { Colors } from "../lib/colors";
import { WEB_APP_URL } from "../lib/admin-api";
import { useI18n } from "../lib/i18n";
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
  const passwordRef = useRef<TextInput>(null);

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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <AuthBackBar
        onPress={() => void Linking.openURL(`${WEB_APP_URL}/sobre-nosotros`)}
      />
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
            editable={!loading}
            {...authEmailProps}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label={t.auth.password}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            {...authPasswordProps}
            ref={passwordRef}
            onSubmitEditing={handleLogin}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>{t.auth.login}</Text>
            )}
          </Pressable>

          <Pressable style={styles.switchRow} onPress={onSwitch} disabled={loading}>
            <Text style={styles.switchText}>
              {t.auth.noAccount}
              <Text style={styles.switchLink}>{t.auth.signup}</Text>
            </Text>
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
});
