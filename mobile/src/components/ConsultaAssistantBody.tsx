import { shouldShowClinicalTestImage } from "../lib/clinical-test-images";
import { StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";

function stripMarkdownStars(text: string) {
  return text
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
    .replace(/\*/g, "");
}

function renderInlineBold(text: string, style?: object, boldStyle?: object) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <Text key={i} style={boldStyle}>
        {part.slice(2, -2)}
      </Text>
    ) : (
      <Text key={i} style={style}>
        {part}
      </Text>
    )
  );
}

type Props = {
  text: string;
  style?: object;
  boldStyle?: object;
};

/** Renders consulta assistant text with functional-test illustrations when matched. */
export function ConsultaAssistantBody({ text, style, boldStyle }: Props) {
  const shownTestIds = new Set<string>();
  const lines = text.split("\n");

  return (
    <View>
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
                <Text style={boldStyle}>{withBody ? `${withBody[1]}:` : plain}</Text>
                {withBody ? ` ${withBody[2]}` : null}
              </Text>
              {mediaBlock}
            </View>
          );
        }

        return (
          <View key={li} style={li > 0 ? styles.lineGap : undefined}>
            <Text style={style}>{renderInlineBold(trimmed, style, boldStyle)}</Text>
            {mediaBlock}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  lineGap: { marginTop: 8 },
  lineGapLg: { marginTop: 12 },
});
