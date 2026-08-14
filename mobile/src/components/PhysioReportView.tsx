import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { hasClinicalReasoningForReport } from "../lib/clinical-reasoning";

const SECTION_ORDER = [
  "Resultados de las pruebas funcionales ya realizadas",
  "Pruebas/maniobras a realizar en la cita",
  "Hipótesis diagnósticas",
  "Resumen para el fisioterapeuta",
  "Datos del paciente",
  "Historia y mecanismo",
  "Pruebas de imagen si procede",
  "Puntos de alerta",
] as const;

function normalizeHeading(raw: string): string {
  let h = raw.replace(/\*\*/g, "").trim();
  h = h.replace(/\s*\(por probabilidad\)\s*/i, "").trim();
  if (/^hip[oó]tesis diagn/i.test(h)) return "Hipótesis diagnósticas";
  if (/pruebas\/?\s*maniobras/i.test(h)) return "Pruebas/maniobras a realizar en la cita";
  if (/resultados de las pruebas funcionales/i.test(h)) {
    return "Resultados de las pruebas funcionales ya realizadas";
  }
  if (/resumen para el fisioterapeuta/i.test(h)) return "Resumen para el fisioterapeuta";
  if (/datos del paciente/i.test(h)) return "Datos del paciente";
  if (/historia y mecanismo/i.test(h)) return "Historia y mecanismo";
  if (/pruebas de imagen/i.test(h)) return "Pruebas de imagen si procede";
  if (/puntos de alerta/i.test(h)) return "Puntos de alerta";
  if (/fuentes consultadas|sources consulted/i.test(h)) return "Fuentes consultadas";
  return h;
}

function fixClinicalSpelling(text: string): string {
  return text.replace(/Syndesmosis/gi, "Sindesmosis");
}

function splitReportSections(content: string): {
  sections: { title: string; body: string }[];
  sources: string[];
  preamble: string;
} {
  const fixed = fixClinicalSpelling(content);
  const sources: string[] = [];
  const sections: { title: string; body: string }[] = [];
  const parts = fixed.split(/\n(?=\*\*[^*]+\*\*)/);
  let preamble = "";

  for (const part of parts) {
    const match = /^\*\*([^*]+)\*\*\s*([\s\S]*)$/.exec(part.trim());
    if (!match) {
      if (!sections.length) preamble += (preamble ? "\n" : "") + part.trim();
      continue;
    }
    const title = normalizeHeading(match[1]);
    let body = match[2].trim();
    if (title === "Fuentes consultadas") {
      for (const line of body.split("\n")) {
        const item = line.replace(/^[-*•]\s*/, "").trim();
        if (item) sources.push(item);
      }
      continue;
    }
    if (title === "Pruebas de imagen si procede") {
      body =
        "No se recomienda realizar pruebas de imagen en esta fase inicial hasta pasadas 24-48 horas.";
    }
    sections.push({ title, body });
  }

  const orderIndex = (t: string) => {
    const i = SECTION_ORDER.indexOf(t as (typeof SECTION_ORDER)[number]);
    return i === -1 ? 100 : i;
  };
  sections.sort((a, b) => orderIndex(a.title) - orderIndex(b.title));

  return { sections, sources, preamble };
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <Text style={styles.body}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <Text key={i} style={styles.bold}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
}

export function AiOrientationDisclaimer({ style }: { style?: object }) {
  return (
    <Text style={[styles.disclaimer, style]}>
      AIKinora es una IA orientativa: no sustituye el criterio clínico ni un
      diagnóstico médico presencial.
    </Text>
  );
}

export function PhysioReportView({
  content,
  bodyArea,
  onStartClinicalReasoning,
}: {
  content: string;
  bodyArea?: string | null;
  onStartClinicalReasoning?: () => void;
}) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { sections, sources, preamble } = useMemo(
    () => splitReportSections(content),
    [content]
  );

  const showReasoningButton =
    Boolean(onStartClinicalReasoning) &&
    hasClinicalReasoningForReport({
      bodyArea: bodyArea ?? null,
      physioReport: content,
    });

  return (
    <View style={styles.wrap}>
      {preamble ? <InlineMarkdown text={preamble} /> : null}

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <InlineMarkdown text={section.body} />
          {section.title === "Pruebas/maniobras a realizar en la cita" &&
          showReasoningButton ? (
            <View style={styles.reasoningWrap}>
              <Pressable
                onPress={onStartClinicalReasoning}
                style={({ pressed }) => [
                  styles.reasoningBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.reasoningBtnText}>
                  Razonamiento clínico por pruebas →
                </Text>
              </Pressable>
              <Text style={styles.reasoningHint}>
                Aplica las maniobras una a una (Positivo / Negativo) y obtén
                hipótesis orientativas según los hallazgos.
              </Text>
            </View>
          ) : null}
        </View>
      ))}

      {sources.length > 0 ? (
        <View style={styles.section}>
          <Pressable
            onPress={() => setSourcesOpen((v) => !v)}
            style={styles.sourcesBtn}
          >
            <Text style={styles.sourcesBtnText}>
              {sourcesOpen ? "Ocultar fuentes consultadas" : "Fuentes consultadas"}
            </Text>
          </Pressable>
          {sourcesOpen
            ? sources.map((s) => (
                <Text key={s} style={styles.sourceItem}>
                  • {s}
                </Text>
              ))
            : null}
        </View>
      ) : null}

      <AiOrientationDisclaimer style={styles.disclaimerTop} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  section: { gap: 6 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Colors.primary,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
  },
  bold: { fontWeight: "700", color: Colors.text },
  sourcesBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sourcesBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
  sourceItem: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textLight,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textLight,
  },
  disclaimerTop: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  reasoningWrap: { marginTop: 10, gap: 6 },
  reasoningBtn: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reasoningBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  reasoningHint: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textLight,
  },
});
