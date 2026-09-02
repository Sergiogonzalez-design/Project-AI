import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WEB_APP_URL } from "../lib/admin-api";
import { normalizeClinicAccent, parseClinicSpecialties } from "../lib/clinic-brand";
import { displayClinicHoursText } from "../lib/clinic-hours";
import { Colors } from "../lib/colors";

export type PhysioClinicSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  tagline?: string | null;
  accent_color?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  contact_email?: string | null;
  website?: string | null;
  hours?: string | null;
  specialties?: string[] | null;
};

type Props = {
  clinic: PhysioClinicSummary;
};

export function PhysioClinicInfoCard({ clinic }: Props) {
  const accent = normalizeClinicAccent(clinic.accent_color);
  const hours = displayClinicHoursText(clinic.hours);
  const chips = parseClinicSpecialties(clinic.specialties);
  const location = [clinic.address, clinic.postal_code, clinic.city]
    .filter(Boolean)
    .join(", ");
  const publicUrl = clinic.slug
    ? `${WEB_APP_URL}/centro/${clinic.slug}`
    : null;

  return (
    <View style={styles.card}>
      <View style={[styles.cover, { backgroundColor: accent }]}>
        {clinic.cover_url ? (
          <Image source={{ uri: clinic.cover_url }} style={styles.coverImg} />
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.logoRow}>
          {clinic.logo_url ? (
            <Image source={{ uri: clinic.logo_url }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, { backgroundColor: accent }]}>
              <Text style={styles.logoLetter}>
                {clinic.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.logoMeta}>
            <Text style={styles.kicker}>Tu clínica</Text>
            <Text style={styles.name}>{clinic.name}</Text>
            {clinic.tagline ? (
              <Text style={styles.tagline}>{clinic.tagline}</Text>
            ) : null}
          </View>
        </View>

        {clinic.description ? (
          <Text style={styles.description}>{clinic.description}</Text>
        ) : null}

        {chips.length > 0 ? (
          <View style={styles.chipRow}>
            {chips.map((s) => (
              <Text key={s} style={[styles.chip, { color: accent }]}>
                {s}
              </Text>
            ))}
          </View>
        ) : null}

        {hours ? (
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Horario</Text>
            <Text style={styles.blockText}>{hours}</Text>
          </View>
        ) : null}

        {location ? (
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Dirección</Text>
            <Text style={styles.blockText}>{location}</Text>
          </View>
        ) : null}

        {clinic.phone ? (
          <Text style={styles.meta}>Tel: {clinic.phone}</Text>
        ) : null}
        {clinic.contact_email ? (
          <Text style={styles.meta}>Email: {clinic.contact_email}</Text>
        ) : null}
        {clinic.website ? (
          <Text style={styles.meta}>Web: {clinic.website}</Text>
        ) : null}

        {publicUrl ? (
          <Pressable
            onPress={() => void Linking.openURL(publicUrl)}
            style={styles.linkBtn}
          >
            <Text style={[styles.linkBtnText, { color: accent }]}>
              Ver ficha pública
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  cover: { height: 88, width: "100%" },
  coverImg: { width: "100%", height: "100%" },
  body: { padding: 14, gap: 6 },
  logoRow: { flexDirection: "row", gap: 12, alignItems: "flex-end", marginTop: -28 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  logoLetter: { color: "#fff", fontWeight: "800", fontSize: 20 },
  logoMeta: { flex: 1, paddingBottom: 2 },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  name: { fontSize: 18, fontWeight: "800", color: Colors.text },
  tagline: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  chip: {
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  block: { marginTop: 8 },
  blockLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
  },
  blockText: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text,
  },
  meta: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  linkBtn: { marginTop: 10, alignSelf: "flex-start" },
  linkBtnText: { fontSize: 14, fontWeight: "700" },
});
