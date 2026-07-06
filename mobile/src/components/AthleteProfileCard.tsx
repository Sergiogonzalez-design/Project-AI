import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
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

type ProfileData = {
  age: number | null;
  sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  dominant_hand: string | null;
  dominant_foot: string | null;
  primary_sport: string | null;
  sport_position: string | null;
  competitive_level: string | null;
  sessions_per_week: number | null;
  hours_per_week: number | null;
  current_season: string | null;
  performance_goals: string[] | null;
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function AthleteProfileCard() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);

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

  function fillForm(data: ProfileData) {
    setAge(data.age?.toString() ?? "");
    setSex(data.sex ?? "");
    setHeightCm(data.height_cm?.toString() ?? "");
    setWeightKg(data.weight_kg?.toString() ?? "");
    setDominantHand(data.dominant_hand ?? "");
    setDominantFoot(data.dominant_foot ?? "");
    setPrimarySport(data.primary_sport ?? "");
    setSportPosition(data.sport_position ?? "");
    setCompetitiveLevel(data.competitive_level ?? "");
    setSessionsPerWeek(data.sessions_per_week?.toString() ?? "");
    setHoursPerWeek(data.hours_per_week?.toString() ?? "");
    setCurrentSeason(data.current_season ?? "");
    setPerformanceGoals(data.performance_goals ?? []);
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select(
          "age, sex, height_cm, weight_kg, dominant_hand, dominant_foot, primary_sport, sport_position, competitive_level, sessions_per_week, hours_per_week, current_season, performance_goals"
        )
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data as ProfileData);
        fillForm(data as ProfileData);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated: ProfileData = {
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
      };
      const { error: saveErr } = await supabase
        .from("profiles")
        .update({ ...updated, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (saveErr) throw new Error(saveErr.message);
      setProfile(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  function ChipPicker({
    options,
    value,
    onSelect,
    multi,
  }: {
    options: readonly string[];
    value: string | string[];
    onSelect: (v: string) => void;
    multi?: boolean;
  }) {
    return (
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = multi
            ? (value as string[]).includes(opt)
            : value === opt;
          return (
            <Pressable
              key={opt}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(opt)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  const hasData = profile?.primary_sport || profile?.age;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Perfil deportivo</Text>
          <Pressable style={styles.editBtn} onPress={() => setEditing(true)}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
            <Text style={styles.editBtnText}>{hasData ? "Editar" : "Completar"}</Text>
          </Pressable>
        </View>

        {hasData ? (
          <>
            <Row label="Edad" value={profile?.age ? `${profile.age} años` : null} />
            <Row label="Sexo" value={profile?.sex} />
            <Row
              label="Altura / Peso"
              value={
                profile?.height_cm && profile?.weight_kg
                  ? `${profile.height_cm} cm · ${profile.weight_kg} kg`
                  : null
              }
            />
            <Row label="Mano" value={profile?.dominant_hand} />
            <Row label="Pie" value={profile?.dominant_foot} />
            <Row label="Deporte" value={profile?.primary_sport} />
            <Row label="Posición" value={profile?.sport_position} />
            <Row label="Nivel" value={profile?.competitive_level} />
            <Row
              label="Entrenamiento"
              value={
                profile?.sessions_per_week != null
                  ? `${profile.sessions_per_week} ses. · ${profile.hours_per_week} h/sem`
                  : null
              }
            />
            <Row label="Temporada" value={profile?.current_season} />
            {profile?.performance_goals && profile.performance_goals.length > 0 && (
              <View style={styles.goalsWrap}>
                <Text style={styles.rowLabel}>Objetivos</Text>
                <View style={styles.goalsRow}>
                  {profile.performance_goals.map((g) => (
                    <View key={g} style={styles.goalTag}>
                      <Text style={styles.goalTagText}>{g}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Completa tu perfil deportivo para que la IA personalice tus consultas.
          </Text>
        )}
      </View>

      <Modal visible={editing} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modalRoot} contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar perfil deportivo</Text>

          <Text style={styles.fieldLabel}>Edad</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
          <Text style={styles.fieldLabel}>Sexo</Text>
          <ChipPicker options={SEX_OPTIONS} value={sex} onSelect={setSex} />
          <Text style={styles.fieldLabel}>Altura (cm) / Peso (kg)</Text>
          <View style={styles.twoCol}>
            <TextInput style={[styles.input, styles.halfInput]} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
            <TextInput style={[styles.input, styles.halfInput]} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
          </View>
          <Text style={styles.fieldLabel}>Mano dominante</Text>
          <ChipPicker options={DOMINANT_HAND_OPTIONS} value={dominantHand} onSelect={setDominantHand} />
          <Text style={styles.fieldLabel}>Pie dominante</Text>
          <ChipPicker options={DOMINANT_FOOT_OPTIONS} value={dominantFoot} onSelect={setDominantFoot} />
          <Text style={styles.fieldLabel}>Deporte principal</Text>
          <TextInput style={styles.input} value={primarySport} onChangeText={setPrimarySport} />
          <Text style={styles.fieldLabel}>Posición</Text>
          <TextInput style={styles.input} value={sportPosition} onChangeText={setSportPosition} />
          <Text style={styles.fieldLabel}>Nivel</Text>
          <ChipPicker options={COMPETITIVE_LEVELS} value={competitiveLevel} onSelect={setCompetitiveLevel} />
          <Text style={styles.fieldLabel}>Sesiones / Horas por semana</Text>
          <View style={styles.twoCol}>
            <TextInput style={[styles.input, styles.halfInput]} value={sessionsPerWeek} onChangeText={setSessionsPerWeek} keyboardType="numeric" />
            <TextInput style={[styles.input, styles.halfInput]} value={hoursPerWeek} onChangeText={setHoursPerWeek} keyboardType="numeric" />
          </View>
          <Text style={styles.fieldLabel}>Temporada</Text>
          <ChipPicker options={CURRENT_SEASONS} value={currentSeason} onSelect={setCurrentSeason} />
          <Text style={styles.fieldLabel}>Objetivos</Text>
          <ChipPicker
            options={PERFORMANCE_GOALS}
            value={performanceGoals}
            multi
            onSelect={(g) =>
              setPerformanceGoals((prev) =>
                prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
              )
            }
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.modalBtns}>
            <Pressable style={styles.cancelBtn} onPress={() => { setEditing(false); if (profile) fillForm(profile); }}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  editBtnText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { fontSize: 13, color: Colors.textSecondary },
  rowValue: { fontSize: 13, fontWeight: "600", color: Colors.text, flexShrink: 1, textAlign: "right", marginLeft: 12 },
  goalsWrap: { marginTop: 8 },
  goalsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  goalTag: { backgroundColor: Colors.primaryLight, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  goalTagText: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  emptyText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  modalRoot: { flex: 1, backgroundColor: Colors.background },
  modalContent: { padding: 20, paddingBottom: 48 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: Colors.text, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: Colors.text, backgroundColor: Colors.surface,
  },
  twoCol: { flexDirection: "row", gap: 10 },
  halfInput: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.text },
  chipTextActive: { color: Colors.white, fontWeight: "600" },
  error: { marginTop: 12, color: Colors.danger, fontSize: 13, textAlign: "center" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: "600" },
  saveBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: Colors.white, fontWeight: "700" },
});
