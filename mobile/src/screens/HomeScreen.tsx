import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header row */}
      <View style={styles.heroRow}>
        <Image source={require("../../assets/logo.png")} style={styles.heroLogo} />
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>PhysioGuide AI</Text>
          <Text style={styles.heroSub}>Tu guía de fisioterapia inteligente</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>¿Tienes una molestia?</Text>
        <Text style={styles.bannerBody}>
          Usa la consulta para orientarte antes de visitar a tu entrenador atlético.
          No sustituye la valoración profesional.
        </Text>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons
          name="warning-outline"
          size={18}
          color="#92400E"
          style={{ marginTop: 1 }}
        />
        <Text style={styles.disclaimerText}>
          Esta app proporciona orientación informativa. Ante síntomas graves o urgentes
          acude a urgencias o a tu médico.
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
  heroLogo: {
    width: 52,
    height: 52,
    resizeMode: "contain",
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
    marginBottom: 20,
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
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    lineHeight: 17,
  },
});
