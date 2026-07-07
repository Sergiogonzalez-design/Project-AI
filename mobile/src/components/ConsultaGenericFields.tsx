import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  defaultGenericConsultaAnswers,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "../lib/consulta-generic";
import { Colors } from "../lib/colors";

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[styles.chip, value === opt && styles.chipSelected]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextSelected]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

type Props = {
  value: GenericConsultaAnswers;
  onChange: (v: GenericConsultaAnswers) => void;
};

export function ConsultaGenericFields({ value, onChange }: Props) {
  const a = value ?? defaultGenericConsultaAnswers();
  const patch = (p: Partial<GenericConsultaAnswers>) => onChange({ ...a, ...p });

  return (
    <View>
      <View style={styles.warnBox}>
        <Text style={styles.warnText}>
          Cuestionario detallado disponible para hombro. Para otras zonas, responde estas preguntas básicas.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Comprobación de urgencia</Text>
      <Text style={styles.label}>¿Deformidad evidente?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_deformidad} onChange={(rf_deformidad) => patch({ rf_deformidad })} />
      <Text style={styles.label}>¿Fiebre asociada?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_fiebre} onChange={(rf_fiebre) => patch({ rf_fiebre })} />
      <Text style={styles.label}>¿Pérdida de sensibilidad?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_perdida_sensibilidad} onChange={(rf_perdida_sensibilidad) => patch({ rf_perdida_sensibilidad })} />

      <Text style={styles.sectionTitle}>Tu problema</Text>
      <Text style={styles.label}>¿Cuánto tiempo llevas con esto?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.evolution} value={a.evolucion} onChange={(evolucion) => patch({ evolucion })} />
      <Text style={styles.label}>¿Cómo fue el inicio?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.onset} value={a.inicio} onChange={(inicio) => patch({ inicio })} />
      <Text style={styles.label}>¿Qué pudo provocarlo?</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.mechanism} value={a.mecanismo} onChange={(mecanismo) => patch({ mecanismo })} />
      {a.mecanismo === "Otro" && (
        <TextInput
          style={styles.input}
          value={a.mecanismo_otro}
          onChangeText={(mecanismo_otro) => patch({ mecanismo_otro })}
          placeholder="Describe el mecanismo"
          placeholderTextColor={Colors.textLight}
        />
      )}
      <Text style={styles.label}>Intensidad del dolor: {a.intensidad_dolor}/10</Text>
      <View style={styles.painRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Pressable
            key={n}
            style={[styles.painChip, a.intensidad_dolor === n && styles.chipSelected]}
            onPress={() => patch({ intensidad_dolor: n })}
          >
            <Text style={[styles.painText, a.intensidad_dolor === n && styles.chipTextSelected]}>{n}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Detalles adicionales (opcional)</Text>
      <TextInput
        style={styles.input}
        value={a.descripcion}
        onChangeText={(descripcion) => patch({ descripcion })}
        multiline
        placeholder="Cualquier información extra…"
        placeholderTextColor={Colors.textLight}
      />
    </View>
  );
}

const styles = {
  warnBox: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  warnText: { fontSize: 13, color: "#92400e" },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, marginBottom: 10, marginTop: 8 },
  label: { fontSize: 14, fontWeight: "600" as const, color: Colors.text, marginBottom: 8 },
  chipGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8, marginBottom: 12 },
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
  painRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 6, marginBottom: 12 },
  painChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  painText: { fontSize: 13, color: Colors.text },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 60,
    marginBottom: 12,
    textAlignVertical: "top" as const,
  },
};
