import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  defaultWristAdaptiveAnswers,
  detectWristRedFlags,
  getVisibleWristQuestions,
  getVisibleWristSections,
  localizeWristLabel,
  localizeWristOption,
  localizeWristSection,
  WRIST_LOCATION_OPTIONS,
  validateWristSection,
  type ConsultLocale,
  type WristAdaptiveAnswers,
  type WristQuestionDef,
} from "../lib/consulta-wrist-adaptive";
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
    (o) =>
      o === "Ninguno" ||
      o === "No" ||
      o === "Sin limitación" ||
      o === "Ninguno en particular" ||
      o === "Ninguna"
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

function WristLocationMap({
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

  const display = (opt: string) => localizeWristOption(opt, locale);

  return (
    <View style={styles.mapWrap}>
      <Text style={styles.mapHint}>
        {locale === "en"
          ? "Tap the map to mark areas (you can select several)."
          : "Toca en el “mapa” para marcar zonas (puedes elegir varias)."}
      </Text>

      <View style={styles.mapCanvas}>
        <View pointerEvents="none" style={styles.mapSchematic}>
          <View style={styles.mapForearm} />
          <View style={styles.mapWrist} />
          <View style={styles.mapPalm} />
        </View>

        {[
          { opt: "Lado del pulgar", hotStyle: styles.hotThumbSide },
          { opt: "Base del pulgar", hotStyle: styles.hotThumbBase },
          { opt: "Lado del meñique", hotStyle: styles.hotUlnarSide },
          { opt: "Cara dorsal (parte externa)", hotStyle: styles.hotBack },
          { opt: "Toda la muñeca", hotStyle: styles.hotEntire },
          { opt: "Centro de la muñeca", hotStyle: styles.hotCenter },
          { opt: "Hacia la mano", hotStyle: styles.hotIntoHand },
          { opt: "Cara palmar (parte interna)", hotStyle: styles.hotPalm },
        ].map(({ opt, hotStyle }) => (
          <Pressable
            key={opt}
            onPress={() => toggle(opt)}
            style={[
              styles.hot,
              hotStyle,
              value.includes(opt) ? styles.hotSelected : styles.hotUnselected,
            ]}
            hitSlop={8}
          >
            <Text style={[styles.hotText, value.includes(opt) && styles.hotTextSelected]}>
              {display(opt)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.mapChips}>
        {WRIST_LOCATION_OPTIONS.map((opt) => (
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
  q: WristQuestionDef;
  answers: WristAdaptiveAnswers;
  onPatch: (p: Partial<WristAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeWristLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeWristOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    const min = typeof q.min === "number" ? q.min : 0;
    const max = typeof q.max === "number" ? q.max : 10;

    if (q.id === "intensidad_dolor" && min === 0 && max === 10) {
      return (
        <PainScale
          value={num}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
              onPress={() => onPatch({ [q.id]: n } as Partial<WristAdaptiveAnswers>)}
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
          onChangeText={(t) => onPatch({ [q.id]: t } as Partial<WristAdaptiveAnswers>)}
          multiline
        />
      </View>
    );
  }

  if (q.type === "wrist_map") {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <WristLocationMap
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </View>
    );
  }

  return null;
}

type Props = {
  value: WristAdaptiveAnswers;
  onChange: (v: WristAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveWrist({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultWristAdaptiveAnswers();
  const sections = getVisibleWristSections(answers);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleWristQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectWristRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<WristAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const err = validateWristSection(currentSection, answers);
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
            <Text style={{ fontWeight: "800" }}>{redFlagsDetectedLabel(locale)}</Text>{" "}
            {triggered.join(", ")}. {redFlagsUrgencyNote(locale)}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>{localizeWristSection(currentSection, locale)}</Text>

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

export function isLastWristSection(value: WristAdaptiveAnswers, sectionIndex: number): boolean {
  const answers = value ?? defaultWristAdaptiveAnswers();
  const sections = getVisibleWristSections(answers);
  return sectionIndex >= sections.length - 1;
}

const styles = StyleSheet.create({
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
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  chipTextSelected: {
    color: Colors.white,
  },
  painRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
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
  painText: {
    fontWeight: "800",
    color: Colors.textSecondary,
  },
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
  mapCanvas: {
    height: 220,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    position: "relative",
    marginBottom: 10,
  },
  mapSchematic: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
  },
  mapForearm: {
    width: 64,
    height: 96,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginTop: 20,
  },
  mapWrist: {
    width: 56,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginTop: -10,
  },
  mapPalm: {
    width: 96,
    height: 100,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginTop: -6,
  },
  hot: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 170,
  },
  hotUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  hotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hotText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textSecondary,
  },
  hotTextSelected: {
    color: Colors.white,
  },
  hotThumbSide: { left: 10, top: 92 },
  hotThumbBase: { left: 16, top: 132 },
  hotUlnarSide: { right: 10, top: 92 },
  hotBack: { left: "50%", top: 10, transform: [{ translateX: -70 }] },
  hotEntire: { left: "50%", top: 52, transform: [{ translateX: -64 }] },
  hotCenter: { left: "50%", top: 108, transform: [{ translateX: -68 }] },
  hotIntoHand: { left: "50%", top: 150, transform: [{ translateX: -60 }] },
  hotPalm: { left: "50%", top: 186, transform: [{ translateX: -70 }] },
  mapChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  smallChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  smallChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  smallChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  smallChipTextSelected: {
    color: Colors.white,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
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
  btnText: {
    fontSize: 13,
    fontWeight: "800",
  },
  btnPrimaryText: {
    color: Colors.white,
  },
  btnSecondaryText: {
    color: Colors.textSecondary,
  },
  btnDoneText: {
    color: "#047857",
  },
});

