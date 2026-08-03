import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";
import { AIInquiriesScreen } from "./AIInquiriesScreen";

type LinkedPhysio = {
  physio_id: string;
  physio_name: string | null;
  clinic_name: string | null;
};

/**
 * Standalone screen where a patient must enter their physiotherapist's code
 * before the AI consult opens. Once linked, the full consult chat renders
 * here; finishing a consult auto-sends the clinical report to the physio.
 */
export function PhysioLinkScreen() {
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState<LinkedPhysio | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.rpc("patient_get_linked_physio");
      const row = Array.isArray(data) ? data[0] : data;
      if (!cancelled) {
        setLinked(row?.physio_id ? (row as LinkedPhysio) : null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit() {
    setError(null);
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 6) {
      setError("Introduce el código que te ha dado tu fisioterapeuta.");
      return;
    }
    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("patient_link_physio_code", {
      p_code: normalized,
    });
    setBusy(false);
    if (rpcError) {
      setError(
        rpcError.message.includes("no encontrado")
          ? "Código no encontrado. Comprueba que lo has escrito bien."
          : rpcError.message
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.physio_id) {
      setError("No se pudo vincular con ese código.");
      return;
    }
    setLinked({
      physio_id: row.physio_id,
      physio_name: row.physio_name ?? null,
      clinic_name: row.clinic_name ?? null,
    });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (linked) {
    return <AIInquiriesScreen />;
  }

  return (
    <DismissKeyboard>
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.background }}
        contentContainerStyle={{ padding: 24, justifyContent: "center", flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.text }}>
          Código de tu fisioterapeuta
        </Text>
        <Text style={{ marginTop: 8, marginBottom: 16, fontSize: 14, lineHeight: 20, color: Colors.textSecondary }}>
          Introduce el código que te ha compartido tu fisioterapeuta para empezar la consulta con
          la IA. Al terminar, el informe clínico se enviará automáticamente a su panel antes de tu
          cita.
        </Text>
        <TextInput
          value={code}
          onChangeText={(v) => setCode(v.toUpperCase())}
          placeholder="Ej. K7M2P9QX"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="characters"
          autoCorrect={false}
          style={{
            borderWidth: 1,
            borderColor: Colors.borderStrong,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 16,
            letterSpacing: 2,
            color: Colors.text,
            backgroundColor: Colors.white,
            marginBottom: 12,
          }}
        />
        {error ? (
          <Text style={{ color: "#991B1B", marginBottom: 12, fontSize: 13 }}>{error}</Text>
        ) : null}
        <Pressable
          onPress={() => void handleSubmit()}
          disabled={busy}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: "700" }}>
            {busy ? "Vinculando…" : "Continuar a la consulta"}
          </Text>
        </Pressable>
      </ScrollView>
    </DismissKeyboard>
  );
}
