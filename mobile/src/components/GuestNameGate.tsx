import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { deleteOwnAccountAndSignOut } from "../lib/delete-account";
import { supabase } from "../lib/supabase";
import { AuthBackBar } from "./AuthBackBar";
import { AuthTextField } from "./AuthTextField";

type Props = {
  onSaved: (name: string) => void;
};

export function GuestNameGate({ onSaved }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    Keyboard.dismiss();
    const displayName = name.trim().replace(/\s+/g, " ");
    if (displayName.length < 2) {
      setError("Escribe tu nombre para que tu fisioterapeuta sepa quién eres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Sesión caducada. Vuelve a introducir el código.");
        return;
      }
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("id", user.id);
      if (updateError) {
        setError("No se pudo guardar tu nombre. Inténtalo de nuevo.");
        return;
      }
      onSaved(displayName);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: Colors.background }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <AuthBackBar onPress={() => void deleteOwnAccountAndSignOut()} />
      <View style={styles.wrap} pointerEvents="box-none">
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          accessibilityLabel="AIKinora"
        />
        <Text style={styles.title}>¿Cómo te llamas?</Text>
        <Text style={styles.hint}>
          Tu fisioterapeuta verá este nombre en el informe de la consulta previa.
        </Text>
        <AuthTextField
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
          placeholder="Nombre y apellidos"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => void handleSubmit()}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={() => void handleSubmit()}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9 },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Empezar consulta</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  hint: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
