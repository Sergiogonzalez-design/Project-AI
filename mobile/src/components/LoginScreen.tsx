import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import {
  AuthTextField,
  authEmailProps,
  authPasswordProps,
} from "./AuthTextField";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Props = {
  onSwitch: () => void;
};

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos. Si te registraste en la web, confirma tu correo primero.";
  }
  if (message.includes("Email not confirmed")) {
    return "Confirma tu correo antes de iniciar sesión (revisa tu bandeja de entrada).";
  }
  return message;
}

export function LoginScreen({ onSwitch }: Props) {
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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>PhysioGuide AI</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
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
            placeholder="Tu contraseña"
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
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable style={styles.switchRow} onPress={onSwitch} disabled={loading}>
            <Text style={styles.switchText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.switchLink}>Crear cuenta</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: { alignItems: "center", marginBottom: 32 },
  logo: { width: 72, height: 72, marginBottom: 12, resizeMode: "contain" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: { marginTop: 6, fontSize: 15, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
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
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: { backgroundColor: Colors.primaryDark },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  switchRow: { marginTop: 20, alignItems: "center" },
  switchText: { fontSize: 14, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: "600" },
});
