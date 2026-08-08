import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  defaultFingerAdaptiveAnswers,
  detectFingerRedFlags,
  FINGER_INTRO,
  FINGER_LOCATION_OPTIONS,
  getVisibleFingerQuestions,
  getVisibleFingerSections,
  localizeFingerLabel,
  localizeFingerOption,
  localizeFingerSection,
  validateFingerSection,
  type ConsultLocale,
  type FingerAdaptiveAnswers,
  type FingerQuestionDef,
} from "../lib/consulta-finger-adaptive";
import { Colors } from "../lib/colors";
import { chipStyle, chipTextStyle } from "./ui/chipStyle";
import { PainScale } from "./ui/PainScale";
import { QuestionnaireProgress } from "./ui/QuestionnaireProgress";
import { redFlagsDetectedLabel, redFlagsUrgencyNote } from "../lib/consulta-red-flags-copy";

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
  const exclusiveOption = options.find(
    (o) => o === "Ninguna" || o === "No" || o === "Nada específico"
  );

  function toggle(opt: string) {
    if (exclusiveOption && opt === exclusiveOption) {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutExclusive = exclusiveOption
      ? value.filter((v) => v !== exclusiveOption)
      : value;
    if (withoutExclusive.includes(opt)) onChange(withoutExclusive.filter((v) => v !== opt));
    else onChange([...withoutExclusive, opt]);
  }

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

function FingerLocationMap({
  value,
  onChange,
  locale,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  locale: ConsultLocale;
}) {
  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  }

  const display = (opt: string) => localizeFingerOption(opt, locale);

  return (
    <View style={styles.mapWrap}>
      <Text style={styles.mapHint}>
        {locale === "en"
          ? "Mark where it hurts most (you can select several areas)."
          : "Marca dónde duele más (puedes elegir varias zonas)."}
      </Text>
      <View style={styles.mapChips}>
        {FINGER_LOCATION_OPTIONS.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => toggle(opt)}
            style={[styles.smallChip, value.includes(opt) && styles.smallChipSelected]}
          >
            <Text
              style={[
                styles.smallChipText,
                value.includes(opt) && styles.smallChipTextSelected,
              ]}
            >
              {display(opt)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function QuestionField({
  q,
  answers,
  onPatch,
  locale,
}: {
  q: FingerQuestionDef;
  answers: FingerAdaptiveAnswers;
  onPatch: (p: Partial<FingerAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeFingerLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeFingerOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    const min = typeof q.min === "number" ? q.min : 0;
    const max = typeof q.max === "number" ? q.max : 10;

    if (q.id === "intensidad_dolor" && min === 0 && max === 10) {
      return (
        <PainScale
          value={num}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          label={label}
          locale={locale}
        />
      );
    }

    return (
      <View style={styles.field}>
        <Text style={styles.label}>
          {label}: {num}/{max}
        </Text>
        <View style={styles.painRow}>
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
            <Pressable
              key={n}
              style={[styles.painChip, num === n && styles.chipSelected]}
              onPress={() => onPatch({ [q.id]: n } as Partial<FingerAdaptiveAnswers>)}
            >
              <Text style={[styles.painText, num === n && styles.chipTextSelected]}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (q.type === "text") {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={typeof val === "string" ? val : ""}
          onChangeText={(t) => onPatch({ [q.id]: t } as Partial<FingerAdaptiveAnswers>)}
          multiline
        />
      </View>
    );
  }

  if (q.type === "finger_map") {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <FingerLocationMap
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          locale={locale}
        />
      </View>
    );
  }

  if (q.type === "multi" && q.options) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <MultiChipGroup
          options={q.options}
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </View>
    );
  }

  if (q.options) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <ChipGroup
          options={q.options}
          value={typeof val === "string" ? val : ""}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </View>
    );
  }

  return null;
}

type Props = {
  value: FingerAdaptiveAnswers;
  onChange: (v: FingerAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveFinger({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultFingerAdaptiveAnswers();
  const sections = getVisibleFingerSections(answers);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleFingerQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectFingerRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<FingerAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const issue = validateFingerSection(currentSection, answers);
    if (issue) {
      onSectionError(issue.message);
      return;
    }
    onSectionError(null);
    onSectionIndexChange(sectionIndex + 1);
  }

  return (
    <View>
      {sectionIndex === 0 && (
        <View style={styles.introBox}>
          <Text style={styles.introText}>{FINGER_INTRO}</Text>
        </View>
      )}

      <QuestionnaireProgress stepIndex={sectionIndex} totalSteps={sections.length} locale={locale} />

      {currentSection === "red_flags" && (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>
            Estas preguntas detectan situaciones que pueden requerir atención médica urgente.
          </Text>
        </View>
      )}

      {urgent && currentSection !== "red_flags" && (
        <View style={styles.redBox}>
          <Text style={styles.redText}>
            <Text style={{ fontWeight: "800" }}>{redFlagsDetectedLabel(locale)}</Text>{" "}
            {triggered.join(", ")}.{redFlagsUrgencyNote(locale)}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>{localizeFingerSection(currentSection, locale)}</Text>

      {sectionQuestions.map((q) => (
        <QuestionField key={String(q.id)} q={q} answers={answers} onPatch={patch} locale={locale} />
      ))}

      {sectionError && <Text style={styles.errorText}>{sectionError}</Text>}

      <View style={styles.btnRow}>
        {sectionIndex > 0 && (
          <Pressable
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => onSectionIndexChange(sectionIndex - 1)}
          >
            <Text style={[styles.btnText, styles.btnSecondaryText]}>Atrás</Text>
          </Pressable>
        )}
        {!isLastSection ? (
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handleNext}>
            <Text style={[styles.btnText, styles.btnPrimaryText]}>Siguiente</Text>
          </Pressable>
        ) : (
          <View style={[styles.btn, styles.btnDone]}>
            <Text style={[styles.btnText, styles.btnDoneText]}>Listo para enviar a la IA</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function isLastFingerSection(value: FingerAdaptiveAnswers, sectionIndex: number): boolean {
  const answers = value ?? defaultFingerAdaptiveAnswers();
  const sections = getVisibleFingerSections(answers);
  return sectionIndex >= sections.length - 1;
}

const styles = StyleSheet.create({
  introBox: {
    backgroundColor: "#EFF6FF",
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  introText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 19,
  },
  stepText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: "700",
  },
  warnBox: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  warnText: {
    color: "#92400E",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  redBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  redText: {
    color: "#991B1B",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "700" },
  chipTextSelected: { color: Colors.white },
  painRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  painChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  painText: { fontWeight: "800", color: Colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    color: Colors.text,
  },
  mapWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 12,
  },
  mapHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 10,
  },
  mapChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  smallChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  smallChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  smallChipText: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary },
  smallChipTextSelected: { color: Colors.white },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: Colors.primary },
  btnSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnDone: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  btnText: { fontSize: 13, fontWeight: "800" },
  btnPrimaryText: { color: Colors.white },
  btnSecondaryText: { color: Colors.textSecondary },
  btnDoneText: { color: "#047857" },
});
