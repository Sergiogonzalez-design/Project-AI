import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { buildClinicStaffInviteUrl } from "../lib/clinic-invite";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Member = {
  user_id: string;
  email: string;
  display_name: string | null;
  role: string;
};

type Invite = {
  id: string;
  email: string;
  token: string;
  accepted_at: string | null;
};

export function ClinicTeamScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [{ data: m }, { data: i }] = await Promise.all([
      supabase.rpc("clinic_list_members"),
      supabase.rpc("clinic_list_invites"),
    ]);
    setMembers((m as Member[]) ?? []);
    setInvites((i as Invite[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function invite() {
    setError(null);
    setBusy(true);
    try {
      const { data, error: err } = await supabase.rpc("clinic_create_invite", {
        p_email: email.trim().toLowerCase(),
        p_display_name: displayName.trim() || null,
      });
      if (err) throw new Error(err.message);
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.token) throw new Error("No se pudo crear la invitación.");
      setLastLink(buildClinicStaffInviteUrl(row.token));
      setEmail("");
      setDisplayName("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  const physios = members.filter((m) => m.role === "physio");
  const pending = invites.filter((i) => !i.accepted_at);

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Text style={styles.lead}>
        Invita fisioterapeutas con un enlace. Ellos crean su contraseña y heredan
        el nombre de la clínica.
      </Text>
      <Text style={styles.label}>Correo del fisioterapeuta</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="fisio@clinica.com"
        placeholderTextColor={Colors.textLight}
      />
      <Text style={styles.label}>Nombre (opcional)</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Nombre y apellidos"
        placeholderTextColor={Colors.textLight}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.btn} onPress={() => void invite()} disabled={busy}>
        <Text style={styles.btnText}>{busy ? "Creando…" : "Crear enlace de alta"}</Text>
      </Pressable>
      {lastLink ? <Text style={styles.link}>{lastLink}</Text> : null}

      <Text style={styles.section}>Equipo</Text>
      {physios.length === 0 ? (
        <Text style={styles.muted}>Aún no hay fisioterapeutas.</Text>
      ) : (
        physios.map((m) => (
          <View key={m.user_id} style={styles.row}>
            <Text style={styles.name}>{m.display_name || "Sin nombre"}</Text>
            <Text style={styles.muted}>{m.email}</Text>
          </View>
        ))
      )}
      {pending.map((inv) => (
        <Text key={inv.id} style={styles.muted}>
          Pendiente: {inv.email}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  lead: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    marginTop: 4,
  },
  btn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  error: { marginTop: 8, color: Colors.danger, fontSize: 13 },
  link: { marginTop: 12, fontSize: 12, color: Colors.primary, lineHeight: 18 },
  section: { marginTop: 28, fontSize: 16, fontWeight: "700", color: Colors.text },
  muted: { marginTop: 8, fontSize: 13, color: Colors.textSecondary },
  row: { marginTop: 10 },
  name: { fontSize: 15, fontWeight: "700", color: Colors.text },
});
