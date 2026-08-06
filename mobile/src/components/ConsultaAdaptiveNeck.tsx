import React, { useEffect } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  defaultNeckAdaptiveAnswers,
  detectNeckRedFlags,
  getVisibleNeckQuestions,
  getVisibleNeckSections,
  localizeNeckLabel,
  localizeNeckOption,
  localizeNeckSection,
  validateNeckSection,
  type ConsultLocale,
  type NeckAdaptiveAnswers,
  type NeckQuestionDef,
} from "../lib/consulta-neck-adaptive";
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
  const noneOption = options.find(
    (o) =>
      o === "Ninguno" ||
      o === "Ninguno en particular" ||
      o === "Sin limitación" ||
      o === "Ninguna"
  );

  function toggle(opt: string) {
    if (noneOption && opt === noneOption) {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutNone = noneOption ? value.filter((v) => v !== noneOption) : value;
    if (withoutNone.includes(opt)) {
      onChange(withoutNone.filter((v) => v !== opt));
    } else {
      onChange([...withoutNone, opt]);
    }
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

function QuestionField({
  q,
  answers,
  onPatch,
  locale,
}: {
  q: NeckQuestionDef;
  answers: NeckAdaptiveAnswers;
  onPatch: (p: Partial<NeckAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeNeckLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeNeckOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    return (
      <PainScale
        value={num}
        onChange={(v) => onPatch({ [q.id]: v } as Partial<NeckAdaptiveAnswers>)}
        label={label}
        locale={locale}
      />
    );
  }

  if (q.type === "text") {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={typeof val === "string" ? val : ""}
          onChangeText={(t) => onPatch({ [q.id]: t } as Partial<NeckAdaptiveAnswers>)}
          multiline
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<NeckAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<NeckAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </View>
    );
  }

  return null;
}

type Props = {
  value: NeckAdaptiveAnswers;
  onChange: (v: NeckAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveNeck({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultNeckAdaptiveAnswers();
  const sections = getVisibleNeckSections(answers);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleNeckQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectNeckRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<NeckAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const err = validateNeckSection(currentSection, answers);
    if (err) {
      onSectionError(err);
      return;
    }
    onSectionError(null);
    onSectionIndexChange(sectionIndex + 1);
  }

  return (
    <View>
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
            {redFlagsDetectedLabel(locale)} {triggered.join(", ")}. {redFlagsUrgencyNote(locale)}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>{localizeNeckSection(currentSection, locale)}</Text>

      {sectionQuestions.map((q) => (
        <QuestionField key={q.id} q={q} answers={answers} onPatch={patch} locale={locale} />
      ))}

      {sectionError ? <Text style={styles.error}>{sectionError}</Text> : null}

      <View style={styles.navRow}>
        {sectionIndex > 0 && (
          <Pressable style={styles.navBtnOutline} onPress={() => onSectionIndexChange(sectionIndex - 1)}>
            <Text style={styles.navBtnOutlineText}>Anterior</Text>
          </Pressable>
        )}
        {!isLastSection && (
          <Pressable style={styles.navBtn} onPress={handleNext}>
            <Text style={styles.navBtnText}>Siguiente</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function isLastNeckSection(
  answers: NeckAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleNeckSections(answers);
  return sectionIndex >= sections.length - 1;
}

const styles = {
  stepText: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  warnBox: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  warnText: { fontSize: 13, color: "#92400e" },
  redBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  redText: { fontSize: 13, color: "#991b1b" },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, marginBottom: 12 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600" as const, color: Colors.text, marginBottom: 8 },
  chipGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
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
  painRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 6 },
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
    textAlignVertical: "top" as const,
  },
  error: { color: "#dc2626", fontSize: 13, marginBottom: 8 },
  navRow: { flexDirection: "row" as const, gap: 10, marginTop: 8 },
  navBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center" as const,
  },
  navBtnText: { color: Colors.white, fontWeight: "700" as const },
  navBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center" as const,
  },
  navBtnOutlineText: { color: Colors.primary, fontWeight: "600" as const },
};
