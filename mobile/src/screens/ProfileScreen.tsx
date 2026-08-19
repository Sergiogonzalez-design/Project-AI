import { Ionicons } from "@expo/vector-icons";
import type { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { AthleteProfileCard } from "../components/AthleteProfileCard";
import { PhysioProfileCard } from "../components/PhysioProfileCard";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import type { LanguagePreference } from "../lib/i18n/translations";
import {
  cancelAllReminders,
  getNotificationsEnabled,
  requestNotificationPermissions,
  setNotificationsEnabled,
} from "../lib/notifications";
import { refreshSmartReminders } from "../lib/smart-reminders";
import { deleteOwnAccount } from "../lib/delete-account";
import { supabase } from "../lib/supabase";

const LANGUAGE_OPTIONS: {
  value: LanguagePreference;
  labelKey: "languageEs" | "languageEn";
}[] = [
  { value: "es", labelKey: "languageEs" },
  { value: "en", labelKey: "languageEn" },
];

export function ProfileScreen() {
  const { t, locale, preference, setPreference } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAthleteProfile, setShowAthleteProfile] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [accountType, setAccountType] = useState<"patient" | "physio" | null>(null);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [notifBusy, setNotifBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, account_type")
          .eq("id", data.user.id)
          .single();
        setDisplayName(profile?.display_name ?? "");
        setAvatarUrl(profile?.avatar_url ?? null);
        setAccountType(
          profile?.account_type === "physio" ? "physio" : "patient"
        );
      }
      setNotificationsOn(await getNotificationsEnabled());
      setLoading(false);
    });
  }, []);

  async function handleLanguageChange(next: LanguagePreference) {
    await setPreference(next);
    if (await getNotificationsEnabled()) {
      setNotifBusy(true);
      try {
        await refreshSmartReminders(next);
      } catch {
        // Keep language change even if reminder refresh fails.
      } finally {
        setNotifBusy(false);
      }
    }
  }

  async function handleNotificationsToggle(enabled: boolean) {
    setNotifBusy(true);
    try {
      if (!enabled) {
        await cancelAllReminders();
        await setNotificationsEnabled(false);
        setNotificationsOn(false);
        Alert.alert(t.profile.notifications, t.profile.notificationsDisabled);
        return;
      }

      const granted = await requestNotificationPermissions();
      if (!granted) {
        setNotificationsOn(false);
        await setNotificationsEnabled(false);
        Alert.alert(t.profile.notifications, t.profile.notificationsDenied);
        return;
      }

      const result = await refreshSmartReminders(locale);
      await setNotificationsEnabled(true);
      setNotificationsOn(true);

      Alert.alert(
        t.profile.notifications,
        result.hasInjury
          ? t.profile.notificationsEnabled
          : t.profile.noInjuryYet
      );
    } catch {
      setNotificationsOn(false);
      await setNotificationsEnabled(false);
      Alert.alert(t.profile.notifications, t.common.error);
    } finally {
      setNotifBusy(false);
    }
  }

  async function handleDeleteAccount() {
    Alert.alert(t.profile.deleteAccountTitle, t.profile.deleteAccountConfirm, [
      { text: t.profile.cancel, style: "cancel" },
      {
        text: t.profile.deleteAccount,
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          const error = await deleteOwnAccount();
          if (error) {
            setDeleting(false);
            Alert.alert(t.profile.deleteAccountTitle, t.profile.deleteAccountError);
            return;
          }
          await cancelAllReminders();
          await supabase.auth.signOut({ scope: "local" });
        },
      },
    ]);
  }

  async function handleSignOut() {
    Alert.alert(t.profile.signOutTitle, t.profile.signOutConfirm, [
      { text: t.profile.cancel, style: "cancel" },
      {
        text: t.profile.signOut,
        style: "destructive",
        onPress: async () => {
          setSigningOut(true);
          await cancelAllReminders();
          await Promise.race([
            supabase.auth.signOut({ scope: "local" }),
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "U";

  return (
    <ScreenScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>{t.profile.title}</Text>

      <View style={styles.avatarSection}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImg}
            accessibilityLabel={t.profile.avatarA11y}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <Text style={styles.email}>{displayName || user?.email || "—"}</Text>
        {displayName ? (
          <Text style={styles.emailSub}>{user?.email}</Text>
        ) : null}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t.profile.freePlan}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.profile.preferences}</Text>

        <Text style={styles.prefLabel}>{t.profile.language}</Text>
        <View style={styles.languageRow}>
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = preference === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => handleLanguageChange(opt.value)}
                style={[styles.langChip, active && styles.langChipActive]}
              >
                <Text
                  style={[styles.langChipText, active && styles.langChipTextActive]}
                >
                  {t.profile[opt.labelKey]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.prefRow, styles.prefRowBorder, { marginTop: 8 }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.prefLabel}>{t.profile.notifications}</Text>
            <Text style={styles.prefHint}>{t.profile.notificationsHint}</Text>
            {notifBusy ? (
              <Text style={styles.prefBusy}>{t.profile.refreshingReminders}</Text>
            ) : null}
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={handleNotificationsToggle}
            disabled={notifBusy}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={notificationsOn ? Colors.primary : "#f4f4f5"}
          />
        </View>
      </View>

      {accountType === "physio" ? (
        <PhysioProfileCard />
      ) : (
        <View style={styles.card}>
          <Pressable
            onPress={() => setShowAthleteProfile((v) => !v)}
            style={({ pressed }) => [styles.collapseBtn, pressed && { opacity: 0.9 }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="fitness" size={18} color={Colors.primary} />
              <Text style={styles.collapseBtnText}>{t.profile.athleteProfile}</Text>
            </View>
            <Ionicons
              name={showAthleteProfile ? "chevron-up" : "chevron-down"}
              size={18}
              color={Colors.textSecondary}
            />
          </Pressable>
          {showAthleteProfile ? (
            <View style={{ marginTop: 12 }}>
              <AthleteProfileCard />
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.profile.account}</Text>
        <InfoRow label={t.profile.email} value={user?.email ?? "—"} />
        <InfoRow
          label={t.profile.createdAt}
          value={
            user?.created_at
              ? new Date(user.created_at).toLocaleDateString(
                  locale === "en" ? "en-US" : "es-ES"
                )
              : "—"
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.signOutBtn,
          pressed && styles.signOutBtnPressed,
          signingOut && { opacity: 0.6 },
        ]}
        onPress={handleSignOut}
        disabled={signingOut || deleting}
        accessibilityRole="button"
        accessibilityLabel={t.profile.signOut}
      >
        {signingOut ? (
          <ActivityIndicator color={Colors.danger} />
        ) : (
          <Text style={styles.signOutText}>{t.profile.signOut}</Text>
        )}
      </Pressable>

      <View style={styles.card}>
        <Pressable
          onPress={() => setShowPrivacy((v) => !v)}
          style={({ pressed }) => [styles.collapseBtn, pressed && { opacity: 0.9 }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.collapseBtnText}>{t.profile.valuePrivacy}</Text>
          </View>
          <Ionicons
            name={showPrivacy ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.textSecondary}
          />
        </Pressable>
        {showPrivacy ? (
          <View style={{ marginTop: 12, gap: 10 }}>
            <Pressable
              onPress={() => {
                const { Linking } = require("react-native");
                Linking.openURL("https://aikinora.com/privacidad");
              }}
              style={({ pressed }) => [styles.privacyLinkBtn, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
              <Text style={styles.privacyLinkText}>
                {locale === "en" ? "Privacy Policy" : "Política de privacidad"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed && styles.deleteBtnPressed,
                deleting && { opacity: 0.6 },
              ]}
              onPress={handleDeleteAccount}
              disabled={signingOut || deleting}
            >
              {deleting ? (
                <ActivityIndicator color={Colors.danger} />
              ) : (
                <Text style={styles.deleteBtnText}>{t.profile.deleteAccount}</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScreenScrollView>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.6,
    marginBottom: 24,
  },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 14,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarText: { color: Colors.white, fontSize: 28, fontWeight: "700" },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  emailSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  languageRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  langChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primarySoft,
  },
  langChipActive: {
    backgroundColor: "#6B7280",
    borderColor: "#6B7280",
  },
  langChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  langChipTextActive: { color: Colors.white },
  collapseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  collapseBtnText: { fontSize: 15, fontWeight: "700", color: Colors.text },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: "600", color: Colors.text, maxWidth: "58%", textAlign: "right" },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  prefRowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  prefLabel: { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  prefHint: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  prefBusy: { marginTop: 6, fontSize: 12, color: Colors.primary, fontWeight: "600" },
  signOutBtn: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FFF5F5",
  },
  signOutBtnPressed: { backgroundColor: "#FEE2E2" },
  signOutText: { fontSize: 15, fontWeight: "700", color: Colors.danger },
  privacyLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteBtnPressed: { backgroundColor: "#FEF2F2" },
  deleteBtnText: { fontSize: 15, fontWeight: "700", color: Colors.danger },
});
