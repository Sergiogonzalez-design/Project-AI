import React, { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { ClinicalTestMediaBlock } from "./ClinicalTestMediaBlock";
import { WEB_APP_URL } from "../lib/admin-api";
import { Colors } from "../lib/colors";
import { hasClinicalReasoningForReport } from "../lib/clinical-reasoning";
import {
  findClinicalTestImage,
  shouldShowClinicalTestImage,
  type ClinicalTestImage,
} from "../lib/clinical-test-images";
import {
  extractCitedSources,
  remapOrientationHeadingsForPhysio,
  toCitedSource,
  type CitedSource,
} from "../lib/source-links";
import { stripVisibleMarkup } from "../lib/strip-visible-markup";

const SECTION_ORDER = [
  "Resultados de las pruebas funcionales ya realizadas",
  "Pruebas/maniobras a realizar en la cita",
  "Hipótesis diagnósticas",
  "Resumen para el fisioterapeuta",
  "Datos del paciente",
  "Historia y mecanismo",
  "Pruebas de imagen si procede",
  "Puntos de alerta",
  "Qué debe hacer el paciente",
  "Qué puede hacer el paciente mientras tanto",
] as const;

function normalizeHeading(raw: string): string {
  let h = stripVisibleMarkup(raw).trim();
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
  if (/qu[eé]\s+debes\s+hacer\s+ahora|what you should do now/i.test(h)) {
    return "Qué debe hacer el paciente";
  }
  if (/qu[eé]\s+debe\s+hacer\s+el\s+paciente|what the patient should do now/i.test(h)) {
    return "Qué debe hacer el paciente";
  }
  if (/qu[eé]\s+hacer\s+mientras\s+tanto|what to do in the meantime/i.test(h)) {
    return "Qué puede hacer el paciente mientras tanto";
  }
  if (/qu[eé]\s+puede\s+hacer\s+el\s+paciente\s+mientras/i.test(h)) {
    return "Qué puede hacer el paciente mientras tanto";
  }
  return h;
}

function fixClinicalSpelling(text: string): string {
  return text.replace(/Syndesmosis/gi, "Sindesmosis");
}

function collectSourceLabel(raw: string, into: string[]) {
  const item = raw.replace(/^[-*•]\s*/, "").trim();
  if (!item) return;
  if (/^criterio cl[ií]nico general$/i.test(item)) return;
  into.push(item);
}

function splitReportSections(content: string): {
  sections: { title: string; body: string }[];
  sources: CitedSource[];
  preamble: string;
} {
  const fixed = remapOrientationHeadingsForPhysio(fixClinicalSpelling(content));
  const sourceLabels: string[] = [];
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
        collectSourceLabel(line, sourceLabels);
      }
      continue;
    }
    const kept: string[] = [];
    for (const line of body.split("\n")) {
      const trimmed = line.trim();
      if (/^(?:[-•*]\s*)?(?:Fuente|Source)\s*:/i.test(trimmed)) {
        const item = trimmed.replace(/^(?:[-•*]\s*)?(?:Fuente|Source)\s*:\s*/i, "").trim();
        collectSourceLabel(item, sourceLabels);
        continue;
      }
      kept.push(line);
    }
    body = kept.join("\n").trim();
    if (title === "Pruebas de imagen si procede" && !body) {
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

  const seen = new Set<string>();
  const sources: CitedSource[] = [];
  for (const label of sourceLabels) {
    const source = toCitedSource(label, { forPhysio: true });
    const key = (source.href ?? source.title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push(source);
  }

  return { sections, sources, preamble };
}

function emphasizeYesNoAnswers(text: string): string {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) return part;
      return part.replace(
        /(^|[^A-Za-záéíóúüñÁÉÍÓÚÜÑ*])(S[IÍ]|Yes|YES|No|NO)(?![A-Za-záéíóúüñÁÉÍÓÚÜÑ*])/g,
        "$1**$2**"
      );
    })
    .join("");
}

