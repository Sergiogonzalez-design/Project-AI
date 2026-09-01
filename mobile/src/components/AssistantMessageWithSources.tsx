import React, { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { extractCitedSources, type CitedSource } from "../lib/source-links";

type Props = {
  content: string;
  renderBody: (body: string) => React.ReactNode;
};

function SourceItem({ source }: { source: CitedSource }) {
  if (!source.href) {
    return <Text style={styles.sourcePlain}>• {source.title}</Text>;
  }

  return (
    <Pressable onPress={() => void Linking.openURL(source.href!)}>
      <Text style={styles.sourceLink}>• {source.title}</Text>
    </Pressable>
  );
}

export function AssistantMessageWithSources({ content, renderBody }: Props) {
  const { body, sources, heading } = useMemo(
    () => extractCitedSources(content),
    [content]
  );
  const [open, setOpen] = useState(false);

  return (
    <>
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
                <SourceItem key={source.title} source={source} />
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </>
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
    gap: 8,
  },
  sourceLink: {
    color: Colors.primary,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: "underline",
  },
  sourcePlain: {
    color: Colors.text,
    fontSize: 12,
    lineHeight: 16,
  },
});
