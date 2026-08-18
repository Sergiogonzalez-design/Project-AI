import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import {
  clinicalTestRegionIdsForHeading,
  isClinicalRegionSectionLabel,
  leftoverIllustratedTests,
  nextIllustratedFallbackTest,
  shouldShowClinicalTestImage,
  type ClinicalTestImage,
} from "../lib/clinical-test-images";
import { Colors } from "../lib/colors";

function stripMarkdownStars(text: string) {
  return text
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
    .replace(/\*/g, "");
}

function parseNumberedLine(
  text: string
): { title: string; body: string | null } | null {
  const plain = stripMarkdownStars(text.trim().replace(/^\*\s+/, "• "));
  if (!/^\d+[.)]\s+\S/.test(plain)) return null;
  const withColon = /^(\d+[.)]\s+[^:]+):\s+(.+)$/.exec(plain);
  if (withColon) {
    return { title: `${withColon[1]}:`, body: withColon[2] };
  }
  const withParen = /^(\d+[.)]\s+.+?)\s+(\([^)]{12,}\)\.?)\s*$/.exec(plain);
  if (withParen) {
    return { title: withParen[1].trim(), body: withParen[2] };
  }
  return { title: plain, body: null };
}

function isShortSectionTitle(text: string): boolean {
  const plain = stripMarkdownStars(text).trim();
  if (!plain || plain.length > 60) return false;
  if ((plain.match(/,/g) ?? []).length >= 2) return false;
  return true;
}

type Props = {
  text: string;
  /** Catalog tests for the zone when the model invents generic names. */
  fallbackTests?: ClinicalTestImage[];
};

function leftoverMedia(test: ClinicalTestImage, key: string) {
  return (
    <View key={key} style={styles.lineGapLg}>
      <Text style={styles.headingBlue}>{test.title}</Text>
      <ClinicalTestMediaBlock test={test} />
    </View>
  );
}

/** Physio clinical chat body with numbered tests + video/illustration media. */
export function PhysioAssistantBody({ text, fallbackTests = [] }: Props) {
  const shownTestIds = new Set<string>();
  let currentRegionIds: readonly string[] | null = null;
  const nodes: React.ReactNode[] = [];

  function pushLeftovers(
    regionIds: readonly string[] | null,
    keyPrefix: string
  ) {
    leftoverIllustratedTests(fallbackTests, shownTestIds, regionIds).forEach(
      (t) => {
        shownTestIds.add(t.id);
        nodes.push(leftoverMedia(t, `${keyPrefix}-${t.id}`));
      }
    );
  }

  text.split("\n").forEach((line, li) => {
    const trimmed = line.trim().replace(/^\*\s+/, "• ");
    if (
      /^Fuente:/i.test(trimmed) ||
      /^- Fuente:/i.test(trimmed) ||
      /^Source:/i.test(trimmed) ||
      /^- Source:/i.test(trimmed)
    ) {
      return;
    }
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
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

    const headingCandidate = !numberedText
      ? (headingText ??
        wholeBoldMatch?.[1] ??
        (isClinicalRegionSectionLabel(trimmed)
          ? stripMarkdownStars(trimmed)
          : null))
      : null;
    if (headingCandidate) {
      const nextIds = clinicalTestRegionIdsForHeading(headingCandidate);
      if (nextIds && nextIds.join(",") !== currentRegionIds?.join(",")) {
        if (currentRegionIds) {
          pushLeftovers(currentRegionIds, `flush-${li}`);
        }
        currentRegionIds = nextIds;
      }
    }

    const matched = shouldShowClinicalTestImage({
      numberedText,
      headingText,
      wholeBoldText: wholeBoldMatch?.[1] ?? null,
    });
    let showTest =
      matched && !shownTestIds.has(matched.id) ? matched : null;
    if (
      showTest &&
      currentRegionIds &&
      !currentRegionIds.includes(showTest.id)
    ) {
      showTest = null;
    }
    if (showTest) shownTestIds.add(showTest.id);
    if (!showTest && numberedText && currentRegionIds) {
      showTest = nextIllustratedFallbackTest(
        fallbackTests,
        shownTestIds,
        currentRegionIds
      );
      if (showTest) shownTestIds.add(showTest.id);
    }

    const mediaBlock = showTest ? (
      <ClinicalTestMediaBlock test={showTest} />
    ) : null;

    if (numberedText) {
      const parsed = parseNumberedLine(trimmed) ?? {
        title: stripMarkdownStars(numberedText),
        body: null,
      };
      const displayTitle = showTest
        ? parsed.title.replace(
            /^(\d+[.)]\s+)[^:]+(:?)/,
            `$1${showTest.title}$2`
          )
        : parsed.title;
      nodes.push(
        <View key={li} style={li > 0 ? styles.lineGapLg : undefined}>
          <Text style={styles.body}>
            <Text style={styles.headingBlue}>{displayTitle}</Text>
            {parsed.body ? (
              <Text style={styles.body}> {parsed.body}</Text>
            ) : null}
          </Text>
          {mediaBlock}
        </View>
      );
      return;
    }

    if (wholeBoldMatch && !numberedText) {
      const title = stripMarkdownStars(wholeBoldMatch[1]);
      nodes.push(
        <View key={li} style={li > 0 ? styles.lineGapLg : undefined}>
          <Text
            style={
              isShortSectionTitle(title) ? styles.headingBlue : styles.subtitleBlack
            }
          >
            {title}
          </Text>
          {mediaBlock}
        </View>
      );
      return;
    }

    if (headingText) {
      const title = stripMarkdownStars(headingText);
      nodes.push(
        <View key={li} style={li > 0 ? styles.lineGapLg : undefined}>
          <Text
            style={
              isShortSectionTitle(title) ? styles.headingBlue : styles.subtitleBlack
            }
          >
            {title}
          </Text>
          {mediaBlock}
        </View>
      );
      return;
    }

    const regionLabel = isClinicalRegionSectionLabel(trimmed)
      ? stripMarkdownStars(trimmed)
      : null;
    if (regionLabel && isShortSectionTitle(regionLabel)) {
      nodes.push(
        <View key={li} style={li > 0 ? styles.lineGapLg : undefined}>
          <Text style={styles.headingBlue}>{regionLabel}</Text>
          {mediaBlock}
        </View>
      );
      return;
    }

    nodes.push(
      <View key={li} style={li > 0 ? styles.lineGap : undefined}>
        <Text style={styles.body}>
          {trimmed.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <Text key={i} style={styles.subtitleBlack}>
                {stripMarkdownStars(part.slice(2, -2))}
              </Text>
            ) : (
              <Text key={i}>{stripMarkdownStars(part)}</Text>
            )
          )}
        </Text>
        {mediaBlock}
      </View>
    );
  });

  pushLeftovers(currentRegionIds, "end-region");
  leftoverIllustratedTests(fallbackTests, shownTestIds, null).forEach((t) => {
    shownTestIds.add(t.id);
    nodes.push(leftoverMedia(t, `end-all-${t.id}`));
  });

  return <View>{nodes}</View>;
}

const styles = StyleSheet.create({
  body: { fontSize: 14, lineHeight: 20, color: Colors.text },
  headingBlue: {
    fontWeight: "700",
    color: Colors.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  subtitleBlack: { fontWeight: "700", color: Colors.text },
  lineGap: { marginTop: 8 },
  lineGapLg: { marginTop: 12 },
});
