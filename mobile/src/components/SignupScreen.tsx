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

export function SignupScreen({ onSwitch }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleSignup() {
    setError(null);
    setInfo(null);
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
      const { data, error: signError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      if (!data.session) {
        setInfo(
          "Revisa tu correo y confirma la cuenta para poder entrar."
        );
      }
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
          {info ? <Text style={styles.info}>{info}</Text> : null}

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
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
  },
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  info: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.primary,
    textAlign: "center",
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
