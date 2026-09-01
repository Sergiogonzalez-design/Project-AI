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
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthBackBar } from "../components/AuthBackBar";
import { Colors } from "../lib/colors";
import { clinicMapsQuery, googleMapsSearchUrl } from "../lib/clinic-maps";
import { supabase } from "../lib/supabase";

type Props = { onComplete: () => void };

const TEAM_SIZE_OPTIONS = ["1", "2–5", "6–10", "Más de 10"] as const;

export function ClinicOnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [ownerName, setOwnerName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateStep1(): boolean {
    if (!ownerName.trim()) {
      setError("Introduce el nombre del responsable de la clínica.");
      return false;
    }
    if (clinicName.trim().length < 2) {
      setError("Introduce el nombre comercial de la clínica.");
      return false;
    }
    if (phone.trim().length < 7) {
      setError("Introduce un teléfono de contacto de la clínica.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep2(): boolean {
    if (!address.trim()) {
      setError("Introduce la dirección de la clínica.");
      return false;
    }
    if (!city.trim()) {
      setError("Introduce la ciudad.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.account_type !== "clinic") {
        const { error: repairErr } = await supabase
          .from("profiles")
          .update({ account_type: "clinic" })
          .eq("id", user.id);
        if (repairErr) throw new Error(repairErr.message);
      }

      const descParts = [
        description.trim(),
        teamSize ? `Equipo: ${teamSize} fisioterapeutas.` : "",
      ].filter(Boolean);
      const fullDescription = descParts.join("\n") || null;

      const { error: clinicErr } = await supabase.rpc("clinic_create_own", {
        p_name: clinicName.trim(),
        p_description: fullDescription,
      });
      if (clinicErr) throw new Error(clinicErr.message);

      const mapQuery = clinicMapsQuery({
        address: address.trim(),
        city: city.trim(),
      });
      const mapsUrl = mapQuery ? googleMapsSearchUrl(mapQuery) : null;

      const { error: updateErr } = await supabase.rpc("clinic_update_own", {
        p_phone: phone.trim(),
        p_website: website.trim() || "",
        p_address: address.trim(),
        p_city: city.trim(),
        p_postal_code: postalCode.trim() || "",
        p_description: fullDescription ?? "",
        p_google_maps_url: mapsUrl,
      });
      if (updateErr) throw new Error(updateErr.message);

      const { error: saveErr } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: ownerName.trim(),
        clinic_name: clinicName.trim(),
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
      if (saveErr) throw new Error(saveErr.message);
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear la clínica.");
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
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Alta de clínica</Text>
          <Text style={styles.subtitle}>
            Datos del centro (no del paciente). Luego podrás invitar a tus
            fisioterapeutas.
          </Text>
          <Text style={styles.step}>Paso {step} de 2</Text>

          {step === 1 ? (
            <>
              <Text style={styles.label}>Responsable / administrador</Text>
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="Nombre y apellidos"
                placeholderTextColor={Colors.textLight}
              />

              <Text style={styles.label}>Nombre de la clínica</Text>
              <TextInput
                style={styles.input}
                value={clinicName}
                onChangeText={setClinicName}
                placeholder="Ej: Clínica AIKinora"
                placeholderTextColor={Colors.textLight}
              />

              <Text style={styles.label}>Teléfono de la clínica</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+34 600 000 000"
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Tamaño del equipo</Text>
              <View style={styles.chips}>
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => setTeamSize(opt)}
                    style={[styles.chip, teamSize === opt && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        teamSize === opt && styles.chipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>
                Número aproximado de fisioterapeutas (opcional).
              </Text>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                style={styles.primaryBtn}
                onPress={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                <Text style={styles.primaryBtnText}>Continuar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Calle y número"
                placeholderTextColor={Colors.textLight}
              />

              <Text style={styles.label}>Ciudad</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Madrid"
                placeholderTextColor={Colors.textLight}
              />

              <Text style={styles.label}>Código postal</Text>
              <TextInput
                style={styles.input}
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="28001"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Web (opcional)</Text>
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="https://"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="none"
                keyboardType="url"
              />

              <Text style={styles.label}>Descripción / especialidades</Text>
              <TextInput
                style={[styles.input, styles.area]}
                value={description}
                onChangeText={setDescription}
                placeholder="Deportiva, pediátrica, suelo pélvico…"
                placeholderTextColor={Colors.textLight}
                multiline
              />
              <Text style={styles.hint}>
                Visible en la ficha pública de la clínica.
              </Text>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.row}>
                <Pressable
                  style={[styles.secondaryBtn, loading && { opacity: 0.6 }]}
                  onPress={() => {
                    setError(null);
                    setStep(1);
                  }}
                  disabled={loading}
                >
                  <Text style={styles.secondaryBtnText}>Atrás</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.primaryBtn,
                    styles.primaryFlex,
                    loading && { opacity: 0.85 },
                  ]}
                  onPress={() => void handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Crear clínica</Text>
                  )}
                </Pressable>
              </View>
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
  logo: {
    width: 64,
    height: 64,
    alignSelf: "center",
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
  step: {
    marginTop: 10,
    marginBottom: 16,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
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
  area: { minHeight: 80, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  chip: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  chipTextActive: { color: "#fff" },
  hint: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  row: { flexDirection: "row", gap: 10, marginTop: 24 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryFlex: { flex: 2, marginTop: 0 },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
