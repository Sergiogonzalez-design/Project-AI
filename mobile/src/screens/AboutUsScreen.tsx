import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BeneficiosCarousel } from "../components/BeneficiosCarousel";
import { brandName } from "../lib/brand";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  image_url: string | null;
};

export function AboutUsScreen() {
  const { t, locale } = useI18n();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsPost | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("news")
      .select("id, title, body, published_at, image_url")
      .order("published_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setNews((data as NewsPost[]) ?? []))
      .catch(() => setNews([]));
  }, []);

  async function handleContactSubmit() {
    setContactError(null);
    const name = fullName.trim();
    const emailNorm = email.trim().toLowerCase();
    const ageNum = Number.parseInt(age, 10);
    const message = inquiry.trim();

    if (name.length < 2) {
      setContactError(t.about.contactErrorName);
      return;
    }
    if (!emailNorm.includes("@") || emailNorm.length < 5) {
      setContactError(t.about.contactErrorEmail);
      return;
    }
    if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120) {
      setContactError(t.about.contactErrorAge);
      return;
    }
    if (message.length < 5) {
      setContactError(t.about.contactErrorInquiry);
      return;
    }

    setContactLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("contact_inquiries").insert({
        full_name: name,
        email: emailNorm,
        age: ageNum,
        inquiry: message,
        user_id: user?.id ?? null,
      });
      if (error) {
        setContactError(error.message || t.about.contactErrorGeneric);
        return;
      }
      setContactSuccess(true);
      setFullName("");
      setEmail("");
      setAge("");
      setInquiry("");
    } catch {
      setContactError(t.about.contactErrorGeneric);
    } finally {
      setContactLoading(false);
    }
  }

  if (selectedNews) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.detailContainer}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => setSelectedNews(null)}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.primary} />
          <Text style={styles.backText}>{t.about.newsBack}</Text>
        </Pressable>

        {selectedNews.image_url ? (
          <Image
            source={{ uri: selectedNews.image_url }}
            style={styles.detailHero}
            resizeMode="contain"
            accessibilityLabel={selectedNews.title}
          />
        ) : (
          <View style={styles.detailHeroEmpty}>
            <Ionicons name="newspaper-outline" size={40} color={Colors.borderStrong} />
          </View>
        )}

        <Text style={styles.detailDate}>
          {new Date(selectedNews.published_at).toLocaleDateString(
            locale === "en" ? "en-US" : "es-ES",
            { day: "numeric", month: "long", year: "numeric" }
          )}
        </Text>
        <Text style={styles.detailTitle}>{selectedNews.title}</Text>
        <Text style={styles.detailBody}>{selectedNews.body}</Text>
      </ScrollView>
    );
  }

  const howSteps = [
    {
      icon: "clipboard-outline" as const,
      title: t.about.how1Title,
      body: t.about.how1Body,
    },
    {
      icon: "sparkles-outline" as const,
      title: t.about.how2Title,
      body: t.about.how2Body,
    },
    {
      icon: "chatbubbles-outline" as const,
      title: t.about.how3Title,
      body: t.about.how3Body,
    },
  ];

  const values = [
    { title: t.about.valuePrecision, desc: t.about.valuePrecisionDesc },
    { title: t.about.valueAccess, desc: t.about.valueAccessDesc },
    { title: t.about.valuePrivacy, desc: t.about.valuePrivacyDesc },
    { title: t.about.valueImprove, desc: t.about.valueImproveDesc },
  ];

  const davidCredentials = [
    t.about.davidCred1,
    t.about.davidCred2,
    t.about.davidCred3,
  ];
  const sergioCredentials = [
    t.about.sergioCred1,
    t.about.sergioCred2,
    t.about.sergioCred3,
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroLogoWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.heroLogo}
            accessibilityLabel={brandName(locale)}
          />
        </View>
        <Text style={styles.heroTitle}>{brandName(locale)}</Text>
        <Text style={styles.heroSub}>{t.about.tagline}</Text>
      </View>

      {/* News — top, under Kinora */}
      <Text style={styles.sectionTitle}>{t.about.newsTitle}</Text>
      {news.length === 0 ? (
        <View style={styles.emptyNews}>
          <Ionicons name="newspaper-outline" size={36} color={Colors.borderStrong} />
          <Text style={styles.emptyNewsText}>{t.about.newsEmpty}</Text>
        </View>
      ) : (
        <View style={styles.newsList}>
          {news.map((post) => (
            <Pressable
              key={post.id}
              onPress={() => setSelectedNews(post)}
              style={({ pressed }) => [
                styles.newsCard,
                pressed && { opacity: 0.92 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t.about.newsOpen}
            >
              {post.image_url ? (
                <Image source={{ uri: post.image_url }} style={styles.newsCircle} />
              ) : (
                <View style={[styles.newsCircle, styles.newsCircleEmpty]}>
                  <Ionicons
                    name="newspaper-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
              )}
              <View style={styles.newsTextCol}>
                <Text style={styles.newsDate}>
                  {new Date(post.published_at).toLocaleDateString(
                    locale === "en" ? "en-US" : "es-ES",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </Text>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={styles.newsBody} numberOfLines={2}>
                  {post.body}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </Pressable>
          ))}
        </View>
      )}

      {/* Beneficios */}
      <BeneficiosCarousel />

      {/* How it works */}
      <Text style={styles.sectionTitle}>{t.about.howTitle}</Text>
      <View style={styles.howList}>
        {howSteps.map((step, idx) => (
          <View key={step.title} style={styles.howCard}>
            <View style={styles.howIcon}>
              <Ionicons name={step.icon} size={22} color={Colors.primary} />
            </View>
            <Text style={styles.howTitle}>{step.title}</Text>
            <Text style={styles.howBody}>{step.body}</Text>
            <View style={styles.howMeta}>
              <Text style={styles.howBadge}>
                {t.about.howStep} {idx + 1}
              </Text>
              <Text style={styles.howFast}>{t.about.howFast}</Text>
            </View>
          </View>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
        onPress={() => navigation.navigate("AIInquiries")}
      >
        <Text style={styles.ctaBtnText}>{t.about.startConsulta}</Text>
      </Pressable>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons
          name="warning-outline"
          size={18}
          color="#92400E"
          style={{ marginTop: 1 }}
        />
        <Text style={styles.disclaimerText}>{t.about.disclaimer}</Text>
      </View>

      {/* Mission */}
      <View style={styles.missionBox}>
        <Text style={styles.sectionTitleCentered}>{t.about.missionTitle}</Text>
        <Text style={styles.missionBody}>{t.about.missionBody}</Text>
      </View>

      {/* Team */}
      <Text style={styles.sectionTitle}>{t.about.teamTitle}</Text>
      <View style={styles.teamList}>
        <TeamCard
          initials="DR"
          name="David Ramirez Moreno"
          role={t.about.davidRole}
          bio={t.about.davidBio}
          credentials={davidCredentials}
          gradient="blue"
        />
        <TeamCard
          initials="SG"
          name="Sergio Gonzalez Fernandez"
          role={t.about.sergioRole}
          bio={t.about.sergioBio}
          credentials={sergioCredentials}
          gradient="cyan"
        />
      </View>

      {/* Values */}
      <Text style={styles.sectionTitle}>{t.about.valuesTitle}</Text>
      <View style={styles.valuesGrid}>
        {values.map((v) => (
          <View key={v.title} style={styles.valueCard}>
            <Text style={styles.valueTitle}>{v.title}</Text>
            <Text style={styles.valueDesc}>{v.desc}</Text>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.contactBox}>
        <Text style={styles.contactTitle}>{t.about.contactTitle}</Text>
        <Text style={styles.contactBody}>{t.about.contactBody}</Text>
        {contactSuccess ? (
          <View style={styles.contactForm}>
            <Text style={styles.contactSuccessTitle}>{t.about.contactSuccessTitle}</Text>
            <Text style={styles.contactSuccessBody}>{t.about.contactSuccessBody}</Text>
            <Pressable
              style={({ pressed }) => [styles.contactBtn, pressed && { opacity: 0.9 }]}
              onPress={() => setContactSuccess(false)}
            >
              <Text style={styles.contactBtnText}>{t.about.contactSendAnother}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.contactForm}>
            <Text style={styles.contactLabel}>{t.about.contactFullName}</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder={t.about.contactFullNamePlaceholder}
              placeholderTextColor={Colors.textLight}
              style={styles.contactInput}
              autoCapitalize="words"
            />
            <Text style={styles.contactLabel}>{t.about.contactEmail}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t.about.contactEmailPlaceholder}
              placeholderTextColor={Colors.textLight}
              style={styles.contactInput}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.contactLabel}>{t.about.contactAge}</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder={t.about.contactAgePlaceholder}
              placeholderTextColor={Colors.textLight}
              style={styles.contactInput}
              keyboardType="number-pad"
            />
            <Text style={styles.contactLabel}>{t.about.contactInquiry}</Text>
            <TextInput
              value={inquiry}
              onChangeText={setInquiry}
              placeholder={t.about.contactInquiryPlaceholder}
              placeholderTextColor={Colors.textLight}
              style={[styles.contactInput, styles.contactTextarea]}
              multiline
              textAlignVertical="top"
            />
            {contactError ? <Text style={styles.contactError}>{contactError}</Text> : null}
            <Pressable
              style={({ pressed }) => [
                styles.contactBtn,
                contactLoading && { opacity: 0.6 },
                pressed && { opacity: 0.9 },
              ]}
              onPress={() => void handleContactSubmit()}
              disabled={contactLoading}
            >
              <Text style={styles.contactBtnText}>
                {contactLoading ? t.about.contactSending : t.about.contactButton}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function TeamCard({
  initials,
  name,
  role,
  bio,
  credentials,
  gradient,
}: {
  initials: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  gradient: "blue" | "cyan";
}) {
  return (
    <View style={styles.teamCard}>
      <View
        style={[
          styles.teamAvatar,
          gradient === "cyan" ? styles.teamAvatarCyan : styles.teamAvatarBlue,
        ]}
      >
        <Text style={styles.teamInitials}>{initials}</Text>
      </View>
      <Text style={styles.teamName}>{name}</Text>
      <Text style={styles.teamRole}>{role}</Text>
      <Text style={styles.teamBio}>{bio}</Text>
      <View style={styles.credList}>
        {credentials.map((c) => (
          <View key={c} style={styles.credRow}>
            <View style={styles.credDot} />
            <Text style={styles.credText}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 20, paddingBottom: 48 },
  hero: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },
  heroLogoWrap: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
  },
  heroLogo: { width: 72, height: 72, resizeMode: "contain" },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.8,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 14,
    color: "#BFDBFE",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
    letterSpacing: -0.1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.4,
    marginTop: 8,
    marginBottom: 14,
  },
  sectionTitleCentered: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.4,
    marginBottom: 12,
    textAlign: "center",
  },
  howList: { gap: 12, marginBottom: 16 },
  howCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
  },
  howIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  howTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  howBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  howMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  howBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    backgroundColor: Colors.primarySoft,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  howFast: { fontSize: 11, color: Colors.textLight, fontWeight: "600" },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaBtnPressed: { backgroundColor: Colors.primaryDark },
  ctaBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 14,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    lineHeight: 17,
  },
  emptyNews: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.borderStrong,
    padding: 28,
    marginBottom: 20,
  },
  emptyNewsText: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  newsList: { gap: 12, marginBottom: 20 },
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  newsCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primarySoft,
  },
  newsCircleEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  newsTextCol: { flex: 1, minWidth: 0 },
  newsDate: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  newsBody: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  detailContainer: { padding: 20, paddingBottom: 48 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  detailHero: {
    width: "100%",
    minHeight: 180,
    maxHeight: 420,
    borderRadius: 20,
    marginBottom: 18,
    backgroundColor: Colors.primarySoft,
  },
  detailHeroEmpty: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    marginBottom: 18,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  detailDate: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  detailBody: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  missionBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 20,
  },
  missionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  teamList: { gap: 14, marginBottom: 20 },
  teamCard: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  teamAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  teamAvatarBlue: { backgroundColor: Colors.primary },
  teamAvatarCyan: { backgroundColor: "#0891B2" },
  teamInitials: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  teamRole: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  teamBio: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  credList: { marginTop: 14, gap: 8 },
  credRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  credDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  credText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  valueCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: "center",
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  valueDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  contactBox: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  contactBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#BFDBFE",
    textAlign: "center",
    marginBottom: 18,
  },
  contactForm: {
    width: "100%",
    alignItems: "stretch",
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 6,
  },
  contactInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  contactTextarea: {
    minHeight: 96,
    paddingTop: 12,
  },
  contactError: {
    color: "#FEE2E2",
    fontSize: 13,
    marginBottom: 10,
  },
  contactSuccessTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 6,
    textAlign: "center",
  },
  contactSuccessBody: {
    fontSize: 13,
    lineHeight: 19,
    color: "#BFDBFE",
    textAlign: "center",
    marginBottom: 14,
  },
  contactBtn: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  contactBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
