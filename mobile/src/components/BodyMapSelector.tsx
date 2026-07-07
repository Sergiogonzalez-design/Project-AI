import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  BODY_MAP_REGIONS,
  bodyMapRegionLabel,
  toggleBodyMapRegion,
  type BodyMapRegionId,
  type BodyMapSelection,
} from "../lib/body-map";
import { Colors } from "../lib/colors";

type Props = {
  value: BodyMapSelection;
  onChange: (v: BodyMapSelection) => void;
};

export function BodyMapSelector({ value, onChange }: Props) {
  function toggle(id: BodyMapRegionId) {
    onChange(toggleBodyMapRegion(value, id));
  }

  return (
    <View>
      <Text style={styles.hint}>Toca las zonas donde sientes dolor (puedes marcar varias):</Text>
      <View style={styles.grid}>
        {BODY_MAP_REGIONS.map((region) => {
          const selected = value.regionIds.includes(region.id);
          return (
            <Pressable
              key={region.id}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggle(region.id)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {region.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {value.regionIds.length > 0 && (
        <View style={styles.selectedRow}>
          {value.regionIds.map((id) => (
            <Pressable key={id} style={styles.selectedChip} onPress={() => toggle(id)}>
              <Text style={styles.selectedChipText}>{bodyMapRegionLabel(id)} ✕</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = {
  hint: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text },
  chipTextSelected: { color: Colors.white, fontWeight: "600" as const },
  selectedRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 6, marginTop: 12 },
  selectedChip: {
    backgroundColor: "#dbeafe",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedChipText: { fontSize: 12, color: "#1e40af" },
};
