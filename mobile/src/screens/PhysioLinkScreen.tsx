import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { parsePastedInviteCode } from "../lib/physio-invite";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";
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
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { locale, t } = useI18n();
  const en = locale === "en";
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
    const normalized = parsePastedInviteCode(code);
    if (normalized.length < 6) {
      setError(
        en
          ? "Enter the code your physiotherapist gave you."
          : "Introduce el código que te ha dado tu fisioterapeuta."
      );
      return;
    }
    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("patient_link_physio_code", {
      p_code: normalized,
    });
    setBusy(false);
    if (rpcError) {
      const raw = rpcError.message ?? "";
      setError(
        raw.includes("no encontrado")
          ? en
            ? "Code not found. Check that you typed it correctly."
            : "Código no encontrado. Comprueba que lo has escrito bien."
          : raw.includes("fisioterapeutas no pueden")
            ? en
              ? "You are on a physiotherapist account. Sign out and sign in with a patient account to enter the code."
              : "Estás en una cuenta de fisioterapeuta. Cierra sesión e inicia sesión con una cuenta de paciente (Persona) para introducir el código."
            : raw
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.physio_id) {
      setError(
        en
          ? "Could not link with that code."
          : "No se pudo vincular con ese código."
      );
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
    return (
      <AIInquiriesScreen
        linkedPhysio={linked}
        onLinkedPhysioChange={setLinked}
      />
    );
  }

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Pressable
          onPress={() => navigation.navigate("AIInquiries")}
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 2,
            marginHorizontal: 16,
            paddingVertical: 4,
            paddingRight: 8,
          }}
          accessibilityLabel={en ? "Back to Consulta" : "Volver a Consulta"}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.primary }}>
            {t.headers.consulta}
          </Text>
        </Pressable>
        <ScreenScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 24,
            justifyContent: "center",
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.text }}>
            {en ? "Your physiotherapist's code" : "Código de tu fisioterapeuta"}
          </Text>
          <Text style={{ marginTop: 8, marginBottom: 16, fontSize: 14, lineHeight: 20, color: Colors.textSecondary }}>
            {en
              ? "Enter the code your physiotherapist shared so you can start the AI consultation. When you finish, the clinical report is sent automatically to their dashboard before your appointment."
              : "Introduce el código que te ha compartido tu fisioterapeuta para empezar la consulta con la IA. Al terminar, el informe clínico se enviará automáticamente a su panel antes de tu cita."}
          </Text>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(parsePastedInviteCode(v))}
            placeholder="Ej. K7M2P9QX"
            placeholderTextColor={Colors.textLight}
            autoCapitalize="characters"
            autoCorrect={false}
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 2,
              color: Colors.text,
              backgroundColor: Colors.white,
            }}
          />
          {error ? (
            <Text style={{ marginTop: 10, fontSize: 13, color: Colors.danger }}>{error}</Text>
          ) : null}
          <Pressable
            onPress={() => void handleSubmit()}
            disabled={busy}
            style={{
              marginTop: 16,
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              opacity: busy ? 0.6 : 1,
            }}
          >
            <Text style={{ color: Colors.white, fontWeight: "700", fontSize: 15 }}>
              {busy
                ? en
                  ? "Linking…"
                  : "Vinculando…"
                : en
                  ? "Continue"
                  : "Continuar"}
            </Text>
          </Pressable>
        </ScreenScrollView>
      </View>
    </DismissKeyboard>
  );
}
