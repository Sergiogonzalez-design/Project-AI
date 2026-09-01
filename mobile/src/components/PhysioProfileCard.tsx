import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type PhysioProfileData = {
  display_name: string | null;
  clinic_name: string | null;
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

export function PhysioProfileCard() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<PhysioProfileData | null>(null);
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");

  function fillForm(data: PhysioProfileData) {
    setFullName(data.display_name ?? "");
    setClinicName(data.clinic_name ?? "");
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("display_name, clinic_name")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setProfile(data as PhysioProfileData);
        fillForm(data as PhysioProfileData);
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!fullName.trim()) {
      setError("Introduce tu nombre completo.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated: PhysioProfileData = {
        display_name: fullName.trim(),
        clinic_name: clinicName.trim() || null,
      };
      const { error: saveErr } = await supabase
        .from("profiles")
        .update({
          ...updated,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
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

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  const hasData = Boolean(profile?.display_name?.trim());

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Datos profesionales</Text>
          <Pressable style={styles.editBtn} onPress={() => setEditing(true)}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
            <Text style={styles.editBtnText}>{hasData ? "Editar" : "Completar"}</Text>
          </Pressable>
        </View>

        {hasData ? (
          <>
            <Row label="Nombre" value={profile?.display_name} />
            <Row label="Clínica o centro" value={profile?.clinic_name} />
          </>
        ) : (
          <Text style={styles.emptyText}>
            Añade tu nombre y el de tu clínica para identificarte ante tus pacientes.
          </Text>
        )}
      </View>

      <Modal visible={editing} animationType="slide" presentationStyle="pageSheet">
        <ScrollView
          style={styles.modalRoot}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          bounces
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Text style={styles.modalTitle}>Datos profesionales</Text>

          <Text style={styles.fieldLabel}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre y apellidos"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.fieldLabel}>Clínica o centro</Text>
          <TextInput
            style={styles.input}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Ej: Clínica AIKinora"
            placeholderTextColor={Colors.textSecondary}
          />
          <Text style={styles.hint}>
            Aparecerá en el enlace de invitación para tus pacientes (opcional).
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.modalBtns}>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setEditing(false);
                if (profile) fillForm(profile);
                setError(null);
              }}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={() => void handleSave()} disabled={saving}>
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
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  editBtnText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: { fontSize: 13, color: Colors.textSecondary },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  emptyText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  modalRoot: { flex: 1, backgroundColor: Colors.background },
  modalContent: { flexGrow: 1, padding: 20, paddingBottom: 48 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 14,
    marginBottom: 6,
  },
  hint: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  error: { marginTop: 12, color: Colors.danger, fontSize: 13, textAlign: "center" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: "600" },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: { color: Colors.white, fontWeight: "700" },
});
