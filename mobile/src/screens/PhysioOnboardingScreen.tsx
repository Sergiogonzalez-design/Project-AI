import React, { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthBackBar } from "../components/AuthBackBar";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Props = { onComplete: () => void };

export function PhysioOnboardingScreen({ onComplete }: Props) {
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUserId(data.session?.user?.id ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    if (!userId) {
      setError("Sesión expirada. Cierra la app y vuelve a entrar.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        display_name: fullName.trim(),
        clinic_name: clinicName.trim() || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId);

      if (saveErr) {
        const { error: upsertErr } = await supabase.from("profiles").upsert({
          id: userId,
          account_type: "physio",
          ...payload,
        });
        if (upsertErr) throw new Error(upsertErr.message);
      }

      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <AuthBackBar onPress={() => void supabase.auth.signOut()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          bounces
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Bienvenido, fisioterapeuta</Text>
          <Text style={styles.subtitle}>
            Cuéntanos cómo te identifican tus pacientes. No necesitamos tu perfil
            deportivo.
          </Text>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre y apellidos"
            placeholderTextColor={Colors.textLight}
          />

          <Text style={styles.label}>Clínica o centro</Text>
          <TextInput
            style={styles.input}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Ej: Clínica AIKinora, Centro de fisioterapia…"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.hint}>
            Opcional — aparece en tu enlace de invitación para pacientes.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={() => void handleSubmit()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Ir al panel de pacientes</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, paddingTop: 56, paddingBottom: 64 },
  logo: { width: 64, height: 64, alignSelf: "center", marginBottom: 16, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 8, marginTop: 8 },
  hint: { fontSize: 12, color: Colors.textSecondary, marginTop: 6, lineHeight: 17 },
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
  primaryBtnDisabled: { opacity: 0.85 },
  primaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
