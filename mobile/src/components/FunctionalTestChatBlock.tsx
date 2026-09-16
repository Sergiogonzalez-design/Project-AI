import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ConsultaAssistantBody } from "./ConsultaAssistantBody";
import { FunctionalTestYesNo } from "./FunctionalTestYesNo";
import type { ConsultLocale } from "../lib/consult-clinic-links";
import {
  functionalTestPreparingLabel,
  functionalTestProgressiveBefore,
  functionalTestRevealPreview,
} from "../lib/functional-test-reveal";
import type { FunctionalTestItem } from "../lib/functional-test-answers";
import { Colors } from "../lib/colors";

type ParsedBlock = {
  before: string;
  heading: string;
  tests: FunctionalTestItem[];
  after: string;
};

type Props = {
  parsed: ParsedBlock;
  language: ConsultLocale;
  disabled?: boolean;
  isRevealing: boolean;
  visibleText?: string;
  onSubmit: (text: string) => void;
  onScrollTick?: () => void;
  onClinicPress?: (slug: string) => void;
  bubbleText: object;
  bubbleBold: object;
  highlightPhrases?: string[];
  highlightStyle?: object;
  forceHospitalOnly?: boolean;
  cityHint?: string | null;
};

export function FunctionalTestChatBlock({
  parsed,
  language,
  disabled,
  isRevealing,
  visibleText,
  onSubmit,
  onScrollTick,
  onClinicPress,
  bubbleText,
  bubbleBold,
  highlightPhrases,
  highlightStyle,
  forceHospitalOnly = false,
  cityHint = null,
}: Props) {
  const [afterVisible, setAfterVisible] = useState(false);
  const testKey = parsed.tests.map((t) => t.prompt).join("|");

  useEffect(() => {
    setAfterVisible(false);
  }, [testKey]);

  const bodyProps = {
    style: bubbleText,
    boldStyle: bubbleBold,
    highlightPhrases,
    highlightStyle,
    onClinicPress,
    language,
    showClinicalTestMedia: false as const,
    forceHospitalOnly,
    cityHint,
  };

  if (isRevealing) {
    const progressive = functionalTestProgressiveBefore(
      parsed.before,
      visibleText ?? ""
    );
    const preview =
      progressive ||
      (parsed.heading
        ? functionalTestRevealPreview({ before: "", heading: parsed.heading })
        : "");
    return (
      <View>
        {progressive ? (
          <ConsultaAssistantBody text={progressive} {...bodyProps} />
        ) : preview ? (
          <ConsultaAssistantBody text={preview} {...bodyProps} />
        ) : null}
        <Text style={styles.preparing}>
          {functionalTestPreparingLabel(language)}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {parsed.before ? (
        <ConsultaAssistantBody text={parsed.before} {...bodyProps} />
      ) : null}
      {parsed.heading ? (
        <Text
          style={[
            bubbleText,
            bubbleBold,
            parsed.before ? styles.headingGap : undefined,
          ]}
        >
          {parsed.heading}
        </Text>
      ) : null}
      <FunctionalTestYesNo
        tests={parsed.tests}
        language={language}
        disabled={disabled}
        ready
        onSubmit={onSubmit}
        onStaggerTick={onScrollTick}
        onStaggerComplete={() => setAfterVisible(true)}
      />
      {afterVisible && parsed.after ? (
        <View style={styles.afterGap}>
          <ConsultaAssistantBody text={parsed.after} {...bodyProps} />
        </View>
      ) : null}
    </View>
  );
}

const styles = {
  preparing: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textLight,
    fontStyle: "italic" as const,
  },
  headingGap: { marginTop: 12 },
  afterGap: { marginTop: 12 },
};
