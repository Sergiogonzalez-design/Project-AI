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
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const id = sessionData.session?.user?.id ?? null;
      if (cancelled) return;
      setUserId(id);
      if (!id) {
        setLoadingProfile(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, clinic_name, clinic_id")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (profile?.display_name) setFullName(profile.display_name);
      if (profile?.clinic_name) setClinicName(profile.clinic_name);
      else if (profile?.clinic_id) {
        const { data: clinic } = await supabase
          .from("clinics")
          .select("name")
          .eq("id", profile.clinic_id)
          .maybeSingle();
        if (!cancelled && clinic?.name) setClinicName(clinic.name);
      }
      setLoadingProfile(false);
    })();
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
        clinic_name: clinicName?.trim() || null,
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
            Indica tu nombre completo. La clínica ya viene de tu invitación.
          </Text>

          {loadingProfile ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <>
              {clinicName ? (
                <View style={styles.clinicCard}>
                  <Text style={styles.clinicLabel}>Clínica</Text>
                  <Text style={styles.clinicValue}>{clinicName}</Text>
                  <Text style={styles.hint}>
                    Asignada automáticamente desde la invitación. No hace falta
                    escribirla.
                  </Text>
                </View>
              ) : (
                <Text style={styles.hint}>
                  No encontramos la clínica de la invitación. Contacta con el
                  titular del centro.
                </Text>
              )}

              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Tu nombre y apellidos"
                placeholderTextColor={Colors.textLight}
                autoComplete="name"
              />

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
            </>
          )}
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
  clinicCard: {
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  clinicLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  clinicValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
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
