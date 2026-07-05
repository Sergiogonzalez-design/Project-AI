import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";

const features = [
  {
    icon: "🤖",
    title: "Consulta con IA",
    desc: "Responde preguntas sobre tu lesión y obtén orientación inmediata.",
  },
  {
    icon: "👤",
    title: "Contacta con tu AT",
    desc: "Comunícate directamente con tu entrenador atlético de referencia.",
  },
  {
    icon: "📋",
    title: "Historial personal",
    desc: "Guarda y revisa todas tus consultas anteriores.",
  },
];

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroRow}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeLetter}>P</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>PhysioGuide AI</Text>
          <Text style={styles.heroSub}>Tu guía de fisioterapia inteligente</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>¿Tienes una molestia?</Text>
        <Text style={styles.bannerBody}>
          Usa la IA para orientarte antes de visitar a tu entrenador atlético.
          No sustituye la valoración profesional.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>¿Qué puedes hacer?</Text>
      {features.map((f) => (
        <View key={f.title} style={styles.featureCard}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️  Esta app proporciona orientación informativa. Ante síntomas
          graves o urgentes acude a urgencias o a tu médico.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    marginTop: 8,
  },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  heroBadgeLetter: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.4,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  bannerBody: {
    color: "#BFDBFE",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 26,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    marginTop: 20,
    backgroundColor: "#FEF9C3",
    borderRadius: 12,
    padding: 14,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#713F12",
    lineHeight: 17,
  },
});
