import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

export function StaffPatientNotesCard({ patientId }: { patientId: string }) {
  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "staff_get_patient_profile",
        { p_patient_id: patientId }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      const value =
        row && typeof row === "object"
          ? ((row as { staff_notes?: string | null }).staff_notes ?? "")
          : "";
      setNotes(value);
      setDirty(false);
      setLoaded(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar las notas."
      );
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedFlash(false);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_patient_notes",
        {
          p_patient_id: patientId,
          p_staff_notes: notes,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      setNotes(typeof data === "string" ? data : notes.trim() || "");
      setDirty(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron guardar las notas."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Notas del fisioterapeuta</Text>
      <Text style={styles.hint}>
        Observaciones clínicas o recordatorios internos. No se muestran al
        paciente.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {savedFlash && !dirty ? (
        <Text style={styles.saved}>Notas guardadas.</Text>
      ) : null}
      {!loaded ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 12 }} />
      ) : (
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={(t) => {
            setNotes(t);
            setDirty(true);
          }}
          multiline
          textAlignVertical="top"
          placeholder="Ej. Antecedentes, evolución, preferencias…"
          placeholderTextColor={Colors.textLight}
        />
      )}
      {loaded && dirty ? (
        <Pressable
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          disabled={saving}
          onPress={() => void handleSave()}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Guardando…" : "Guardar notas"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StaffReportNotesField({
  reportId,
  initialNotes,
  onSaved,
}: {
  reportId: string;
  initialNotes: string | null;
  onSaved?: (notes: string | null) => void;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setNotes(initialNotes ?? "");
    setDirty(false);
  }, [reportId, initialNotes]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_report_notes",
        {
          p_report_id: reportId,
          p_staff_notes: notes,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      const next = typeof data === "string" ? data : notes.trim() || "";
      setNotes(next);
      setDirty(false);
      onSaved?.(next || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.reportNotes}>
      <Text style={styles.reportLabel}>Notas de esta consulta</Text>
      <TextInput
        style={styles.reportInput}
        value={notes}
        onChangeText={(t) => {
          setNotes(t);
          setDirty(true);
        }}
        multiline
        textAlignVertical="top"
        placeholder="Apuntes del fisio sobre esta visita…"
        placeholderTextColor={Colors.textLight}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {dirty ? (
        <Pressable
          style={[styles.reportSaveBtn, saving && { opacity: 0.6 }]}
          disabled={saving}
          onPress={() => void handleSave()}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Guardando…" : "Guardar notas"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
  },
  title: { fontSize: 15, fontWeight: "700", color: Colors.text },
  hint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
  error: { marginTop: 8, fontSize: 13, color: Colors.danger },
  saved: { marginTop: 8, fontSize: 13, color: "#047857" },
  input: {
    marginTop: 12,
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  saveBtn: {
    marginTop: 12,
    alignSelf: "flex-end",
    borderRadius: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  reportNotes: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    backgroundColor: "#FFFBEB",
    padding: 12,
  },
  reportLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  reportInput: {
    marginTop: 8,
    minHeight: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.text,
  },
  reportSaveBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#92400E",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
