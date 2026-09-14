import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LegalDocumentView,
} from "../components/LegalDocumentView";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { BeneficiosCarousel } from "../components/BeneficiosCarousel";
import { brandName } from "../lib/brand";
import { Colors } from "../lib/colors";
import { screenHeaderTopInset } from "../lib/screen-header-insets";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";
import {
  getPrimaryWorkspaceRoute,
  navigateToPrimaryWorkspace,
} from "../navigation/tab-navigation";

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
  const insets = useSafeAreaInsets();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsPost | null>(null);
  const [showLegal, setShowLegal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const newsScrollRef = useRef<React.ElementRef<typeof ScreenScrollView>>(null);
  const mainScrollRef = useRef<React.ElementRef<typeof ScreenScrollView>>(null);

  const primaryWorkspace = getPrimaryWorkspaceRoute(navigation);
  const startCtaLabel =
    primaryWorkspace === "Patients"
      ? t.about.goToPatients
      : primaryWorkspace === "PhysioLink"
        ? t.about.goToPaciente
        : t.about.startConsulta;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: !selectedNews && !showLegal,
      });
      return () => {
        navigation.setOptions({ headerShown: true });
      };
    }, [navigation, selectedNews, showLegal])
  );

  useEffect(() => {
    if (selectedNews) {
      newsScrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      mainScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [selectedNews]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, body, published_at, image_url")
        .order("published_at", { ascending: false })
        .limit(6);
      if (!cancelled) {
        setNews(error ? [] : ((data as NewsPost[]) ?? []));
      }
    })();
    return () => {
      cancelled = true;
    };
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

  if (showLegal) {
    return <LegalDocumentView onClose={() => setShowLegal(false)} />;
  }

  if (selectedNews) {
    return (
      <ScreenScrollView
        ref={newsScrollRef}
        style={styles.root}
        contentContainerStyle={[
          styles.detailContainer,
          { paddingTop: screenHeaderTopInset(insets) },
        ]}
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

        <View style={styles.detailMetaChip}>
          <Text style={styles.detailDate}>
            {new Date(selectedNews.published_at).toLocaleDateString(
              locale === "en" ? "en-US" : "es-ES",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </Text>
        </View>
        <Text style={styles.detailTitle}>{selectedNews.title}</Text>
        <Text style={styles.detailBody}>{selectedNews.body}</Text>
      </ScreenScrollView>
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
    {
      icon: "locate-outline" as const,
      title: t.about.valuePrecision,
      desc: t.about.valuePrecisionDesc,
    },
    {
      icon: "people-outline" as const,
      title: t.about.valueAccess,
      desc: t.about.valueAccessDesc,
    },
    {
      icon: "lock-closed-outline" as const,
      title: t.about.valuePrivacy,
      desc: t.about.valuePrivacyDesc,
    },
    {
      icon: "leaf-outline" as const,
      title: t.about.valueImprove,
      desc: t.about.valueImproveDesc,
    },
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
    <ScreenScrollView
      ref={mainScrollRef}
      style={styles.root}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.heroLogo}
          accessibilityLabel={brandName(locale)}
        />
        <Text style={styles.heroTitle}>{brandName(locale)}</Text>
        <Text style={styles.heroHeadline}>{t.about.heroHeadline}</Text>
        <Text style={styles.heroSub}>{t.about.tagline}</Text>
        <Pressable
          style={({ pressed }) => [styles.heroCta, pressed && { opacity: 0.9 }]}
          onPress={() => navigateToPrimaryWorkspace(navigation)}
        >
          <Text style={styles.heroCtaText}>{startCtaLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>{t.about.newsTitle}</Text>
      {news.length === 0 ? (
        <View style={styles.emptyNews}>
          <View style={styles.emptyNewsIcon}>
            <Ionicons name="newspaper-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.emptyNewsText}>{t.about.newsEmpty}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          style={styles.newsScroller}
          contentContainerStyle={styles.newsCarousel}
          decelerationRate="fast"
          snapToInterval={272}
          snapToAlignment="start"
        >
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
                <Image source={{ uri: post.image_url }} style={styles.newsCover} />
              ) : (
                <View style={[styles.newsCover, styles.newsCoverEmpty]}>
                  <Ionicons name="newspaper-outline" size={28} color={Colors.primary} />
                </View>
              )}
              <View style={styles.newsCardBody}>
                <Text style={styles.newsDate}>
                  {new Date(post.published_at).toLocaleDateString(
                    locale === "en" ? "en-US" : "es-ES",
                    { day: "numeric", month: "short" }
                  )}
                </Text>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={styles.newsRead}>{t.about.newsRead}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <BeneficiosCarousel />

      <Text style={styles.sectionEyebrow}>{t.about.processLabel}</Text>
      <Text style={styles.sectionTitle}>{t.about.howTitle}</Text>
      <View style={styles.timeline}>
        {howSteps.map((step, idx) => (
          <View key={step.title} style={styles.timelineRow}>
            <View style={styles.timelineRail}>
              <View style={styles.timelineDot}>
                <Text style={styles.timelineNum}>{idx + 1}</Text>
              </View>
              {idx < howSteps.length - 1 ? <View style={styles.timelineLine} /> : null}
            </View>
            <View style={styles.timelineCard}>
              <View style={styles.howIcon}>
                <Ionicons name={step.icon} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.howTitle}>{step.title}</Text>
              <Text style={styles.howBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
        onPress={() => navigateToPrimaryWorkspace(navigation)}
      >
        <Text style={styles.ctaBtnText}>{startCtaLabel}</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.white} />
      </Pressable>

      <View style={styles.disclaimer}>
        <Ionicons
          name="shield-checkmark-outline"
          size={18}
          color="#92400E"
          style={{ marginTop: 1 }}
        />
        <Text style={styles.disclaimerText}>{t.about.disclaimer}</Text>
      </View>

      <View style={styles.missionBox}>
        <Text style={styles.missionQuoteMark}>“</Text>
        <Text style={styles.sectionTitleCentered}>{t.about.missionTitle}</Text>
        <Text style={styles.missionBody}>{t.about.missionBody}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t.about.teamTitle}</Text>
      <View style={styles.teamList}>
        <TeamCard
          initials="DR"
          name="David Ramirez Moreno"
          role={t.about.davidRole}
          bio={t.about.davidBio}
          credentials={davidCredentials}
        />
        <TeamCard
          initials="SG"
          name="Sergio Gonzalez Fernandez"
          role={t.about.sergioRole}
          bio={t.about.sergioBio}
          credentials={sergioCredentials}
        />
      </View>

      <Text style={styles.sectionTitle}>{t.about.valuesTitle}</Text>
      <View style={styles.valuesList}>
        {values.map((v) => (
          <View key={v.title} style={styles.valueRow}>
            <View style={styles.valueIcon}>
              <Ionicons name={v.icon} size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueDesc}>{v.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.legalBox}>
        <Pressable
          style={({ pressed }) => [styles.legalRow, pressed && { opacity: 0.85 }]}
          onPress={() => setShowLegal(true)}
          accessibilityRole="button"
        >
          <View style={styles.legalIconWrap}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.legalRowText}>
              {locale === "en" ? "Privacy & terms" : "Privacidad y términos"}
            </Text>
            <Text style={styles.legalBody}>
              {locale === "en"
                ? `How ${brandName(locale)} uses and protects your data.`
                : `Cómo ${brandName(locale)} usa y protege tus datos.`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
        </Pressable>
      </View>

      <View style={styles.contactBox}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactTitle}>{t.about.contactTitle}</Text>
          <Text style={styles.contactBody}>{t.about.contactBody}</Text>
        </View>
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
    </ScreenScrollView>
  );
}

function TeamCard({
  initials,
  name,
  role,
  bio,
  credentials,
}: {
  initials: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
}) {
  return (
    <View style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={styles.teamAvatar}>
          <Text style={styles.teamInitials}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.teamName}>{name}</Text>
          <Text style={styles.teamRole}>{role}</Text>
        </View>
      </View>
      <Text style={styles.teamBio}>{bio}</Text>
      <View style={styles.credList}>
        {credentials.map((c) => (
          <View key={c} style={styles.credChip}>
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
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  heroLogo: { width: 64, height: 64, resizeMode: "contain", marginBottom: 12 },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroHeadline: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 19,
  },
  heroCta: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  heroCtaText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionEyebrow: {
    marginTop: 16,
    marginBottom: -6,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: Colors.textSecondary,
  },
  sectionTitleCentered: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: "center",
  },
  timeline: { marginBottom: 8 },
  timelineRow: { flexDirection: "row", gap: 12 },
  timelineRail: { width: 28, alignItems: "center" },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineNum: { color: Colors.primary, fontSize: 12, fontWeight: "800" },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    backgroundColor: Colors.border,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  howIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  howTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  howBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  ctaBtnPressed: { backgroundColor: Colors.primaryDark },
  ctaBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.warningSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 14,
    marginBottom: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    lineHeight: 17,
  },
  emptyNews: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    marginBottom: 8,
  },
  emptyNewsIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyNewsText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  newsScroller: { marginHorizontal: -20, marginBottom: 8 },
  newsCarousel: { paddingHorizontal: 20, paddingRight: 20, gap: 12 },
  newsCard: {
    width: 260,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  newsCover: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.background,
  },
  newsCoverEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  newsCardBody: { padding: 14 },
  newsDate: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  newsRead: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
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
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: Colors.background,
  },
  detailHeroEmpty: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  detailDate: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  detailMetaChip: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
  },
  detailBody: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  missionBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 8,
  },
  missionQuoteMark: {
    position: "absolute",
    top: 4,
    left: 12,
    fontSize: 64,
    color: Colors.border,
    fontWeight: "800",
  },
  missionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  teamList: { gap: 12, marginBottom: 8 },
  teamCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  teamHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  teamAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },
  teamInitials: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  teamRole: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  teamBio: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  credList: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  credChip: {
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  credText: { fontSize: 11, fontWeight: "600", color: Colors.textSecondary },
  valuesList: { gap: 10, marginBottom: 8 },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  valueIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  valueDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  legalBox: {
    marginBottom: 16,
    marginTop: 8,
  },
  legalBody: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  legalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  legalRowText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  contactBox: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F1F5F9",
  },
  contactHeader: {
    backgroundColor: "#E2E8F0",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 18,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  contactBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  contactForm: {
    width: "100%",
    alignItems: "stretch",
    padding: 16,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  contactInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.danger,
    fontSize: 13,
    marginBottom: 10,
  },
  contactSuccessTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  contactSuccessBody: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 14,
  },
  contactBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    alignItems: "center",
  },
  contactBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
