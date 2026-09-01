"use client";

import {
  ConsultaAdaptiveShoulder,
  isLastShoulderSection,
} from "@/components/consulta-adaptive-shoulder";
import {
  ConsultaAdaptiveElbow,
  isLastElbowSection,
} from "@/components/consulta-adaptive-elbow";
import {
  ConsultaAdaptiveFinger,
  isLastFingerSection,
} from "@/components/consulta-adaptive-finger";
import {
  ConsultaAdaptiveWrist,
  isLastWristSection,
} from "@/components/consulta-adaptive-wrist";
import {
  ConsultaAdaptiveNeck,
  isLastNeckSection,
} from "@/components/consulta-adaptive-neck";
import {
  ConsultaAdaptiveHead,
  isLastHeadSection,
} from "@/components/consulta-adaptive-head";
import {
  ConsultaAdaptiveLowerLeg,
  isLastLowerLegSection,
} from "@/components/consulta-adaptive-lower-leg";
import {
  ConsultaAdaptiveKnee,
  isLastKneeSection,
} from "@/components/consulta-adaptive-knee";
import {
  ConsultaAdaptiveBack,
  isLastBackSection,
} from "@/components/consulta-adaptive-back";
import {
  ConsultaAdaptiveHip,
  isLastHipSection,
} from "@/components/consulta-adaptive-hip";
import { ConsultaGenericFields } from "@/components/consulta-generic-fields";
import { PhysioAvatar } from "@/components/physio-avatar";
import { PhysioIntro } from "@/components/physio-intro";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom-button";
import { StreamingAssistantMessage } from "@/components/streaming-assistant-message";
import { TrustPanel } from "@/components/ui/trust-panel";
import {
  buildPhysioLinkedCompletionMessage,
  buildPhysioLinkedFunctionalTestsPrompt,
  buildPhysioLinkedIntroGreeting,
  buildPhysioLinkedPostQuestionnaireMessage,
  buildPhysioLinkedWelcome,
  physioDisplayName,
} from "@/lib/physio-linked-welcome";
import { PhysioReportCompleteCard } from "@/components/physio-report-complete-card";
import { VoiceConversationButton } from "@/components/voice-conversation-button";
import { VoiceSpeakButton } from "@/components/voice-speak-button";
import { useKeyboardOverlap } from "@/hooks/use-keyboard-overlap";
import { ensureQuestionnaireFieldVisible } from "@/lib/ensure-questionnaire-field-visible";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { bodyPartLabel, type BodyPartId } from "@/lib/body-parts";
import {
  defaultGenericConsultaAnswers,
  formatGenericConsulta,
  validateGenericConsulta,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";
import {
  scrollToQuestionnaireQuestion,
  type AdaptiveValidationIssue,
} from "@/lib/consulta-validation";
import {
  defaultShoulderAdaptiveAnswers,
  detectRedFlags,
  formatShoulderAdaptive,
  getVisibleShoulderSections,
  resolveShoulderQuestionnaireFocus,
  validateShoulderAdaptive,
  validateShoulderSection,
  withShoulderHintsFromText,
  type ShoulderAdaptiveAnswers,
} from "@/lib/consulta-shoulder-adaptive";
import {
  defaultElbowAdaptiveAnswers,
  detectElbowRedFlags,
  formatElbowAdaptive,
  getVisibleElbowSections,
  validateElbowAdaptive,
  validateElbowSection,
  withElbowHintsFromText,
  type ElbowAdaptiveAnswers,
} from "@/lib/consulta-elbow-adaptive";
import {
  defaultFingerAdaptiveAnswers,
  detectFingerRedFlags,
  formatFingerAdaptive,
  getVisibleFingerSections,
  validateFingerAdaptive,
  validateFingerSection,
  type FingerAdaptiveAnswers,
} from "@/lib/consulta-finger-adaptive";
import {
  defaultWristAdaptiveAnswers,
  detectWristRedFlags,
  formatWristAdaptive,
  getVisibleWristSections,
  validateWristAdaptive,
  validateWristSection,
  type WristAdaptiveAnswers,
} from "@/lib/consulta-wrist-adaptive";
import {
  defaultNeckAdaptiveAnswers,
  detectNeckRedFlags,
  formatNeckAdaptive,
  getVisibleNeckSections,
  validateNeckAdaptive,
  validateNeckSection,
  type NeckAdaptiveAnswers,
} from "@/lib/consulta-neck-adaptive";
import {
  defaultHeadAdaptiveAnswers,
  detectHeadRedFlags,
  formatHeadAdaptive,
  getVisibleHeadSections,
  validateHeadAdaptive,
  validateHeadSection,
  type HeadAdaptiveAnswers,
} from "@/lib/consulta-head-adaptive";
import {
  defaultLowerLegAdaptiveAnswers,
  detectLowerLegRedFlags,
  formatLowerLegAdaptive,
  bodyAreaLabelFromLowerLegAnswers,
  getVisibleLowerLegSections,
  validateLowerLegAdaptive,
  validateLowerLegSection,
  withAnkleFootFocusFromText,
  type LowerLegAdaptiveAnswers,
} from "@/lib/consulta-lower-leg-adaptive";
import {
  defaultKneeAdaptiveAnswers,
  detectKneeRedFlags,
  formatKneeAdaptive,
  getVisibleKneeSections,
  validateKneeAdaptive,
  validateKneeSection,
  type KneeAdaptiveAnswers,
} from "@/lib/consulta-knee-adaptive";
import {
  defaultBackAdaptiveAnswers,
  detectBackRedFlags,
  formatBackAdaptive,
  getVisibleBackSections,
  validateBackAdaptive,
  validateBackSection,
  type BackAdaptiveAnswers,
} from "@/lib/consulta-back-adaptive";
import {
  defaultHipAdaptiveAnswers,
  detectHipRedFlags,
  formatHipAdaptive,
  getVisibleHipSections,
  hipBodyAreaLabelForAi,
  validateHipAdaptive,
  validateHipSection,
  type HipAdaptiveAnswers,
} from "@/lib/consulta-hip-adaptive";
import {
  questionnaireForText,
  questionnaireIntroMessage,
  resolveAnkleFootFocus,
  patientFacingPartLabel,
  detectBodyPartsFromText,
  isVagueArmComplaint,
  vagueArmClarifyMessage,
  resolveBodyPartFromLocationReply,
} from "@/lib/detect-body-part";
import {
  decideFisioIntro,
  decideFisioLocationReply,
} from "@/lib/fisio-case-flow";
import {
  bodyAreaLabelFromText,
  betweenPartsChoiceContext,
  fallbackTriageFromText,
  isClearStartNextPart,
  isDeclineNextPart,
  isMetaOrClarificationQuery,
  isInformationalOrEducationalQuery,
  shouldOpenSymptomQuestionnaire,
  nextPartReadyMessage,
  parseTriageResult,
  pendingPartsFromText,
  refineTriageBodyPart,
  resolveQuestionnaireLaunch,
  reportsFunctionalTestResults,
  functionalTestResultsFollowupContext,
  consultaFinishedCloseMessage,
  isConsultaFinishedCloseMessage,
  declinesMoreRelatedQuestions,
  affirmsMoreRelatedQuestions,
  inviteRelatedQuestionMessage,
  unrelatedConsultaRedirectMessage,
  isUnrelatedConsultaQuestion,
  relatedInjuryFollowupContext,
  ensureAsksMoreRelatedQuestions,
  askMoreRelatedQuestionsPrompt,
  resolveNextPendingZone,
  shouldStartQuestionnaire,
  wantsFunctionalTestsNow,
  wantsToContinueToNextQuestionnaire,
  type AdaptiveQuestionnairePart,
} from "@/lib/consulta-triage";
import { ConsultaCompleteCard } from "@/components/consulta-complete-card";
import { ConsultaNewConsultaPrompt } from "@/components/consulta-new-consulta-prompt";
import { shouldShowClinicalTestImage } from "@/lib/clinical-test-images";
import {
  consultAttachmentCaption,
  consultAttachmentHistoryNote,
  consultVisionUrl,
  isConsultImageFile,
  isConsultPdfFile,
  isConsultPdfUrl,
  MAX_CONSULT_ATTACHMENT_BYTES,
  uploadConsultPhoto,
} from "@/lib/consult-photo";
import {
  canStartNewFisioConsult,
  fisioNewConsultCooldownMessage,
  fisioNewConsultHoursRemaining,
} from "@/lib/fisio-consult-cooldown";
import {
  type ConsultLanguage,
} from "@/lib/consult-language";
import { useUiLocale } from "@/lib/ui-locale";
import { stripVisibleMarkup } from "@/lib/strip-visible-markup";
import { AssistantMessageWithSources } from "@/components/assistant-message-with-sources";
import { FunctionalTestYesNo } from "@/components/functional-test-yes-no";
import {
  latestUnansweredFunctionalTests,
  splitFunctionalTests,
} from "@/lib/functional-test-answers";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
  created_at?: string | null;
};
type Conversation = {
  id: string;
  title: string;
  created_at: string;
  physio_id?: string | null;
  physio_name?: string | null;
  clinic_name?: string | null;
};
type ConversationGroup = {
  label: string;
  physioName?: string;
  clinicName?: string | null;
  items: Conversation[];
};
type LinkedPhysioInfo = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};
type Phase = "intro" | "questionnaire" | "followup" | "complete";

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";
const WELCOME_MESSAGE_ES =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia o duda sobre ejercicios.";
const WELCOME_MESSAGE_EN =
  "How can I help you? Tell me if you have any discomfort or a question about exercises.";
const WELCOME_ID = "welcome";

function formatDate(iso: string, locale: ConsultLanguage) {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string | null | undefined, locale: ConsultLanguage) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString(locale === "en" ? "en-US" : "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Groups conversations into ChatGPT-style relative date buckets for the sidebar. */
function groupConversationsByDate(
  conversations: Conversation[],
  locale: ConsultLanguage
) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const buckets: ConversationGroup[] = [
    { label: locale === "en" ? "Today" : "Hoy", items: [] },
    { label: locale === "en" ? "Yesterday" : "Ayer", items: [] },
    { label: locale === "en" ? "Previous 7 days" : "Últimos 7 días", items: [] },
    { label: locale === "en" ? "Older" : "Anteriores", items: [] },
  ];

  for (const c of conversations) {
    const d = startOfDay(new Date(c.created_at));
    if (d.getTime() === today.getTime()) buckets[0].items.push(c);
    else if (d.getTime() === yesterday.getTime()) buckets[1].items.push(c);
    else if (d.getTime() > weekAgo.getTime()) buckets[2].items.push(c);
    else buckets[3].items.push(c);
  }

  return buckets.filter((b) => b.items.length > 0);
}

/** Groups Fisioterapia conversations by the physiotherapist + clinic they belong to. */
function groupConversationsByPhysio(conversations: Conversation[]): ConversationGroup[] {
  const groups: ConversationGroup[] = [];
  const indexByLabel = new Map<string, number>();

  for (const c of conversations) {
    const physioName = c.physio_name?.trim() || "Fisioterapeuta";
    const clinicName = c.clinic_name?.trim() || null;
    const label = clinicName ? `${physioName} — ${clinicName}` : physioName;
    const idx = indexByLabel.get(label);
    if (idx === undefined) {
      indexByLabel.set(label, groups.length);
      groups.push({ label, physioName, clinicName, items: [c] });
    } else {
      groups[idx].items.push(c);
    }
  }

  return groups;
}

const GENERIC_PHYSIO_LABELS = new Set([
  "tu fisioterapeuta",
  "fisioterapeuta",
  "your physiotherapist",
]);

function collectPhysioHighlightPhrases(
  linked: LinkedPhysioInfo | null,
  conversations: Conversation[]
): string[] {
  const set = new Set<string>();
  const add = (value?: string | null) => {
    const trimmed = value?.trim();
    if (!trimmed || GENERIC_PHYSIO_LABELS.has(trimmed.toLowerCase())) return;
    set.add(trimmed);
  };
  add(linked?.physio_name);
  add(linked?.clinic_name);
  for (const c of conversations) {
    add(c.physio_name);
    add(c.clinic_name);
  }
  return [...set].sort((a, b) => b.length - a.length);
}

function PhysioHighlight({ children }: { children: string }) {
  return <strong className="font-bold text-inherit">{children}</strong>;
}

function withPhysioHighlights(
  text: string,
  phrases: string[],
  keyPrefix: string
): ReactNode {
  if (!text || phrases.length === 0) return text;
  const present = phrases.filter((p) =>
    text.toLowerCase().includes(p.toLowerCase())
  );
  if (present.length === 0) return text;
  const escaped = present.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).map((part, i) => {
    if (!part) return null;
    const matched = present.some((p) => p.toLowerCase() === part.toLowerCase());
    return matched ? (
      <PhysioHighlight key={`${keyPrefix}-${i}`}>{part}</PhysioHighlight>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    );
  });
}

function welcomeMessage(content: string = WELCOME_MESSAGE_ES): Message {
  return { id: WELCOME_ID, role: "assistant", content };
}

function stripMarkdownStars(text: string) {
  return stripVisibleMarkup(text);
}

function renderInlineText(text: string, phrases: string[], keyPrefix: string) {
  const inner = stripVisibleMarkup(text);
  if (phrases.some((p) => p.toLowerCase() === inner.toLowerCase())) {
    return <PhysioHighlight>{inner}</PhysioHighlight>;
  }
  return withPhysioHighlights(inner, phrases, keyPrefix);
}

function renderAssistantContent(content: string, highlightPhrases: string[] = []) {
  const shownTestIds = new Set<string>();

  return content.split("\n").map((line, li) => {
    const trimmed = line.trim();
    if (
      /^Fuente:/i.test(trimmed) ||
      /^- Fuente:/i.test(trimmed) ||
      /^Source:/i.test(trimmed) ||
      /^- Source:/i.test(trimmed)
    ) {
      return null;
    }

    const headingMatch = /^(#{1,6})\s*(.+)$/.exec(trimmed);
    const headingText = headingMatch?.[2] ?? null;
    const wholeBoldMatch = /^\*\*(.+)\*\*$/.exec(trimmed);
    const numberedText =
      headingText && /^\d+[.)]\s+\S/.test(headingText)
        ? headingText
        : wholeBoldMatch && /^\d+[.)]\s+\S/.test(wholeBoldMatch[1])
          ? wholeBoldMatch[1]
          : /^\d+[.)]\s+\S/.test(stripMarkdownStars(trimmed))
            ? stripMarkdownStars(trimmed)
            : null;

    const testImage = shouldShowClinicalTestImage({
      numberedText,
      headingText,
      wholeBoldText: wholeBoldMatch?.[1] ?? null,
    });
    const showImage =
      testImage && !shownTestIds.has(testImage.id) ? testImage : null;
    if (showImage) shownTestIds.add(showImage.id);

    const imageBlock = showImage ? (
      <div className="mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <Image
          src={showImage.src}
          alt={showImage.title}
          width={640}
          height={480}
          className="h-auto w-full max-w-md object-cover"
          sizes="(max-width: 768px) 100vw, 28rem"
        />
      </div>
    ) : null;

    if (numberedText) {
      const plain = stripMarkdownStars(trimmed);
      const withBody = /^(\d+[.)]\s+[^:]+):\s+(.+)$/.exec(plain);
      return (
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p className="text-neutral-900">
            <strong className="font-bold text-blue-700">
              {renderInlineText(
                withBody ? `${withBody[1]}:` : plain,
                highlightPhrases,
                `${li}-n`
              )}
            </strong>
            {withBody ? (
              <span className="text-neutral-900">
                {" "}
                {renderInlineText(withBody[2], highlightPhrases, `${li}-nb`)}
              </span>
            ) : null}
          </p>
          {imageBlock}
        </div>
      );
    }

    if (wholeBoldMatch && !numberedText) {
      return (
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p>
            <strong className="font-bold text-blue-700">
              {renderInlineText(
                wholeBoldMatch[1],
                highlightPhrases,
                `${li}-b`
              )}
            </strong>
          </p>
          {imageBlock}
        </div>
      );
    }

    if (headingText) {
      return (
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p>
            <strong className="font-bold text-blue-700">
              {renderInlineText(headingText, highlightPhrases, `${li}-h`)}
            </strong>
          </p>
          {imageBlock}
        </div>
      );
    }

    const rendered = line.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = stripVisibleMarkup(part.slice(2, -2));
        if (highlightPhrases.some((p) => p.toLowerCase() === inner.toLowerCase())) {
          return <PhysioHighlight key={i}>{inner}</PhysioHighlight>;
        }
        return (
          <strong key={i} className="font-bold text-blue-700">
            {withPhysioHighlights(inner, highlightPhrases, `${li}-${i}`)}
          </strong>
        );
      }
      return (
        <span key={i}>
          {renderInlineText(part, highlightPhrases, `${li}-${i}`)}
        </span>
      );
    });
    return (
      <div key={li} className={li > 0 ? "mt-2" : undefined}>
        <p className="text-neutral-900">{rendered}</p>
        {imageBlock}
      </div>
    );
  });
}

