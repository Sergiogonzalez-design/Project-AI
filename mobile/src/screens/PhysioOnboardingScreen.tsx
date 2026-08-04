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
import { PHYSIO_EQUIPMENT_CATEGORIES } from "../lib/physio-equipment-options";
import { supabase } from "../lib/supabase";

type Props = { onComplete: () => void };

export function PhysioOnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [equipmentNotes, setEquipmentNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleEquipment(id: string) {
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function goNext() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit() {
    if (equipment.length === 0) {
      setError(
        "Selecciona al menos el material que tienes (o «Solo material básico»)."
      );
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
        clinic_equipment: equipment,
        clinic_equipment_notes: equipmentNotes.trim() || null,
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
            {step === 1
              ? "Paso 1 de 2 — Tus datos para el panel de pacientes"
              : "Paso 2 de 2 — Material de tu consulta"}
          </Text>

          {step === 1 ? (
            <>
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

              <Pressable style={styles.primaryBtn} onPress={goNext}>
                <Text style={styles.primaryBtnText}>Continuar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.help}>
                Marca el material que tienes. Physio adaptará recomendaciones; si
                falta algo (p. ej. RX), te sugerirá derivar al paciente.
              </Text>

              {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => (
                <View key={cat.id} style={styles.category}>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                  <View style={styles.chips}>
                    {cat.options.map((opt) => {
                      const selected = equipment.includes(opt.id);
                      return (
                        <Pressable
                          key={opt.id}
                          onPress={() => toggleEquipment(opt.id)}
                          style={[styles.chip, selected && styles.chipSelected]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.chipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}

              <Text style={styles.label}>Otro material o notas (opcional)</Text>
              <TextInput
                style={[styles.input, styles.notes]}
                value={equipmentNotes}
                onChangeText={setEquipmentNotes}
                placeholder="Ej: RX en el edificio de al lado…"
                placeholderTextColor={Colors.textLight}
                multiline
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.row}>
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => {
                    setError(null);
                    setStep(1);
                  }}
                >
                  <Text style={styles.secondaryBtnText}>Atrás</Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryBtn, styles.primaryBtnFlex]}
                  onPress={() => void handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Ir al panel</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
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
  help: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 16,
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
  notes: { minHeight: 80, textAlignVertical: "top" },
  category: { marginBottom: 16 },
  categoryTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  chipTextSelected: { color: Colors.white },
  error: { marginTop: 12, fontSize: 13, color: Colors.danger, textAlign: "center" },
  row: { flexDirection: "row", gap: 10, marginTop: 16 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: 15, fontWeight: "700" },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnFlex: { flex: 1, marginTop: 0 },
  primaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
