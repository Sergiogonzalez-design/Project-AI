import React from "react";
import { shouldShowClinicalTestImage } from "../lib/clinical-test-images";
import { parseClinicCentroFromLine } from "../lib/consult-clinic-links";
import { parseReadaptExerciseFromLine } from "../lib/consult-readaptation";
import { ReadaptationExerciseCard } from "./ReadaptationExerciseCard";
import { stripVisibleMarkup } from "../lib/strip-visible-markup";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import { Colors } from "../lib/colors";

function stripMarkdownStars(text: string) {
  return stripVisibleMarkup(text);
}

function splitHighlightParts(text: string, phrases?: string[]) {
  if (!text || !phrases?.length) return [{ text, highlight: false }];
  const present = phrases.filter(
    (p) => p.length >= 3 && text.toLowerCase().includes(p.toLowerCase())
  );
  if (present.length === 0) return [{ text, highlight: false }];
  const escaped = present.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).filter(Boolean).map((part) => ({
    text: part,
    highlight: present.some((p) => p.toLowerCase() === part.toLowerCase()),
  }));
}

function renderHighlighted(
  text: string,
  style: object | undefined,
  highlightPhrases: string[] | undefined,
  highlightStyle: object | undefined,
  keyPrefix: string
) {
  const parts = splitHighlightParts(text, highlightPhrases);
  if (parts.length === 1 && !parts[0].highlight) {
    return parts[0].text;
  }
  return parts.map((part, i) => (
    <Text
      key={`${keyPrefix}-${i}`}
      style={part.highlight ? highlightStyle ?? style : undefined}
    >
      {part.text}
    </Text>
  ));
}

function renderInlineBold(
  text: string,
  style?: object,
  boldStyle?: object,
  highlightPhrases?: string[],
  highlightStyle?: object
) {
  // Always strip # / * from plain lines (previously skipped when no **).
  if (!text.includes("**")) {
    return renderHighlighted(
      stripVisibleMarkup(text),
      style,
      highlightPhrases,
      highlightStyle,
      "t"
    );
  }
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (!part) return null;
    const isBold = part.startsWith("**") && part.endsWith("**");
    const plain = stripVisibleMarkup(isBold ? part.slice(2, -2) : part);
    if (!plain) return null;
    if (isBold) {
      return (
        <Text key={`b${i}`} style={boldStyle}>
          {renderHighlighted(plain, boldStyle, highlightPhrases, highlightStyle, `b${i}`)}
        </Text>
      );
    }
    return (
      <React.Fragment key={`t${i}`}>
        {renderHighlighted(plain, style, highlightPhrases, highlightStyle, `t${i}`)}
      </React.Fragment>
    );
  });
}

type Props = {
  text: string;
  style?: object;
  boldStyle?: object;
  highlightPhrases?: string[];
  highlightStyle?: object;
  /** Opens Buscar → clinic profile for `/centro/{slug}` lines. Hospitals have no slug. */
  onClinicPress?: (slug: string) => void;
};

/** Renders consulta assistant text with functional-test illustrations when matched. */
export function ConsultaAssistantBody({
  text,
  style,
  boldStyle,
  highlightPhrases,
  highlightStyle,
  onClinicPress,
}: Props) {
  const shownTestIds = new Set<string>();
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (
          /^Fuente:/i.test(trimmed) ||
          /^- Fuente:/i.test(trimmed) ||
          /^Source:/i.test(trimmed) ||
          /^- Source:/i.test(trimmed)
        ) {
          return null;
        }

        const clinicLink = parseClinicCentroFromLine(trimmed);
        if (clinicLink) {
          return (
            <Pressable
              key={li}
              onPress={() => onClinicPress?.(clinicLink.slug)}
              disabled={!onClinicPress}
              style={({ pressed }) => [
                styles.clinicBtn,
                li > 0 ? styles.lineGap : undefined,
                pressed && onClinicPress ? styles.clinicBtnPressed : null,
                !onClinicPress ? styles.clinicBtnDisabled : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${clinicLink.label}. Ver ficha de la clínica`}
            >
              <Text style={styles.clinicBtnTitle}>{clinicLink.label}</Text>
              <Text style={styles.clinicBtnMeta}>
                {clinicLink.meta || "Ver ficha en Buscar"}
              </Text>
            </Pressable>
          );
        }

        const readaptLink = parseReadaptExerciseFromLine(trimmed);
        if (readaptLink) {
          return (
            <View key={li} style={li > 0 ? styles.lineGap : undefined}>
              <ReadaptationExerciseCard link={readaptLink} />
            </View>
          );
        }

        const headingMatch = /^(#{1,6})\s*(.+)$/.exec(trimmed);
        const headingText = headingMatch?.[2] ?? null;
        const wholeBoldMatch = /^\*\*(.+)\*\*$/.exec(trimmed);
        const numberedText =
          headingText && /^\d+[.)]\s+\S/.test(headingText)
            ? headingText
            : wholeBoldMatch && /^\d+[.)]\s+\S/.test(wholeBoldMatch[1])
              ? wholeBoldMatch[1]
              : /^\d+[.)]\s+\S/.test(stripMarkdownStars(trimmed))
                ? stripMarkdownStars(trimmed)
                : null;

        const testImage = shouldShowClinicalTestImage({
          numberedText,
          headingText,
          wholeBoldText: wholeBoldMatch?.[1] ?? null,
        });
        const showImage =
          testImage && !shownTestIds.has(testImage.id) ? testImage : null;
        if (showImage) shownTestIds.add(showImage.id);

        const mediaBlock = showImage ? (
          <ClinicalTestMediaBlock test={showImage} />
        ) : null;

        if (numberedText) {
          const plain = stripMarkdownStars(trimmed);
          const withBody = /^(\d+[.)]\s+[^:]+):\s+(.+)$/.exec(plain);
          return (
            <View key={li} style={li > 0 ? styles.lineGapLg : undefined}>
              <Text style={style}>
                <Text style={boldStyle}>
                  {withBody ? `${withBody[1]}:` : plain}
                </Text>
                {withBody ? (
                  <Text style={style}>{` ${withBody[2]}`}</Text>
                ) : null}
              </Text>
              {mediaBlock}
            </View>
          );
        }

        // Keep plain lines as a single Text so words wrap naturally inside the bubble.
        if (!mediaBlock) {
          return (
            <Text key={li} style={[style, li > 0 ? styles.lineGapText : undefined]}>
              {renderInlineBold(
                trimmed,
                style,
                boldStyle,
                highlightPhrases,
                highlightStyle
              )}
            </Text>
          );
        }

        return (
          <View key={li} style={li > 0 ? styles.lineGap : undefined}>
            <Text style={style}>
              {renderInlineBold(
                trimmed,
                style,
                boldStyle,
                highlightPhrases,
                highlightStyle
              )}
            </Text>
            {mediaBlock}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  lineGap: { marginTop: 8 },
  lineGapLg: { marginTop: 12 },
  lineGapText: { marginTop: 8 },
  clinicBtn: {
    alignSelf: "stretch",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clinicBtnPressed: { opacity: 0.88, backgroundColor: "#dbeafe" },
  clinicBtnDisabled: { opacity: 0.95 },
  clinicBtnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  clinicBtnMeta: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "#1d4ed8",
    opacity: 0.85,
  },
});
