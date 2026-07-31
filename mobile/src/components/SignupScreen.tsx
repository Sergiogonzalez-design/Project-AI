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
import { useI18n } from "../lib/i18n";
import { WEB_APP_URL } from "../lib/admin-api";
import { supabase } from "../lib/supabase";

type Props = {
  onSwitch: () => void;
};

export function SignupScreen({ onSwitch }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleSignup() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Rellena todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      const res = await fetch(`${WEB_APP_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      const { error: signError } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
      });
      if (signError) {
        setError(signError.message);
      }
      // Session change is handled by App.tsx auth listener → onboarding
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
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>{t.auth.signupTitle}</Text>
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
        </View>

        <View style={styles.card}>
          <AuthTextField
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            {...authEmailProps}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            {...authPasswordProps}
            ref={passwordRef}
            onSubmitEditing={() => confirmRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label="Repite la contraseña"
            placeholder="Repite la contraseña"
            value={confirm}
            onChangeText={setConfirm}
            editable={!loading}
            {...authPasswordProps}
            ref={confirmRef}
            onSubmitEditing={handleSignup}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear cuenta</Text>
            )}
          </Pressable>

          <Pressable style={styles.switchRow} onPress={onSwitch}>
            <Text style={styles.switchText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.switchLink}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
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
  buttonPressed: {
    backgroundColor: Colors.primaryDark,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  switchRow: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switchLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
