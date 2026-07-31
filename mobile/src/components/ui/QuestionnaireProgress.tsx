import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../lib/colors";

/**
 * Highly visible assessment progress indicator shown at the top of every
 * body-part questionnaire. Shows current step, remaining steps and a
 * percentage-filled bar so users always know where they stand.
 */
export function QuestionnaireProgress({
  stepIndex,
  totalSteps,
  locale = "es",
}: {
  stepIndex: number;
  totalSteps: number;
  locale?: "es" | "en";
}) {
  const current = Math.min(stepIndex + 1, Math.max(totalSteps, 1));
  const pct = totalSteps > 0 ? Math.round((current / totalSteps) * 100) : 0;
  const remaining = Math.max(totalSteps - current, 0);
  const en = locale === "en";

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>{en ? "Assessment progress" : "Progreso de la evaluación"}</Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.stepLabel}>
          {en ? `Step ${current} of ${totalSteps}` : `Paso ${current} de ${totalSteps}`}
        </Text>
        {remaining > 0 && (
          <Text style={styles.remaining}>
            {en
              ? `${remaining} step${remaining === 1 ? "" : "s"} left`
              : `${remaining} paso${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = {
  topRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.textLight,
    letterSpacing: 0.4,
    textTransform: "uppercase" as const,
  },
  pct: { fontSize: 11, fontWeight: "800" as const, color: Colors.primary },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.primarySoft,
    overflow: "hidden" as const,
  },
  fill: {
    height: "100%" as const,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  bottomRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 6,
  },
  stepLabel: { fontSize: 11, fontWeight: "600" as const, color: Colors.textSecondary },
  remaining: { fontSize: 11, color: Colors.textLight },
};
