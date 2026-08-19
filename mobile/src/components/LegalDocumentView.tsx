import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import {
  getPrivacyPolicy,
  getTermsOfUse,
  legalUiCopy,
  type LegalLocale,
  type LegalSection,
} from "../lib/legal-docs";
import { useI18n } from "../lib/i18n";

type Props = {
  onClose: () => void;
  /** Scroll to terms section when opened from a terms link. */
  initialSection?: "privacy" | "terms";
};

function Sections({ sections }: { sections: LegalSection[] }) {
  return (
    <View style={styles.sections}>
      {sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          {section.paragraphs.map((p) => (
            <Text key={p.slice(0, 40)} style={styles.paragraph}>
              {p}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

/** In-app privacy + terms; language follows the app locale. */
export function LegalDocumentView({
  onClose,
  initialSection = "privacy",
}: Props) {
  const { locale } = useI18n();
  const legalLocale: LegalLocale = locale === "en" ? "en" : "es";
  const ui = legalUiCopy(legalLocale);
  const privacy = getPrivacyPolicy(legalLocale);
  const terms = getTermsOfUse(legalLocale);

  const scrollRef = React.useRef<ScrollView>(null);
  const termsY = React.useRef(0);

  React.useEffect(() => {
    if (initialSection !== "terms") return;
    const t = setTimeout(() => {
      if (termsY.current > 0) {
        scrollRef.current?.scrollTo({ y: termsY.current, animated: true });
      }
    }, 80);
    return () => clearTimeout(t);
  }, [initialSection, legalLocale]);

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={ui.back}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {ui.privacy}
        </Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{ui.kicker}</Text>
        <Text style={styles.title}>{privacy.title}</Text>
        <Text style={styles.intro}>{privacy.intro}</Text>
        <Sections sections={privacy.sections} />

        <View
          style={styles.divider}
          onLayout={(e) => {
            termsY.current = e.nativeEvent.layout.y;
          }}
        />

        <Text style={styles.title}>{terms.title}</Text>
        <Text style={styles.intro}>{terms.intro}</Text>
        <Sections sections={terms.sections} />

        <Text style={styles.footnote}>{ui.footnote}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
  },
  intro: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  sections: { marginTop: 24, gap: 22 },
  section: { gap: 8 },
  heading: { fontSize: 15, fontWeight: "700", color: Colors.text },
  paragraph: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 28,
  },
  footnote: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textLight,
  },
});
