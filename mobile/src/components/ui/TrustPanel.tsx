import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../lib/colors";

/**
 * Compact trust-building strip shown near the start of the assessment flow.
 * Healthcare products live or die on trust - this reinforces it without
 * getting in the way of the questionnaire.
 */
const ITEMS_ES = [
  "Datos seguros y cifrados",
  "Evaluación asistida por IA",
  "Orientación basada en evidencia",
  "No sustituye un diagnóstico médico",
  "Enfoque fisioterapéutico",
];

const ITEMS_EN = [
  "Secure and encrypted",
  "AI-assisted assessment",
  "Evidence-informed guidance",
  "Not a medical diagnosis",
  "Physiotherapy-focused recommendations",
];

export function TrustPanel({ locale = "es" }: { locale?: "es" | "en" }) {
  const items = locale === "en" ? ITEMS_EN : ITEMS_ES;
  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <View key={item} style={styles.item}>
          <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = {
  wrap: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    rowGap: 6,
    columnGap: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  item: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    maxWidth: "100%" as const,
  },
  itemText: {
    fontSize: 10.5,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
};
