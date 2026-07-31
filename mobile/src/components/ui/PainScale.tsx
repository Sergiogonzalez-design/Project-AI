import React from "react";
import { Pressable, Text, View } from "react-native";
import { Colors } from "../../lib/colors";

/**
 * Redesigned 0-10 pain intensity input. Replaces the plain row of numbered
 * circle buttons with a color-coded (green -> yellow -> orange -> red) scale,
 * emoji anchors, and a prominent readout of the selected value. Built from
 * flex segments (not a native slider) so it always fills the available width
 * and stays fully usable on small phone screens.
 */
const SEGMENT_COLORS = [
  "#10B981",
  "#3FAE72",
  "#84CC16",
  "#A3B31E",
  "#F59E0B",
  "#F2921C",
  "#F97316",
  "#F45F26",
  "#EF4444",
  "#E53535",
  "#DC2626",
];

function colorFor(n: number): string {
  return SEGMENT_COLORS[Math.min(10, Math.max(0, Math.round(n)))];
}

export function PainScale({
  value,
  onChange,
  label,
  locale = "es",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  locale?: "es" | "en";
}) {
  const en = locale === "en";
  const num = Number.isFinite(value) ? Math.min(10, Math.max(0, Math.round(value))) : 5;
  const color = colorFor(num);

  return (
    <View style={{ marginBottom: 18 }}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label ?? (en ? "Pain intensity" : "Intensidad del dolor")}</Text>
        <View style={[styles.readout, { backgroundColor: color }]}>
          <Text style={styles.readoutText}>{num}/10</Text>
        </View>
      </View>

      <View style={styles.scaleRow}>
        <Text style={styles.emoji}>🙂</Text>
        <View style={styles.segments}>
          {Array.from({ length: 11 }, (_, n) => n).map((n) => {
            const selected = n === num;
            return (
              <Pressable
                key={n}
                onPress={() => onChange(n)}
                hitSlop={4}
                style={styles.segmentTouch}
                accessibilityRole="button"
                accessibilityLabel={`${n}/10`}
              >
                <View
                  style={[
                    styles.segmentBar,
                    { backgroundColor: colorFor(n) },
                    selected && styles.segmentBarSelected,
                    selected && { shadowColor: colorFor(n) },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.emoji}>😣</Text>
      </View>

      <View style={styles.captionRow}>
        <Text style={styles.caption}>0 {en ? "no pain" : "sin dolor"}</Text>
        <Text style={styles.caption}>10 {en ? "worst" : "insoportable"}</Text>
      </View>
    </View>
  );
}

const styles = {
  headerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  readout: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  readoutText: { color: Colors.white, fontWeight: "800" as const, fontSize: 13 },
  scaleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  emoji: { fontSize: 18 },
  segments: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    height: 40,
  },
  segmentTouch: {
    flex: 1,
    height: 40,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  segmentBar: {
    width: "100%" as const,
    height: 10,
    borderRadius: 999,
    marginHorizontal: 1,
    opacity: 0.85,
  },
  segmentBarSelected: {
    height: 24,
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
  },
  captionRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 4,
    paddingHorizontal: 24,
  },
  caption: { fontSize: 10, color: Colors.textLight, fontWeight: "500" as const },
};
