import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

const preferences = [
  { id: "notifications", label: "Notificaciones push" },
  { id: "reminders", label: "Recordatorios de seguimiento" },
];

export function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    notifications: true,
    reminders: false,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            setSigningOut(true);
            await supabase.auth.signOut();
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Perfil</Text>

      {/* Avatar + email */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.email}>{user?.email ?? "—"}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Plan gratuito</Text>
        </View>
      </View>

      {/* Account info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cuenta</Text>
        <InfoRow label="Correo" value={user?.email ?? "—"} />
        <InfoRow
          label="Cuenta creada"
          value={
            user?.created_at
              ? new Date(user.created_at).toLocaleDateString("es-ES")
              : "—"
          }
        />
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferencias</Text>
        {preferences.map((p, i) => (
          <View
            key={p.id}
            style={[
              styles.prefRow,
              i < preferences.length - 1 && styles.prefRowBorder,
            ]}
          >
            <Text style={styles.prefLabel}>{p.label}</Text>
            <Switch
              value={prefs[p.id]}
              onValueChange={(v) => setPrefs((prev) => ({ ...prev, [p.id]: v }))}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        ))}
      </View>

      {/* Sign out */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutBtn,
          pressed && styles.signOutBtnPressed,
          signingOut && { opacity: 0.6 },
        ]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={Colors.danger} />
        ) : (
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 48 },
  centered: {
    flex: 1, alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: 24, fontWeight: "700", color: Colors.text,
    letterSpacing: -0.5, marginBottom: 24,
  },
  avatarSection: {
    alignItems: "center", marginBottom: 28,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  avatarText: {
    color: Colors.white, fontSize: 28, fontWeight: "700",
  },
  email: { fontSize: 16, fontWeight: "600", color: Colors.text, marginBottom: 6 },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
  },
  badgeText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 13, fontWeight: "700", color: Colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: "600", color: Colors.text },
  prefRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingVertical: 10,
  },
  prefRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  prefLabel: { fontSize: 15, color: Colors.text },
  signOutBtn: {
    marginTop: 8,
    borderWidth: 1.5, borderColor: Colors.danger, borderRadius: 14,
    paddingVertical: 14, alignItems: "center",
    backgroundColor: "#FFF5F5",
  },
  signOutBtnPressed: { backgroundColor: "#FEE2E2" },
  signOutText: { fontSize: 15, fontWeight: "700", color: Colors.danger },
});