function InlineMarkdown({
  text,
  boldYesNo,
}: {
  text: string;
  boldYesNo?: boolean;
}) {
  const prepared = boldYesNo ? emphasizeYesNoAnswers(text) : text;
  const parts = prepared.split(/(\*\*[^*]+\*\*)/);
  return (
    <Text style={styles.body}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <Text key={i} style={styles.bold}>
            {stripVisibleMarkup(part.slice(2, -2))}
          </Text>
        ) : (
          <Text key={i}>{stripVisibleMarkup(part)}</Text>
        )
      )}
    </Text>
  );
}

function matchPruebaLine(line: string): ClinicalTestImage | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const plain = stripVisibleMarkup(trimmed).replace(/^\*\s+/, "• ").trim();
  const wholeBoldMatch = /^\*\*(.+)\*\*$/.exec(trimmed);
  const numberedText = /^\d+[.)]\s+\S/.test(plain) ? plain : null;
  const matched = shouldShowClinicalTestImage({
    numberedText,
    wholeBoldText: wholeBoldMatch?.[1] ?? null,
  });
  if (matched) return matched;
  if (/^[-•*]\s+\S/.test(plain) && plain.length <= 160) {
    return findClinicalTestImage(plain);
  }
  return null;
}

function PruebasWithVideos({ body }: { body: string }) {
  const shown = new Set<string>();
  return (
    <View style={styles.pruebasWrap}>
      {body.split("\n").map((line, i) => {
        const matched = matchPruebaLine(line);
        const show = matched && !shown.has(matched.id) ? matched : null;
        if (show) shown.add(show.id);
        if (!line.trim() && !show) {
          return <View key={i} style={{ height: 8 }} />;
        }
        return (
          <View key={i} style={styles.pruebaItem}>
            {line.trim() ? <InlineMarkdown text={line} /> : null}
            {show ? <ClinicalTestMediaBlock test={show} /> : null}
          </View>
        );
      })}
    </View>
  );
}

function openSourceHref(href: string) {
  const finalUrl = href.startsWith("/") ? `${WEB_APP_URL}${href}` : href;
  void Linking.openURL(finalUrl);
}

function SourcesBlock({
  sources,
  heading = "Fuentes consultadas",
}: {
  sources: CitedSource[];
  heading?: string;
}) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) return null;

  return (
    <View style={styles.section}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.sourcesBtn}>
        <Text style={styles.sourcesBtnText}>{heading}</Text>
        <View style={styles.sourcesBadge}>
          <Text style={styles.sourcesBadgeText}>{sources.length}</Text>
        </View>
      </Pressable>
      {open
        ? sources.map((source) => {
            if (!source.href) {
              return (
                <Text key={source.title} style={styles.sourceItem}>
                  • {source.title}
                </Text>
              );
            }
            return (
              <Pressable
                key={`${source.title}-${source.href}`}
                onPress={() => openSourceHref(source.href!)}
              >
                <Text style={styles.sourceLink}>• {source.title}</Text>
              </Pressable>
            );
          })
        : null}
    </View>
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

export function PhysioPatientOrientationView({ content }: { content: string }) {
  const remapped = useMemo(
    () => remapOrientationHeadingsForPhysio(fixClinicalSpelling(content)),
    [content]
  );
  const { body, sources, heading } = useMemo(
    () => extractCitedSources(remapped, { forPhysio: true }),
    [remapped]
  );

  return (
    <View style={styles.wrap}>
      <InlineMarkdown text={body} />
      <SourcesBlock sources={sources} heading={heading} />
    </View>
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
          {section.title === "Pruebas/maniobras a realizar en la cita" ? (
            <PruebasWithVideos body={section.body} />
          ) : (
            <InlineMarkdown
              text={section.body}
              boldYesNo={
                section.title ===
                "Resultados de las pruebas funcionales ya realizadas"
              }
            />
          )}
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

      <SourcesBlock sources={sources} />

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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sourcesBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e40af",
  },
  sourcesBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
  },
  sourcesBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  sourceItem: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textLight,
  },
  sourceLink: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.primary,
    textDecorationLine: "underline",
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
  pruebasWrap: { gap: 10 },
  pruebaItem: { gap: 6 },
});
