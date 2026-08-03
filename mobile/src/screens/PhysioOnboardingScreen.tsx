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
  TextInput,
  View,
} from "react-native";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Props = { onComplete: () => void };

export function PhysioOnboardingScreen({ onComplete }: Props) {
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");
      const { error: saveErr } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: fullName.trim(),
        clinic_name: clinicName.trim() || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
      if (saveErr) throw new Error(saveErr.message);
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <DismissKeyboard>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Bienvenido, fisioterapeuta</Text>
          <Text style={styles.subtitle}>
            Solo necesitamos un par de datos para crear tu panel de pacientes
          </Text>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre y apellidos"
            placeholderTextColor={Colors.textLight}
          />

          <Text style={styles.label}>Clínica o centro (opcional)</Text>
          <TextInput
            style={styles.input}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Ej: Clínica Kinora"
            placeholderTextColor={Colors.textLight}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Continuar</Text>
            )}
          </Pressable>
        </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 24, paddingBottom: 48 },
  logo: { width: 64, height: 64, alignSelf: "center", marginBottom: 16, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  error: { marginTop: 12, fontSize: 13, color: Colors.danger, textAlign: "center" },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
