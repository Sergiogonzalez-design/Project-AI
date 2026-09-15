import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { staffVisibleEmail } from "../lib/guest-account";
import { SEX_OPTIONS } from "../lib/profile-options";
import { supabase } from "../lib/supabase";

export type StaffPatientProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  age: number | null;
  sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  city: string | null;
  is_guest: boolean;
};

type Props = {
  patientId: string;
  onDisplayNameChange?: (name: string | null) => void;
};

function parseOptionalInt(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

function parseOptionalNum(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function rowFromRpc(raw: unknown): StaffPatientProfile | null {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    email: staffVisibleEmail((r.email as string | null) ?? null),
    display_name: (r.display_name as string | null) ?? null,
    age: r.age == null ? null : Number(r.age),
    sex: (r.sex as string | null) ?? null,
    height_cm: r.height_cm == null ? null : Number(r.height_cm),
    weight_kg: r.weight_kg == null ? null : Number(r.weight_kg),
    city: (r.city as string | null) ?? null,
    is_guest: Boolean(r.is_guest),
  };
}

export function StaffPatientProfileEditor({
  patientId,
  onDisplayNameChange,
}: Props) {
  const [profile, setProfile] = useState<StaffPatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [city, setCity] = useState("");

  const fillForm = useCallback((p: StaffPatientProfile) => {
    setDisplayName(p.display_name ?? "");
    setAge(p.age?.toString() ?? "");
    setSex(p.sex ?? "");
    setHeightCm(p.height_cm?.toString() ?? "");
    setWeightKg(p.weight_kg?.toString() ?? "");
    setCity(p.city ?? "");
  }, []);

  const nameChangeRef = useRef(onDisplayNameChange);
  nameChangeRef.current = onDisplayNameChange;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "staff_get_patient_profile",
        { p_patient_id: patientId }
      );
      if (rpcError) {
        setError(rpcError.message);
        setProfile(null);
        return;
      }
      const next = rowFromRpc(data);
      setProfile(next);
      if (next) {
        fillForm(next);
        nameChangeRef.current?.(next.display_name);
        const empty =
          !next.display_name &&
          next.age == null &&
          !next.sex &&
          next.height_cm == null &&
          next.weight_kg == null &&
          !next.city;
        if (empty) setEditing(true);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cargar el perfil."
      );
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [fillForm, patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedFlash(false);

    const ageVal = parseOptionalInt(age);
    if (age.trim() && ageVal == null) {
      setError("La edad debe ser un número entero.");
      setSaving(false);
      return;
    }
    if (ageVal != null && (ageVal < 1 || ageVal > 120)) {
      setError("La edad debe estar entre 1 y 120.");
      setSaving(false);
      return;
    }
    const heightVal = parseOptionalNum(heightCm);
    if (heightCm.trim() && heightVal == null) {
      setError("La altura debe ser un número.");
      setSaving(false);
      return;
    }
    const weightVal = parseOptionalNum(weightKg);
    if (weightKg.trim() && weightVal == null) {
      setError("El peso debe ser un número.");
      setSaving(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_patient_profile",
        {
          p_patient_id: patientId,
          p_display_name: displayName.trim() || null,
          p_age: ageVal,
          p_sex: sex.trim() || null,
          p_height_cm: heightVal,
          p_weight_kg: weightVal,
          p_city: city.trim() || null,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      const next = rowFromRpc(data);
      if (next) {
        setProfile(next);
        fillForm(next);
        nameChangeRef.current?.(next.display_name);
      }
      setEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const hasAny =
    !!profile?.display_name ||
    profile?.age != null ||
    !!profile?.sex ||
    profile?.height_cm != null ||
    profile?.weight_kg != null ||
    !!profile?.city;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Perfil del paciente</Text>
          <Text style={styles.hint}>
            Todos los campos son opcionales. Útil si el paciente entró solo con
            código.
          </Text>
          {profile?.is_guest ? (
            <Text style={styles.guest}>Cuenta invitada (sin registro completo).</Text>
          ) : null}
        </View>
        {!editing && !loading ? (
          <Pressable
            onPress={() => {
              if (profile) fillForm(profile);
              setEditing(true);
              setError(null);
            }}
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>
              {hasAny ? "Editar" : "Completar"}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 12 }} />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {savedFlash ? <Text style={styles.saved}>Perfil guardado.</Text> : null}

      {!loading && !editing && profile ? (
        hasAny ? (
          <View style={styles.summary}>
            {profile.display_name ? (
              <Summary label="Nombre" value={profile.display_name} />
            ) : null}
            {profile.age != null ? (
              <Summary label="Edad" value={`${profile.age} años`} />
            ) : null}
            {profile.sex ? <Summary label="Sexo" value={profile.sex} /> : null}
            {profile.height_cm != null ? (
              <Summary label="Altura" value={`${profile.height_cm} cm`} />
            ) : null}
            {profile.weight_kg != null ? (
              <Summary label="Peso" value={`${profile.weight_kg} kg`} />
            ) : null}
            {profile.city ? (
              <Summary label="Ciudad" value={profile.city} />
            ) : null}
          </View>
        ) : (
          <Text style={styles.empty}>
            Aún no hay datos. Puedes añadir nombre, edad u otros si los conoces.
          </Text>
        )
      ) : null}

      {!loading && editing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Nombre y apellidos"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
          <Text style={styles.label}>Edad</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="Opcional"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.chips}>
            {SEX_OPTIONS.map((opt) => {
              const active = sex === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setSex(active ? "" : opt)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="decimal-pad"
                placeholder="Opcional"
                placeholderTextColor={Colors.textLight}
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                value={weightKg}
                onChangeText={setWeightKg}
                keyboardType="decimal-pad"
                placeholder="Opcional"
                placeholderTextColor={Colors.textLight}
                style={styles.input}
              />
            </View>
          </View>
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Opcional"
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
          <View style={styles.actions}>
            <Pressable
              onPress={() => void handleSave()}
              disabled={saving}
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Guardando…" : "Guardar"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (profile) fillForm(profile);
                setEditing(false);
                setError(null);
              }}
              disabled={saving}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
  guest: {
    marginTop: 6,
    fontSize: 12,
    color: "#b45309",
  },
  editBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  error: {
    marginTop: 10,
    fontSize: 13,
    color: "#dc2626",
  },
  saved: {
    marginTop: 10,
    fontSize: 13,
    color: "#047857",
  },
  empty: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summary: {
    marginTop: 12,
    gap: 8,
  },
  summaryRow: {},
  summaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Colors.textLight,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.text,
  },
  form: {
    marginTop: 12,
    gap: 4,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.white,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  saveBtn: {
    borderRadius: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  cancelBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: Colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
