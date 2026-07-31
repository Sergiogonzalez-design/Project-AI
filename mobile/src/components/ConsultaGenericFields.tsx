import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  defaultGenericConsultaAnswers,
  GENERIC_FIELD_OPTIONS,
  type GenericConsultaAnswers,
} from "../lib/consulta-generic";
import {
  localizeShoulderOption,
  type ConsultLocale,
} from "../lib/consulta-shoulder-adaptive";
import { Colors } from "../lib/colors";
import { chipStyle, chipTextStyle } from "./ui/chipStyle";
import { PainScale } from "./ui/PainScale";

const GENERIC_LABELS_EN = {
  banner: "Questionnaire to gather details before guidance.",
  urgency: "Urgency check",
  rf_deformidad: "Obvious deformity?",
  rf_fiebre: "Associated fever?",
  rf_perdida_sensibilidad: "Loss of sensation?",
  problem: "Your problem",
  evolucion: "How long have you had this?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Describe the mechanism",
  intensidad: "Pain intensity",
  descripcion: "Additional details (optional)",
  descripcion_ph: "Any extra information…",
} as const;

function ChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  displayOption?: (opt: string) => string;
}) {
  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={chipStyle(value === opt)}
          onPress={() => onChange(opt)}
        >
          <Text style={chipTextStyle(value === opt)}>
            {displayOption ? displayOption(opt) : opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function MultiChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  displayOption?: (opt: string) => string;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={chipStyle(value.includes(opt))}
          onPress={() => toggle(opt)}
        >
          <Text style={chipTextStyle(value.includes(opt))}>
            {displayOption ? displayOption(opt) : opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type Props = {
  value: GenericConsultaAnswers;
  onChange: (v: GenericConsultaAnswers) => void;
  locale?: ConsultLocale;
};

export function ConsultaGenericFields({ value, onChange, locale = "es" }: Props) {
  const a = value ?? defaultGenericConsultaAnswers();
  const patch = (p: Partial<GenericConsultaAnswers>) => onChange({ ...a, ...p });
  const en = locale === "en";
  const L = GENERIC_LABELS_EN;
  const displayOption = (opt: string) => localizeShoulderOption(opt, locale);

  return (
    <View>
      <View style={styles.warnBox}>
        <Text style={styles.warnText}>
          {en
            ? L.banner
            : "Cuestionario para recoger detalles antes de orientación."}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>{en ? L.urgency : "Comprobación de urgencia"}</Text>
      <Text style={styles.label}>{en ? L.rf_deformidad : "¿Deformidad evidente?"}</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_deformidad} onChange={(rf_deformidad) => patch({ rf_deformidad })} displayOption={displayOption} />
      <Text style={styles.label}>{en ? L.rf_fiebre : "¿Fiebre asociada?"}</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_fiebre} onChange={(rf_fiebre) => patch({ rf_fiebre })} displayOption={displayOption} />
      <Text style={styles.label}>{en ? L.rf_perdida_sensibilidad : "¿Pérdida de sensibilidad?"}</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.yesNo} value={a.rf_perdida_sensibilidad} onChange={(rf_perdida_sensibilidad) => patch({ rf_perdida_sensibilidad })} displayOption={displayOption} />

      <Text style={styles.sectionTitle}>{en ? L.problem : "Tu problema"}</Text>
      <Text style={styles.label}>{en ? L.evolucion : "¿Cuánto tiempo llevas con esto?"}</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.evolution} value={a.evolucion} onChange={(evolucion) => patch({ evolucion })} displayOption={displayOption} />
      <Text style={styles.label}>{en ? L.inicio : "¿Cómo fue el inicio?"}</Text>
      <ChipGroup options={GENERIC_FIELD_OPTIONS.onset} value={a.inicio} onChange={(inicio) => patch({ inicio })} displayOption={displayOption} />
      <Text style={styles.label}>{en ? L.mecanismo : "¿Qué pudo provocarlo? (puedes marcar varias)"}</Text>
      <MultiChipGroup options={GENERIC_FIELD_OPTIONS.mechanism} value={a.mecanismo} onChange={(mecanismo) => patch({ mecanismo })} displayOption={displayOption} />
      {a.mecanismo.includes("Otro") && (
        <TextInput
          style={styles.input}
          value={a.mecanismo_otro}
          onChangeText={(mecanismo_otro) => patch({ mecanismo_otro })}
          placeholder={en ? L.mecanismo_otro : "Describe el mecanismo"}
          placeholderTextColor={Colors.textLight}
        />
      )}
      <PainScale
        value={a.intensidad_dolor}
        onChange={(v) => patch({ intensidad_dolor: v })}
        label={en ? L.intensidad : "Intensidad del dolor"}
        locale={locale}
      />
      <Text style={styles.label}>{en ? L.descripcion : "Detalles adicionales (opcional)"}</Text>
      <TextInput
        style={styles.input}
        value={a.descripcion}
        onChangeText={(descripcion) => patch({ descripcion })}
        multiline
        placeholder={en ? L.descripcion_ph : "Cualquier información extra…"}
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
