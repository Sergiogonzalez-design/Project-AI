import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  buildClinicInviteShareMessage,
  buildClinicStaffInviteUrl,
  clinicInviteMailtoUrl,
  clinicInviteWhatsAppUrl,
} from "../lib/clinic-invite";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";

type Member = {
  user_id: string;
  email: string;
  display_name: string | null;
  role: string;
};

type Invite = {
  id: string;
  email: string | null;
  token: string;
  invite_code?: string | null;
  accepted_at: string | null;
};

type CreatedInvite = {
  link: string;
  code: string;
  email: string | null;
};

/** Team invite UI — embed inside Pacientes hub without nesting ScrollViews. */
export function ClinicTeamPanel({ embedded = false }: { embedded?: boolean }) {
  const { t } = useI18n();
  const hub = t.clinicHub;
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedInvite | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: m }, { data: i }, { data: clinic }] = await Promise.all([
      supabase.rpc("clinic_list_members"),
      supabase.rpc("clinic_list_invites"),
      supabase.rpc("clinic_get_own"),
    ]);
    setMembers((m as Member[]) ?? []);
    setInvites((i as Invite[]) ?? []);
    if (clinic && typeof clinic === "object" && "name" in clinic) {
      setClinicName(String((clinic as { name?: string }).name ?? "") || null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shareMessage = useMemo(() => {
    if (!created) return "";
    return buildClinicInviteShareMessage({
      clinicName,
      inviteCode: created.code,
      link: created.link,
    });
  }, [clinicName, created]);

  async function invite(opts?: { openCode?: boolean }) {
    setError(null);
    setBusy(true);
    try {
      const payload = opts?.openCode
        ? {
            p_email: null as string | null,
            p_display_name: displayName.trim() || null,
          }
        : {
            p_email: email.trim().toLowerCase() || null,
            p_display_name: displayName.trim() || null,
          };

      if (!opts?.openCode && !payload.p_email) {
        throw new Error(hub.inviteNeedEmail);
      }

      const { data, error: err } = await supabase.rpc("clinic_create_invite", payload);
      if (err) throw new Error(err.message);
      const row = (Array.isArray(data) ? data[0] : data) as {
        token?: string;
        invite_code?: string;
        email?: string | null;
      } | null;
      if (!row?.token || !row?.invite_code) {
        throw new Error(hub.inviteCreateError);
      }
      setCreated({
        link: buildClinicStaffInviteUrl(row.token),
        code: row.invite_code,
        email: row.email ?? null,
      });
      if (!opts?.openCode) {
        setEmail("");
        setDisplayName("");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : hub.inviteCreateError);
    } finally {
      setBusy(false);
    }
  }

  async function copyText(kind: "code" | "link", value: string) {
    await Clipboard.setStringAsync(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  async function shareInvite() {
    if (!created || !shareMessage) return;
    try {
      await Share.share({
        message: shareMessage,
        title: "AIKinora",
      });
    } catch {
      // dismissed
    }
  }

  async function deleteInvite(inviteRow: Invite) {
    const label = inviteRow.email || inviteRow.invite_code || hub.openCode;
    Alert.alert(
      hub.deleteInviteTitle,
      hub.deleteInviteBody.replace("{label}", label),
      [
        { text: hub.cancel, style: "cancel" },
        {
          text: hub.delete,
          style: "destructive",
          onPress: () => {
            void (async () => {
              setError(null);
              setDeletingId(inviteRow.id);
              try {
                const { error: err } = await supabase.rpc("clinic_delete_invite", {
                  p_invite_id: inviteRow.id,
                });
                if (err) throw new Error(err.message);
                if (
                  created &&
                  (created.code === inviteRow.invite_code ||
                    created.link.includes(inviteRow.token))
                ) {
                  setCreated(null);
                }
                await load();
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : hub.inviteDeleteError
                );
              } finally {
                setDeletingId(null);
              }
            })();
          },
        },
      ]
    );
  }

  const pending = invites.filter((i) => !i.accepted_at);

  const body = (
    <View style={embedded ? undefined : styles.inner}>
      <Text style={styles.lead}>{hub.physiosLead}</Text>

      <Text style={styles.label}>{hub.emailOptional}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={hub.emailPlaceholder}
        placeholderTextColor={Colors.textLight}
      />
      <Text style={styles.label}>{hub.nameOptional}</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder={hub.namePlaceholder}
        placeholderTextColor={Colors.textLight}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.btn}
        onPress={() => void invite({ openCode: !email.trim() })}
        disabled={busy}
      >
        <Text style={styles.btnText}>
          {busy
            ? hub.creating
            : email.trim()
              ? hub.createInvite
              : hub.generateCode}
        </Text>
      </Pressable>
      {email.trim() ? (
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => void invite({ openCode: true })}
          disabled={busy}
        >
          <Text style={styles.secondaryBtnText}>{hub.codeOnly}</Text>
        </Pressable>
      ) : null}

      {created ? (
        <View style={styles.inviteCard}>
          <Text style={styles.inviteTitle}>{hub.inviteCodeTitle}</Text>
          <Text style={styles.code}>{created.code}</Text>
          <Pressable onPress={() => void copyText("code", created.code)}>
            <Text style={styles.copyLink}>
              {copied === "code" ? hub.codeCopied : hub.copyCodeLong}
            </Text>
          </Pressable>

          <Text style={[styles.inviteTitle, { marginTop: 14 }]}>
            {hub.webLinkTitle}
          </Text>
          <Text style={styles.link}>{created.link}</Text>
          <Pressable onPress={() => void copyText("link", created.link)}>
            <Text style={styles.copyLink}>
              {copied === "link" ? hub.linkCopied : hub.copyLinkLong}
            </Text>
          </Pressable>

          <View style={styles.shareRow}>
            <Pressable style={styles.shareBtn} onPress={() => void shareInvite()}>
              <Text style={styles.shareBtnText}>{hub.shareBtn}</Text>
            </Pressable>
            <Pressable
              style={[styles.shareBtn, styles.whatsappBtn]}
              onPress={() => void Linking.openURL(clinicInviteWhatsAppUrl(shareMessage))}
            >
              <Text style={styles.shareBtnText}>WhatsApp</Text>
            </Pressable>
            <Pressable
              style={[styles.shareBtn, styles.mailBtn]}
              onPress={() =>
                void Linking.openURL(
                  clinicInviteMailtoUrl(shareMessage, created.email),
                )
              }
            >
              <Text style={styles.shareBtnText}>Email</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Text style={styles.section}>{hub.teamTitle}</Text>
      {members.length === 0 ? (
        <Text style={styles.muted}>{hub.noMembers}</Text>
      ) : (
        members.map((m) => {
          const roleLabel =
            m.role === "physio"
              ? hub.rolePhysio
              : m.role === "owner"
                ? hub.roleOwner
                : m.role === "admin"
                  ? hub.roleAdmin
                  : m.role;
          return (
            <View key={m.user_id} style={styles.row}>
              <View style={styles.memberHead}>
                <Text style={styles.name}>{m.display_name || hub.noName}</Text>
                <Text style={styles.roleBadge}>{roleLabel}</Text>
              </View>
              <Text style={styles.muted}>{m.email}</Text>
            </View>
          );
        })
      )}
      {pending.map((inv) => (
        <View key={inv.id} style={styles.pendingRow}>
          <Text style={styles.muted}>
            {hub.pending}: {inv.email || hub.openCode}
            {inv.invite_code ? ` · ${inv.invite_code}` : ""}
          </Text>
          <View style={styles.pendingActions}>
            {inv.token ? (
              <Pressable
                onPress={() =>
                  setCreated({
                    link: buildClinicStaffInviteUrl(inv.token),
                    code: inv.invite_code || inv.token.slice(0, 8).toUpperCase(),
                    email: inv.email,
                  })
                }
              >
                <Text style={styles.copyLink}>{hub.viewShare}</Text>
              </Pressable>
            ) : null}
            <Pressable
              disabled={deletingId === inv.id}
              onPress={() => void deleteInvite(inv)}
            >
              <Text style={styles.deleteLink}>
                {deletingId === inv.id ? hub.deleting : hub.delete}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );

  if (embedded) return body;

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      {body}
    </ScrollView>
  );
}

export function ClinicTeamScreen() {
  return <ClinicTeamPanel />;
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  inner: { paddingBottom: 8 },
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
  secondaryBtn: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  secondaryBtnText: { color: Colors.text, fontWeight: "600", fontSize: 14 },
  error: { marginTop: 8, color: Colors.danger, fontSize: 13 },
  inviteCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    padding: 14,
  },
  inviteTitle: { fontSize: 12, fontWeight: "700", color: "#1E3A8A", textTransform: "uppercase" },
  code: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 3,
    color: Colors.text,
  },
  link: { marginTop: 6, fontSize: 12, color: Colors.primary, lineHeight: 18 },
  copyLink: { marginTop: 8, fontSize: 13, fontWeight: "700", color: Colors.primary },
  deleteLink: { marginTop: 8, fontSize: 13, fontWeight: "700", color: Colors.danger },
  pendingActions: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  shareRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  shareBtn: {
    borderRadius: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  whatsappBtn: { backgroundColor: "#16A34A" },
  mailBtn: { backgroundColor: "#0F172A" },
  shareBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  section: { marginTop: 28, fontSize: 16, fontWeight: "700", color: Colors.text },
  muted: { marginTop: 8, fontSize: 13, color: Colors.textSecondary },
  pendingRow: { marginTop: 10 },
  row: { marginTop: 10 },
  memberHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: { flex: 1, fontSize: 15, fontWeight: "700", color: Colors.text },
  roleBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    backgroundColor: "#EFF6FF",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
