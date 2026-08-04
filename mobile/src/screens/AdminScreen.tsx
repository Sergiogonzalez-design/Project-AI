import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { adminCreateUserUrl } from "../lib/admin-api";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { deleteNewsImageByUrl, uploadNewsImageFromUri } from "../lib/news-image";
import { isAdminEmail } from "../lib/supabase-config";
import { supabase } from "../lib/supabase";

type TabKey = "users" | "news";

type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
  primary_sport: string | null;
  is_admin: boolean;
  is_premium: boolean;
};

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  image_url: string | null;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString(locale === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminScreen() {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState<TabKey>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsImageUri, setNewsImageUri] = useState<string | null>(null);
  const [newsImageMime, setNewsImageMime] = useState("image/jpeg");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAllowed(isAdminEmail(data.user?.email));
    });
  }, []);

  const loadUsers = useCallback(async () => {
    const { data, error: rpcError } = await supabase.rpc("admin_list_users");
    if (rpcError) throw new Error(rpcError.message);
    setUsers((data as AdminUser[]) ?? []);
  }, []);

  const loadNews = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("news")
      .select("id, title, body, published_at, image_url")
      .order("published_at", { ascending: false });
    if (fetchError) throw new Error(fetchError.message);
    setPosts((data as NewsPost[]) ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadUsers(), loadNews()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  }, [loadUsers, loadNews, t.common.error]);

  useEffect(() => {
    if (allowed !== true) return;
    void load();
  }, [allowed, load]);

  async function handleDeleteUser(user: AdminUser) {
    if (user.is_admin) return;
    Alert.alert(
      t.admin.deleteUserTitle,
      t.admin.deleteUserConfirm.replace("{email}", user.email),
      [
        { text: t.profile.cancel, style: "cancel" },
        {
          text: t.admin.delete,
          style: "destructive",
          onPress: async () => {
            setBusyId(user.id);
            setError(null);
            const { error: rpcError } = await supabase.rpc("admin_delete_user", {
              target_user_id: user.id,
            });
            if (rpcError) setError(rpcError.message);
            else setUsers((prev) => prev.filter((u) => u.id !== user.id));
            setBusyId(null);
          },
        },
      ]
    );
  }

  async function handleCreateUser() {
    const email = inviteEmail.trim().toLowerCase();
    const password = invitePassword;
    if (!email || password.length < 8) {
      setError(t.admin.createUserValidation);
      return;
    }

    setBusyId("create");
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error(t.admin.notSignedIn);

      const res = await fetch(adminCreateUserUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? t.common.error);

      setInviteEmail("");
      setInvitePassword("");
      Alert.alert(t.admin.createUserTitle, t.admin.createUserSuccess);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setBusyId(null);
    }
  }

  async function handlePickNewsImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(t.common.error);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setNewsImageUri(asset.uri);
    setNewsImageMime(asset.mimeType ?? "image/jpeg");
  }

  async function handleCreateNews() {
    const title = newsTitle.trim();
    const body = newsBody.trim();
    if (!title || !body) {
      setError(t.admin.newsValidation);
      return;
    }
    setBusyId("news");
    setError(null);
    let imageUrl: string | null = null;
    try {
      if (newsImageUri) {
        imageUrl = await uploadNewsImageFromUri(newsImageUri, newsImageMime);
      }
      const { error: insertError } = await supabase.from("news").insert({
        title,
        body,
        image_url: imageUrl,
      });
      if (insertError) {
        if (imageUrl) await deleteNewsImageByUrl(imageUrl);
        throw new Error(insertError.message);
      }
      setNewsTitle("");
      setNewsBody("");
      setNewsImageUri(null);
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteNews(post: NewsPost) {
    Alert.alert(t.admin.deleteNewsTitle, t.admin.deleteNewsConfirm, [
      { text: t.profile.cancel, style: "cancel" },
      {
        text: t.admin.delete,
        style: "destructive",
        onPress: async () => {
          setBusyId(post.id);
          const { error: deleteError } = await supabase
            .from("news")
            .delete()
            .eq("id", post.id);
          if (deleteError) setError(deleteError.message);
          else {
            await deleteNewsImageByUrl(post.image_url);
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
          }
          setBusyId(null);
        },
      },
    ]);
  }

  if (allowed === null) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!allowed) {
    return (
      <View style={[styles.root, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.subtitle}>{t.common.error}</Text>
      </View>
    );
  }

  return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        showsVerticalScrollIndicator
      >
      <Text style={styles.title}>{t.admin.title}</Text>
      <Text style={styles.subtitle}>{t.admin.subtitle}</Text>

      <View style={styles.segment}>
        <Pressable
          onPress={() => setTab("users")}
          style={[styles.segmentBtn, tab === "users" && styles.segmentBtnActive]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === "users" && styles.segmentTextActive,
            ]}
          >
            {t.admin.users}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("news")}
          style={[styles.segmentBtn, tab === "news" && styles.segmentBtnActive]}
        >
          <Text
            style={[
              styles.segmentText,
              tab === "news" && styles.segmentTextActive,
            ]}
          >
            {t.admin.news}
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
      ) : tab === "users" ? (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.admin.createUserTitle}</Text>
            <TextInput
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder={t.admin.emailPlaceholder}
              placeholderTextColor={Colors.textLight}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              value={invitePassword}
              onChangeText={setInvitePassword}
              placeholder={t.admin.passwordPlaceholder}
              placeholderTextColor={Colors.textLight}
              secureTextEntry
              style={styles.input}
            />
            <Pressable
              onPress={() => void handleCreateUser()}
              disabled={busyId === "create"}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
                busyId === "create" && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.primaryBtnText}>
                {busyId === "create" ? t.common.loading : t.admin.createUser}
              </Text>
            </Pressable>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {users.length} {t.admin.users.toLowerCase()}
            </Text>
            <Pressable onPress={() => void load()}>
              <Text style={styles.refresh}>{t.admin.refresh}</Text>
            </Pressable>
          </View>

          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.userTitleRow}>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                  {user.is_admin ? (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.userMeta}>
                  {user.display_name || t.admin.noName} ·{" "}
                  {formatDate(user.created_at, locale)}
                </Text>
              </View>
              {!user.is_admin ? (
                <Pressable
                  onPress={() => handleDeleteUser(user)}
                  disabled={busyId === user.id}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.admin.createNewsTitle}</Text>
            <TextInput
              value={newsTitle}
              onChangeText={setNewsTitle}
              placeholder={t.admin.newsTitlePlaceholder}
              placeholderTextColor={Colors.textLight}
              style={styles.input}
            />
            <TextInput
              value={newsBody}
              onChangeText={setNewsBody}
              placeholder={t.admin.newsBodyPlaceholder}
              placeholderTextColor={Colors.textLight}
              multiline
              style={[styles.input, styles.textArea]}
            />
            <Text style={styles.imageLabel}>{t.admin.newsImage}</Text>
            <View style={styles.imageRow}>
              <Pressable
                onPress={() => void handlePickNewsImage()}
                style={styles.imagePickBtn}
              >
                <Text style={styles.imagePickText}>{t.admin.pickImage}</Text>
              </Pressable>
              {newsImageUri ? (
                <>
                  <Image source={{ uri: newsImageUri }} style={styles.imagePreview} />
                  <Pressable onPress={() => setNewsImageUri(null)}>
                    <Text style={styles.removeImage}>{t.admin.removeImage}</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
            <Pressable
              onPress={() => void handleCreateNews()}
              disabled={busyId === "news"}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
                busyId === "news" && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.primaryBtnText}>
                {busyId === "news" ? t.common.loading : t.admin.publishNews}
              </Text>
            </Pressable>
          </View>

          {posts.map((post) => (
            <View key={post.id} style={styles.userCard}>
              {post.image_url ? (
                <Image source={{ uri: post.image_url }} style={styles.newsThumb} />
              ) : (
                <View style={[styles.newsThumb, styles.newsThumbEmpty]}>
                  <Ionicons name="newspaper-outline" size={18} color={Colors.textLight} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.userMeta}>
                  {formatDate(post.published_at, locale)}
                </Text>
                <Text style={styles.userEmail}>{post.title}</Text>
                <Text style={styles.newsBody} numberOfLines={3}>
                  {post.body}
                </Text>
              </View>
              <Pressable
                onPress={() => handleDeleteNews(post)}
                disabled={busyId === post.id}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 100, flexGrow: 1 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentBtnActive: { backgroundColor: Colors.primary },
  segmentText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  segmentTextActive: { color: Colors.white },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: "#991B1B", fontSize: 13 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
    backgroundColor: Colors.background,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  refresh: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  userTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  userEmail: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  userMeta: { marginTop: 4, fontSize: 12, color: Colors.textSecondary },
  newsBody: { marginTop: 6, fontSize: 13, lineHeight: 18, color: Colors.textSecondary },
  imageLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  imagePickBtn: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  imagePickText: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  imagePreview: { width: 56, height: 56, borderRadius: 28 },
  removeImage: { fontSize: 13, fontWeight: "600", color: Colors.danger },
  newsThumb: { width: 44, height: 44, borderRadius: 22 },
  newsThumbEmpty: {
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  adminBadge: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
  },
});
