import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Props = {
  patientId: string;
  patientLabel?: string | null;
  onDeleted: () => void;
};

export function StaffDeletePatientButton({
  patientId,
  patientLabel,
  onDeleted,
}: Props) {
  const [busy, setBusy] = useState(false);

  function askConfirm() {
    const name = patientLabel?.trim() || "este paciente";
    Alert.alert(
      "Eliminar perfil",
      `¿Eliminar ${name}? Se quitará de tu lista. Si era una consulta previa sin cuenta, se borrará por completo.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => void doDelete(),
        },
      ]
    );
  }

  async function doDelete() {
    setBusy(true);
    const { error } = await supabase.rpc("staff_delete_patient", {
      p_patient_id: patientId,
    });
    setBusy(false);
    if (error) {
      Alert.alert("No se pudo eliminar", error.message);
      return;
    }
    onDeleted();
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={askConfirm}
        disabled={busy}
        style={({ pressed }) => [
          styles.btn,
          pressed && { backgroundColor: "#FEE2E2" },
          busy && { opacity: 0.6 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Eliminar perfil del paciente"
      >
        {busy ? (
          <ActivityIndicator color="#B91C1C" />
        ) : (
          <Text style={styles.btnText}>Eliminar perfil del paciente</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  btn: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B91C1C",
  },
});
