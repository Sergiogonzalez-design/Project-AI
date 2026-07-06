import React, { useState } from "react";
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
  COMPETITIVE_LEVELS,
  CURRENT_SEASONS,
  DOMINANT_FOOT_OPTIONS,
  DOMINANT_HAND_OPTIONS,
  PERFORMANCE_GOALS,
  SEX_OPTIONS,
} from "../lib/profile-options";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Props = { onComplete: () => void };

function Chips({
  options,
  value,
  onChange,
  multi,
  selected,
  onToggle,
}: {
  options: readonly string[];
  value?: string;
  onChange?: (v: string) => void;
  multi?: boolean;
  selected?: string[];
  onToggle?: (v: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => {
        const active = multi ? selected?.includes(opt) : value === opt;
        return (
          <Pressable
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => (multi ? onToggle?.(opt) : onChange?.(opt))}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [dominantHand, setDominantHand] = useState("");
  const [dominantFoot, setDominantFoot] = useState("");
  const [primarySport, setPrimarySport] = useState("");
  const [sportPosition, setSportPosition] = useState("");
  const [competitiveLevel, setCompetitiveLevel] = useState("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [performanceGoals, setPerformanceGoals] = useState<string[]>([]);

  function toggleGoal(goal: string) {
    setPerformanceGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function validateStep1() {
    if (!fullName.trim()) return "Introduce tu nombre completo.";
    if (!age || Number(age) < 1) return "Introduce una edad válida.";
    if (!sex) return "Selecciona tu sexo.";
    if (!heightCm) return "Introduce tu altura.";
    if (!weightKg) return "Introduce tu peso.";
    if (!dominantHand) return "Selecciona tu mano dominante.";
    if (!dominantFoot) return "Selecciona tu pie dominante.";
    return null;
  }

  function validateStep2() {
    if (!primarySport.trim()) return "Indica tu deporte principal.";
    if (!competitiveLevel) return "Selecciona tu nivel competitivo.";
    if (!sessionsPerWeek) return "Indica sesiones por semana.";
    if (!hoursPerWeek) return "Indica horas por semana.";
    if (!currentSeason) return "Selecciona la temporada.";
    if (performanceGoals.length === 0) return "Selecciona al menos un objetivo.";
    return null;
  }

  async function handleFinish() {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");
      const { error: saveErr } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: fullName.trim(),
        age: Number(age),
        sex,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        dominant_hand: dominantHand,
        dominant_foot: dominantFoot,
        primary_sport: primarySport.trim(),
        sport_position: sportPosition.trim() || null,
        competitive_level: competitiveLevel,
        sessions_per_week: Number(sessionsPerWeek),
        hours_per_week: Number(hoursPerWeek),
        current_season: currentSeason,
        performance_goals: performanceGoals,
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>
          {step === 1 ? "Información básica" : "Perfil deportivo"}
        </Text>
        <Text style={styles.subtitle}>Paso {step} de 2</Text>
        <View style={styles.progressRow}>
          <View style={[styles.progressBar, step >= 1 && styles.progressActive]} />
          <View style={[styles.progressBar, step >= 2 && styles.progressActive]} />
        </View>

        {step === 1 ? (
          <>
            <Field label="Nombre completo" value={fullName} onChangeText={setFullName} />
            <Field label="Edad" value={age} onChangeText={setAge} keyboardType="numeric" />
            <Text style={styles.label}>Sexo</Text>
            <Chips options={SEX_OPTIONS} value={sex} onChange={setSex} />
            <View style={styles.row}>
              <View style={styles.half}>
                <Field label="Altura (cm)" value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
              </View>
              <View style={styles.half}>
                <Field label="Peso (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
              </View>
            </View>
            <Text style={styles.label}>Mano dominante</Text>
            <Chips options={DOMINANT_HAND_OPTIONS} value={dominantHand} onChange={setDominantHand} />
            <Text style={styles.label}>Pie dominante</Text>
            <Chips options={DOMINANT_FOOT_OPTIONS} value={dominantFoot} onChange={setDominantFoot} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                const err = validateStep1();
                if (err) { setError(err); return; }
                setError(null);
                setStep(2);
              }}
            >
              <Text style={styles.primaryBtnText}>Continuar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Field label="Deporte principal" value={primarySport} onChangeText={setPrimarySport} />
            <Field label="Posición (opcional)" value={sportPosition} onChangeText={setSportPosition} />
            <Text style={styles.label}>Nivel competitivo</Text>
            <Chips options={COMPETITIVE_LEVELS} value={competitiveLevel} onChange={setCompetitiveLevel} />
            <View style={styles.row}>
              <View style={styles.half}>
                <Field label="Sesiones/sem" value={sessionsPerWeek} onChangeText={setSessionsPerWeek} keyboardType="numeric" />
              </View>
              <View style={styles.half}>
                <Field label="Horas/sem" value={hoursPerWeek} onChangeText={setHoursPerWeek} keyboardType="numeric" />
              </View>
            </View>
            <Text style={styles.label}>Temporada actual</Text>
            <Chips options={CURRENT_SEASONS} value={currentSeason} onChange={setCurrentSeason} />
            <Text style={styles.label}>Objetivos de rendimiento</Text>
            <Chips
              options={PERFORMANCE_GOALS}
              multi
              selected={performanceGoals}
              onToggle={toggleGoal}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.btnRow}>
              <Pressable style={styles.secondaryBtn} onPress={() => { setStep(1); setError(null); }}>
                <Text style={styles.secondaryBtnText}>Atrás</Text>
              </Pressable>
              <Pressable style={styles.primaryBtnFlex} onPress={handleFinish} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Finalizar</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "numeric" | "default";
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.textLight}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 24, paddingBottom: 48 },
  logo: { width: 64, height: 64, alignSelf: "center", marginBottom: 16, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text, textAlign: "center" },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: "center", marginTop: 4, marginBottom: 16 },
  progressRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressActive: { backgroundColor: Colors.primary },
  label: { fontSize: 14, fontWeight: "600", color: Colors.text, marginTop: 16, marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    color: Colors.text, backgroundColor: Colors.surface,
  },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  chipTextActive: { color: Colors.white, fontWeight: "600" },
  error: { marginTop: 12, fontSize: 13, color: Colors.danger, textAlign: "center" },
  primaryBtn: {
    marginTop: 24, backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
  },
  primaryBtnFlex: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
  },
  primaryBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    paddingVertical: 14, alignItems: "center", backgroundColor: Colors.surface,
  },
  secondaryBtnText: { color: Colors.primary, fontSize: 16, fontWeight: "600" },
  btnRow: { flexDirection: "row", gap: 12, marginTop: 24 },
});
