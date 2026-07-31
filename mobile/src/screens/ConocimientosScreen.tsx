import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";

type KnowledgeItem = {
  id: string;
  title: string;
  preview: string;
};

const CATEGORIES = [
  { key: "muscle", icon: "barbell-outline" as const },
  { key: "joint", icon: "body-outline" as const },
  { key: "prevention", icon: "shield-checkmark-outline" as const },
  { key: "recovery", icon: "refresh-outline" as const },
];

export function ConocimientosScreen() {
  const { t, locale } = useI18n();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("document_chunks")
        .select("id, source_name, content")
        .order("created_at", { ascending: false })
        .limit(40);

      const seen = new Set<string>();
      const sources: KnowledgeItem[] = [];
      for (const row of (data ?? []) as {
        id: string;
        source_name: string;
        content: string;
      }[]) {
        if (seen.has(row.source_name)) continue;
        seen.add(row.source_name);
        sources.push({
          id: row.id,
          title: row.source_name,
          preview:
            row.content.length > 180
              ? `${row.content.slice(0, 180)}…`
              : row.content,
        });
      }
      setItems(sources);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryLabels = {
    muscle: t.knowledge.catMuscle,
    joint: t.knowledge.catJoint,
    prevention: t.knowledge.catPrevention,
    recovery: t.knowledge.catRecovery,
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load();
          }}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{t.knowledge.title}</Text>
        <Text style={styles.heroSub}>{t.knowledge.subtitle}</Text>
      </View>

      <View style={styles.categories}>
        {CATEGORIES.map((c) => (
          <View key={c.key} style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <Ionicons name={c.icon} size={22} color={Colors.primary} />
            </View>
            <Text style={styles.categoryLabel}>
              {categoryLabels[c.key as keyof typeof categoryLabels]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t.knowledge.material}</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="library-outline" size={40} color={Colors.borderStrong} />
          <Text style={styles.emptyText}>{t.knowledge.empty}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.docIcon}>
                <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody} numberOfLines={4}>
                {item.preview}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>{t.knowledge.ctaTitle}</Text>
        <Text style={styles.ctaBody}>{t.knowledge.ctaBody}</Text>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
          onPress={() => navigation.navigate("AIInquiries")}
        >
          <Text style={styles.ctaBtnText}>{t.knowledge.ctaButton}</Text>
        </Pressable>
      </View>

      <Text style={styles.localeHint}>
        {locale === "en" ? "Pull to refresh" : "Desliza para actualizar"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 40 },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 20,
    color: "#BFDBFE",
    letterSpacing: -0.1,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  categoryCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    alignItems: "center",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -0.1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  centered: { paddingVertical: 40, alignItems: "center" },
  empty: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.borderStrong,
    padding: 28,
    marginBottom: 18,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  list: { gap: 12, marginBottom: 18 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  cta: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  ctaBody: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 14,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaBtnPressed: { backgroundColor: Colors.primaryDark },
  ctaBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  localeHint: {
    textAlign: "center",
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
});
