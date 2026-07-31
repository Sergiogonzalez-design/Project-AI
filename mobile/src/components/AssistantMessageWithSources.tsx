import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";

function parseSourcesBlock(content: string): {
  body: string;
  sources: string[];
  heading: string;
} {
  const lines = content.split("\n");
  let headingIndex = -1;
  let heading = "Fuentes consultadas";

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim().replace(/\*/g, "");
    if (
      /^Fuentes consultadas$/i.test(trimmed) ||
      /^Sources consulted$/i.test(trimmed)
    ) {
      headingIndex = i;
      heading = /sources consulted/i.test(trimmed)
        ? "Sources consulted"
        : "Fuentes consultadas";
      break;
    }
  }

  if (headingIndex === -1) {
    return { body: content, sources: [], heading };
  }

  const body = lines.slice(0, headingIndex).join("\n").trimEnd();
  const sources: string[] = [];
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (/^Fuente:/i.test(trimmed) || /^- Fuente:/i.test(trimmed)) continue;
    if (/^Source:/i.test(trimmed) || /^- Source:/i.test(trimmed)) continue;
    const bullet = trimmed.replace(/^[-•*]\s+/, "").trim();
    if (bullet) sources.push(bullet);
  }

  return { body, sources, heading };
}

type Props = {
  content: string;
  renderBody: (body: string) => React.ReactNode;
};

export function AssistantMessageWithSources({ content, renderBody }: Props) {
  const { body, sources, heading } = useMemo(
    () => parseSourcesBlock(content),
    [content]
  );
  const [open, setOpen] = useState(false);

  return (
    <View>
      {renderBody(body)}
      {sources.length > 0 ? (
        <View style={styles.wrap}>
          <Pressable
            onPress={() => setOpen((v) => !v)}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>{heading}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{sources.length}</Text>
            </View>
          </Pressable>
          {open ? (
            <View style={styles.list}>
              {sources.map((source) => (
                <Text key={source} style={styles.sourceItem}>
                  • {source}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10 },
  btn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.borderStrong,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnPressed: { opacity: 0.85 },
  btnText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: "700" },
  list: {
    marginTop: 8,
    backgroundColor: Colors.primarySoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  sourceItem: {
    color: Colors.primary,
    fontSize: 12,
    lineHeight: 16,
  },
});
