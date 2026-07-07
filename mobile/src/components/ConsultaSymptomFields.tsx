import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../lib/colors";
import {
  LATERALITY_OPTIONS,
  PAIN_PATTERN_OPTIONS,
  PROGRESSION_OPTIONS,
  SWELLING_SIGN_OPTIONS,
  TRIED_TREATMENT_OPTIONS,
  TRAINING_IMPACT_OPTIONS,
  WEIGHT_BEARING_OPTIONS,
  YES_NO,
  type ConsultaSymptomDetails,
} from "../lib/consulta-symptoms";

type Props = {
  value: ConsultaSymptomDetails;
  onChange: (v: ConsultaSymptomDetails) => void;
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
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chipGrid}>
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

function MultiChipGroup({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    if (opt === "Ninguno") {
      onChange(values.includes("Ninguno") ? [] : ["Ninguno"]);
      return;
    }
    const withoutNone = values.filter((v) => v !== "Ninguno");
    onChange(
      withoutNone.includes(opt)
        ? withoutNone.filter((v) => v !== opt)
        : [...withoutNone, opt]
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chipGrid}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.chip, values.includes(opt) && styles.chipSelected]}
            onPress={() => toggle(opt)}
          >
            <Text
              style={[styles.chipText, values.includes(opt) && styles.chipTextSelected]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ConsultaSymptomFields({ value, onChange }: Props) {
  function patch(partial: Partial<ConsultaSymptomDetails>) {
    onChange({ ...value, ...partial });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.groupTitle}>Detalles del dolor</Text>

      <ChipGroup
        label="¿El dolor es constante o solo al moverte / entrenar?"
        options={PAIN_PATTERN_OPTIONS}
        value={value.painPattern}
        onChange={(painPattern) => patch({ painPattern })}
      />

      <ChipGroup
        label="¿Puedes apoyar peso o usar esa zona con normalidad?"
        options={WEIGHT_BEARING_OPTIONS}
        value={value.weightBearing}
        onChange={(weightBearing) => patch({ weightBearing })}
      />

      <MultiChipGroup
        label="¿Hay hinchazón, moretón o calor en la zona?"
        options={SWELLING_SIGN_OPTIONS}
        values={value.swellingSigns}
        onChange={(swellingSigns) => patch({ swellingSigns })}
      />

      <ChipGroup
        label="¿Notas hormigueo, entumecimiento o debilidad?"
        options={YES_NO}
        value={value.nerveSymptoms}
        onChange={(nerveSymptoms) =>
          patch({
            nerveSymptoms,
            nerveSymptomsDetail: nerveSymptoms === "No" ? "" : value.nerveSymptomsDetail,
          })
        }
      />
      {value.nerveSymptoms === "Sí" && (
        <TextInput
          style={styles.input}
          placeholder="Describe dónde y qué notas"
          placeholderTextColor={Colors.textLight}
          value={value.nerveSymptomsDetail}
          onChangeText={(nerveSymptomsDetail) => patch({ nerveSymptomsDetail })}
        />
      )}

      <ChipGroup
        label="¿El dolor empeora por la noche o al estar en reposo?"
        options={YES_NO}
        value={value.nightPain}
        onChange={(nightPain) => patch({ nightPain })}
      />

      <ChipGroup
        label="¿Has tenido este mismo dolor antes en esa zona?"
        options={YES_NO}
        value={value.previousSamePain}
        onChange={(previousSamePain) =>
          patch({
            previousSamePain,
            previousSamePainDetail:
              previousSamePain === "No" ? "" : value.previousSamePainDetail,
          })
        }
      />
      {value.previousSamePain === "Sí" && (
        <TextInput
          style={styles.input}
          placeholder="Cuándo aproximadamente (opcional)"
          placeholderTextColor={Colors.textLight}
          value={value.previousSamePainDetail}
          onChangeText={(previousSamePainDetail) => patch({ previousSamePainDetail })}
        />
      )}

      <Text style={styles.sectionLabel}>¿Qué movimiento o actividad lo empeora más?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: al correr, al girar, al levantar el brazo..."
        placeholderTextColor={Colors.textLight}
        value={value.aggravatingMovement}
        onChangeText={(aggravatingMovement) => patch({ aggravatingMovement })}
      />

      <MultiChipGroup
        label="¿Qué has hecho ya?"
        options={TRIED_TREATMENT_OPTIONS}
        values={value.triedTreatments}
        onChange={(triedTreatments) => patch({ triedTreatments })}
      />

      <ChipGroup
        label="¿Ha ido a más, se mantiene igual o empeora?"
        options={PROGRESSION_OPTIONS}
        value={value.progression}
        onChange={(progression) => patch({ progression })}
      />

      <ChipGroup
        label="¿Te impide entrenar o competir?"
        options={TRAINING_IMPACT_OPTIONS}
        value={value.trainingImpact}
        onChange={(trainingImpact) => patch({ trainingImpact })}
      />

      <ChipGroup
        label="¿Dolor en un solo lado o ambos?"
        options={LATERALITY_OPTIONS}
        value={value.laterality}
        onChange={(laterality) => patch({ laterality })}
      />

      <ChipGroup
        label="¿Escuchaste un chasquido o crack en el momento?"
        options={YES_NO}
        value={value.heardPop}
        onChange={(heardPop) => patch({ heardPop })}
      />

      <ChipGroup
        label="¿La zona se bloquea o se traba?"
        options={YES_NO}
        value={value.jointLocking}
        onChange={(jointLocking) => patch({ jointLocking })}
      />

      <ChipGroup
        label="¿El dolor se irradia a otra zona?"
        options={YES_NO}
        value={value.radiatingPain}
        onChange={(radiatingPain) =>
          patch({
            radiatingPain,
            radiatingPainDetail: radiatingPain === "No" ? "" : value.radiatingPainDetail,
          })
        }
      />
      {value.radiatingPain === "Sí" && (
        <TextInput
          style={styles.input}
          placeholder="Hacia dónde se irradia"
          placeholderTextColor={Colors.textLight}
          value={value.radiatingPainDetail}
          onChangeText={(radiatingPainDetail) => patch({ radiatingPainDetail })}
        />
      )}

      <Text style={styles.groupTitle}>Signos de alarma</Text>

      <ChipGroup
        label="¿Fiebre, malestar general o pérdida de peso reciente?"
        options={YES_NO}
        value={value.systemicSymptoms}
        onChange={(systemicSymptoms) => patch({ systemicSymptoms })}
      />

      <ChipGroup
        label="¿Deformidad visible o incapacidad total para mover la zona?"
        options={YES_NO}
        value={value.deformity}
        onChange={(deformity) => patch({ deformity })}
      />

      <ChipGroup
        label="¿Dolor tras un golpe fuerte o caída desde altura?"
        options={YES_NO}
        value={value.severeTrauma}
        onChange={(severeTrauma) => patch({ severeTrauma })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8 },
  groupTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  block: { marginTop: 12 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
});
