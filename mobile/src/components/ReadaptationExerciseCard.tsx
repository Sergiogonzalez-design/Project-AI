import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getReadaptExerciseById } from "../lib/readaptation-exercise-catalog";
import { READAPT_PHASE_LABELS } from "../lib/readaptation-types";
import type { ConsultReadaptExerciseLink } from "../lib/consult-readaptation";

type Props = {
  link: ConsultReadaptExerciseLink;
  language?: "es" | "en";
};

export function ReadaptationExerciseCard({ link, language = "es" }: Props) {
  const [open, setOpen] = useState(false);
  const ex = getReadaptExerciseById(link.id);
  const phaseLabel = ex
    ? language === "en"
      ? READAPT_PHASE_LABELS[ex.phase].en
      : READAPT_PHASE_LABELS[ex.phase].es
    : null;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${link.label}. ${open ? "Ocultar" : "Ver"} instrucciones`}
      >
        <Text style={styles.title}>{link.label}</Text>
        {link.meta ? (
          <Text style={styles.meta}>{link.meta}</Text>
        ) : phaseLabel ? (
          <Text style={styles.meta}>{phaseLabel}</Text>
        ) : (
          <Text style={styles.meta}>
            {language === "en" ? "Tap for instructions" : "Toca para ver instrucciones"}
          </Text>
        )}
        <Text style={styles.toggle}>
          {open
            ? language === "en"
              ? "Hide details ▲"
              : "Ocultar detalle ▲"
            : language === "en"
              ? "Show how-to ▼"
              : "Ver cómo hacerlo ▼"}
        </Text>
      </Pressable>
      {open && ex ? (
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "How to: " : "Cómo hacerlo: "}
            </Text>
            {language === "en" ? ex.instructionsEn : ex.instructionsEs}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "Dose: " : "Dosis: "}
            </Text>
            {language === "en" ? ex.dosageEn : ex.dosageEs}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "Progression: " : "Progresión: "}
            </Text>
            {language === "en" ? ex.progressionEn : ex.progressionEs}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "Regression: " : "Regresión: "}
            </Text>
            {language === "en" ? ex.regressionEn : ex.regressionEs}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "Avoid if: " : "Evitar si: "}
            </Text>
            {language === "en"
              ? ex.contraindicationsEn
              : ex.contraindicationsEs}
          </Text>
          <Text style={styles.evidence}>
            <Text style={styles.bodyLabel}>
              {language === "en" ? "Evidence: " : "Evidencia: "}
            </Text>
            {language === "en" ? ex.evidenceEn : ex.evidenceEs}
          </Text>
        </View>
      ) : open ? (
        <View style={styles.body}>
          <Text style={styles.evidence}>
            {language === "en"
              ? "No detailed card in catalog. Follow the line above and ask your physiotherapist if unsure."
              : "Sin ficha en catálogo. Sigue la línea anterior y consulta a tu fisioterapeuta si tienes dudas."}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    backgroundColor: "rgba(236, 253, 245, 0.9)",
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerPressed: {
    backgroundColor: "rgba(167, 243, 208, 0.35)",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#064e3b",
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(6, 78, 59, 0.75)",
  },
  toggle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(6, 78, 59, 0.55)",
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 243, 208, 0.8)",
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#262626",
  },
  bodyLabel: {
    fontWeight: "600",
    color: "#064e3b",
  },
  evidence: {
    fontSize: 12,
    lineHeight: 17,
    color: "#525252",
  },
});
