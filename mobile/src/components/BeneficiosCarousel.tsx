import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";

type Benefit = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const BENEFIT_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "flash-outline",
  "time-outline",
  "heart-outline",
  "person-outline",
  "clipboard-outline",
];

const ROTATION_MS = 10000;
const CARD_HEIGHT = 260;

export function BeneficiosCarousel() {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const indexRef = useRef(0);
  const transitioningRef = useRef(false);

  const benefits: Benefit[] = [
    {
      icon: BENEFIT_ICONS[0],
      title: t.about.benefit1Title,
      description: t.about.benefit1Body,
    },
    {
      icon: BENEFIT_ICONS[1],
      title: t.about.benefit2Title,
      description: t.about.benefit2Body,
    },
    {
      icon: BENEFIT_ICONS[2],
      title: t.about.benefit3Title,
      description: t.about.benefit3Body,
    },
    {
      icon: BENEFIT_ICONS[3],
      title: t.about.benefit4Title,
      description: t.about.benefit4Body,
    },
    {
      icon: BENEFIT_ICONS[4],
      title: t.about.benefit5Title,
      description: t.about.benefit5Body,
    },
  ];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === indexRef.current || transitioningRef.current) return;

      transitioningRef.current = true;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        indexRef.current = nextIndex;
        setIndex(nextIndex);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          transitioningRef.current = false;
        });
      });
    },
    [fadeAnim],
  );

  const goNext = useCallback(() => {
    goTo((indexRef.current + 1) % benefits.length);
    setTimerKey((k) => k + 1);
  }, [goTo, benefits.length]);

  const goPrev = useCallback(() => {
    goTo((indexRef.current - 1 + benefits.length) % benefits.length);
    setTimerKey((k) => k + 1);
  }, [goTo, benefits.length]);

  const goToDot = useCallback(
    (i: number) => {
      goTo(i);
      setTimerKey((k) => k + 1);
    },
    [goTo],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((indexRef.current + 1) % benefits.length);
    }, ROTATION_MS);

    return () => clearInterval(interval);
  }, [goTo, timerKey, benefits.length]);

  // Reset carousel index when language changes
  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    fadeAnim.setValue(1);
  }, [t.about.benefit1Title, fadeAnim]);

  const benefit = benefits[index] ?? benefits[0];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t.about.benefits}</Text>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.cardGlow} />
        <View style={styles.iconWrap}>
          <Ionicons name={benefit.icon} size={32} color={Colors.white} />
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {benefit.title}
        </Text>
        <Text style={styles.cardBody} numberOfLines={5}>
          {benefit.description}
        </Text>
      </Animated.View>

      <View style={styles.controls}>
        <Pressable
          onPress={goPrev}
          style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
          accessibilityLabel={
            locale === "en" ? "Previous benefit" : "Beneficio anterior"
          }
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </Pressable>

        <View style={styles.dots}>
          {benefits.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goToDot(i)}
              style={styles.dotHit}
              accessibilityLabel={
                locale === "en" ? `Benefit ${i + 1}` : `Beneficio ${i + 1}`
              }
              hitSlop={6}
            >
              <View style={[styles.dot, i === index && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={goNext}
          style={({ pressed }) => [styles.navBtn, pressed && styles.navBtnPressed]}
          accessibilityLabel={
            locale === "en" ? "Next benefit" : "Siguiente beneficio"
          }
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#3B82F6",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    height: CARD_HEIGHT,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 10,
    lineHeight: 24,
  },
  cardBody: {
    fontSize: 15,
    color: "#BFDBFE",
    lineHeight: 22,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    gap: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  navBtnPressed: {
    opacity: 0.7,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dotHit: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 18,
  },
});
