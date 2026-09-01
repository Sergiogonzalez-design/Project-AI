import type { BodyPartId } from "./body-parts";
import {
  fisioSteerToComplaintMessage,
  isVagueArmComplaint,
  questionnaireForText,
  resolveBodyPartFromLocationReply,
  vagueArmClarifyMessage,
} from "./detect-body-part";
import {
  isAdaptiveQuestionnairePart,
  isInformationalOrEducationalQuery,
  isMetaOrClarificationQuery,
  looksLikePersonalMusculoskeletalComplaint,
  type AdaptiveQuestionnairePart,
} from "./consulta-triage";

export type FisioIntroDecision =
  | { type: "steer_meta"; message: string }
  | { type: "clarify_location"; message: string }
  | { type: "questionnaire"; part: AdaptiveQuestionnairePart | "generic" };

function asAdaptivePart(
  part: BodyPartId | "generic" | null | undefined
): AdaptiveQuestionnairePart | "generic" {
  if (part && part !== "generic" && isAdaptiveQuestionnairePart(part)) {
    return part;
  }
  return "generic";
}

/**
 * Best matching questionnaire for Fisioterapia from what the patient wrote.
 * Always returns a part — "generic" when the zone is unknown so a report can still be built.
 */
export function resolveFisioQuestionnairePart(
  text: string
): AdaptiveQuestionnairePart | "generic" {
  const fromReply = resolveBodyPartFromLocationReply(text);
  if (fromReply && isAdaptiveQuestionnairePart(fromReply)) return fromReply;
  const { part, detected } = questionnaireForText(text);
  if (detected[0] && isAdaptiveQuestionnairePart(detected[0])) {
    return detected[0];
  }
  return asAdaptivePart(part);
}

/**
 * Fisioterapia first message:
 * - Named zone → that adaptive questionnaire
 * - Vague "brazo/arm" → ask where once (wrong adaptive UI would be worse)
 * - Any other complaint / unclear zone → generic questionnaire (asks where + details)
 * - Pure meta ("cómo funciona") → steer back to describing the complaint
 *
 * Never leaves the patient in free chat without a path to a report.
 */
export function decideFisioIntro(
  text: string,
  locale: "es" | "en" = "es"
): FisioIntroDecision {
  if (
    (isMetaOrClarificationQuery(text) || isInformationalOrEducationalQuery(text)) &&
    !looksLikePersonalMusculoskeletalComplaint(text)
  ) {
    return { type: "steer_meta", message: fisioSteerToComplaintMessage(locale) };
  }

  // Only "brazo/arm" needs a clarifying turn — several adaptive UIs share that word.
  if (isVagueArmComplaint(text)) {
    return { type: "clarify_location", message: vagueArmClarifyMessage(locale) };
  }

  return {
    type: "questionnaire",
    part: resolveFisioQuestionnairePart(text),
  };
}

/**
 * After "dónde te duele?": open the matching questionnaire, or generic if still unclear.
 */
export function decideFisioLocationReply(
  reply: string,
  pendingComplaint: string
): { part: AdaptiveQuestionnairePart | "generic"; contextText: string } {
  const contextText = `${pendingComplaint}\n${reply}`.trim();
  const fromReply = resolveBodyPartFromLocationReply(reply);
  if (fromReply && isAdaptiveQuestionnairePart(fromReply)) {
    return { part: fromReply, contextText };
  }
  // Still vague after the clarify turn → generic questionnaire (includes zona field).
  return { part: resolveFisioQuestionnairePart(contextText), contextText };
}