function shouldAnimateAssistantMessage(msg: Message, revealingMessageId: string | null) {
  return (
    msg.role === "assistant" &&
    msg.id !== WELCOME_ID &&
    !msg.id.startsWith("q-intro") &&
    msg.id === revealingMessageId
  );
}

/** Long clinical summaries should open at their top; short replies can stay at the bottom. */
function isLongAssistantReply(content: string) {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  return content.length >= 480 || lines.length >= 8;
}

type ChatInterfaceProps = {
  /** When set (Fisioterapia flow), welcome copy names the linked physio and explains the report. */
  linkedPhysio?: LinkedPhysioInfo | null;
  /** Called when the patient links another physio via invite code. */
  onLinkedPhysioChange?: (physio: LinkedPhysioInfo) => void;
  /** Pre-appointment guest (invite code, no full account). */
  guestMode?: boolean;
};

export function ChatInterface({
  linkedPhysio = null,
  onLinkedPhysioChange,
  guestMode = false,
}: ChatInterfaceProps) {
  const supabase = createClient();
  const { locale: uiLocale } = useUiLocale();
  const consultLanguage: ConsultLanguage = uiLocale;
  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name, {
        guest: guestMode,
        clinicName: linkedPhysio.clinic_name,
        language: consultLanguage,
      })
    : consultLanguage === "en"
      ? WELCOME_MESSAGE_EN
      : WELCOME_MESSAGE_ES;
  const introGreeting = linkedPhysio
    ? buildPhysioLinkedIntroGreeting(linkedPhysio.physio_name, consultLanguage)
    : undefined;
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const questionnaireRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [fisioBootDeadline, setFisioBootDeadline] = useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState(() => (uiLocale === "en" ? "New consultation" : "Nueva consulta"));
  const [messages, setMessages] = useState<Message[]>([]);
  // Fisioterapia never boots into the intro animation — wait for history first.
  const [physioIntro, setPhysioIntro] = useState(!linkedPhysio);
  const [phase, setPhase] = useState<Phase>("intro");
  const [initialMessage, setInitialMessage] = useState("");
  const [questionnairePart, setQuestionnairePart] = useState<BodyPartId | "generic">("shoulder");
  const [shoulderAnswers, setShoulderAnswers] = useState<ShoulderAdaptiveAnswers>(
    defaultShoulderAdaptiveAnswers
  );
  const [elbowAnswers, setElbowAnswers] = useState<ElbowAdaptiveAnswers>(
    defaultElbowAdaptiveAnswers
  );
  const [wristAnswers, setWristAnswers] = useState<WristAdaptiveAnswers>(
    defaultWristAdaptiveAnswers
  );
  const [fingerAnswers, setFingerAnswers] = useState<FingerAdaptiveAnswers>(
    defaultFingerAdaptiveAnswers
  );
  const [neckAnswers, setNeckAnswers] = useState<NeckAdaptiveAnswers>(
    defaultNeckAdaptiveAnswers
  );
  const [headAnswers, setHeadAnswers] = useState<HeadAdaptiveAnswers>(
    defaultHeadAdaptiveAnswers
  );
  const [lowerLegAnswers, setLowerLegAnswers] = useState<LowerLegAdaptiveAnswers>(
    defaultLowerLegAdaptiveAnswers
  );
  const [kneeAnswers, setKneeAnswers] = useState<KneeAdaptiveAnswers>(
    defaultKneeAdaptiveAnswers
  );
  const [backAnswers, setBackAnswers] = useState<BackAdaptiveAnswers>(
    defaultBackAdaptiveAnswers
  );
  const [hipAnswers, setHipAnswers] = useState<HipAdaptiveAnswers>(
    defaultHipAdaptiveAnswers
  );
  const kneeAnswersRef = useRef(kneeAnswers);
  const hipAnswersRef = useRef(hipAnswers);
  kneeAnswersRef.current = kneeAnswers;
  hipAnswersRef.current = hipAnswers;
  const [genericAnswers, setGenericAnswers] = useState<GenericConsultaAnswers>(
    defaultGenericConsultaAnswers
  );
  const [shoulderSectionIndex, setShoulderSectionIndex] = useState(0);
  const [elbowSectionIndex, setElbowSectionIndex] = useState(0);
  const [wristSectionIndex, setWristSectionIndex] = useState(0);
  const [fingerSectionIndex, setFingerSectionIndex] = useState(0);
  const [neckSectionIndex, setNeckSectionIndex] = useState(0);
  const [headSectionIndex, setHeadSectionIndex] = useState(0);
  const [lowerLegSectionIndex, setLowerLegSectionIndex] = useState(0);
  const [kneeSectionIndex, setKneeSectionIndex] = useState(0);
  const [backSectionIndex, setBackSectionIndex] = useState(0);
  const [hipSectionIndex, setHipSectionIndex] = useState(0);
  const [shoulderSectionError, setShoulderSectionError] = useState<string | null>(null);
  const [evaluatedParts, setEvaluatedParts] = useState<AdaptiveQuestionnairePart[]>([]);
  /** Remaining zones to evaluate one-by-one after the current questionnaire. */
  const [pendingParts, setPendingParts] = useState<AdaptiveQuestionnairePart[]>([]);
  /** Next zone waiting for patient confirmation (sí / no). */
  const [awaitingNextPart, setAwaitingNextPart] = useState<AdaptiveQuestionnairePart | null>(null);
  /** Per-zone AI orientations for the final multi-part summary. */
  const [partEvaluations, setPartEvaluations] = useState<
    { part: AdaptiveQuestionnairePart | "generic"; label: string; summary: string }[]
  >([]);
  const partEvaluationsRef = useRef(partEvaluations);
  partEvaluationsRef.current = partEvaluations;
  /** Avoid sending the multi-zone resumen twice in one consulta. */
  const multiPartSummarySentRef = useRef(false);
  /** Zones whose functional tests the patient already completed in this consult. */
  const [functionalTestsCompletedParts, setFunctionalTestsCompletedParts] =
    useState<AdaptiveQuestionnairePart[]>([]);
  const functionalTestsCompletedRef = useRef(functionalTestsCompletedParts);
  functionalTestsCompletedRef.current = functionalTestsCompletedParts;
  /** After first orientation (no more queued zones): chat stays open for tests / related Qs. */
  const [relatedFollowupActive, setRelatedFollowupActive] = useState(false);
  /** True once we've asked "any other question related to this injury?" */
  const [postGuidanceAsked, setPostGuidanceAsked] = useState(false);
  /** Soft Nueva consulta button when the patient drifts to another topic. */
  const [showUnrelatedCta, setShowUnrelatedCta] = useState(false);
  /** Original complaint while we ask where on the arm/leg it hurts. */
  const [pendingComplaintText, setPendingComplaintText] = useState<string | null>(
    null
  );

  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  /** Injury photo kept from intro through the questionnaire for the clinical AI call */
  const [caseImageUrl, setCaseImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [revealingMessageId, setRevealingMessageId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  /** When true, keep the viewport pinned to the start of the revealing AI message. */
  const pinRevealToStartRef = useRef(false);

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [linkedPhysioLabel, setLinkedPhysioLabel] = useState<string | null>(null);
  const [physioReportSentBanner, setPhysioReportSentBanner] = useState(false);
  /** After entering a new physio code, allow starting a fresh assigned consult. */
  const [fisioNewConsultDraft, setFisioNewConsultDraft] = useState(false);
  const [showPhysioCodeEntry, setShowPhysioCodeEntry] = useState(false);
  const pendingFisioCodeReload = useRef(false);
  /** Fisioterapia: wait for functional-test answers before generating the physio report. */
  const pendingPhysioReportRef = useRef<{
    patientId: string;
    conversationId: string;
    bodyArea: string;
    onsetType: string;
    painLevel: number;
    hadTrauma: string;
    description: string;
    symptomContext: string;
    patientSummary: string;
    language: ConsultLanguage;
    /** True while Sí/No functional tests are still outstanding — do not send yet. */
    awaitFunctionalTests?: boolean;
  } | null>(null);
  const physioReportInFlightRef = useRef(false);
  const autoSpokenIdsRef = useRef<Set<string>>(new Set());
  const [conversationMode, setConversationMode] = useState(false);
  const conversationModeRef = useRef(false);
  const conversationBusyRef = useRef(false);
  const startMicRef = useRef<() => void>(() => {});
  const stopMicRef = useRef<() => void>(() => {});
  const sendVoiceTurnRef = useRef<(text: string) => void>(() => {});
  const pendingVoiceTextRef = useRef<string | null>(null);
  const hearingTextRef = useRef("");
  const silenceTimerRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const SILENCE_MS = 3000;
  const keyboardOverlap = useKeyboardOverlap();

  useEffect(() => {
    if (phase !== "questionnaire") return;
    const root = messagesRef.current;
    if (!root) return;

    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLTextAreaElement ||
        (t instanceof HTMLInputElement &&
          t.type !== "button" &&
          t.type !== "checkbox" &&
          t.type !== "radio" &&
          t.type !== "submit")
      ) {
        ensureQuestionnaireFieldVisible(t);
      }
    };

    const onViewportChange = () => {
      const active = document.activeElement;
      if (
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLInputElement
      ) {
        if (root.contains(active)) ensureQuestionnaireFieldVisible(active);
      }
    };

    root.addEventListener("focusin", onFocusIn);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onViewportChange);
    vv?.addEventListener("scroll", onViewportChange);
    return () => {
      root.removeEventListener("focusin", onFocusIn);
      vv?.removeEventListener("resize", onViewportChange);
      vv?.removeEventListener("scroll", onViewportChange);
    };
  }, [phase]);

  const {
    supported: ttsSupported,
    speakingId,
    speak,
    cancel: cancelSpeech,
    toggle: toggleSpeak,
  } = useSpeechSynthesis({ language: consultLanguage });
  const speakRef = useRef(speak);
  speakRef.current = speak;

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resumeConversationListening = useCallback(() => {
    conversationBusyRef.current = false;
    hearingTextRef.current = "";
    clearSilenceTimer();
    if (!conversationModeRef.current) return;
    if (phaseRef.current === "questionnaire") return;
    window.setTimeout(() => {
      if (
        conversationModeRef.current &&
        !conversationBusyRef.current &&
        phaseRef.current !== "questionnaire"
      ) {
        startMicRef.current();
      }
    }, 500);
  }, [clearSilenceTimer]);

  const {
    supported: sttSupported,
    listening,
    error: sttError,
    start: startMic,
    stop: stopMic,
  } = useSpeechToText({
    language: consultLanguage,
    keepAlive: conversationMode,
    onHearing: (heard) => {
      if (!conversationModeRef.current || conversationBusyRef.current) return;
      hearingTextRef.current = heard;
      setInput(heard);
      clearSilenceTimer();
      silenceTimerRef.current = window.setTimeout(() => {
        if (!conversationModeRef.current || conversationBusyRef.current) return;
        const text = hearingTextRef.current.trim();
        if (text.length < 2) return;
        conversationBusyRef.current = true;
        clearSilenceTimer();
        stopMicRef.current();
        sendVoiceTurnRef.current(text);
      }, SILENCE_MS);
    },
  });

  startMicRef.current = startMic;
  stopMicRef.current = stopMic;

  function toggleConversationMode() {
    clearSilenceTimer();
    hearingTextRef.current = "";
    if (conversationMode) {
      conversationModeRef.current = false;
      setConversationMode(false);
      conversationBusyRef.current = false;
      stopMic();
      cancelSpeech();
      return;
    }
    // Don't auto-speak older history when conversation starts.
    for (const m of messages) {
      if (m.role === "assistant") autoSpokenIdsRef.current.add(m.id);
    }
    conversationModeRef.current = true;
    setConversationMode(true);
    conversationBusyRef.current = false;
    cancelSpeech();
    if (phase !== "questionnaire") startMic();
  }

  // Speak each new assistant reply in conversation mode (doesn't rely only on reveal animation).
  useEffect(() => {
    if (!conversationMode) return;
    if (revealingMessageId) return;
    if (phase === "questionnaire") return;

    const last = [...messages]
      .reverse()
      .find(
        (m) =>
          m.role === "assistant" &&
          m.id !== WELCOME_ID &&
          !m.id.startsWith("q-intro")
      );
    if (!last || autoSpokenIdsRef.current.has(last.id)) return;

    autoSpokenIdsRef.current.add(last.id);
    stopMicRef.current();
    conversationBusyRef.current = true;
    speakRef.current(last.content, last.id, {
      onEnd: () => {
        if (phaseRef.current === "questionnaire") return;
        resumeConversationListening();
      },
    });
  }, [messages, revealingMessageId, conversationMode, phase, resumeConversationListening]);

  // Pause mic during questionnaire; keep conversation mode so voice resumes after.
  useEffect(() => {
    if (!conversationModeRef.current) return;
    if (phase === "questionnaire") {
      clearSilenceTimer();
      stopMic();
      conversationBusyRef.current = true;
      return;
    }
    // After questionnaire → followup, wait for AI reveal/speak to resume (busy stays true
    // until orientation is spoken). If already idle on followup/intro, resume.
    if (
      (phase === "followup" || phase === "intro") &&
      conversationBusyRef.current &&
      !loading &&
      !revealingMessageId
    ) {
      // Orientation may still be arriving; the reveal/speak path resumes.
      // Fallback if nothing is coming:
      const t = window.setTimeout(() => {
        if (
          conversationModeRef.current &&
          conversationBusyRef.current &&
          !loading &&
          !revealingMessageId
        ) {
          resumeConversationListening();
        }
      }, 4000);
      return () => window.clearTimeout(t);
    }
  }, [
    phase,
    loading,
    revealingMessageId,
    stopMic,
    clearSilenceTimer,
    resumeConversationListening,
  ]);

  function clearAttachment() {
    setAttachedFile(null);
    if (attachedPreview?.startsWith("blob:")) URL.revokeObjectURL(attachedPreview);
    setAttachedPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  function onAttachmentSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const isImage = isConsultImageFile(file);
    const isPdf = isConsultPdfFile(file);
    if (!isImage && !isPdf) {
      alert("Selecciona una foto (JPG, PNG, WebP) o un PDF.");
      return;
    }
    if (file.size > MAX_CONSULT_ATTACHMENT_BYTES) {
      alert("El archivo es demasiado grande (máx. 10 MB).");
      return;
    }
    if (attachedPreview?.startsWith("blob:")) URL.revokeObjectURL(attachedPreview);
    setAttachedFile(file);
    setAttachedPreview(isImage ? URL.createObjectURL(file) : null);
  }

  async function uploadOutgoingPhoto(): Promise<string | null> {
    if (!attachedFile) return null;
    const url = await uploadConsultPhoto(attachedFile);
    clearAttachment();
    return url;
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!linkedPhysio) return;
    const t = window.setTimeout(() => setFisioBootDeadline(true), 800);
    return () => window.clearTimeout(t);
  }, [linkedPhysio]);

  useEffect(() => {
    if (!pendingFisioCodeReload.current || !linkedPhysio) return;
    pendingFisioCodeReload.current = false;
    void loadConversations({ skipAutoOpen: true });
  }, [linkedPhysio]);

  const updateScrollDownVisibility = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollDown(distance > 96);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const scrollToBottomAfterPaint = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    });
  }, [scrollToBottom]);

  const scrollToMessageStart = useCallback((id: string, behavior: ScrollBehavior = "smooth") => {
    const run = () => {
      const scrollEl = messagesRef.current;
      const msgEl = messageRefs.current.get(id);
      if (!scrollEl || !msgEl) return;
      const top =
        msgEl.getBoundingClientRect().top -
        scrollEl.getBoundingClientRect().top +
        scrollEl.scrollTop -
        12;
      scrollEl.scrollTo({ top: Math.max(0, top), behavior });
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, []);

  const beginAssistantReveal = useCallback((id: string, content: string) => {
    pinRevealToStartRef.current = isLongAssistantReply(content);
    setRevealingMessageId(id);
  }, []);

  const scrollQuestionnaireToTop = useCallback(() => {
    requestAnimationFrame(() => {
      const scrollEl = messagesRef.current;
      const cardEl = questionnaireRef.current;
      if (!scrollEl || !cardEl) return;
      const scrollTop =
        cardEl.getBoundingClientRect().top -
        scrollEl.getBoundingClientRect().top +
        scrollEl.scrollTop -
        8;
      scrollEl.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" });
    });
  }, []);

  const withQuestionnaireScroll = useCallback(
    (setter: React.Dispatch<React.SetStateAction<number>>) => (index: number) => {
      setter(index);
      scrollQuestionnaireToTop();
    },
    [scrollQuestionnaireToTop]
  );

  useEffect(() => {
    if (!revealingMessageId) return;
    if (pinRevealToStartRef.current) {
      scrollToMessageStart(revealingMessageId, "auto");
      const t1 = window.setTimeout(
        () => scrollToMessageStart(revealingMessageId, "auto"),
        80
      );
      const t2 = window.setTimeout(
        () => scrollToMessageStart(revealingMessageId, "smooth"),
        220
      );
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    scrollToBottom("smooth");
  }, [revealingMessageId, scrollToMessageStart, scrollToBottom]);

  useEffect(() => {
    updateScrollDownVisibility();
  }, [messages, loading, phase, physioIntro, updateScrollDownVisibility]);

  function skipPhysioIntro() {
    if (!physioIntro || activeId) return;
    setPhysioIntro(false);
    setMessages((prev) => (prev.length === 0 ? [welcomeMessage(welcomeText)] : prev));
  }

  useEffect(() => {
    if (!physioIntro || activeId) return;
    const timer = setTimeout(() => {
      skipPhysioIntro();
    }, 5000);
    return () => clearTimeout(timer);
  }, [physioIntro, activeId]);

  async function loadConversations(opts?: { skipAutoOpen?: boolean }) {
    try {
      const { data } = await supabase
        .from("conversations")
        .select("id, title, created_at, physio_id, physio_name, clinic_name")
        .eq("kind", linkedPhysio ? "fisioterapia" : "consulta")
        .order("created_at", { ascending: false })
        .limit(linkedPhysio ? 30 : 10);
      const list = (data as Conversation[]) ?? [];
      setConversations(list);

      // Fisioterapia: open latest assigned chat before revealing the UI (avoids intro /
      // empty-chat / typing-indicator flashes when switching from Consulta).
      if (linkedPhysio && list.length > 0 && !opts?.skipAutoOpen) {
        const preferred =
          (linkedPhysio.physio_id
            ? list.find((c) => c.physio_id === linkedPhysio.physio_id)
            : null) ?? list[0];
        await loadConversation(preferred.id, preferred.title);
        return;
      }

      if (linkedPhysio) {
        // First assigned consult — show intro only once history is confirmed empty.
        setPhysioIntro(true);
      }
    } catch (err) {
      console.error("No se pudieron cargar las consultas:", err);
      if (linkedPhysio) setPhysioIntro(true);
    } finally {
      setHistoryLoaded(true);
    }
  }

  async function loadConversation(id: string, title: string) {
    setActiveId(id);
    setActiveTitle(title);
    setOpeningConversation(true);
    setMobileSidebarOpen(false);
    setPhysioIntro(false);
    setRevealingMessageId(null);
    setEvaluatedParts([]);
    setPendingParts([]);
    setAwaitingNextPart(null);
    setPartEvaluations([]);
    partEvaluationsRef.current = [];
    multiPartSummarySentRef.current = false;
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setCaseImageUrl(null);
    clearAttachment();
    setPhysioReportSentBanner(false);

    try {
      const { data } = await supabase
        .from("messages")
        .select("id, role, content, image_url, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      let msgs = (data as Message[]) ?? [];

      if (linkedPhysio) {
        const { data: report } = await supabase
          .from("clinical_reports")
          .select("id")
          .eq("conversation_id", id)
          .limit(1)
          .maybeSingle();

        // Patients must not see the clinical orientation — only the thank-you copy.
        msgs = msgs.filter(
          (m) =>
            m.role !== "assistant" ||
            !/\*\*Resumen de tu consulta\*\*|Estructuras que podrían estar afectadas|Posibles lesiones \(orientativas\)/i.test(
              m.content
            )
        );

        if (report) {
          setPhase("complete");
          setPhysioReportSentBanner(true);
          setLinkedPhysioLabel(
            [linkedPhysio.physio_name, linkedPhysio.clinic_name]
              .filter(Boolean)
              .join(" · ") || null
          );
        } else {
          setPhase("followup");
        }
      } else {
        const finished = msgs.some(
          (m) => m.role === "assistant" && isConsultaFinishedCloseMessage(m.content)
        );
        if (finished) {
          setPhase("complete");
        } else {
          setPhase("followup");
          const hasOrientation = msgs.some(
            (m) =>
              m.role === "assistant" &&
              /\*\*Resumen de tu consulta\*\*|Summary of your consultation/i.test(
                m.content
              )
          );
          if (hasOrientation) {
            setRelatedFollowupActive(true);
            const lastAsst = [...msgs]
              .reverse()
              .find((m) => m.role === "assistant");
            if (
              lastAsst &&
              /otra pregunta relacionada|any other question related|alguna otra duda relacionada/i.test(
                lastAsst.content
              )
            ) {
              setPostGuidanceAsked(true);
            }
          }
        }
      }

      setMessages(msgs);
    } catch (err) {
      console.error("No se pudo abrir la consulta:", err);
      setMessages([]);
    } finally {
      setOpeningConversation(false);
      setHistoryLoaded(true);
    }
  }

  function clearToFisioIdle() {
    setActiveId(null);
    setActiveTitle(
      linkedPhysio
        ? `Consulta con ${physioDisplayName(linkedPhysio.physio_name)}`
        : "Nueva consulta"
    );
    setMessages([]);
    setRevealingMessageId(null);
    setShowScrollDown(false);
    setPhysioIntro(false);
    setPhase("intro");
    setInitialMessage("");
    setEvaluatedParts([]);
    setPendingParts([]);
    setAwaitingNextPart(null);
    setPartEvaluations([]);
    partEvaluationsRef.current = [];
    multiPartSummarySentRef.current = false;
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setInput("");
    setCaseImageUrl(null);
    clearAttachment();
    setMobileSidebarOpen(false);
    setPhysioReportSentBanner(false);
  }

  async function deleteConversation(id: string) {
    if (
      !window.confirm(
        "¿Eliminar esta consulta? Se borrará el historial de mensajes y no se puede deshacer."
      )
    ) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert("No se pudo eliminar la consulta. Inténtalo de nuevo.");
      return;
    }

    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeId === id) {
      if (linkedPhysio) {
        if (remaining[0]) {
          await loadConversation(remaining[0].id, remaining[0].title);
        } else {
          clearToFisioIdle();
        }
      } else {
        startNewConsultation();
      }
    }
  }

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async function callAI(
    body: Record<string, unknown>,
    languageOverride?: ConsultLanguage
  ): Promise<string> {
    const session = await getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({
        language: languageOverride ?? consultLanguage,
        ...(linkedPhysio
          ? {
              fisioterapiaFlow: true,
              linkedPhysioName: linkedPhysio.physio_name,
              linkedClinicName: linkedPhysio.clinic_name ?? null,
            }
          : {}),
        ...body,
      }),
    });
    if (!res.ok) throw new Error("Error en la IA");
    const data = (await res.json()) as { answer: string };
    return data.answer;
  }

  async function callEdgeJson(
    body: Record<string, unknown>,
    languageOverride?: ConsultLanguage
  ): Promise<unknown> {
    const session = await getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({
        language: languageOverride ?? consultLanguage,
        ...(linkedPhysio
          ? {
              fisioterapiaFlow: true,
              linkedPhysioName: linkedPhysio.physio_name,
              linkedClinicName: linkedPhysio.clinic_name ?? null,
            }
          : {}),
        ...body,
      }),
    });
    if (!res.ok) throw new Error("Error en la IA");
    return res.json();
  }

  /**
   * Fisioterapia flow only: generate clinician report for the linked physio dashboard.
   */
  async function maybeGenerateAndSendPhysioReport(params: {
    patientId: string;
    conversationId: string;
    bodyArea: string;
    onsetType: string;
    painLevel: number;
    hadTrauma: string;
    description: string;
    symptomContext: string;
    patientSummary: string;
    language: ConsultLanguage;
  }): Promise<{ sent: boolean; physioLabel?: string | null }> {
    if (physioReportInFlightRef.current) {
      return { sent: false };
    }
    physioReportInFlightRef.current = true;
    try {
      const { data: patientProfile } = await supabase
        .from("profiles")
        .select("physio_id")
        .eq("id", params.patientId)
        .maybeSingle();
      const physioId =
        (patientProfile as { physio_id?: string | null } | null)?.physio_id ||
        linkedPhysio?.physio_id ||
        null;
      if (!physioId && !linkedPhysio?.physio_id) {
        console.error(
          "No se pudo generar el informe: falta physio_id (perfil o código)."
        );
        return { sent: false };
      }

      const raw = await callEdgeJson(
        {
          mode: "physio_report",
          bodyArea: params.bodyArea,
          onsetType: params.onsetType,
          painLevel: params.painLevel,
          hadTrauma: params.hadTrauma,
          description: params.description,
          symptomContext: params.symptomContext,
          patientSummary: params.patientSummary,
        },
        params.language
      );
      const answer = (raw as { answer?: string } | null)?.answer?.trim();
      if (!answer) return { sent: false };

      const { data: reportId, error: insertError } = await supabase.rpc(
        "patient_submit_clinical_report",
        {
          p_conversation_id: params.conversationId,
          p_body_area: params.bodyArea,
          p_patient_summary: params.patientSummary,
          p_physio_report: answer,
          p_fallback_physio_id: physioId,
        }
      );
      if (insertError || !reportId) {
        console.error("No se pudo guardar el informe para el fisioterapeuta:", insertError);
        return { sent: false };
      }

      let physioLabel: string | null = null;
      try {
        const { data: linked } = await supabase.rpc("patient_get_linked_physio");
        const row = Array.isArray(linked) ? linked[0] : linked;
        physioLabel =
          [row?.physio_name, row?.clinic_name].filter(Boolean).join(" · ") || null;
      } catch {
        physioLabel = null;
      }
      return { sent: true, physioLabel };
    } catch (err) {
      console.error("No se pudo generar el informe para el fisioterapeuta:", err);
      return { sent: false };
    } finally {
      physioReportInFlightRef.current = false;
    }
  }

  async function triageMessage(
    text: string,
    imageUrl?: string | null,
    languageOverride?: ConsultLanguage
  ) {
    try {
      const raw = await callEdgeJson(
        {
          mode: "triage",
          message: text,
          ...(imageUrl ? { imageUrl } : {}),
        },
        languageOverride
      );
      return refineTriageBodyPart(parseTriageResult(raw), text);
    } catch {
      return refineTriageBodyPart(fallbackTriageFromText(text), text);
    }
  }

  function resetQuestionnaireState(part: AdaptiveQuestionnairePart | "generic") {
    setQuestionnairePart(part);
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setElbowAnswers(defaultElbowAdaptiveAnswers());
    setWristAnswers(defaultWristAdaptiveAnswers());
    setFingerAnswers(defaultFingerAdaptiveAnswers());
    setNeckAnswers(defaultNeckAdaptiveAnswers());
    setHeadAnswers(defaultHeadAdaptiveAnswers());
    setLowerLegAnswers(defaultLowerLegAdaptiveAnswers());
    setKneeAnswers(defaultKneeAdaptiveAnswers());
    setBackAnswers(defaultBackAdaptiveAnswers());
    setHipAnswers(defaultHipAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setNeckSectionIndex(0);
    setHeadSectionIndex(0);
    setLowerLegSectionIndex(0);
    setKneeSectionIndex(0);
    setBackSectionIndex(0);
    setHipSectionIndex(0);
    setShoulderSectionError(null);
  }

  function markPartEvaluated(part: BodyPartId | "generic") {
    if (part !== "generic") {
      setEvaluatedParts((prev) =>
        prev.includes(part as AdaptiveQuestionnairePart)
          ? prev
          : [...prev, part as AdaptiveQuestionnairePart]
      );
    }
  }

  function beginQuestionnaire(
    text: string,
    part: AdaptiveQuestionnairePart | "generic",
    language: ConsultLanguage = consultLanguage,
    remainingCount = 0
  ) {
    const pending = pendingComplaintText?.trim();
    const contextText =
      pending && !text.toLowerCase().includes(pending.toLowerCase().slice(0, 40))
        ? `${pending}\n${text}`.trim()
        : text;
    setPendingComplaintText(null);
    setInitialMessage(contextText);
    resetQuestionnaireState(part);
    setAwaitingNextPart(null);
    if (part === "ankle_foot") {
      setLowerLegAnswers(
        withAnkleFootFocusFromText(
          contextText,
          resolveAnkleFootFocus(contextText)
        )
      );
    } else if (part === "shoulder") {
      setShoulderAnswers(withShoulderHintsFromText(contextText));
    } else if (part === "elbow") {
      setElbowAnswers(withElbowHintsFromText(contextText));
    }
    let intro = questionnaireIntroMessage(part, language, contextText);
    if (remainingCount > 0) {
      intro +=
        language === "en"
          ? `\n\nYou mentioned more than one area — we'll go one by one. After this, ${remainingCount} more questionnaire${remainingCount === 1 ? "" : "s"} remain.`
          : `\n\nHas mencionado más de una zona: iremos **una a una**. Después de esta, quedan ${remainingCount} cuestionario${remainingCount === 1 ? "" : "s"} más.`;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: `q-intro-${Date.now()}`,
        role: "assistant",
        content: intro,
      },
    ]);
    setPhase("questionnaire");
  }

  function startQuestionnaireQueue(
    text: string,
    language: ConsultLanguage,
    preferredFirst?: AdaptiveQuestionnairePart | "generic"
  ) {
    const launch = resolveQuestionnaireLaunch(text, evaluatedParts, preferredFirst);
    if (!launch) return false;
    setPendingParts(launch.rest);
    beginQuestionnaire(text, launch.first, language, launch.rest.length);
    return true;
  }

  async function finishConsultaSession(
    conversationId: string,
    language: ConsultLanguage
  ) {
    if (linkedPhysio) return;
    setAwaitingNextPart(null);
    setPendingParts([]);
    setShowUnrelatedCta(false);
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    const closing = consultaFinishedCloseMessage(language);
    try {
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: closing,
        })
        .select("id, role, content, created_at")
        .single();
      if (aiMsg) {
        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);
      }
    } catch {
      // Still lock the session so the patient can open a new consulta.
    }
    setPhase("complete");
  }

  function hasMoreZonesPending(
    completedPart?: AdaptiveQuestionnairePart | "generic"
  ): boolean {
    if (awaitingNextPart) return true;
    if (pendingParts.length > 0) return true;
    const evaluated = [
      ...evaluatedParts,
      ...(completedPart && completedPart !== "generic"
        ? [completedPart as AdaptiveQuestionnairePart]
        : []),
    ];
    return pendingPartsFromText(initialMessage, evaluated).length > 0;
  }

  function resolveNextZone(
    completedPart?: AdaptiveQuestionnairePart | "generic"
  ): AdaptiveQuestionnairePart | null {
    return resolveNextPendingZone(
      initialMessage,
      evaluatedParts,
      pendingParts,
      awaitingNextPart,
      completedPart
    );
  }

  function ensureAwaitingNextZone(
    completedPart: AdaptiveQuestionnairePart | "generic"
  ): AdaptiveQuestionnairePart | null {
    const next = resolveNextZone(completedPart);
    if (!next) return null;
    if (!awaitingNextPart) {
      const evaluated = [
        ...evaluatedParts,
        ...(completedPart !== "generic"
          ? [completedPart as AdaptiveQuestionnairePart]
          : []),
      ];
      const queue =
        pendingParts.length > 0
          ? pendingParts
          : pendingPartsFromText(initialMessage, evaluated);
      setPendingParts(queue.filter((part) => part !== next));
      setAwaitingNextPart(next);
    }
    return next;
  }

  async function promptNextZoneQuestionnaire(
    conversationId: string,
    completedPart: AdaptiveQuestionnairePart | "generic",
    language: ConsultLanguage,
    opts?: { functionalTestsDone?: boolean }
  ): Promise<boolean> {
    const next = ensureAwaitingNextZone(completedPart);
    if (!next) return false;
    await appendAssistantMessage(
      conversationId,
      nextPartReadyMessage(
        completedPart,
        next,
        language,
        initialMessage,
        {
          functionalTestsDone:
            opts?.functionalTestsDone ??
            isFunctionalTestsDoneForPart(
              completedPart !== "generic" ? completedPart : undefined
            ),
        }
      )
    );
    return true;
  }

  function currentInjuryLabel(): string {
    if (partEvaluationsRef.current.length > 0) {
      return partEvaluationsRef.current.map((e) => e.label).join(", ");
    }
    return patientFacingPartLabel(
      questionnairePart === "generic" ? "generic" : questionnairePart,
      initialMessage,
      consultLanguage
    );
  }

  function casePartsForRelatedGate(): AdaptiveQuestionnairePart[] {
    const fromEvals = partEvaluationsRef.current
      .map((e) => e.part)
      .filter((p): p is AdaptiveQuestionnairePart => p !== "generic");
    return [...new Set([...evaluatedParts, ...fromEvals])];
  }

  async function appendAssistantMessage(
    conversationId: string,
    content: string
  ) {
    const { data: aiMsg } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content,
      })
      .select("id, role, content, created_at")
      .single();
    if (aiMsg) {
      beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
      setMessages((prev) => [...prev, aiMsg as Message]);
    }
    return aiMsg as Message | null;
  }

  async function activateRelatedFollowup(
    conversationId: string,
    language: ConsultLanguage,
    options?: { askNow?: boolean; offeredTests?: boolean }
  ) {
    setRelatedFollowupActive(true);
    setShowUnrelatedCta(false);
    if (options?.askNow || options?.offeredTests === false) {
      await appendAssistantMessage(
        conversationId,
        askMoreRelatedQuestionsPrompt(language)
      );
      setPostGuidanceAsked(true);
    }
  }

  async function appendMultiPartFinalSummary(
    conversationId: string,
    evaluations: {
      part: AdaptiveQuestionnairePart | "generic";
      label: string;
      summary: string;
    }[],
    language: ConsultLanguage
  ) {
    if (linkedPhysio || evaluations.length < 2) return;
    if (multiPartSummarySentRef.current) return;
    multiPartSummarySentRef.current = true;
    try {
      const message = evaluations
        .map((e) => `=== ${e.label} ===\n${e.summary}`)
        .join("\n\n");
      const bodyArea = evaluations.map((e) => e.label).join(", ");
      const answer = await callAI(
        {
          mode: "multi_part_summary",
          message,
          bodyArea,
        },
        language
      );
      await appendAssistantMessage(conversationId, answer);
    } catch {
      multiPartSummarySentRef.current = false;
    }
  }

  function recordPartEvaluation(
    part: AdaptiveQuestionnairePart | "generic",
    summary: string,
    labelHint?: string
  ) {
    const label =
      labelHint?.trim() ||
      patientFacingPartLabel(
        part === "generic" ? "generic" : part,
        initialMessage,
        consultLanguage
      );
    const entry = { part, label, summary: summary.trim() };
    const next = [
      ...partEvaluationsRef.current.filter((e) => e.part !== part),
      entry,
    ];
    partEvaluationsRef.current = next;
    setPartEvaluations(next);
    return next;
  }

  function markFunctionalTestsDone(part: AdaptiveQuestionnairePart) {
    setFunctionalTestsCompletedParts((prev) => {
      if (prev.includes(part)) return prev;
      const next = [...prev, part];
      functionalTestsCompletedRef.current = next;
      return next;
    });
  }

  function isFunctionalTestsDoneForPart(
    part: AdaptiveQuestionnairePart | "generic" | undefined
  ): boolean {
    if (!part || part === "generic") return false;
    return functionalTestsCompletedRef.current.includes(part);
  }

  async function offerNextPendingPart(
    conversationId: string,
    completedPart: AdaptiveQuestionnairePart | "generic",
    language: ConsultLanguage,
    completedSummary?: string,
    areaLabel?: string
  ) {
    const evaluations = completedSummary?.trim()
      ? recordPartEvaluation(completedPart, completedSummary, areaLabel)
      : partEvaluationsRef.current;

    const nextFromQueue = pendingParts[0];
    const rest = pendingParts.slice(1);
    const recomputed = pendingPartsFromText(initialMessage, [
      ...evaluatedParts,
      ...(completedPart !== "generic" ? [completedPart as AdaptiveQuestionnairePart] : []),
    ]);
    const next = nextFromQueue ?? recomputed[0] ?? null;
    const remaining = nextFromQueue
      ? rest
      : recomputed.filter((p) => p !== next);

    if (!next || linkedPhysio) {
      setPendingParts([]);
      setAwaitingNextPart(null);
      if (linkedPhysio) return;
      // Keep chat open for functional tests / related questions — do NOT finish here.
      const offeredTests =
        Boolean(completedSummary) &&
        /\*\*Preguntas de valoración funcional\*\*|Functional assessment questions|\*\*Preguntas de valoraci[oó]n funcional\*\*/i.test(
          completedSummary ?? ""
        );
      // Multi-zone resumen waits until the patient reports functional-test
      // results for this last injury. If no tests were offered, send it now.
      if (!offeredTests && evaluations.length >= 2) {
        await appendMultiPartFinalSummary(conversationId, evaluations, language);
      }
      await activateRelatedFollowup(conversationId, language, {
        offeredTests,
        askNow: !offeredTests,
      });
      return;
    }

    setPendingParts(remaining);
    setAwaitingNextPart(next);
    const testsDone = isFunctionalTestsDoneForPart(completedPart);
    const prompt = nextPartReadyMessage(
      completedPart,
      next,
      language,
      initialMessage,
      { functionalTestsDone: testsDone }
    );
    const { data: aiMsg } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, role: "assistant", content: prompt })
      .select("id, role, content, created_at")
      .single();
    if (aiMsg) {
      setMessages((prev) => [...prev, aiMsg as Message]);
    }
  }

  async function respondToInitialMessage(
    text: string,
    triage: ReturnType<typeof parseTriageResult>,
    imageUrl?: string | null,
    language: ConsultLanguage = consultLanguage
  ) {
    const visionUrl = consultVisionUrl(imageUrl);
    let answer = triage.answer?.trim() ?? "";

    if (!answer) {
      if (triage.intent === "symptom_other") {
        answer = await callAI(
          {
            mode: "clinical_screen",
            message: text,
            bodyArea: bodyAreaLabelFromText(text),
            ...(visionUrl ? { imageUrl: visionUrl } : {}),
          },
          language
        );
      } else {
        answer = await callAI(
          {
            mode: "general_chat",
            message: text,
            ...(visionUrl ? { imageUrl: visionUrl } : {}),
          },
          language
        );
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

    if (linkedPhysio && conversations.length > 0 && !fisioNewConsultDraft) {
      throw new Error(
        "En Fisioterapia no se pueden abrir chats nuevos. Continúa una consulta existente o usa la pestaña Consulta."
      );
    }

    const title = conversationTitleFromText(text);
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .insert({
        title,
        user_id: user.id,
        kind: linkedPhysio ? "fisioterapia" : "consulta",
        physio_id: linkedPhysio?.physio_id ?? null,
        physio_name: linkedPhysio?.physio_name ?? null,
        clinic_name: linkedPhysio?.clinic_name ?? null,
      })
      .select("id, title, created_at, physio_id, physio_name, clinic_name")
      .single();
    if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");

    await supabase.from("messages").insert([
      { conversation_id: conv.id, role: "assistant", content: welcomeText },
      {
        conversation_id: conv.id,
        role: "user",
        content: text,
        image_url: imageUrl ?? null,
      },
      { conversation_id: conv.id, role: "assistant", content: answer },
    ]);

    setActiveId(conv.id);
    setActiveTitle(title);
    setConversations((prev) => [conv as Conversation, ...prev].slice(0, 10));
    setFisioNewConsultDraft(false);
    setInitialMessage(text);
    setCaseImageUrl(null);
    const aiMsgId = `ai-${Date.now()}`;
    beginAssistantReveal(aiMsgId, answer);
    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: "assistant", content: answer },
    ]);
    setPhase("followup");
  }

  function conversationTitleFromText(text: string): string {
    const short = text.trim().slice(0, 40);
    return short.length < text.trim().length ? `${short}…` : short;
  }

  function buildSymptomContext(): string {
    const introBlock = `Descripción inicial del paciente:\n${initialMessage}`;
    if (questionnairePart === "shoulder") {
      return formatShoulderAdaptive(
        shoulderAnswers,
        introBlock,
        resolveShoulderQuestionnaireFocus(initialMessage)
      );
    }
    if (questionnairePart === "elbow") {
      return formatElbowAdaptive(elbowAnswers, introBlock);
    }
    if (questionnairePart === "wrist_hand") {
      return formatWristAdaptive(wristAnswers, initialMessage);
    }
    if (questionnairePart === "finger") {
      return formatFingerAdaptive(fingerAnswers, introBlock);
    }
    if (questionnairePart === "head") {
      return formatHeadAdaptive(headAnswers, introBlock);
    }
    if (questionnairePart === "neck") {
      return formatNeckAdaptive(neckAnswers, introBlock);
    }
    if (questionnairePart === "ankle_foot") {
      return formatLowerLegAdaptive(lowerLegAnswers, introBlock);
    }
    if (questionnairePart === "knee") {
      return formatKneeAdaptive(kneeAnswersRef.current, introBlock);
    }
    if (questionnairePart === "back") {
      return formatBackAdaptive(backAnswers, introBlock);
    }
    if (questionnairePart === "hip") {
      return formatHipAdaptive(hipAnswersRef.current, introBlock);
    }
    return formatGenericConsulta(genericAnswers, introBlock);
  }

  async function handleIntroSubmit() {
    const text =
      (pendingVoiceTextRef.current ?? input).trim() ||
      (attachedFile ? consultAttachmentCaption(attachedFile) : "");
    pendingVoiceTextRef.current = null;
    if ((!text && !attachedFile) || loading || phase !== "intro" || physioIntro) {
      if (conversationModeRef.current) resumeConversationListening();
      return;
    }
    const userMsgId = `user-${Date.now()}`;
    setInput("");
    setLoading(true);

    try {
      const attachmentUrl = await uploadOutgoingPhoto();
      const imageUrl = consultVisionUrl(attachmentUrl);
      if (imageUrl) setCaseImageUrl(imageUrl);

      const lang = consultLanguage;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: attachmentUrl },
      ]);
      scrollToBottomAfterPaint();

      const triage = await triageMessage(text, imageUrl, lang);

      if (linkedPhysio) {
        const decision = decideFisioIntro(text, lang);
        if (decision.type === "steer_meta") {
          await respondToInitialMessage(
            text,
            {
              action: "respond",
              intent: "general",
              answer: triage.answer?.trim() || decision.message,
            },
            attachmentUrl,
            lang
          );
          return;
        }
        if (decision.type === "clarify_location") {
          setPendingComplaintText(text);
          await respondToInitialMessage(
            text,
            {
              action: "respond",
              intent: "general",
              answer: decision.message,
            },
            attachmentUrl,
            lang
          );
          return;
        }
        if (!startQuestionnaireQueue(text, lang, decision.part)) {
          beginQuestionnaire(text, decision.part, lang);
        }
        return;
      }

      if (
        isMetaOrClarificationQuery(text) ||
        isInformationalOrEducationalQuery(text)
      ) {
        await respondToInitialMessage(
          text,
          { action: "respond", intent: "general", answer: triage.answer },
          attachmentUrl,
          lang
        );
        return;
      }

      // "brazo" / "arm" alone is too vague — ask where before any questionnaire
      if (isVagueArmComplaint(text)) {
        setPendingComplaintText(text);
        await respondToInitialMessage(
          text,
          {
            action: "respond",
            intent: "general",
            answer: vagueArmClarifyMessage(lang),
          },
          attachmentUrl,
          lang
        );
        return;
      }

      // Only personal injury complaints open questionnaires — never keyword-only
      if (
        shouldOpenSymptomQuestionnaire(text) &&
        triage.action === "questionnaire" &&
        triage.bodyPart
      ) {
        startQuestionnaireQueue(text, lang, triage.bodyPart);
        return;
      }

      if (
        shouldOpenSymptomQuestionnaire(text) &&
        triage.intent === "symptom_other"
      ) {
        const { part } = questionnaireForText(text);
        if (!startQuestionnaireQueue(text, lang, part === "generic" ? "generic" : part)) {
          beginQuestionnaire(text, part === "generic" ? "generic" : part, lang);
        }
        return;
      }

      // Local multi-part detection only for real personal complaints
      if (
        shouldOpenSymptomQuestionnaire(text) &&
        startQuestionnaireQueue(text, lang)
      ) {
        return;
      }

      await respondToInitialMessage(text, triage, attachmentUrl, lang);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      alert(err instanceof Error ? err.message : "Error al procesar tu mensaje.");
      if (conversationModeRef.current) resumeConversationListening();
    } finally {
      setLoading(false);
    }
  }

  async function handleQuestionnaireSubmit() {
    if (loading) return;

    // Prefer refs so "Enviar ahora (urgencia)" can setState + submit with the same answers.
    const kneeAnswers = kneeAnswersRef.current;
    const hipAnswers = hipAnswersRef.current;

    const focusIssue = (
      issue: AdaptiveValidationIssue,
      sections: readonly string[],
      setIndex: (i: number) => void
    ) => {
      setShoulderSectionError(issue.message);
      const idx = sections.findIndex((s) => s === issue.section);
      if (idx >= 0) {
        setIndex(idx);
      }
      window.setTimeout(() => scrollToQuestionnaireQuestion(issue.questionId), 80);
    };

    if (questionnairePart === "shoulder") {
      const shoulderFocus = resolveShoulderQuestionnaireFocus(initialMessage);
      const sections = getVisibleShoulderSections(shoulderAnswers, shoulderFocus);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateShoulderSection(
          lastSection,
          shoulderAnswers,
          shoulderFocus
        );
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setShoulderSectionIndex));
          return;
        }
      }
      const issue = validateShoulderAdaptive(shoulderAnswers, shoulderFocus);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setShoulderSectionIndex));
        return;
      }
    } else if (questionnairePart === "elbow") {
      const sections = getVisibleElbowSections(elbowAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateElbowSection(lastSection, elbowAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setElbowSectionIndex));
          return;
        }
      }
      const issue = validateElbowAdaptive(elbowAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setElbowSectionIndex));
        return;
      }
    } else if (questionnairePart === "wrist_hand") {
      const sections = getVisibleWristSections(wristAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateWristSection(lastSection, wristAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setWristSectionIndex));
          return;
        }
      }
      const issue = validateWristAdaptive(wristAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setWristSectionIndex));
        return;
      }
    } else if (questionnairePart === "finger") {
      const sections = getVisibleFingerSections(fingerAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateFingerSection(lastSection, fingerAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setFingerSectionIndex));
          return;
        }
      }
      const issue = validateFingerAdaptive(fingerAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setFingerSectionIndex));
        return;
      }
    } else if (questionnairePart === "head") {
      const sections = getVisibleHeadSections(headAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateHeadSection(lastSection, headAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setHeadSectionIndex));
          return;
        }
      }
      const issue = validateHeadAdaptive(headAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setHeadSectionIndex));
        return;
      }
    } else if (questionnairePart === "neck") {
      const sections = getVisibleNeckSections(neckAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateNeckSection(lastSection, neckAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setNeckSectionIndex));
          return;
        }
      }
      const issue = validateNeckAdaptive(neckAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setNeckSectionIndex));
        return;
      }
    } else if (questionnairePart === "ankle_foot") {
      const sections = getVisibleLowerLegSections(lowerLegAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateLowerLegSection(lastSection, lowerLegAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setLowerLegSectionIndex));
          return;
        }
      }
      const issue = validateLowerLegAdaptive(lowerLegAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setLowerLegSectionIndex));
        return;
      }
    } else if (questionnairePart === "knee") {
      const sections = getVisibleKneeSections(kneeAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateKneeSection(lastSection, kneeAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setKneeSectionIndex));
          return;
        }
      }
      const issue = validateKneeAdaptive(kneeAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setKneeSectionIndex));
        return;
      }
    } else if (questionnairePart === "back") {
      const sections = getVisibleBackSections(backAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateBackSection(lastSection, backAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setBackSectionIndex));
          return;
        }
      }
      const issue = validateBackAdaptive(backAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setBackSectionIndex));
        return;
      }
    } else if (questionnairePart === "hip") {
      const sections = getVisibleHipSections(hipAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateHipSection(lastSection, hipAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, withQuestionnaireScroll(setHipSectionIndex));
          return;
        }
      }
      const issue = validateHipAdaptive(hipAnswers);
      if (issue) {
        focusIssue(issue, sections, withQuestionnaireScroll(setHipSectionIndex));
        return;
      }
    } else {
      const issue = validateGenericConsulta(genericAnswers);
      if (issue) {
        setShoulderSectionError(issue.message);
        window.setTimeout(() => scrollToQuestionnaireQuestion(issue.questionId), 80);
        return;
      }
    }

    setLoading(true);
    setLoadingModal(true);

    const symptomContext = buildSymptomContext();
    const detectedZones = detectBodyPartsFromText(initialMessage);
    const areaLabel =
      questionnairePart === "hip"
        ? hipBodyAreaLabelForAi(hipAnswers, initialMessage)
        : questionnairePart === "ankle_foot"
          ? bodyAreaLabelFromLowerLegAnswers(lowerLegAnswers, consultLanguage)
          : questionnairePart === "generic"
            ? genericAnswers.zona.trim() ||
              patientFacingPartLabel("generic", initialMessage, consultLanguage)
            : patientFacingPartLabel(questionnairePart, initialMessage, consultLanguage);
    const multiZoneScopeNote =
      detectedZones.length > 1
        ? consultLanguage === "en"
          ? `\n\nCRITICAL — MULTI-ZONE CASE: Evaluate ONLY «${areaLabel}» right now. The patient also mentioned other areas that will get their own questionnaires later. Do NOT reframe this as shoulder pain, invent a different primary zone, or write a summary centered on another region.`
          : `\n\nCRÍTICO — CASO MULTI-ZONA: Evalúa ÚNICAMENTE «${areaLabel}» ahora. El paciente también mencionó otras zonas que tendrán su propio cuestionario después. NO digas que el problema principal es el hombro ni centres el resumen en otra región distinta a «${areaLabel}».`
        : "";
    const painLevel =
      questionnairePart === "shoulder"
        ? shoulderAnswers.intensidad_dolor
        : questionnairePart === "elbow"
          ? elbowAnswers.intensidad_dolor
          : questionnairePart === "wrist_hand"
            ? wristAnswers.intensidad_dolor
          : questionnairePart === "finger"
            ? fingerAnswers.intensidad_dolor
          : questionnairePart === "head"
            ? headAnswers.intensidad_dolor
          : questionnairePart === "neck"
            ? neckAnswers.intensidad_dolor
          : questionnairePart === "ankle_foot"
            ? lowerLegAnswers.intensidad_dolor
          : questionnairePart === "knee"
            ? kneeAnswers.intensidad_dolor
          : questionnairePart === "back"
            ? backAnswers.intensidad_dolor
          : questionnairePart === "hip"
            ? hipAnswers.intensidad_dolor
          : genericAnswers.intensidad_dolor;
    const onsetType =
      questionnairePart === "shoulder"
        ? `${shoulderAnswers.inicio} — ${shoulderAnswers.evolucion}. Mecanismo: ${shoulderAnswers.mecanismo.join(", ")}`
        : questionnairePart === "elbow"
          ? `${elbowAnswers.inicio} — ${elbowAnswers.evolucion}. Mecanismo: ${elbowAnswers.mecanismo}`
          : questionnairePart === "wrist_hand"
            ? `${wristAnswers.inicio} — ${wristAnswers.comienzo}. Actividad: ${wristAnswers.actividad_tipo} — ${wristAnswers.actividad_detalle}`
          : questionnairePart === "finger"
            ? `${fingerAnswers.cuando_empezo} — ${fingerAnswers.como_empezo}${fingerAnswers.detalle_otro ? ` (${fingerAnswers.detalle_otro})` : ""}`
          : questionnairePart === "head"
            ? `${headAnswers.inicio} — ${headAnswers.evolucion}. Mecanismo: ${headAnswers.mecanismo.join(", ")}`
          : questionnairePart === "neck"
            ? `${neckAnswers.inicio} — ${neckAnswers.evolucion}. Mecanismo: ${neckAnswers.mecanismo.join(", ")}`
          : questionnairePart === "ankle_foot"
            ? `${lowerLegAnswers.inicio} — ${lowerLegAnswers.evolucion}. Mecanismo: ${lowerLegAnswers.mecanismo.join(", ")}`
          : questionnairePart === "knee"
            ? `${kneeAnswers.inicio} — ${kneeAnswers.evolucion}. Mecanismo: ${kneeAnswers.mecanismo.join(", ")}`
          : questionnairePart === "back"
            ? `${backAnswers.inicio} — ${backAnswers.evolucion}. Mecanismo: ${backAnswers.mecanismo.join(", ")}`
          : questionnairePart === "hip"
            ? `${hipAnswers.inicio} — ${hipAnswers.evolucion}. Mecanismo: ${hipAnswers.mecanismo.join(", ")}`
          : `${genericAnswers.inicio} — ${genericAnswers.evolucion}. Mecanismo: ${genericAnswers.mecanismo.join(", ")}`;
    const hadTraumaVal =
      questionnairePart === "shoulder"
        ? shoulderAnswers.mecanismo.includes("Caída") || shoulderAnswers.mecanismo.includes("Golpe directo")
          ? `Sí: ${shoulderAnswers.mecanismo.join(", ")}`
          : "No"
        : questionnairePart === "elbow"
          ? elbowAnswers.mecanismo === "Tras una caída" || elbowAnswers.mecanismo === "Tras golpe directo"
            ? `Sí: ${elbowAnswers.mecanismo}`
            : "No"
          : questionnairePart === "wrist_hand"
            ? wristAnswers.inicio === "Tras una caída" ||
              wristAnswers.inicio === "Tras un golpe directo" ||
              wristAnswers.inicio === "Tras torcer la muñeca" ||
              wristAnswers.inicio === "Al apoyarme con la mano"
              ? `Sí: ${wristAnswers.inicio}`
              : "No"
          : questionnairePart === "finger"
            ? fingerAnswers.como_empezo === "Caída" ||
              fingerAnswers.como_empezo === "Dedo doblado hacia atrás" ||
              fingerAnswers.como_empezo === "Dedo golpeado por balón" ||
              fingerAnswers.como_empezo === "Lesión por torsión" ||
              fingerAnswers.como_empezo === "Corte o herida"
              ? `Sí: ${fingerAnswers.como_empezo}`
              : "No"
          : questionnairePart === "head"
            ? headAnswers.mecanismo.includes("Golpe fuerte en la cabeza") ||
              headAnswers.rf_trauma === "Sí"
              ? `Sí: ${headAnswers.mecanismo.join(", ") || "trauma"}`
              : "No"
          : questionnairePart === "neck"
            ? neckAnswers.mecanismo.includes("Caída") ||
              neckAnswers.mecanismo.includes("Golpe directo / lesión fuerte") ||
              neckAnswers.rf_trauma_grave === "Sí"
              ? `Sí: ${neckAnswers.mecanismo.join(", ") || "trauma"}`
              : "No"
          : questionnairePart === "ankle_foot"
            ? lowerLegAnswers.mecanismo.includes("Caída") ||
              lowerLegAnswers.mecanismo.includes("Golpe directo")
              ? `Sí: ${lowerLegAnswers.mecanismo.join(", ")}`
              : "No"
          : questionnairePart === "knee"
            ? kneeAnswers.mecanismo.includes("Caída") ||
              kneeAnswers.mecanismo.includes("Golpe directo") ||
              kneeAnswers.mecanismo.includes("Torsión / cambio de dirección")
              ? `Sí: ${kneeAnswers.mecanismo.join(", ")}`
              : "No"
          : questionnairePart === "back"
            ? backAnswers.mecanismo.includes("Caída") ||
              backAnswers.mecanismo.includes("Golpe directo") ||
              backAnswers.mecanismo.includes("Levantamiento / esfuerzo")
              ? `Sí: ${backAnswers.mecanismo.join(", ")}`
              : "No"
          : questionnairePart === "hip"
            ? hipAnswers.mecanismo.includes("Caída") ||
              hipAnswers.mecanismo.includes("Golpe directo") ||
              hipAnswers.mecanismo.includes("Cambio de dirección / pivote")
              ? `Sí: ${hipAnswers.mecanismo.join(", ")}`
              : "No"
          : genericAnswers.mecanismo.includes("Caída") || genericAnswers.mecanismo.includes("Golpe directo")
            ? `Sí: ${genericAnswers.mecanismo.join(", ")}`
            : "No";
    const redFlagsUrgent =
      questionnairePart === "shoulder"
        ? detectRedFlags(shoulderAnswers).urgent
        : questionnairePart === "elbow"
          ? detectElbowRedFlags(elbowAnswers).urgent
          : questionnairePart === "wrist_hand"
            ? detectWristRedFlags(wristAnswers).urgent
          : questionnairePart === "finger"
            ? detectFingerRedFlags(fingerAnswers).urgent
          : questionnairePart === "head"
            ? detectHeadRedFlags(headAnswers).urgent
          : questionnairePart === "neck"
            ? detectNeckRedFlags(neckAnswers).urgent
          : questionnairePart === "ankle_foot"
            ? detectLowerLegRedFlags(lowerLegAnswers).urgent
          : questionnairePart === "knee"
            ? detectKneeRedFlags(kneeAnswers).urgent
          : questionnairePart === "back"
            ? detectBackRedFlags(backAnswers).urgent
          : questionnairePart === "hip"
            ? detectHipRedFlags(hipAnswers).urgent
          : genericAnswers.rf_deformidad === "Sí" ||
            genericAnswers.rf_fiebre === "Sí" ||
            genericAnswers.rf_perdida_sensibilidad === "Sí";
    const contextForAi =
      (redFlagsUrgent
        ? `⚠️ PRIORIDAD ALTA — BANDERAS ROJAS DETECTADAS\n\n${symptomContext}`
        : symptomContext) + multiZoneScopeNote;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      // Fisioterapia: show patient orientation + functional tests first; send report after answers.
      if (linkedPhysio) {
        const patientFacingAi = await callAI({
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext:
            contextForAi +
            (redFlagsUrgent
              ? `\n\nFLUJO FISIOTERAPIA + URGENCIA (CRÍTICO): Hay banderas rojas. Esta orientación es para el paciente. NO pidas pruebas funcionales ni hop. Prioriza HOSPITAL / URGENCIAS e imagen. NO digas que el informe ya se envió al fisio.`
              : `\n\nFLUJO FISIOTERAPIA (CRÍTICO): Esta orientación es para el paciente. Incluye SIEMPRE la sección **Pruebas funcionales** específicas de la zona lesionada. NO digas que el informe ya se envió al fisio: primero debe responder a las pruebas.`),
          conversationHistory: [],
          ...(caseImageUrl ? { imageUrl: caseImageUrl } : {}),
        });

        const ensureConversationId = async (): Promise<{
          id: string;
          title: string;
          created_at?: string;
          physio_id?: string | null;
          physio_name?: string | null;
          clinic_name?: string | null;
          isNew: boolean;
        }> => {
          if (activeId) {
            return {
              id: activeId,
              title: activeTitle,
              isNew: false,
            };
          }
          if (conversations.length > 0 && !fisioNewConsultDraft) {
            throw new Error(
              "En Fisioterapia no se pueden abrir chats nuevos. Continúa una consulta existente o usa la pestaña Consulta."
            );
          }
          const title = `${areaLabel} — ${new Date().toLocaleDateString("es-ES")}`;
          const { data: conv, error: convErr } = await supabase
            .from("conversations")
            .insert({
              title,
              user_id: user.id,
              kind: "fisioterapia",
              physio_id: linkedPhysio.physio_id ?? null,
              physio_name: linkedPhysio.physio_name ?? null,
              clinic_name: linkedPhysio.clinic_name ?? null,
            })
            .select("id, title, created_at, physio_id, physio_name, clinic_name")
            .single();
          if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");

          await supabase.from("messages").insert({
            conversation_id: conv.id,
            role: "assistant",
            content: welcomeText,
          });
          for (const msg of messages) {
            if (msg.id === WELCOME_ID) continue;
            await supabase.from("messages").insert({
              conversation_id: conv.id,
              role: msg.role,
              content: msg.content,
              image_url: msg.image_url ?? null,
            });
          }
          return { ...(conv as Conversation), isNew: true };
        };

        const conv = await ensureConversationId();

        await supabase.from("consultas").insert({
          body_area: areaLabel,
          started_when: onsetType,
          onset_type: onsetType,
          pain_level: painLevel,
          had_trauma: hadTraumaVal,
          description: initialMessage,
          symptom_details: {
            questionnaireVersion: 4,
            mode: "chat-then-questionnaire",
            initialMessage,
            questionnairePart,
            shoulder: questionnairePart === "shoulder" ? shoulderAnswers : null,
            elbow: questionnairePart === "elbow" ? elbowAnswers : null,
            wrist_hand: questionnairePart === "wrist_hand" ? wristAnswers : null,
            finger: questionnairePart === "finger" ? fingerAnswers : null,
            head: questionnairePart === "head" ? headAnswers : null,
            neck: questionnairePart === "neck" ? neckAnswers : null,
            ankle_foot: questionnairePart === "ankle_foot" ? lowerLegAnswers : null,
            knee: questionnairePart === "knee" ? kneeAnswers : null,
            back: questionnairePart === "back" ? backAnswers : null,
            hip: questionnairePart === "hip" ? hipAnswers : null,
            generic:
              questionnairePart === "generic" ||
              !["shoulder", "elbow", "wrist_hand", "finger", "head", "neck", "ankle_foot", "knee", "back", "hip"].includes(
                questionnairePart
              )
                ? genericAnswers
                : null,
            redFlagsUrgent,
            awaitingFunctionalTestsForPhysioReport: true,
          },
        });

        const combined = redFlagsUrgent
          ? patientFacingAi.trim()
          : buildPhysioLinkedPostQuestionnaireMessage({
              physioName: linkedPhysio.physio_name,
              aiText: patientFacingAi,
              bodyArea: areaLabel,
              language: consultLanguage,
            });

        pendingPhysioReportRef.current = {
          patientId: user.id,
          conversationId: conv.id,
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
          patientSummary: patientFacingAi,
          language: consultLanguage,
        };

        const awaitingTests =
          !redFlagsUrgent &&
          (splitFunctionalTests(combined)?.tests.length ?? 0) >= 2;

        // Only send (and show “report sent”) when there are no outstanding Sí/No tests.
        if (awaitingTests) {
          pendingPhysioReportRef.current = {
            ...pendingPhysioReportRef.current,
            awaitFunctionalTests: true,
          };
        } else {
          const { sent, physioLabel } = await maybeGenerateAndSendPhysioReport(
            pendingPhysioReportRef.current
          );
          if (sent) {
            setPhysioReportSentBanner(true);
            setLinkedPhysioLabel(
              physioLabel ||
                [linkedPhysio.physio_name, linkedPhysio.clinic_name]
                  .filter(Boolean)
                  .join(" · ") ||
                null
            );
            pendingPhysioReportRef.current = null;
          }
        }

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: conv.id,
            role: "assistant",
            content: combined,
          })
          .select("id, role, content, created_at")
          .single();

        if (conv.isNew) {
          setActiveId(conv.id);
          setActiveTitle(conv.title);
          setConversations((prev) => [conv as Conversation, ...prev].slice(0, 10));
        }
        if (aiMsg) {
          beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
          setMessages((prev) => [...prev, aiMsg as Message]);
        }
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        if (!awaitingTests && !pendingPhysioReportRef.current) {
          const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name, {
            guest: guestMode,
            language: consultLanguage,
          });
          const { data: thanksMsg } = await supabase
            .from("messages")
            .insert({
              conversation_id: conv.id,
              role: "assistant",
              content: thanks,
            })
            .select("id, role, content, created_at")
            .single();
          if (thanksMsg) {
            beginAssistantReveal((thanksMsg as Message).id, (thanksMsg as Message).content);
            setMessages((prev) => [...prev, thanksMsg as Message]);
          }
          setPhase("complete");
        } else {
          setPhase("followup");
        }
        return;
      }

      const aiText = await callAI({
        bodyArea: areaLabel,
        onsetType,
        painLevel,
        hadTrauma: hadTraumaVal,
        description: initialMessage,
        symptomContext: contextForAi,
        conversationHistory: [],
        ...(caseImageUrl ? { imageUrl: caseImageUrl } : {}),
      });

      if (activeId) {
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ conversation_id: activeId, role: "assistant", content: aiText })
          .select("id, role, content")
          .single();

        await supabase.from("consultas").insert({
          body_area: areaLabel,
          started_when: onsetType,
          onset_type: onsetType,
          pain_level: painLevel,
          had_trauma: hadTraumaVal,
          description: initialMessage,
          symptom_details: {
            questionnaireVersion: 4,
            mode: "chat-then-questionnaire",
            initialMessage,
            questionnairePart,
            shoulder: questionnairePart === "shoulder" ? shoulderAnswers : null,
            elbow: questionnairePart === "elbow" ? elbowAnswers : null,
            wrist_hand: questionnairePart === "wrist_hand" ? wristAnswers : null,
            finger: questionnairePart === "finger" ? fingerAnswers : null,
            head: questionnairePart === "head" ? headAnswers : null,
            neck: questionnairePart === "neck" ? neckAnswers : null,
            ankle_foot: questionnairePart === "ankle_foot" ? lowerLegAnswers : null,
            knee: questionnairePart === "knee" ? kneeAnswers : null,
            back: questionnairePart === "back" ? backAnswers : null,
            hip: questionnairePart === "hip" ? hipAnswers : null,
            generic: questionnairePart === "generic" || !["shoulder","elbow","wrist_hand","finger","head","neck","ankle_foot","knee","back","hip"].includes(questionnairePart) ? genericAnswers : null,
            redFlagsUrgent,
          },
        });

        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        setPhase("followup");
        await offerNextPendingPart(
          activeId,
          questionnairePart,
          consultLanguage,
          aiText,
          areaLabel
        );
        return;
      }

      const title = `${areaLabel} — ${new Date().toLocaleDateString("es-ES")}`;
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({
          title,
          user_id: user.id,
          kind: "consulta",
          physio_id: null,
          physio_name: null,
          clinic_name: null,
        })
        .select("id, title, created_at, physio_id, physio_name, clinic_name")
        .single();
      if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");

      await supabase.from("messages").insert({
        conversation_id: conv.id,
        role: "assistant",
        content: welcomeText,
      });
      for (const msg of messages) {
        if (msg.id === WELCOME_ID) continue;
        await supabase.from("messages").insert({
          conversation_id: conv.id,
          role: msg.role,
          content: msg.content,
          image_url: msg.image_url ?? null,
        });
      }

      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: conv.id, role: "assistant", content: aiText })
        .select("id, role, content")
        .single();

      await supabase.from("consultas").insert({
        body_area: areaLabel,
        started_when: onsetType,
        onset_type: onsetType,
        pain_level: painLevel,
        had_trauma: hadTraumaVal,
        description: initialMessage,
        symptom_details: {
          questionnaireVersion: 4,
          mode: "chat-then-questionnaire",
          initialMessage,
          questionnairePart,
          shoulder: questionnairePart === "shoulder" ? shoulderAnswers : null,
          elbow: questionnairePart === "elbow" ? elbowAnswers : null,
          wrist_hand: questionnairePart === "wrist_hand" ? wristAnswers : null,
          finger: questionnairePart === "finger" ? fingerAnswers : null,
          head: questionnairePart === "head" ? headAnswers : null,
          neck: questionnairePart === "neck" ? neckAnswers : null,
          ankle_foot: questionnairePart === "ankle_foot" ? lowerLegAnswers : null,
          knee: questionnairePart === "knee" ? kneeAnswers : null,
          back: questionnairePart === "back" ? backAnswers : null,
          hip: questionnairePart === "hip" ? hipAnswers : null,
          generic:
            questionnairePart === "generic" ||
            !["shoulder", "elbow", "wrist_hand", "finger", "head", "neck", "ankle_foot", "knee", "back", "hip"].includes(questionnairePart)
              ? genericAnswers
              : null,
          redFlagsUrgent,
        },
      });

      setActiveId(conv.id);
      setActiveTitle(title);
      setConversations((prev) => [conv as Conversation, ...prev].slice(0, 10));
      beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
      setMessages((prev) => [...prev, aiMsg as Message]);
      markPartEvaluated(questionnairePart);
      setCaseImageUrl(null);
      setPhase("followup");
      await offerNextPendingPart(
        conv.id,
        questionnairePart,
        consultLanguage,
        aiText,
        areaLabel
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al analizar tu caso.");
    } finally {
      setLoading(false);
      setLoadingModal(false);
    }
  }

  async function handleFollowupSubmit() {
    const text =
      (pendingVoiceTextRef.current ?? input).trim() ||
      (attachedFile ? consultAttachmentCaption(attachedFile) : "");
    pendingVoiceTextRef.current = null;
    if ((!text && !attachedFile) || loading || phase !== "followup" || !activeId) {
      if (conversationModeRef.current) resumeConversationListening();
      return;
    }
    const userMsgId = `user-${Date.now()}`;
    setInput("");
    setLoading(true);

    try {
      const attachmentUrl = await uploadOutgoingPhoto();
      const imageUrl = consultVisionUrl(attachmentUrl);

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: attachmentUrl },
      ]);
      scrollToBottomAfterPaint();

      const triage = await triageMessage(text, imageUrl, consultLanguage);
      let userSaved = false;

      async function saveUserMessage() {
        if (userSaved) return;
        await supabase.from("messages").insert({
          conversation_id: activeId,
          role: "user",
          content: text,
          image_url: attachmentUrl,
        });
        userSaved = true;
      }

      // After "dónde te duele?" — open the questionnaire for the zone they named
      if (pendingComplaintText) {
        await saveUserMessage();
        if (linkedPhysio) {
          const { part, contextText } = decideFisioLocationReply(
            text,
            pendingComplaintText
          );
          if (imageUrl) setCaseImageUrl(imageUrl);
          if (!startQuestionnaireQueue(contextText, consultLanguage, part)) {
            beginQuestionnaire(contextText, part, consultLanguage);
          }
          return;
        }
        const resolved = resolveBodyPartFromLocationReply(text);
        if (
          resolved &&
          [
            "shoulder",
            "elbow",
            "wrist_hand",
            "finger",
            "neck",
            "back",
            "hip",
            "knee",
            "ankle_foot",
            "head",
          ].includes(resolved)
        ) {
          if (imageUrl) setCaseImageUrl(imageUrl);
          startQuestionnaireQueue(
            text,
            consultLanguage,
            resolved as AdaptiveQuestionnairePart
          );
          return;
        }
        await appendAssistantMessage(
          activeId,
          vagueArmClarifyMessage(consultLanguage)
        );
        return;
      }

      // Fisioterapia: never stay in free chat without a questionnaire + report
      if (
        linkedPhysio &&
        partEvaluationsRef.current.length === 0 &&
        evaluatedParts.length === 0 &&
        !awaitingNextPart &&
        pendingParts.length === 0 &&
        !pendingPhysioReportRef.current
      ) {
        await saveUserMessage();
        if (imageUrl) setCaseImageUrl(imageUrl);
        const combined = [initialMessage, text].filter(Boolean).join("\n").trim();
        const latest = decideFisioIntro(text, consultLanguage);
        // Prefer the latest message; if it's only a meta steer, try combined context.
        const decision =
          latest.type === "questionnaire" || latest.type === "clarify_location"
            ? latest
            : decideFisioIntro(combined, consultLanguage);
        if (decision.type === "steer_meta") {
          // Second chance: still no clear complaint → open generic questionnaire so a report can be made.
          if (!startQuestionnaireQueue(combined || text, consultLanguage, "generic")) {
            beginQuestionnaire(combined || text, "generic", consultLanguage);
          }
          return;
        }
        if (decision.type === "clarify_location") {
          setPendingComplaintText(combined || text);
          await appendAssistantMessage(activeId, decision.message);
          return;
        }
        if (!startQuestionnaireQueue(combined || text, consultLanguage, decision.part)) {
          beginQuestionnaire(combined || text, decision.part, consultLanguage);
        }
        return;
      }

      if (awaitingNextPart) {
        await saveUserMessage();

        const lastEval =
          partEvaluationsRef.current[partEvaluationsRef.current.length - 1];
        const completedPart = lastEval?.part;
        const reportingTests = reportsFunctionalTestResults(text);
        if (
          reportingTests &&
          completedPart &&
          completedPart !== "generic"
        ) {
          markFunctionalTestsDone(completedPart);
        }
        const functionalTestsDone =
          reportingTests || isFunctionalTestsDoneForPart(completedPart);

        // Answering functional tests → interpret them. Never open another questionnaire this turn.
        if (reportingTests) {
          const doneLabel =
            lastEval?.label ||
            patientFacingPartLabel(
              questionnairePart === "generic" ? "generic" : questionnairePart,
              initialMessage,
              consultLanguage
            );
          const nextLabel = patientFacingPartLabel(
            awaitingNextPart,
            initialMessage,
            consultLanguage
          );
          const conversationHistory = [
            ...messages
              .filter(
                (m) =>
                  m.id !== WELCOME_ID &&
                  !m.id.startsWith("q-intro") &&
                  m.id !== userMsgId
              )
              .map((m) => ({
                role: m.role,
                content: m.image_url
                  ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url)}`
                  : m.content,
              })),
            {
              role: "user" as const,
              content: attachmentUrl
                ? `${text}\n${consultAttachmentHistoryNote(attachmentUrl)}`
                : text,
            },
          ].slice(-10);

          const aiText = await callAI({
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No especificado",
            description: text,
            symptomContext: functionalTestResultsFollowupContext(consultLanguage, {
              pendingNextZoneLabel: nextLabel,
            }),
            conversationHistory,
            ...(imageUrl ? { imageUrl } : {}),
          });

          const { data: aiMsg } = await supabase
            .from("messages")
            .insert({
              conversation_id: activeId,
              role: "assistant",
              content: aiText,
            })
            .select("id, role, content, created_at")
            .single();
          if (aiMsg) {
            beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
            setMessages((prev) => [...prev, aiMsg as Message]);
          }
          // Still awaiting the next zone questionnaire — do not finish yet.
          return;
        }

        if (
          isClearStartNextPart(text, awaitingNextPart, initialMessage) ||
          (functionalTestsDone &&
            wantsToContinueToNextQuestionnaire(text))
        ) {
          const next = awaitingNextPart;
          const remaining = pendingParts.length;
          setAwaitingNextPart(null);
          beginQuestionnaire(
            initialMessage || text,
            next,
            consultLanguage,
            remaining
          );
          return;
        }

        if (declinesMoreRelatedQuestions(text)) {
          const completedForNext =
            completedPart && completedPart !== "generic"
              ? completedPart
              : questionnairePart;
          await promptNextZoneQuestionnaire(
            activeId,
            completedForNext,
            consultLanguage,
            { functionalTestsDone }
          );
          return;
        }

        if (isDeclineNextPart(text)) {
          setAwaitingNextPart(null);
          setPendingParts([]);
          if (functionalTestsDone) {
            await appendMultiPartFinalSummary(
              activeId,
              partEvaluationsRef.current,
              consultLanguage
            );
          }
          await activateRelatedFollowup(activeId, consultLanguage, {
            offeredTests: !functionalTestsDone,
            askNow: false,
          });
          return;
        }

        // Keep awaitingNextPart — answer the patient's actual message (choice, tests, questions).
        // Do NOT start the next questionnaire just because they mentioned the zone name.
        const doneLabel =
          partEvaluationsRef.current.length > 0
            ? partEvaluationsRef.current[partEvaluationsRef.current.length - 1]
                .label
            : patientFacingPartLabel(
                questionnairePart === "generic" ? "generic" : questionnairePart,
                initialMessage,
                consultLanguage
              );
        const nextLabel = patientFacingPartLabel(
          awaitingNextPart,
          initialMessage,
          consultLanguage
        );
        const choiceHint = betweenPartsChoiceContext(
          doneLabel,
          nextLabel,
          consultLanguage,
          { functionalTestsDone }
        );
        const testsHint =
          !functionalTestsDone && wantsFunctionalTestsNow(text)
            ? consultLanguage === "en"
              ? "\nThe patient wants to do functional tests first — guide them using the tests from the last orientation; then remind them they can reply yes for the next questionnaire."
              : "\nEl paciente quiere hacer primero las pruebas funcionales — guíalo con las pruebas de la última orientación; luego recuerda que puede responder sí para el siguiente cuestionario."
            : functionalTestsDone
              ? consultLanguage === "en"
                ? "\nFunctional tests for the completed zone are DONE — do not offer them again."
                : "\nLas pruebas funcionales de la zona completada YA están hechas — no las vuelvas a ofrecer."
              : "";

        const conversationHistory = [
          ...messages
            .filter(
              (m) =>
                m.id !== WELCOME_ID &&
                !m.id.startsWith("q-intro") &&
                m.id !== userMsgId
            )
            .map((m) => ({
              role: m.role,
              content: m.image_url
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentUrl
              ? `${text}\n${consultAttachmentHistoryNote(attachmentUrl)}`
              : text,
          },
        ].slice(-10);

        const aiText = await callAI({
          bodyArea: "seguimiento",
          onsetType: text,
          painLevel: 0,
          hadTrauma: "No especificado",
          description: text,
          symptomContext: `${choiceHint}${testsHint}`,
          conversationHistory,
          ...(imageUrl ? { imageUrl } : {}),
        });

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: aiText,
          })
          .select("id, role, content, created_at")
          .single();
        if (aiMsg) {
          beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
          setMessages((prev) => [...prev, aiMsg as Message]);
        }
        return;
      }

      // Fisioterapia: after functional-test answers, generate report + completion (not before).
      const pendingPhysio = pendingPhysioReportRef.current;
      const answeringPendingPhysioTests =
        Boolean(linkedPhysio && pendingPhysio?.awaitFunctionalTests) &&
        (reportsFunctionalTestResults(text) ||
          /resultados de las pruebas funcionales|functional test results/i.test(
            text
          ));

      // Retry report send only when not waiting on Sí/No functional tests.
      if (
        linkedPhysio &&
        pendingPhysio &&
        !physioReportSentBanner &&
        !pendingPhysio.awaitFunctionalTests &&
        !answeringPendingPhysioTests
      ) {
        const { sent, physioLabel } = await maybeGenerateAndSendPhysioReport(pendingPhysio);
        if (sent) {
          setPhysioReportSentBanner(true);
          setLinkedPhysioLabel(
            physioLabel ||
              [linkedPhysio.physio_name, linkedPhysio.clinic_name]
                .filter(Boolean)
                .join(" · ") ||
              null
          );
          pendingPhysioReportRef.current = null;
        }
      }

      if (linkedPhysio && pendingPhysio && answeringPendingPhysioTests) {
        await saveUserMessage();
        const lastEval =
          partEvaluationsRef.current[partEvaluationsRef.current.length - 1];
        const completedPart =
          lastEval?.part && lastEval.part !== "generic"
            ? lastEval.part
            : questionnairePart !== "generic"
              ? (questionnairePart as AdaptiveQuestionnairePart)
              : evaluatedParts[evaluatedParts.length - 1];
        if (completedPart) markFunctionalTestsDone(completedPart);

        const functionalBlock = `\n\nResultados de pruebas funcionales reportados por el paciente:\n${text}`;
        pendingPhysioReportRef.current = null;

        const { sent, physioLabel } = await maybeGenerateAndSendPhysioReport({
          ...pendingPhysio,
          symptomContext: pendingPhysio.symptomContext + functionalBlock,
          patientSummary: pendingPhysio.patientSummary + functionalBlock,
        });

        if (sent) {
          setPhysioReportSentBanner(true);
          setLinkedPhysioLabel(
            physioLabel ||
              [linkedPhysio.physio_name, linkedPhysio.clinic_name]
                .filter(Boolean)
                .join(" · ") ||
              null
          );
        }

        const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name, {
          guest: guestMode,
          language: consultLanguage,
        });
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: thanks,
          })
          .select("id, role, content, created_at")
          .single();
        if (aiMsg) {
          beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
          setMessages((prev) => [...prev, aiMsg as Message]);
        }
        setPhase("complete");
        return;
      }

      if (linkedPhysio && pendingPhysio) {
        await saveUserMessage();
        const nudge = buildPhysioLinkedFunctionalTestsPrompt(
          linkedPhysio.physio_name,
          consultLanguage
        );
        await appendAssistantMessage(activeId, nudge);
        return;
      }

      // Functional test answers for the current case — interpret; never start a new questionnaire.
      if (reportsFunctionalTestResults(text)) {
        await saveUserMessage();
        const lastEval =
          partEvaluationsRef.current[partEvaluationsRef.current.length - 1];
        const completedPart =
          lastEval?.part && lastEval.part !== "generic"
            ? lastEval.part
            : questionnairePart !== "generic"
              ? (questionnairePart as AdaptiveQuestionnairePart)
              : evaluatedParts[evaluatedParts.length - 1];
        if (completedPart) markFunctionalTestsDone(completedPart);

        const moreZonesPending = hasMoreZonesPending(completedPart);
        const nextZone = resolveNextZone(completedPart);
        const nextLabel = nextZone
          ? patientFacingPartLabel(nextZone, initialMessage, consultLanguage)
          : null;
        if (moreZonesPending && nextZone) {
          ensureAwaitingNextZone(
            completedPart && completedPart !== "generic"
              ? completedPart
              : questionnairePart
          );
        }

        const conversationHistory = [
          ...messages
            .filter(
              (m) =>
                m.id !== WELCOME_ID &&
                !m.id.startsWith("q-intro") &&
                m.id !== userMsgId
            )
            .map((m) => ({
              role: m.role,
              content: m.image_url
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentUrl
              ? `${text}\n${consultAttachmentHistoryNote(attachmentUrl)}`
              : text,
          },
        ].slice(-10);

        const rawAiText = await callAI({
          bodyArea: "seguimiento",
          onsetType: text,
          painLevel: 0,
          hadTrauma: "No",
          description: text,
          symptomContext: functionalTestResultsFollowupContext(consultLanguage, {
            pendingNextZoneLabel: moreZonesPending ? nextLabel : null,
          }),
          conversationHistory,
          ...(imageUrl ? { imageUrl } : {}),
        });
        const aiText = moreZonesPending
          ? rawAiText
          : ensureAsksMoreRelatedQuestions(rawAiText, consultLanguage);

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: aiText,
          })
          .select("id, role, content")
          .single();

        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);

        if (!moreZonesPending) {
          await appendMultiPartFinalSummary(
            activeId,
            partEvaluationsRef.current,
            consultLanguage
          );
          setRelatedFollowupActive(true);
          setPostGuidanceAsked(true);
          setShowUnrelatedCta(false);
        }
        return;
      }

      // After orientation / tests: related Qs stay here; unrelated → Nueva consulta CTA.
      if (relatedFollowupActive && !linkedPhysio) {
        await saveUserMessage();
        setShowUnrelatedCta(false);

        if (postGuidanceAsked && declinesMoreRelatedQuestions(text)) {
          const lastEval =
            partEvaluationsRef.current[partEvaluationsRef.current.length - 1];
          const completedPart =
            lastEval?.part && lastEval.part !== "generic"
              ? lastEval.part
              : questionnairePart !== "generic"
                ? (questionnairePart as AdaptiveQuestionnairePart)
                : evaluatedParts[evaluatedParts.length - 1] ?? "generic";
          if (
            hasMoreZonesPending(completedPart) &&
            (await promptNextZoneQuestionnaire(
              activeId,
              completedPart,
              consultLanguage,
              { functionalTestsDone: isFunctionalTestsDoneForPart(completedPart) }
            ))
          ) {
            return;
          }
          await finishConsultaSession(activeId, consultLanguage);
          return;
        }

        if (postGuidanceAsked && affirmsMoreRelatedQuestions(text)) {
          await appendAssistantMessage(
            activeId,
            inviteRelatedQuestionMessage(consultLanguage)
          );
          return;
        }

        const injuryLabel = currentInjuryLabel();
        const looksUnrelated =
          isUnrelatedConsultaQuestion(
            text,
            initialMessage,
            casePartsForRelatedGate()
          ) || shouldStartQuestionnaire(triage, evaluatedParts);

        if (looksUnrelated) {
          await appendAssistantMessage(
            activeId,
            unrelatedConsultaRedirectMessage(injuryLabel, consultLanguage)
          );
          setShowUnrelatedCta(true);
          return;
        }

        const conversationHistory = [
          ...messages
            .filter(
              (m) =>
                m.id !== WELCOME_ID &&
                !m.id.startsWith("q-intro") &&
                m.id !== userMsgId
            )
            .map((m) => ({
              role: m.role,
              content: m.image_url
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentUrl
              ? `${text}\n${consultAttachmentHistoryNote(attachmentUrl)}`
              : text,
          },
        ].slice(-10);

        const rawAi = await callAI({
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No",
            description: "",
            symptomContext: relatedInjuryFollowupContext(
              injuryLabel,
              consultLanguage,
              { askMore: postGuidanceAsked }
            ),
            conversationHistory,
            ...(imageUrl ? { imageUrl } : {}),
          });
        const aiText = postGuidanceAsked
          ? ensureAsksMoreRelatedQuestions(rawAi, consultLanguage)
          : rawAi;

        await appendAssistantMessage(activeId, aiText);
        return;
      }

      if (shouldStartQuestionnaire(triage, evaluatedParts)) {
        // Follow-up may mention a body part for info — don't open a form unless it's a personal complaint
        if (!shouldOpenSymptomQuestionnaire(text) && !pendingComplaintText) {
          // fall through to chat
        } else {
          await saveUserMessage();
          if (imageUrl) setCaseImageUrl(imageUrl);
          startQuestionnaireQueue(text, consultLanguage, triage.bodyPart);
          return;
        }
      }

      await saveUserMessage();

      const conversationHistory = [
        ...messages
          .filter(
            (m) =>
              m.id !== WELCOME_ID &&
              !m.id.startsWith("q-intro") &&
              m.id !== userMsgId
          )
          .map((m) => ({
            role: m.role,
            content: m.image_url
              ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url)}`
              : m.content,
          })),
        {
          role: "user" as const,
          content: attachmentUrl
            ? `${text}\n${consultAttachmentHistoryNote(attachmentUrl)}`
            : text,
        },
      ].slice(-10);

      const aiText = await callAI({
        bodyArea: "seguimiento",
        onsetType: text,
        painLevel: 0,
        hadTrauma: "No",
        description: "",
        conversationHistory,
        ...(imageUrl ? { imageUrl } : {}),
      });

      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: activeId, role: "assistant", content: aiText })
        .select("id, role, content")
        .single();

      beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
      setMessages((prev) => [...prev, aiMsg as Message]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      if (conversationModeRef.current) resumeConversationListening();
    } finally {
      setLoading(false);
    }
  }

  function resetForNewFisioCodeLink() {
    setActiveId(null);
    setMessages([]);
    setRevealingMessageId(null);
    setShowScrollDown(false);
    setPhysioIntro(true);
    setPhase("intro");
    setInitialMessage("");
    setQuestionnairePart("shoulder");
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setElbowAnswers(defaultElbowAdaptiveAnswers());
    setWristAnswers(defaultWristAdaptiveAnswers());
    setFingerAnswers(defaultFingerAdaptiveAnswers());
    setHeadAnswers(defaultHeadAdaptiveAnswers());
    setNeckAnswers(defaultNeckAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setHeadSectionIndex(0);
    setNeckSectionIndex(0);
    setShoulderSectionError(null);
    setEvaluatedParts([]);
    setPendingParts([]);
    setAwaitingNextPart(null);
    setPartEvaluations([]);
    partEvaluationsRef.current = [];
    multiPartSummarySentRef.current = false;
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setInput("");
    setCaseImageUrl(null);
    clearAttachment();
    setMobileSidebarOpen(false);
    setPhysioReportSentBanner(false);
    setFisioNewConsultDraft(true);
    setHistoryLoaded(true);
    setOpeningConversation(false);
  }

  async function handleAnotherPhysioLinked(physio: LinkedPhysioInfo) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && physio.physio_id) {
      const { data: lastReport } = await supabase
        .from("clinical_reports")
        .select("created_at")
        .eq("patient_id", user.id)
        .eq("physio_id", physio.physio_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const hoursLeft = fisioNewConsultHoursRemaining(lastReport?.created_at);
      if (!canStartNewFisioConsult(lastReport?.created_at)) {
        window.alert(fisioNewConsultCooldownMessage(hoursLeft, consultLanguage));
        setShowPhysioCodeEntry(false);
        return;
      }
    }

    onLinkedPhysioChange?.(physio);
    setShowPhysioCodeEntry(false);
    setActiveTitle(`Consulta con ${physioDisplayName(physio.physio_name)}`);
    resetForNewFisioCodeLink();
    pendingFisioCodeReload.current = true;
  }

  function startNewConsultation() {
    // Fisioterapia is only for physio-assigned chats — never start a free new one here.
    if (linkedPhysio) return;

    setActiveId(null);
    setActiveTitle("Nueva consulta");
    setMessages([]);
    setRevealingMessageId(null);
    setShowScrollDown(false);
    setPhysioIntro(true);
    setPhase("intro");
    setInitialMessage("");
    setQuestionnairePart("shoulder");
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setElbowAnswers(defaultElbowAdaptiveAnswers());
    setWristAnswers(defaultWristAdaptiveAnswers());
    setFingerAnswers(defaultFingerAdaptiveAnswers());
    setHeadAnswers(defaultHeadAdaptiveAnswers());
    setNeckAnswers(defaultNeckAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setHeadSectionIndex(0);
    setNeckSectionIndex(0);
    setShoulderSectionError(null);
    setEvaluatedParts([]);
    setPendingParts([]);
    setAwaitingNextPart(null);
    setPartEvaluations([]);
    partEvaluationsRef.current = [];
    multiPartSummarySentRef.current = false;
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setInput("");
    setCaseImageUrl(null);
    clearAttachment();
    setMobileSidebarOpen(false);
  }

  const physioHighlightPhrases = collectPhysioHighlightPhrases(
    linkedPhysio,
    conversations
  );

  const SidebarContent = () => {
    const filtered = sidebarSearch.trim()
      ? conversations.filter((c) =>
          c.title.toLowerCase().includes(sidebarSearch.trim().toLowerCase())
        )
      : conversations;
    const groups = linkedPhysio
      ? groupConversationsByPhysio(filtered)
      : groupConversationsByDate(filtered, consultLanguage);

    return (
      <div className="flex h-full flex-col p-4">
        {!linkedPhysio && (
          <button
            type="button"
            onClick={startNewConsultation}
            className="new-chat-btn mb-4"
          >
            <span className="new-chat-btn__icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
            Nueva consulta
          </button>
        )}
        {linkedPhysio && !guestMode && (
          <p className="mb-4 rounded-[16px] border border-blue-100 bg-blue-50/80 px-3.5 py-3 text-[12px] leading-snug text-blue-800">
            Este chat es para lo que te ha pedido tu fisioterapeuta. Para otras preguntas, usa la pestaña{" "}
            <span className="font-semibold">Consulta</span>.
          </p>
        )}

        {linkedPhysio && !guestMode && (
          <button
            type="button"
            onClick={() => setShowPhysioCodeEntry(true)}
            className="btn-secondary mb-4 !min-h-[48px] w-full text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Introducir otro código
          </button>
        )}

        <div className="relative mb-4">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Buscar consultas…"
            className="sidebar-search"
          />
        </div>

        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
          {linkedPhysio ? "Mis fisioterapeutas" : "Mis consultas"}
        </p>

        <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-0.5">
          {filtered.length === 0 && (
            <p className="px-1 py-3 text-xs text-slate-400">
              {sidebarSearch.trim()
                ? "No se encontraron consultas."
                : "Aún no tienes consultas guardadas."}
            </p>
          )}
          {groups.map((group) => (
            <div key={group.label}>
              {group.physioName ? (
                <div className="mb-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 shadow-sm">
                  <p className="text-[13px] font-bold leading-snug text-blue-900">
                    {group.physioName}
                  </p>
                  {group.clinicName ? (
                    <p className="mt-0.5 text-[12px] font-semibold text-blue-700">
                      {group.clinicName}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mb-1.5 px-2 text-[12px] font-semibold text-slate-900">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((c) => {
                  const isActive = activeId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`sidebar-item group ${
                        isActive ? "sidebar-item--active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => loadConversation(c.id, c.title)}
                        className="min-w-0 flex-1 rounded-[14px] px-3 py-2.5 text-left text-[13px]"
                      >
                        <p
                          className={`truncate font-semibold ${
                            isActive ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {c.title}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] ${
                            isActive ? "text-blue-600/80" : "text-slate-400"
                          }`}
                        >
                          {formatDate(c.created_at, consultLanguage)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteConversation(c.id)}
                        disabled={deletingId === c.id}
                        aria-label={`Eliminar consulta: ${c.title}`}
                        className="flex shrink-0 items-center justify-center rounded-xl px-2.5 text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
                      >
                        {deletingId === c.id ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-200/80 px-1 pt-3 text-[11px] text-slate-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-emerald-500">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
          </svg>
          Tus consultas están cifradas y son privadas
        </div>
      </div>
    );
  };

  const showChatInput =
    historyLoaded &&
    !openingConversation &&
    !physioIntro &&
    phase !== "complete" &&
    (phase === "intro" || phase === "followup") &&
    (!linkedPhysio || Boolean(activeId) || conversations.length === 0 || fisioNewConsultDraft);
  const showFisioPickExisting =
    Boolean(linkedPhysio) &&
    !fisioNewConsultDraft &&
    historyLoaded &&
    !openingConversation &&
    conversations.length > 0 &&
    !activeId;
  const showFisioBootstrap =
    Boolean(linkedPhysio) &&
    !fisioBootDeadline &&
    (!historyLoaded || (openingConversation && messages.length === 0));
  const inputPlaceholder =
    phase === "intro"
      ? linkedPhysio
        ? "Responde sobre tu caso…"
        : "Cuéntanos qué te pasa…"
      : linkedPhysio
        ? "Responde sobre tu caso…"
        : "Pregunta lo que quieras…";
  const onSend = phase === "intro" ? handleIntroSubmit : handleFollowupSubmit;
  const awaitingFunctionalTests =
    phase === "followup" ? latestUnansweredFunctionalTests(messages) : null;
  sendVoiceTurnRef.current = (text: string) => {
    pendingVoiceTextRef.current = text;
    flushSync(() => {
      setInput(text);
    });
    if (phase === "intro") {
      void handleIntroSubmit();
    } else if (phase === "followup") {
      void handleFollowupSubmit();
    } else {
      resumeConversationListening();
    }
  };

  useEffect(() => {
    if (!conversationMode || !conversationBusyRef.current) return;
    if (loading || revealingMessageId) return;
    const t = window.setTimeout(() => {
      if (
        conversationModeRef.current &&
        conversationBusyRef.current &&
        !loading &&
        !revealingMessageId
      ) {
        resumeConversationListening();
      }
    }, 2800);
    return () => window.clearTimeout(t);
  }, [conversationMode, loading, revealingMessageId, resumeConversationListening]);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--background)]">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="animate-fade-in-up relative z-10 flex w-72 flex-col sidebar-panel shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3.5">
              <span className="text-sm font-semibold text-slate-900">Consultas</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="btn-icon !h-9 !w-9"
                aria-label="Cerrar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <aside
        className={`hidden md:flex ${desktopSidebarOpen ? "w-72" : "w-0"} shrink-0 overflow-hidden border-r border-slate-200/80 sidebar-panel transition-all duration-200 ease-out`}
      >
        <div className="w-72">
          <SidebarContent />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setDesktopSidebarOpen((o) => !o)}
        className="hidden md:flex shrink-0 items-center border-r border-slate-200/80 bg-white px-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-blue-600"
        title={desktopSidebarOpen ? "Ocultar" : "Mostrar consultas"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={desktopSidebarOpen ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-200/70 bg-white/90 px-4 py-3.5 shrink-0 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="btn-icon !h-10 !w-10 md:!hidden"
            aria-label="Mis consultas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <p className="flex-1 truncate text-[15px] font-semibold tracking-tight text-slate-900">{activeTitle}</p>
        </div>

        {linkedPhysio && phase === "complete" ? null : linkedPhysio && physioReportSentBanner ? (
          <div className="shrink-0 border-b border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  {consultLanguage === "en"
                    ? "Report sent to your physiotherapist"
                    : "Informe enviado a tu fisioterapeuta"}
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  {consultLanguage === "en"
                    ? `The clinical summary from this consultation was sent successfully${
                        linkedPhysioLabel ? ` to ${linkedPhysioLabel}` : ""
                      }. They can review it on their dashboard before the appointment.`
                    : `El resumen clínico de esta consulta se ha enviado correctamente${
                        linkedPhysioLabel ? ` a ${linkedPhysioLabel}` : ""
                      }. Ya puede revisarlo en su panel antes de la cita.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhysioReportSentBanner(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                {consultLanguage === "en" ? "Close" : "Cerrar"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1">
        <div
          ref={messagesRef}
          onScroll={() => {
            // If the patient scrolls manually during a long reveal, stop pinning to the top.
            if (pinRevealToStartRef.current) {
              const el = messagesRef.current;
              const msgEl = revealingMessageId
                ? messageRefs.current.get(revealingMessageId)
                : null;
              if (el && msgEl) {
                const expected =
                  msgEl.getBoundingClientRect().top -
                  el.getBoundingClientRect().top +
                  el.scrollTop -
                  12;
                if (Math.abs(el.scrollTop - Math.max(0, expected)) > 64) {
                  pinRevealToStartRef.current = false;
                }
              }
            }
            updateScrollDownVisibility();
          }}
          className="scrollbar-thin h-full min-h-0 overflow-y-auto overscroll-contain [overflow-anchor:none]"
        >
          {showFisioBootstrap ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">Cargando…</p>
            </div>
          ) : physioIntro &&
            phase === "intro" &&
            !activeId &&
            (!linkedPhysio || conversations.length === 0 || fisioNewConsultDraft) ? (
            <PhysioIntro
              onSkip={skipPhysioIntro}
              greeting={introGreeting}
              locale={consultLanguage}
            />
          ) : showFisioPickExisting ? (
            <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                Elige una consulta de tu fisioterapeuta
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                En Fisioterapia solo puedes abrir una consulta nueva 24 horas después
                del último informe enviado a tu fisioterapeuta. Mientras tanto, abre
                una consulta de la lista o pulsa{" "}
                <span className="font-semibold text-slate-700">
                  Introducir otro código
                </span>{" "}
                cuando haya pasado ese tiempo. Para otras preguntas usa la pestaña{" "}
                <span className="font-semibold text-slate-700">Consulta</span>.
              </p>
            </div>
          ) : (
          <div
            className={`mx-auto w-full max-w-3xl space-y-5 px-4 py-4 sm:space-y-6 sm:px-6 lg:px-8 ${
              phase === "questionnaire" ? "pb-6" : "pb-4"
            }`}
            style={
              phase === "questionnaire" && keyboardOverlap > 0
                ? { paddingBottom: keyboardOverlap + 24 }
                : undefined
            }
          >
            {messages.map((msg) => {
              const time = formatTime(msg.created_at, consultLanguage);
              return (
                <div
                  key={msg.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(msg.id, el);
                    else messageRefs.current.delete(msg.id);
                  }}
                  className={`animate-fade-in-up flex w-full min-w-0 items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-100">
                      <PhysioAvatar size={36} />
                    </div>
                  )}
                  <div
                    className={`flex min-w-0 flex-col ${
                      msg.role === "user"
                        ? "max-w-[85%] items-end"
                        : "max-w-[calc(100%-3rem)] flex-1 items-start sm:max-w-[min(85%,calc(100%-3rem))]"
                    }`}
                  >
                    <div
                      className={`min-w-0 max-w-full break-words rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:px-4 sm:py-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-800 shadow-[var(--shadow-card)]"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="space-y-2">
                          {msg.image_url ? (
                            isConsultPdfUrl(msg.image_url) ? (
                              <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                                  <path d="M14 3v5h5" strokeLinejoin="round" />
                                </svg>
                                PDF
                              </div>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={msg.image_url}
                                alt="Foto de la lesión"
                                className="max-h-56 w-full rounded-xl object-cover"
                              />
                            )
                          ) : null}
                          {msg.content ? (
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          ) : null}
                        </div>
                      ) : (
                        <StreamingAssistantMessage
                          content={msg.content}
                          animate={shouldAnimateAssistantMessage(msg, revealingMessageId)}
                          onRevealComplete={() => {
                            if (revealingMessageId === msg.id) {
                              setRevealingMessageId(null);
                            }
                            pinRevealToStartRef.current = false;
                            updateScrollDownVisibility();
                          }}
                          onRevealTick={updateScrollDownVisibility}
                        >
                          {(visibleText, isRevealing) => (
                            <>
                              <AssistantMessageWithSources
                                content={visibleText}
                                renderBody={(body) => {
                                  const parsed = splitFunctionalTests(body);
                                  const showButtons =
                                    Boolean(parsed) &&
                                    awaitingFunctionalTests?.messageId === msg.id &&
                                    !isRevealing;
                                  if (!parsed || !showButtons) {
                                    return (
                                      <div className="whitespace-pre-wrap break-words">
                                        {renderAssistantContent(body, physioHighlightPhrases)}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div className="whitespace-pre-wrap break-words">
                                      {parsed.before
                                        ? renderAssistantContent(parsed.before, physioHighlightPhrases)
                                        : null}
                                      <p className={parsed.before ? "mt-3" : undefined}>
                                        <strong className="font-bold text-blue-700">
                                          {parsed.heading}
                                        </strong>
                                      </p>
                                      <FunctionalTestYesNo
                                        tests={parsed.tests}
                                        language={consultLanguage}
                                        disabled={loading}
                                        onSubmit={(text) =>
                                          sendVoiceTurnRef.current(text)
                                        }
                                      />
                                      {parsed.after
                                        ? renderAssistantContent(parsed.after, physioHighlightPhrases)
                                        : null}
                                    </div>
                                  );
                                }}
                              />
                              {msg.id !== WELCOME_ID &&
                                !msg.id.startsWith("q-intro") &&
                                phase === "followup" &&
                                !isRevealing && (
                                  <p className="mt-2 text-xs text-slate-400">
                                    {consultLanguage === "en" ? "Informational guidance, not a medical diagnosis." : "Orientación informativa, no diagnóstico médico."}
                                  </p>
                                )}
                            </>
                          )}
                        </StreamingAssistantMessage>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 px-1">
                      {msg.role === "assistant" && msg.id !== WELCOME_ID ? (
                        <VoiceSpeakButton
                          supported={ttsSupported}
                          speaking={speakingId === msg.id}
                          onToggle={() => toggleSpeak(msg.content, msg.id)}
                        />
                      ) : null}
                      {time ? (
                        <span className="text-[11px] text-slate-400">{time}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {linkedPhysio && phase === "complete" ? (
              <PhysioReportCompleteCard
                physioName={linkedPhysio.physio_name}
                clinicName={linkedPhysio.clinic_name}
                guestMode={guestMode}
              />
            ) : !linkedPhysio && phase === "complete" ? (
              <ConsultaCompleteCard
                locale={consultLanguage}
                onNewConsulta={startNewConsultation}
              />
            ) : !linkedPhysio && showUnrelatedCta ? (
              <ConsultaNewConsultaPrompt
                locale={consultLanguage}
                onNewConsulta={startNewConsultation}
              />
            ) : null}

            {phase === "questionnaire" && (
              <div
                ref={questionnaireRef}
                className="animate-scale-in rounded-3xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-elevated)] sm:p-6"
              >
                <TrustPanel locale={consultLanguage} />
                {questionnairePart === "shoulder" ? (
                  <>
                    <ConsultaAdaptiveShoulder
                      value={shoulderAnswers}
                      onChange={setShoulderAnswers}
                      sectionIndex={shoulderSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setShoulderSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                      focus={resolveShoulderQuestionnaireFocus(initialMessage)}
                    />
                    {isLastShoulderSection(
                      shoulderAnswers,
                      shoulderSectionIndex,
                      resolveShoulderQuestionnaireFocus(initialMessage)
                    ) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "elbow" ? (
                  <>
                    <ConsultaAdaptiveElbow
                      value={elbowAnswers}
                      onChange={setElbowAnswers}
                      sectionIndex={elbowSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setElbowSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastElbowSection(elbowAnswers, elbowSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "wrist_hand" ? (
                  <>
                    <ConsultaAdaptiveWrist
                      value={wristAnswers}
                      onChange={setWristAnswers}
                      sectionIndex={wristSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setWristSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastWristSection(wristAnswers, wristSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "finger" ? (
                  <>
                    <ConsultaAdaptiveFinger
                      value={fingerAnswers}
                      onChange={setFingerAnswers}
                      sectionIndex={fingerSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setFingerSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastFingerSection(fingerAnswers, fingerSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "head" ? (
                  <>
                    <ConsultaAdaptiveHead
                      value={headAnswers}
                      onChange={setHeadAnswers}
                      sectionIndex={headSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setHeadSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastHeadSection(headAnswers, headSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "neck" ? (
                  <>
                    <ConsultaAdaptiveNeck
                      value={neckAnswers}
                      onChange={setNeckAnswers}
                      sectionIndex={neckSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setNeckSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastNeckSection(neckAnswers, neckSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "ankle_foot" ? (
                  <>
                    <ConsultaAdaptiveLowerLeg
                      value={lowerLegAnswers}
                      onChange={setLowerLegAnswers}
                      sectionIndex={lowerLegSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setLowerLegSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastLowerLegSection(lowerLegAnswers, lowerLegSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "knee" ? (
                  <>
                    <ConsultaAdaptiveKnee
                      value={kneeAnswers}
                      onChange={setKneeAnswers}
                      sectionIndex={kneeSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setKneeSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                      onSubmitUrgency={(next) => {
                        kneeAnswersRef.current = next;
                        setKneeAnswers(next);
                        void handleQuestionnaireSubmit();
                      }}
                    />
                    {isLastKneeSection(kneeAnswers, kneeSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "back" ? (
                  <>
                    <ConsultaAdaptiveBack
                      value={backAnswers}
                      onChange={setBackAnswers}
                      sectionIndex={backSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setBackSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                    />
                    {isLastBackSection(backAnswers, backSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : questionnairePart === "hip" ? (
                  <>
                    <ConsultaAdaptiveHip
                      value={hipAnswers}
                      onChange={setHipAnswers}
                      sectionIndex={hipSectionIndex}
                      onSectionIndexChange={withQuestionnaireScroll(setHipSectionIndex)}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                      locale={consultLanguage}
                      onSubmitUrgency={(next) => {
                        hipAnswersRef.current = next;
                        setHipAnswers(next);
                        void handleQuestionnaireSubmit();
                      }}
                    />
                    {isLastHipSection(hipAnswers, hipSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="btn-primary mt-4 w-full"
                      >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <ConsultaGenericFields value={genericAnswers} onChange={setGenericAnswers} locale={consultLanguage} />
                    {shoulderSectionError && (
                      <p className="mb-3 text-sm text-red-600">{shoulderSectionError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleQuestionnaireSubmit}
                      disabled={loading}
                      className="btn-primary w-full"
                    >
                        {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                      </button>
                  </>
                )}
              </div>
            )}

            {loading && !loadingModal && !openingConversation && (phase === "followup" || phase === "intro") && (
              <div className="animate-fade-in-up flex items-start gap-3 justify-start">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-100">
                  <PhysioAvatar size={36} />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[var(--shadow-card)]">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
        <ScrollToBottomButton visible={showScrollDown} onClick={scrollToBottom} />
        </div>

        {conversationMode && phase === "questionnaire" ? (
          <div className="shrink-0 border-t border-blue-100 bg-blue-50 px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <p className="text-xs text-blue-800">
                Conversación en pausa: completa el cuestionario. Luego la IA te
                hablará y podréis seguir.
              </p>
              <VoiceConversationButton
                supported={sttSupported}
                active={conversationMode}
                onToggle={toggleConversationMode}
              />
            </div>
          </div>
        ) : null}

        {showChatInput && (
          <div
            className="shrink-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent px-4 pt-2 sm:px-6 lg:px-8"
            style={{
              paddingBottom:
                keyboardOverlap > 0
                  ? keyboardOverlap + 8
                  : "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto w-full max-w-3xl">
            {attachedFile ? (
              <div className="animate-fade-in-up mb-2 flex items-center gap-2">
                {attachedPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attachedPreview}
                    alt="Vista previa"
                    className="h-14 w-14 rounded-[16px] object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-14 max-w-[70%] items-center gap-2 rounded-[16px] bg-slate-100 px-3 ring-1 ring-slate-200">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-slate-600" aria-hidden>
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                      <path d="M14 3v5h5" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate text-xs font-semibold text-slate-700">
                      {attachedFile.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={clearAttachment}
                  disabled={loading}
                  className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
                >
                  Quitar
                </button>
              </div>
            ) : null}
            <div
              className={`chat-composer flex w-full flex-row flex-nowrap items-end gap-1.5 ${
                conversationMode ? "chat-composer--active" : ""
              }`}
            >
              {!conversationMode ? (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={loading}
                  title="Adjuntar foto, PDF o archivo"
                  aria-label="Adjuntar foto, PDF o archivo"
                  className="mb-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={(e) => {
                  const el = e.currentTarget;
                  window.setTimeout(() => {
                    el.scrollIntoView({ block: "nearest", inline: "nearest" });
                  }, 350);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (conversationMode) return;
                    stopMic();
                    onSend();
                  }
                }}
                placeholder={
                  conversationMode
                    ? listening
                      ? "Te escucho…"
                      : "Conversación activa…"
                    : inputPlaceholder
                }
                rows={1}
                disabled={loading || conversationMode}
                className="chat-composer__input min-w-0 flex-1 basis-0"
              />
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*,.pdf,application/pdf"
                className="hidden"
                onChange={onAttachmentSelected}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onAttachmentSelected}
              />
              <div className="mb-0.5 flex shrink-0 items-center gap-0.5">
                <VoiceConversationButton
                  supported={sttSupported}
                  active={conversationMode}
                  disabled={loading && !conversationMode}
                  onToggle={toggleConversationMode}
                />
                {!conversationMode ? (
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={loading}
                    title="Hacer foto"
                    aria-label="Hacer foto"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" strokeLinejoin="round" />
                      <circle cx="12" cy="14.5" r="3.2" />
                    </svg>
                  </button>
                ) : null}
                {!conversationMode && (input.trim() || attachedFile) ? (
                  <button
                    type="button"
                    onClick={() => {
                      stopMic();
                      cancelSpeech();
                      onSend();
                    }}
                    disabled={loading}
                    className="btn-send"
                    aria-label="Enviar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>
            {(conversationMode || sttError) && (
              <p className="mt-1.5 text-center text-xs text-slate-500">
                {sttError ??
                  (listening
                    ? "Habla con naturalidad. Tras 3 segundos de silencio, es el turno de la IA."
                    : "La IA está respondiendo…")}
              </p>
            )}
            <p className="mt-2 w-full text-center text-xs text-slate-400">
              La IA puede cometer errores. Considera verificar la información importante.
            </p>
            </div>
          </div>
        )}
      </div>

      {loadingModal && (
        <div className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
          <div className="animate-scale-in mx-4 w-full max-w-sm rounded-3xl bg-white px-8 py-10 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-4 ring-blue-100">
              <PhysioAvatar size={56} />
            </div>
            <p className="text-base font-semibold text-slate-900">
              Physio está analizando tu caso
            </p>
            <p className="mt-2 text-sm text-slate-500">Estaremos contigo en breve.</p>
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
            </div>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-emerald-500">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
              </svg>
              Análisis seguro y cifrado
            </div>
          </div>
        </div>
      )}

      {showPhysioCodeEntry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md">
            <PhysioCodeGate
              embedded
              onCancel={() => setShowPhysioCodeEntry(false)}
              onLinked={handleAnotherPhysioLinked}
            />
          </div>
        </div>
      )}
    </div>
  );
}
