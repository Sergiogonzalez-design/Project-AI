import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import { FadeInView } from "./ui/FadeInView";
import { chipStyle, chipTextStyle } from "./ui/chipStyle";
import { Colors } from "../lib/colors";
import {
  formatFunctionalTestAnswers,
  type FunctionalTestAnswer,
  type FunctionalTestItem,
} from "../lib/functional-test-answers";
import {
  functionalTestProgressLabel,
  functionalTestStaggerDelayMs,
  FUNCTIONAL_TEST_HINT_DELAY_MS,
} from "../lib/functional-test-reveal";
import {
  resolveFunctionalTestMedia,
  stripFunctionalMediaMarker,
} from "../lib/functional-test-media";

type Props = {
  tests: FunctionalTestItem[];
  language?: "es" | "en";
  disabled?: boolean;
  ready?: boolean;
  onSubmit: (text: string) => void;
  onStaggerTick?: () => void;
  onStaggerComplete?: () => void;
};

export function FunctionalTestYesNo({
  tests,
  language = "es",
  disabled,
  ready = true,
  onSubmit,
  onStaggerTick,
  onStaggerComplete,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, FunctionalTestAnswer>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const onStaggerTickRef = useRef(onStaggerTick);
  const onStaggerCompleteRef = useRef(onStaggerComplete);
  onStaggerTickRef.current = onStaggerTick;
  onStaggerCompleteRef.current = onStaggerComplete;
  const shown = new Set<string>();
  const allRevealed = revealedCount >= tests.length;
  const complete = tests.every((t) => answers[t.n]);
  const yes = language === "en" ? "Yes" : "Sí";
  const no = language === "en" ? "No" : "No";
  const hint =
    language === "en"
      ? "Do each test at home, then tap Yes or No."
      : "Haz cada prueba en casa y pulsa Sí o No.";
  const send = language === "en" ? "Send answers" : "Enviar respuestas";

  const testKey = tests.map((t) => `${t.n}:${t.prompt}`).join("|");

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(Boolean(enabled));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || tests.length === 0) {
      setShowHint(false);
      setRevealedCount(0);
      return;
    }

    if (reduceMotion) {
      setShowHint(true);
      setRevealedCount(tests.length);
      onStaggerCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    setShowHint(false);
    setRevealedCount(0);

    timers.push(
      setTimeout(() => {
        if (!cancelled) setShowHint(true);
      }, FUNCTIONAL_TEST_HINT_DELAY_MS)
    );

    tests.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          const count = index + 1;
          setRevealedCount(count);
          onStaggerTickRef.current?.();
          if (count >= tests.length) onStaggerCompleteRef.current?.();
        }, functionalTestStaggerDelayMs(index))
      );
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // Callbacks are read via refs so parent scroll handlers cannot reset stagger.
  }, [ready, testKey, tests.length, reduceMotion]);

  function choose(n: number, value: FunctionalTestAnswer) {
    if (disabled || sent) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }

  if (!ready) return null;

  const visibleTests = tests.slice(0, revealedCount);

  return (
    <View style={styles.wrap}>
      {showHint ? (
        <FadeInView>
          <Text style={styles.hint}>{hint}</Text>
        </FadeInView>
      ) : null}
      {showHint && revealedCount > 0 && tests.length > 1 ? (
        <FadeInView style={styles.progressWrap}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {functionalTestProgressLabel(revealedCount, tests.length, language)}
            </Text>
            <Text style={styles.progressPct}>
              {Math.round((revealedCount / tests.length) * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(revealedCount / tests.length) * 100}%` },
              ]}
            />
          </View>
        </FadeInView>
      ) : null}
      {visibleTests.map((test) => {
        const prompt = stripFunctionalMediaMarker(test.prompt);
        const media = resolveFunctionalTestMedia({ prompt: test.prompt });
        const showMedia = media && !shown.has(media.id) ? media : null;
        if (showMedia) shown.add(media.id);
        return (
          <FadeInView key={test.n} style={styles.item}>
            <Text style={styles.prompt}>
              {test.n}. {prompt}
            </Text>
            {showMedia ? <ClinicalTestMediaBlock test={showMedia} /> : null}
            <View style={styles.row}>
              <Pressable
                disabled={disabled || sent}
                onPress={() => choose(test.n, "si")}
                style={chipStyle(answers[test.n] === "si")}
              >
                <Text style={chipTextStyle(answers[test.n] === "si")}>{yes}</Text>
              </Pressable>
              <Pressable
                disabled={disabled || sent}
                onPress={() => choose(test.n, "no")}
                style={chipStyle(answers[test.n] === "no")}
              >
                <Text style={chipTextStyle(answers[test.n] === "no")}>{no}</Text>
              </Pressable>
            </View>
          </FadeInView>
        );
      })}
      {allRevealed && complete ? (
        <FadeInView>
          <Pressable
            disabled={disabled || sent}
            onPress={() => {
              if (sent) return;
              setSent(true);
              onSubmit(formatFunctionalTestAnswers(tests, answers, language));
            }}
            style={[styles.send, (disabled || sent) && { opacity: 0.5 }]}
          >
            <Text style={styles.sendText}>{send}</Text>
          </Pressable>
        </FadeInView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10, gap: 14 },
  hint: { fontSize: 12, lineHeight: 16, color: Colors.textLight },
  progressWrap: { gap: 6 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Colors.textLight,
  },
  progressPct: { fontSize: 11, color: Colors.textLight },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  item: { gap: 8 },
  prompt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.primary,
    flexShrink: 1,
  },
  row: { flexDirection: "row", gap: 8 },
  send: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
