import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import {
  SHOULDER_INSTABILITY,
  SHOULDER_PAIN_LOCATION,
  SHOULDER_ROM_LIMIT,
  type ShoulderDetails,
} from "../lib/consulta-shoulder";
import { YES_NO } from "../lib/consulta-symptoms";

type Props = {
  value: ShoulderDetails;
  onChange: (v: ShoulderDetails) => void;
};

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.grid}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.chip, value === opt && styles.chipSelected]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextSelected]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ConsultaShoulderFields({ value, onChange }: Props) {
  const patch = (p: Partial<ShoulderDetails>) => onChange({ ...value, ...p });

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Hombro (preguntas específicas)</Text>

      <ChipGroup
        label="¿Dónde notas más el dolor?"
        options={SHOULDER_PAIN_LOCATION}
        value={value.painLocation}
        onChange={(painLocation) => patch({ painLocation })}
      />

      <ChipGroup
        label="¿Duele al elevar el brazo por encima de la cabeza?"
        options={YES_NO}
        value={value.overheadPain}
        onChange={(overheadPain) => patch({ overheadPain })}
      />

      <ChipGroup
        label="¿Tienes limitación para mover el brazo?"
        options={SHOULDER_ROM_LIMIT}
        value={value.romLimit}
        onChange={(romLimit) => patch({ romLimit })}
      />

      <ChipGroup
        label="¿Notas inestabilidad (sensación de que se sale)?"
        options={SHOULDER_INSTABILITY}
        value={value.instability}
        onChange={(instability) => patch({ instability })}
      />

      <ChipGroup
        label="¿También hay dolor de cuello?"
        options={YES_NO}
        value={value.neckPain}
        onChange={(neckPain) => patch({ neckPain })}
      />

      <ChipGroup
        label="¿Empeora al dormir sobre ese lado?"
        options={YES_NO}
        value={value.nightPainShoulderSide}
        onChange={(nightPainShoulderSide) => patch({ nightPainShoulderSide })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  block: { marginTop: 12 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
    marginBottom: 10,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.surface,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  chipTextSelected: { color: Colors.white, fontWeight: "600" },
});

