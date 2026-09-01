import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import { chipStyle, chipTextStyle } from "./ui/chipStyle";
import { Colors } from "../lib/colors";
import {
  formatFunctionalTestAnswers,
  type FunctionalTestAnswer,
  type FunctionalTestItem,
} from "../lib/functional-test-answers";
import {
  resolveFunctionalTestMedia,
  stripFunctionalMediaMarker,
} from "../lib/functional-test-media";

type Props = {
  tests: FunctionalTestItem[];
  language?: "es" | "en";
  disabled?: boolean;
  onSubmit: (text: string) => void;
};

export function FunctionalTestYesNo({
  tests,
  language = "es",
  disabled,
  onSubmit,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, FunctionalTestAnswer>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const shown = new Set<string>();
  const complete = tests.every((t) => answers[t.n]);
  const yes = language === "en" ? "Yes" : "Sí";
  const no = language === "en" ? "No" : "No";
  const hint =
    language === "en"
      ? "Do each test, then tap Yes or No."
      : "Haz cada prueba y pulsa Sí o No.";
  const send = language === "en" ? "Send answers" : "Enviar respuestas";

  function choose(n: number, value: FunctionalTestAnswer) {
    if (disabled || sent) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>{hint}</Text>
      {tests.map((test) => {
        const prompt = stripFunctionalMediaMarker(test.prompt);
        const media = resolveFunctionalTestMedia({ prompt: test.prompt });
        const showMedia = media && !shown.has(media.id) ? media : null;
        if (showMedia) shown.add(showMedia.id);
        return (
          <View key={test.n} style={styles.item}>
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
          </View>
        );
      })}
      {complete ? (
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10, gap: 14 },
  hint: { fontSize: 12, lineHeight: 16, color: Colors.textLight },
  item: { gap: 8 },
  prompt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: Colors.primary,
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
