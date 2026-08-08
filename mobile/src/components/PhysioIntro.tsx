import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";

export const PHYSIO_GREETING =
  "¡Hola! Soy Physio, tu asistente de AIKinora. ¿En qué puedo ayudarte hoy?";
export const PHYSIO_GREETING_EN =
  "Hi! I'm Physio, your AIKinora assistant. How can I help you today?";

type Props = {
  onSkip?: () => void;
  greeting?: string;
};

export function PhysioIntro({ onSkip, greeting }: Props) {
  const { locale, t } = useI18n();
  const text =
    greeting ??
    (locale === "en" ? PHYSIO_GREETING_EN : PHYSIO_GREETING);

  return (
    <Pressable
      style={styles.container}
      onPress={onSkip}
      accessibilityRole="button"
      accessibilityLabel={t.consulta.tapToContinue}
    >
      <Image
        source={require("../../assets/physio/physio-full.png")}
        style={styles.character}
        resizeMode="contain"
      />
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      {onSkip ? <Text style={styles.hint}>{t.consulta.tapToContinue}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 420,
  },
  character: {
    width: "100%",
    maxWidth: 280,
    height: 360,
    marginBottom: 24,
  },
  bubble: {
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
});
