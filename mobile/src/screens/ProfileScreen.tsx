import { Ionicons } from "@expo/vector-icons";
import type { User } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
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
import { uploadAvatarFromUri } from "../lib/upload-avatar";

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
  const [accountType, setAccountType] = useState<
    "patient" | "physio" | "clinic" | null
  >(null);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [notifBusy, setNotifBusy] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
          profile?.account_type === "physio"
            ? "physio"
            : profile?.account_type === "clinic"
              ? "clinic"
              : "patient"
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

  async function applyPickedPhoto(uri: string) {
    setUploadingPhoto(true);
    try {
      const url = await uploadAvatarFromUri(uri);
      setAvatarUrl(url);
      Alert.alert(t.profile.title, t.profile.photoUpdated);
    } catch {
      Alert.alert(t.profile.title, t.profile.photoError);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function takeProfilePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.profile.title, t.profile.photoPermission);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      await applyPickedPhoto(result.assets[0].uri);
    }
  }

  async function pickProfilePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.profile.title, t.profile.photoPermission);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      await applyPickedPhoto(result.assets[0].uri);
    }
  }

  function handleChangePhoto() {
    Alert.alert(t.profile.changePhoto, t.profile.changePhotoHint, [
      { text: t.consulta.takePhoto, onPress: () => void takeProfilePhoto() },
      { text: t.consulta.choosePhoto, onPress: () => void pickProfilePhoto() },
      { text: t.profile.cancel, style: "cancel" },
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

  const roleLabel =
    accountType === "clinic"
      ? "Clínica"
      : accountType === "physio"
        ? t.profile.rolePhysio
        : t.profile.rolePatient;

  return (
    <ScreenScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Pressable
          onPress={handleChangePhoto}
          disabled={uploadingPhoto}
          style={styles.avatarPress}
          accessibilityLabel={t.profile.changePhoto}
        >
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
          <View style={styles.cameraBadge}>
            {uploadingPhoto ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Ionicons name="camera" size={14} color={Colors.white} />
            )}
          </View>
        </Pressable>
        <Text style={styles.heroName}>{displayName || user?.email || "—"}</Text>
        {displayName && user?.email ? (
          <Text style={styles.heroEmail}>{user.email}</Text>
        ) : null}
        <View style={styles.chipRow}>
          <View style={styles.roleChip}>
            <Ionicons
              name={
                accountType === "clinic"
                  ? "business-outline"
                  : accountType === "physio"
                    ? "medkit-outline"
                    : "person-outline"
              }
              size={13}
              color={Colors.white}
            />
            <Text style={styles.roleChipText}>{roleLabel}</Text>
          </View>
          <View style={styles.planChip}>
            <Text style={styles.planChipText}>{t.profile.freePlan}</Text>
          </View>
        </View>
        <Pressable
          onPress={handleChangePhoto}
          disabled={uploadingPhoto}
          style={({ pressed }) => [styles.changePhotoBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="image-outline" size={16} color={Colors.white} />
          <Text style={styles.changePhotoText}>{t.profile.changePhoto}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.profile.preferences}</Text>

        <View style={[styles.settingRow, styles.settingRowFirst]}>
          <View style={styles.settingIcon}>
            <Ionicons name="globe-outline" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
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
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, paddingRight: 8 }}>
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

      {accountType === "clinic" ? (
        <View style={styles.card}>
          <Text style={styles.collapseBtnText}>
            Edita la ficha en Clínica. El equipo (invitar fisioterapeutas) está
            dentro de Clínica → Equipo.
          </Text>
        </View>
      ) : accountType === "physio" ? (
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
        <View style={[styles.accountRow, styles.settingRowFirst]}>
          <View style={styles.settingIcon}>
            <Ionicons name="mail-outline" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>{t.profile.email}</Text>
            <Text style={styles.infoValueLeft}>{user?.email ?? "—"}</Text>
          </View>
        </View>
        <View style={styles.accountRow}>
          <View style={styles.settingIcon}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>{t.profile.createdAt}</Text>
            <Text style={styles.infoValueLeft}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString(
                    locale === "en" ? "en-US" : "es-ES"
                  )
                : "—"}
            </Text>
          </View>
        </View>
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
          <>
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
            <Text style={styles.signOutText}>{t.profile.signOut}</Text>
          </>
        )}
      </Pressable>

      <View style={styles.card}>
        <Pressable
          onPress={() => setShowPrivacy((v) => !v)}
          style={({ pressed }) => [styles.collapseBtn, pressed && { opacity: 0.9 }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.collapseBtnText}>{t.profile.privacySection}</Text>
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
              <Text style={styles.privacyLinkText}>{t.profile.privacyPolicy}</Text>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 48 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  heroGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: -80,
    right: -50,
  },
  avatarPress: { marginBottom: 14 },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.55)",
  },
  avatarImg: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.primaryLight,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
  },
  avatarText: { color: Colors.white, fontSize: 34, fontWeight: "700" },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  heroEmail: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
  },
  chipRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  roleChipText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  planChip: {
    backgroundColor: Colors.white,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  planChipText: { color: Colors.primary, fontSize: 12, fontWeight: "700" },
  changePhotoBtn: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15,23,42,0.22)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  changePhotoText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  settingRowFirst: { borderTopWidth: 0, paddingTop: 0 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  languageRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  langChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primarySoft,
  },
  langChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  infoLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  infoValueLeft: { fontSize: 14, fontWeight: "600", color: Colors.text },
  prefLabel: { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  prefHint: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  prefBusy: { marginTop: 6, fontSize: 12, color: Colors.primary, fontWeight: "600" },
  signOutBtn: {
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.dangerSoft,
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
