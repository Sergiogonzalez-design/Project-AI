import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { composerBottomInset, useKeyboardHeight } from "../hooks/useKeyboardHeight";
import { useOnAppBackground } from "../hooks/useAppLifecycle";
import type { TabParamList } from "../navigation/AppTabs";
import {
  ConsultaAdaptiveShoulder,
  isLastShoulderSection,
} from "../components/ConsultaAdaptiveShoulder";
import {
  ConsultaAdaptiveElbow,
  isLastElbowSection,
} from "../components/ConsultaAdaptiveElbow";
import {
  ConsultaAdaptiveFinger,
  isLastFingerSection,
} from "../components/ConsultaAdaptiveFinger";
import {
  ConsultaAdaptiveWrist,
  isLastWristSection,
} from "../components/ConsultaAdaptiveWrist";
import { AssistantMessageWithSources } from "../components/AssistantMessageWithSources";
import { ConsultaAssistantBody } from "../components/ConsultaAssistantBody";
import { stripVisibleMarkup } from "../lib/strip-visible-markup";
import { FunctionalTestYesNo } from "../components/FunctionalTestYesNo";
import {
  latestUnansweredFunctionalTests,
  splitFunctionalTests,
} from "../lib/functional-test-answers";
import { ConsultaGenericFields } from "../components/ConsultaGenericFields";
import { QuestionnaireKeyboardProvider } from "../components/ConsultaTextInput";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { scrollFocusedInputAboveKeyboard } from "../lib/scroll-focused-input-above-keyboard";
import { AppBurgerMenu } from "../components/AppBurgerMenu";
import { PhysioAvatar } from "../components/PhysioAvatar";
import { PhysioIntro } from "../components/PhysioIntro";
import { ScrollToBottomButton } from "../components/ScrollToBottomButton";
import { StreamingAssistantMessage } from "../components/StreamingAssistantMessage";
import { TypingIndicator } from "../components/TypingIndicator";
import { bodyPartLabel, type BodyPartId } from "../lib/body-parts";
import {
  defaultGenericConsultaAnswers,
  formatGenericConsulta,
  validateGenericConsulta,
  type GenericConsultaAnswers,
} from "../lib/consulta-generic";
import {
  defaultShoulderAdaptiveAnswers,
  detectRedFlags,
  formatShoulderAdaptive,
  getVisibleShoulderSections,
  localizeShoulderLabel,
  resolveShoulderQuestionnaireFocus,
  validateShoulderAdaptive,
  validateShoulderSection,
  withShoulderHintsFromText,
  type ShoulderAdaptiveAnswers,
} from "../lib/consulta-shoulder-adaptive";
import {
  defaultElbowAdaptiveAnswers,
  detectElbowRedFlags,
  formatElbowAdaptive,
  getVisibleElbowSections,
  localizeElbowLabel,
  validateElbowAdaptive,
  validateElbowSection,
  withElbowHintsFromText,
  type ElbowAdaptiveAnswers,
} from "../lib/consulta-elbow-adaptive";
import {
  defaultFingerAdaptiveAnswers,
  detectFingerRedFlags,
  formatFingerAdaptive,
  getVisibleFingerSections,
  localizeFingerLabel,
  validateFingerAdaptive,
  validateFingerSection,
  type FingerAdaptiveAnswers,
} from "../lib/consulta-finger-adaptive";
import {
  defaultWristAdaptiveAnswers,
  detectWristRedFlags,
  formatWristAdaptive,
  getVisibleWristSections,
  localizeWristLabel,
  validateWristAdaptive,
  validateWristSection,
  type WristAdaptiveAnswers,
} from "../lib/consulta-wrist-adaptive";
import {
  defaultNeckAdaptiveAnswers,
  detectNeckRedFlags,
  formatNeckAdaptive,
  getVisibleNeckSections,
  localizeNeckLabel,
  validateNeckAdaptive,
  validateNeckSection,
  type NeckAdaptiveAnswers,
} from "../lib/consulta-neck-adaptive";
import {
  defaultHeadAdaptiveAnswers,
  detectHeadRedFlags,
  formatHeadAdaptive,
  getVisibleHeadSections,
  localizeHeadLabel,
  validateHeadAdaptive,
  validateHeadSection,
  type HeadAdaptiveAnswers,
} from "../lib/consulta-head-adaptive";
import {
  defaultLowerLegAdaptiveAnswers,
  detectLowerLegRedFlags,
  formatLowerLegAdaptive,
  bodyAreaLabelFromLowerLegAnswers,
  getVisibleLowerLegSections,
  localizeLowerLegLabel,
  validateLowerLegAdaptive,
  validateLowerLegSection,
  withAnkleFootFocusFromText,
  type LowerLegAdaptiveAnswers,
} from "../lib/consulta-lower-leg-adaptive";
import {
  defaultKneeAdaptiveAnswers,
  detectKneeRedFlags,
  formatKneeAdaptive,
  getVisibleKneeSections,
  localizeKneeLabel,
  validateKneeAdaptive,
  validateKneeSection,
  type KneeAdaptiveAnswers,
} from "../lib/consulta-knee-adaptive";
import {
  defaultBackAdaptiveAnswers,
  detectBackRedFlags,
  formatBackAdaptive,
  getVisibleBackSections,
  localizeBackLabel,
  validateBackAdaptive,
  validateBackSection,
  type BackAdaptiveAnswers,
} from "../lib/consulta-back-adaptive";
import {
  defaultHipAdaptiveAnswers,
  detectHipRedFlags,
  formatHipAdaptive,
  getVisibleHipSections,
  hipBodyAreaLabelForAi,
  localizeHipLabel,
  validateHipAdaptive,
  validateHipSection,
  type HipAdaptiveAnswers,
} from "../lib/consulta-hip-adaptive";
import {
  ConsultaAdaptiveNeck,
  isLastNeckSection,
} from "../components/ConsultaAdaptiveNeck";
import {
  ConsultaAdaptiveHead,
  isLastHeadSection,
} from "../components/ConsultaAdaptiveHead";
import {
  ConsultaAdaptiveLowerLeg,
  isLastLowerLegSection,
} from "../components/ConsultaAdaptiveLowerLeg";
import {
  ConsultaAdaptiveKnee,
  isLastKneeSection,
} from "../components/ConsultaAdaptiveKnee";
import {
  ConsultaAdaptiveBack,
  isLastBackSection,
} from "../components/ConsultaAdaptiveBack";
import {
  ConsultaAdaptiveHip,
  isLastHipSection,
} from "../components/ConsultaAdaptiveHip";
import {
  questionnaireForText,
  questionnaireIntroMessage,
  resolveAnkleFootFocus,
  patientFacingPartLabel,
  detectBodyPartsFromText,
  isVagueArmComplaint,
  vagueArmClarifyMessage,
  resolveBodyPartFromLocationReply,
} from "../lib/detect-body-part";
import {
  decideFisioIntro,
  decideFisioLocationReply,
} from "../lib/fisio-case-flow";
import {
  betweenPartsChoiceContext,
  isClearStartNextPart,
  isDeclineNextPart,
  isMetaOrClarificationQuery,
  isInformationalOrEducationalQuery,
  shouldOpenSymptomQuestionnaire,
  nextPartReadyMessage,
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
  respondToUserMessage,
  shouldStartQuestionnaire,
  triageMessage,
  wantsFunctionalTestsNow,
  wantsToContinueToNextQuestionnaire,
  type AdaptiveQuestionnairePart,
} from "../lib/consulta-triage";
import {
  affirmsExerciseOffer,
  buildPostConsultCaseSummary,
  declinesExerciseOffer,
} from "../lib/consulta-exercise-offer";
import { callEdgeText, callEdgeJson } from "../lib/consulta-api";
import {
  type ConsultLanguage,
} from "../lib/consult-language";
import { formatValidationIssueMessage } from "../lib/consulta-validation";
import {
  consultAttachmentCaption,
  consultAttachmentHistoryNote,
  consultPhotoAccessUrl,
  consultPhotoVisionUrl,
  signConsultMessageAttachments,
  isConsultImageMime,
  isConsultPdfUrl,
  MAX_CONSULT_ATTACHMENT_BYTES,
  uploadConsultPhotoFromUri,
} from "../lib/consult-photo";
import {
  canStartNewFisioConsult,
  fisioNewConsultCooldownMessage,
  fisioNewConsultHoursRemaining,
} from "../lib/fisio-consult-cooldown";
import { Colors } from "../lib/colors";
import { screenHeaderTopInset } from "../lib/screen-header-insets";
import { useI18n } from "../lib/i18n";
import { getNotificationsEnabled } from "../lib/notifications";
import {
  buildPhysioLinkedCompletionMessage,
  buildPhysioLinkedFunctionalTestsPrompt,
  buildPhysioLinkedIntroGreeting,
  buildPhysioLinkedPostQuestionnaireMessage,
  buildPhysioLinkedWelcome,
  physioDisplayName,
} from "../lib/physio-linked-welcome";
import { refreshSmartReminders } from "../lib/smart-reminders";
import { supabase } from "../lib/supabase";
import { FadeInView } from "../components/ui/FadeInView";
import { TrustPanel } from "../components/ui/TrustPanel";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useSpeechToText } from "../hooks/useSpeechToText";

const WELCOME_MESSAGE_ES =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia o duda sobre ejercicios.";
const WELCOME_MESSAGE_EN =
  "How can I help you? Tell me if you have any discomfort or a question about exercises.";
const WELCOME_ID = "welcome";

type Phase = "intro" | "questionnaire" | "followup" | "complete";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
};
type Conversation = {
  id: string;
  title: string;
  created_at: string;
  physio_id?: string | null;
  physio_name?: string | null;
  clinic_name?: string | null;
};

function formatDate(iso: string, locale: "es" | "en" = "es") {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "short",
  });
}

type ConversationGroup = {
  label: string;
  physioName?: string;
  clinicName?: string | null;
  items: Conversation[];
};

function groupConversationsByDate(
  conversations: Conversation[],
  locale: "es" | "en"
): ConversationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86_400_000);

  const labels =
    locale === "en"
      ? { today: "Today", yesterday: "Yesterday", week: "Last 7 days", older: "Older" }
      : { today: "Hoy", yesterday: "Ayer", week: "Últimos 7 días", older: "Anteriores" };

  const buckets: Record<"today" | "yesterday" | "week" | "older", Conversation[]> = {
    today: [],
    yesterday: [],
    week: [],
    older: [],
  };

  for (const c of conversations) {
    const d = new Date(c.created_at);
    if (d >= startOfToday) buckets.today.push(c);
    else if (d >= startOfYesterday) buckets.yesterday.push(c);
    else if (d >= startOfWeek) buckets.week.push(c);
    else buckets.older.push(c);
  }

  const groups: ConversationGroup[] = [
    { label: labels.today, items: buckets.today },
    { label: labels.yesterday, items: buckets.yesterday },
    { label: labels.week, items: buckets.week },
    { label: labels.older, items: buckets.older },
  ];
  return groups.filter((g) => g.items.length > 0);
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

function splitHighlightParts(text: string, phrases?: string[]) {
  if (!text || !phrases?.length) return [{ text, highlight: false }];
  // Ignore tiny phrases — they split words mid-character ("Hola" → "Ho"/"la").
  const present = phrases.filter(
    (p) => p.length >= 3 && text.toLowerCase().includes(p.toLowerCase())
  );
  if (present.length === 0) return [{ text, highlight: false }];
  const escaped = present.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re).filter(Boolean).map((part) => ({
    text: part,
    highlight: present.some((p) => p.toLowerCase() === part.toLowerCase()),
  }));
}

function BoldText({ text, style, boldStyle, highlightPhrases, highlightStyle }: {
  text: string;
  style?: object;
  boldStyle?: object;
  highlightPhrases?: string[];
  highlightStyle?: object;
}) {
  const lines = text.split("\n");

  return (
    <Text style={style}>
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (
          /^Fuente:/i.test(trimmed) ||
          /^- Fuente:/i.test(trimmed) ||
          /^Source:/i.test(trimmed) ||
          /^- Source:/i.test(trimmed)
        ) {
          return null;
        }

        const heading = line.replace(/^#{1,6}\s*/, "");
        if (!heading.includes("**") && !(highlightPhrases && highlightPhrases.length > 0)) {
          return (
            <Text key={li}>
              {stripVisibleMarkup(heading)}
              {li < lines.length - 1 ? "\n" : ""}
            </Text>
          );
        }
        const parts = heading.split(/(\*\*[^*]+\*\*)/g);
        return (
          <Text key={li}>
            {parts.map((part, i) => {
              const isBold = part.startsWith("**") && part.endsWith("**");
              const inner = isBold
                ? stripVisibleMarkup(part.slice(2, -2))
                : stripVisibleMarkup(part);
              if (!inner) return null;
              const chunks = splitHighlightParts(inner, highlightPhrases);
              if (chunks.length === 1 && !chunks[0].highlight) {
                return (
                  <Text key={i} style={isBold ? [style, boldStyle ?? { fontWeight: "700" }] : undefined}>
                    {chunks[0].text}
                  </Text>
                );
              }
              return (
                <Text key={i} style={isBold ? [style, boldStyle ?? { fontWeight: "700" }] : undefined}>
                  {chunks.map((chunk, ci) => (
                    <Text
                      key={ci}
                      style={chunk.highlight ? highlightStyle : undefined}
                    >
                      {chunk.text}
                    </Text>
                  ))}
                </Text>
              );
            })}
            {li < lines.length - 1 ? "\n" : ""}
          </Text>
        );
      })}
    </Text>
  );
}

function welcomeMessage(content: string = WELCOME_MESSAGE_ES): Message {
  return { id: WELCOME_ID, role: "assistant", content };
}

function titleFromText(text: string): string {
  const short = text.trim().slice(0, 40);
  return short.length < text.trim().length ? `${short}…` : short;
}

function shouldAnimateAssistantMessage(msg: Message, revealingMessageId: string | null) {
  return (
    msg.role === "assistant" &&
    msg.id !== WELCOME_ID &&
    !msg.id.startsWith("q-intro") &&
    msg.id === revealingMessageId
  );
}

function isLongAssistantReply(content: string) {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  return content.length >= 480 || lines.length >= 8;
}

type LinkedPhysioInfo = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

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
    if (!trimmed || trimmed.length < 3) return;
    if (GENERIC_PHYSIO_LABELS.has(trimmed.toLowerCase())) return;
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

type AIInquiriesScreenProps = {
  linkedPhysio?: LinkedPhysioInfo | null;
  onLinkedPhysioChange?: (physio: LinkedPhysioInfo) => void;
  guestMode?: boolean;
  onCreateAccount?: () => void;
};

export function AIInquiriesScreen({
  linkedPhysio = null,
  onLinkedPhysioChange,
  guestMode = false,
  onCreateAccount,
}: AIInquiriesScreenProps) {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const openClinicProfile = useCallback(
    (clinicSlug: string) => {
      navigation.navigate("ClinicSearch", { clinicSlug });
    },
    [navigation]
  );
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const composerInset = composerBottomInset(keyboardHeight, insets.bottom);
  const { t, locale } = useI18n();
  const consultLanguage = locale;
  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name, {
        guest: guestMode,
        clinicName: linkedPhysio.clinic_name,
        language: locale,
      })
    : locale === "en"
      ? WELCOME_MESSAGE_EN
      : WELCOME_MESSAGE_ES;
  const introGreeting = linkedPhysio
    ? buildPhysioLinkedIntroGreeting(linkedPhysio.physio_name, locale)
    : undefined;
  const fisioEdgeExtras = linkedPhysio
    ? {
        fisioterapiaFlow: true,
        linkedPhysioName: linkedPhysio.physio_name,
        linkedClinicName: linkedPhysio.clinic_name ?? null,
      }
    : undefined;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerShown: guestMode });
    }, [navigation, guestMode])
  );

  const [messages, setMessages] = useState<Message[]>([]);
  // Fisioterapia never boots into the intro animation — wait for history first.
  const [physioIntro, setPhysioIntro] = useState(!linkedPhysio);
  const [phase, setPhase] = useState<Phase>("intro");
  const [initialMessage, setInitialMessage] = useState("");
  const [questionnairePart, setQuestionnairePart] = useState<BodyPartId | "generic">("shoulder");
  const [shoulderAnswers, setShoulderAnswers] = useState(defaultShoulderAdaptiveAnswers());
  const [elbowAnswers, setElbowAnswers] = useState(defaultElbowAdaptiveAnswers());
  const [wristAnswers, setWristAnswers] = useState<WristAdaptiveAnswers>(defaultWristAdaptiveAnswers());
  const [fingerAnswers, setFingerAnswers] = useState<FingerAdaptiveAnswers>(defaultFingerAdaptiveAnswers());
  const [neckAnswers, setNeckAnswers] = useState<NeckAdaptiveAnswers>(defaultNeckAdaptiveAnswers());
  const [headAnswers, setHeadAnswers] = useState<HeadAdaptiveAnswers>(defaultHeadAdaptiveAnswers());
  const [lowerLegAnswers, setLowerLegAnswers] = useState<LowerLegAdaptiveAnswers>(defaultLowerLegAdaptiveAnswers());
  const [kneeAnswers, setKneeAnswers] = useState<KneeAdaptiveAnswers>(defaultKneeAdaptiveAnswers());
  const [backAnswers, setBackAnswers] = useState<BackAdaptiveAnswers>(defaultBackAdaptiveAnswers());
  const [hipAnswers, setHipAnswers] = useState<HipAdaptiveAnswers>(defaultHipAdaptiveAnswers());
  const kneeAnswersRef = useRef(kneeAnswers);
  const hipAnswersRef = useRef(hipAnswers);
  kneeAnswersRef.current = kneeAnswers;
  hipAnswersRef.current = hipAnswers;
  const [genericAnswers, setGenericAnswers] = useState(defaultGenericConsultaAnswers());
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
  const [formError, setFormError] = useState<string | null>(null);
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
  const [functionalTestsCompletedParts, setFunctionalTestsCompletedParts] =
    useState<AdaptiveQuestionnairePart[]>([]);
  const functionalTestsCompletedRef = useRef(functionalTestsCompletedParts);
  functionalTestsCompletedRef.current = functionalTestsCompletedParts;
  const [relatedFollowupActive, setRelatedFollowupActive] = useState(false);
  const [postGuidanceAsked, setPostGuidanceAsked] = useState(false);
  const [exerciseOfferActive, setExerciseOfferActive] = useState(false);
  const [showUnrelatedCta, setShowUnrelatedCta] = useState(false);
  /** Original complaint while we ask where on the arm/leg it hurts. */
  const [pendingComplaintText, setPendingComplaintText] = useState<string | null>(
    null
  );

  const [chatInput, setChatInput] = useState("");
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const [attachedName, setAttachedName] = useState<string | null>(null);
  const [caseImageUrl, setCaseImageUrl] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const loadingModalStartedAtRef = useRef<number | null>(null);
  const [revealingMessageId, setRevealingMessageId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const pinRevealToStartRef = useRef(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState(t.consulta.newConsulta);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [physioReportSentBanner, setPhysioReportSentBanner] = useState(false);
  const [fisioNewConsultDraft, setFisioNewConsultDraft] = useState(false);
  const [showPhysioCodeEntry, setShowPhysioCodeEntry] = useState(false);
  const [physioCodeInput, setPhysioCodeInput] = useState("");
  const [physioCodeError, setPhysioCodeError] = useState<string | null>(null);
  const [physioCodeBusy, setPhysioCodeBusy] = useState(false);
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
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const SILENCE_MS = 3000;

  const {
    supported: ttsSupported,
    speakingId,
    speak,
    cancel: cancelSpeech,
    toggle: toggleSpeak,
  } = useSpeechSynthesis({ language: consultLanguage });

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resumeConversationListening = useCallback(() => {
    conversationBusyRef.current = false;
    hearingTextRef.current = "";
    clearSilenceTimer();
    if (!conversationModeRef.current) return;
    if (phaseRef.current === "questionnaire") return;
    setTimeout(() => {
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
      setChatInput(heard);
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
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

  startMicRef.current = () => {
    void startMic();
  };
  stopMicRef.current = stopMic;

  useOnAppBackground(() => {
    clearSilenceTimer();
    conversationBusyRef.current = false;
    stopMicRef.current();
    cancelSpeech();
    Keyboard.dismiss();
  });

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
    conversationModeRef.current = true;
    setConversationMode(true);
    conversationBusyRef.current = false;
    cancelSpeech();
    if (phase !== "questionnaire") void startMic();
  }

  const chatScrollRef = useRef<ScrollView>(null);
  const questionnaireScrollRef = useRef<ScrollView>(null);
  const questionnaireScrollY = useRef(0);
  const questionnaireTopY = useRef(0);
  const messageOffsets = useRef<Record<string, number>>({});
  const scrollMetrics = useRef({ offset: 0, viewport: 0, content: 0 });

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!pendingFisioCodeReload.current || !linkedPhysio) return;
    pendingFisioCodeReload.current = false;
    void loadConversations({ skipAutoOpen: true });
  }, [linkedPhysio]);

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

  const updateScrollDownVisibility = useCallback(() => {
    const { offset, viewport, content } = scrollMetrics.current;
    setShowScrollDown(content - offset - viewport > 96);
  }, []);

  const scrollToBottom = useCallback(() => {
    chatScrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  const scrollToBottomAfterPaint = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
  }, []);

  const ensureQuestionnaireFieldVisible = useCallback(() => {
    scrollFocusedInputAboveKeyboard(
      questionnaireScrollRef.current,
      questionnaireScrollY.current,
      keyboardHeight
    );
  }, [keyboardHeight]);

  useEffect(() => {
    if (keyboardHeight <= 0) return;
    if (phase === "questionnaire") {
      const t1 = setTimeout(ensureQuestionnaireFieldVisible, 50);
      const t2 = setTimeout(ensureQuestionnaireFieldVisible, 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const t = setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [keyboardHeight, phase, ensureQuestionnaireFieldVisible]);

  const scrollToMessageStart = useCallback((id: string, animated = true) => {
    const y = messageOffsets.current[id];
    if (y != null) {
      chatScrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated });
    }
  }, []);

  const beginAssistantReveal = useCallback((id: string, content: string) => {
    pinRevealToStartRef.current = isLongAssistantReply(content);
    setRevealingMessageId(id);
  }, []);

  const scrollQuestionnaireToTop = useCallback(() => {
    requestAnimationFrame(() => {
      questionnaireScrollRef.current?.scrollTo({
        y: questionnaireTopY.current,
        animated: true,
      });
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
      requestAnimationFrame(() => scrollToMessageStart(revealingMessageId, false));
      const t1 = setTimeout(() => scrollToMessageStart(revealingMessageId, false), 80);
      const t2 = setTimeout(() => scrollToMessageStart(revealingMessageId, true), 250);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    scrollToBottom();
  }, [revealingMessageId, scrollToMessageStart, scrollToBottom]);

  useEffect(() => {
    updateScrollDownVisibility();
  }, [messages, chatLoading, phase, physioIntro, updateScrollDownVisibility]);

  /** Never leave the full-screen "Analyzing…" overlay stuck after the AI reply is ready. */
  useEffect(() => {
    if (!loadingModal) {
      loadingModalStartedAtRef.current = null;
      return;
    }
    loadingModalStartedAtRef.current = Date.now();
    const failSafe = setTimeout(() => {
      setLoadingModal(false);
      setChatLoading(false);
    }, 120_000);
    return () => clearTimeout(failSafe);
  }, [loadingModal]);

  function dismissQuestionnaireLoading() {
    setChatLoading(false);
    setLoadingModal(false);
  }

  function runPostQuestionnaireFollowUp(
    conversationId: string,
    completedPart: AdaptiveQuestionnairePart | "generic",
    language: ConsultLanguage,
    completedSummary: string,
    areaLabel: string
  ) {
    void (async () => {
      try {
        await offerNextPendingPart(
          conversationId,
          completedPart,
          language,
          completedSummary,
          areaLabel
        );
        if (await getNotificationsEnabled()) {
          void refreshSmartReminders(locale);
        }
      } catch (err) {
        console.error("Post-questionnaire follow-up failed:", err);
      }
    })();
  }

  async function loadConversations(opts?: { skipAutoOpen?: boolean }) {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at, physio_id, physio_name, clinic_name")
      .eq("kind", linkedPhysio ? "fisioterapia" : "consulta")
      .order("created_at", { ascending: false })
      .limit(linkedPhysio ? 30 : 10);
    const list = (data as Conversation[]) ?? [];
    setConversations(list);

    if (linkedPhysio && list.length > 0 && !opts?.skipAutoOpen) {
      const preferred =
        (linkedPhysio.physio_id
          ? list.find((c) => c.physio_id === linkedPhysio.physio_id)
          : null) ?? list[0];
      await loadConversation(preferred.id, preferred.title);
      return;
    }

    if (linkedPhysio) {
      setPhysioIntro(true);
    }
    setHistoryLoaded(true);
  }

  async function loadConversation(id: string, title: string) {
    setActiveId(id);
    setActiveTitle(title);
    setOpeningConversation(true);
    setHistoryOpen(false);
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
    setExerciseOfferActive(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setCaseImageUrl(null);
    setAttachedUri(null);
    setPhysioReportSentBanner(false);

    const { data } = await supabase
      .from("messages")
      .select("id, role, content, image_url")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    let msgs = (data as Message[]) ?? [];

    msgs = await signConsultMessageAttachments(msgs);

    if (linkedPhysio) {
      const { data: report } = await supabase
        .from("clinical_reports")
        .select("id")
        .eq("conversation_id", id)
        .limit(1)
        .maybeSingle();

      msgs = msgs.filter(
        (m) =>
          m.role !== "assistant" ||
          !/\*\*Resumen de tu consulta\*\*|Estructuras que podrían estar afectadas|Posibles lesiones \(orientativas\)/i.test(
            m.content
          )
      );

      setPhase(report ? "complete" : "followup");
      if (report) setPhysioReportSentBanner(true);
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
    setOpeningConversation(false);
    setHistoryLoaded(true);
  }

  function clearToFisioIdle() {
    setActiveId(null);
    setActiveTitle(
      linkedPhysio
        ? `Consulta con ${physioDisplayName(linkedPhysio.physio_name)}`
        : t.consulta.newConsulta
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
    setExerciseOfferActive(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setChatInput("");
    setCaseImageUrl(null);
    setAttachedUri(null);
    setHistoryOpen(false);
    setPhysioReportSentBanner(false);
  }

  function deleteConversation(id: string) {
    Alert.alert(t.consulta.deleteTitle, t.consulta.deleteBody, [
      { text: t.consulta.cancel, style: "cancel" },
      {
        text: t.consulta.delete,
        style: "destructive",
        onPress: () => {
          void (async () => {
            setDeletingId(id);
            const { error } = await supabase.from("conversations").delete().eq("id", id);
            setDeletingId(null);

            if (error) {
              Alert.alert(t.common.error, t.consulta.deleteError);
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
          })();
        },
      },
    ]);
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
    setLowerLegAnswers(defaultLowerLegAdaptiveAnswers());
    setKneeAnswers(defaultKneeAdaptiveAnswers());
    setBackAnswers(defaultBackAdaptiveAnswers());
    setHipAnswers(defaultHipAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setHeadSectionIndex(0);
    setNeckSectionIndex(0);
    setLowerLegSectionIndex(0);
    setKneeSectionIndex(0);
    setBackSectionIndex(0);
    setHipSectionIndex(0);
    setFormError(null);
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
    setExerciseOfferActive(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setChatInput("");
    setAttachedUri(null);
    setCaseImageUrl(null);
        setHistoryOpen(false);
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
        Alert.alert(
          locale === "en" ? "Please wait" : "Espera un poco",
          fisioNewConsultCooldownMessage(hoursLeft, locale === "en" ? "en" : "es")
        );
        setShowPhysioCodeEntry(false);
        setPhysioCodeInput("");
        setPhysioCodeError(null);
        return;
      }
    }

    onLinkedPhysioChange?.(physio);
    setShowPhysioCodeEntry(false);
    setPhysioCodeInput("");
    setPhysioCodeError(null);
    setActiveTitle(`Consulta con ${physioDisplayName(physio.physio_name)}`);
    resetForNewFisioCodeLink();
    pendingFisioCodeReload.current = true;
  }

  async function submitAnotherPhysioCode() {
    setPhysioCodeError(null);
    const normalized = physioCodeInput.trim().toUpperCase();
    if (normalized.length < 6) {
      setPhysioCodeError(
        locale === "en"
          ? "Enter the code your physiotherapist gave you."
          : "Introduce el código que te ha dado tu fisioterapeuta."
      );
      return;
    }
    setPhysioCodeBusy(true);
    const { data, error: rpcError } = await supabase.rpc("patient_link_physio_code", {
      p_code: normalized,
    });
    setPhysioCodeBusy(false);
    if (rpcError) {
      const raw = rpcError.message ?? "";
      setPhysioCodeError(
        raw.includes("no encontrado")
          ? locale === "en"
            ? "Code not found. Check that you typed it correctly."
            : "Código no encontrado. Comprueba que lo has escrito bien."
          : raw
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.physio_id) {
      setPhysioCodeError(
        locale === "en" ? "Could not link with that code." : "No se pudo vincular con ese código."
      );
      return;
    }
    handleAnotherPhysioLinked({
      physio_id: row.physio_id,
      physio_name: row.physio_name ?? null,
      clinic_name: row.clinic_name ?? null,
    });
  }

  function startNewConsultation() {
    if (linkedPhysio) return;

    setActiveId(null);
    setActiveTitle(t.consulta.newConsulta);
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
    setLowerLegAnswers(defaultLowerLegAdaptiveAnswers());
    setKneeAnswers(defaultKneeAdaptiveAnswers());
    setBackAnswers(defaultBackAdaptiveAnswers());
    setHipAnswers(defaultHipAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setHeadSectionIndex(0);
    setNeckSectionIndex(0);
    setLowerLegSectionIndex(0);
    setKneeSectionIndex(0);
    setBackSectionIndex(0);
    setHipSectionIndex(0);
    setFormError(null);
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
    setExerciseOfferActive(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setChatInput("");
    setAttachedUri(null);
    setCaseImageUrl(null);
        setHistoryOpen(false);
  }

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
    setAttachedName(null);
  }

  function applyPickedAsset(uri: string, mimeType?: string | null, name?: string | null) {
    setAttachedUri(uri);
    setAttachedMime(mimeType ?? "image/jpeg");
    setAttachedName(name ?? null);
  }

  async function takeConsultPhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.common.error, t.consulta.photoPermission);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    applyPickedAsset(result.assets[0].uri, result.assets[0].mimeType ?? "image/jpeg");
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.common.error, t.consulta.photoPermission);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    applyPickedAsset(
      result.assets[0].uri,
      result.assets[0].mimeType ?? "image/jpeg",
      result.assets[0].fileName
    );
  }

  async function pickConsultFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      if (asset.size && asset.size > MAX_CONSULT_ATTACHMENT_BYTES) {
        Alert.alert(t.common.error, t.consulta.fileTooLarge);
        return;
      }
      const mime =
        asset.mimeType ??
        (asset.name?.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      applyPickedAsset(asset.uri, mime, asset.name);
    } catch {
      Alert.alert(t.common.error, locale === "en" ? "Could not open the file." : "No se pudo abrir el archivo.");
    }
  }

  function pickConsultAttachment() {
    Alert.alert(t.consulta.attachFile, undefined, [
      {
        text: t.consulta.takePhoto,
        onPress: () => {
          void takeConsultPhoto();
        },
      },
      {
        text: t.consulta.choosePhoto,
        onPress: () => {
          void pickFromGallery();
        },
      },
      {
        text: t.consulta.chooseFile,
        onPress: () => {
          void pickConsultFile();
        },
      },
      { text: t.consulta.cancel, style: "cancel" },
    ]);
  }

  async function uploadOutgoingPhoto(): Promise<string | null> {
    if (!attachedUri) return null;
    const url = await uploadConsultPhotoFromUri(attachedUri, attachedMime);
    clearAttachment();
    return url;
  }

  async function respondToInitialMessage(
    text: string,
    triage: Awaited<ReturnType<typeof triageMessage>>,
    imageUrl?: string | null,
    language: ConsultLanguage = consultLanguage
  ) {
    const answer = await respondToUserMessage(
      text,
      triage,
      await consultPhotoVisionUrl(imageUrl),
      language,
      fisioEdgeExtras
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

    if (linkedPhysio && conversations.length > 0 && !fisioNewConsultDraft) {
      throw new Error(
        locale === "en"
          ? "You can't open new chats in Fisioterapia. Continue an existing one or use the Consulta tab."
          : "En Fisioterapia no se pueden abrir chats nuevos. Continúa una consulta existente o usa la pestaña Consulta."
      );
    }

    const title = titleFromText(text);
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .insert({
        title,
        user_id: user.id,
        kind: linkedPhysio ? "fisioterapia" : "consulta",
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

  /**
   * Best-effort, fire-and-forget: if this patient is linked to a physio,
   * generate a clinician-oriented report and store it for their dashboard.
   * Never throws — must not block or degrade the patient's own chat experience.
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
  }): Promise<boolean> {
    if (physioReportInFlightRef.current) {
      return false;
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
        return false;
      }

      const raw = await callEdgeJson(
        {
          mode: "physio_report",
          language: params.language,
          bodyArea: params.bodyArea,
          onsetType: params.onsetType,
          painLevel: params.painLevel,
          hadTrauma: params.hadTrauma,
          description: params.description,
          symptomContext: params.symptomContext,
          patientSummary: params.patientSummary,
        },
        fisioEdgeExtras
      );
      const answer = (raw as { answer?: string } | null)?.answer?.trim();
      if (!answer) return false;

      const { data: reportId, error: insertError } = await supabase.rpc(
        "patient_submit_clinical_report",
        {
          p_conversation_id: params.conversationId,
          p_body_area: params.bodyArea,
          p_patient_summary: params.patientSummary,
          p_physio_report: answer,
        }
      );
      if (insertError || !reportId) {
        console.error("No se pudo guardar el informe para el fisioterapeuta:", insertError);
        return false;
      }
      return true;
    } catch (err) {
      console.error("No se pudo generar el informe para el fisioterapeuta:", err);
      return false;
    } finally {
      physioReportInFlightRef.current = false;
    }
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
    setQuestionnairePart(part);
    setAwaitingNextPart(null);
    setShoulderAnswers(
      part === "shoulder"
        ? withShoulderHintsFromText(contextText)
        : defaultShoulderAdaptiveAnswers()
    );
    setElbowAnswers(
      part === "elbow"
        ? withElbowHintsFromText(contextText)
        : defaultElbowAdaptiveAnswers()
    );
    setWristAnswers(defaultWristAdaptiveAnswers());
    setFingerAnswers(defaultFingerAdaptiveAnswers());
    setHeadAnswers(defaultHeadAdaptiveAnswers());
    setNeckAnswers(defaultNeckAdaptiveAnswers());
    setLowerLegAnswers(
      part === "ankle_foot"
        ? withAnkleFootFocusFromText(
            contextText,
            resolveAnkleFootFocus(contextText)
          )
        : defaultLowerLegAdaptiveAnswers()
    );
    setKneeAnswers(defaultKneeAdaptiveAnswers());
    setBackAnswers(defaultBackAdaptiveAnswers());
    setHipAnswers(defaultHipAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setElbowSectionIndex(0);
    setWristSectionIndex(0);
    setFingerSectionIndex(0);
    setHeadSectionIndex(0);
    setNeckSectionIndex(0);
    setLowerLegSectionIndex(0);
    setKneeSectionIndex(0);
    setBackSectionIndex(0);
    setHipSectionIndex(0);
    setFormError(null);

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
    setTimeout(() => questionnaireScrollRef.current?.scrollToEnd({ animated: true }), 100);
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
    setExerciseOfferActive(false);
    const closing = consultaFinishedCloseMessage(language);
    try {
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: closing,
        })
        .select("id, role, content")
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
      .select("id, role, content")
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
    setExerciseOfferActive(false);
    setShowUnrelatedCta(false);
    if (options?.askNow || options?.offeredTests === false) {
      await appendAssistantMessage(
        conversationId,
        askMoreRelatedQuestionsPrompt(language)
      );
      setPostGuidanceAsked(true);
    }
  }

  function postConsultCaseSummaryForAi(): string {
    const evaluations = partEvaluationsRef.current.map((e) => ({
      label: e.label,
      summary: e.summary,
    }));
    if (evaluations.length > 0) {
      return buildPostConsultCaseSummary(evaluations, []);
    }
    const assistantTexts = messages
      .filter(
        (m) =>
          m.role === "assistant" &&
          !isConsultaFinishedCloseMessage(m.content),
      )
      .slice(-5)
      .map((m) => m.content);
    return buildPostConsultCaseSummary([], assistantTexts);
  }

  async function sendPostConsultExerciseOffer(conversationId: string) {
    const caseSummary = postConsultCaseSummaryForAi();
    const bodyArea = currentInjuryLabel();
    const answer = await callEdgeText(
      {
        mode: "post_consult_exercise",
        postConsultStep: "offer",
        message: caseSummary,
        bodyArea,
        language: consultLanguage,
      },
      fisioEdgeExtras,
    );
    await appendAssistantMessage(conversationId, answer);
    setRelatedFollowupActive(false);
    setExerciseOfferActive(true);
    setPostGuidanceAsked(false);
  }

  async function sendPostConsultExercisePlan(
    conversationId: string,
    patientReply: string,
  ) {
    const caseSummary = postConsultCaseSummaryForAi();
    const bodyArea = currentInjuryLabel();
    const answer = await callEdgeText(
      {
        mode: "post_consult_exercise",
        postConsultStep: "plan",
        message: caseSummary,
        bodyArea,
        description: patientReply,
        language: consultLanguage,
      },
      fisioEdgeExtras,
    );
    await appendAssistantMessage(conversationId, answer);
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
      const answer = await callEdgeText(
        {
          mode: "multi_part_summary",
          message,
          bodyArea,
          language,
        },
        fisioEdgeExtras
      );
      await appendAssistantMessage(conversationId, answer);
    } catch {
      // Allow a later retry if the edge call failed before a message was shown.
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
      const offeredTests =
        Boolean(completedSummary) &&
        /\*\*Preguntas de valoración funcional\*\*|Functional assessment questions|\*\*Preguntas de valoraci[oó]n funcional\*\*/i.test(
          completedSummary ?? ""
        );
      // Multi-zone resumen waits until the patient reports functional-test
      // results for this last injury (see reportsFunctionalTestResults path).
      // If this orientation did not offer tests, send the resumen now.
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
      .select("id, role, content")
      .single();
    if (aiMsg) {
      setMessages((prev) => [...prev, aiMsg as Message]);
    }
  }

  async function handleIntroSubmit() {
    const text =
      (pendingVoiceTextRef.current ?? chatInput).trim() ||
      (attachedUri ? consultAttachmentCaption(locale, attachedMime, attachedName) : "");
    pendingVoiceTextRef.current = null;
    if ((!text && !attachedUri) || phase !== "intro" || physioIntro || chatLoading) {
      if (conversationModeRef.current) resumeConversationListening();
      return;
    }
    const userMsgId = `user-${Date.now()}`;
    setChatInput("");
    setChatLoading(true);
    setFormError(null);

    try {
      const attachmentPath = await uploadOutgoingPhoto();
      const displayUrl = attachmentPath
        ? await consultPhotoAccessUrl(attachmentPath)
        : null;
      const imageUrl = await consultPhotoVisionUrl(attachmentPath);
      if (imageUrl) setCaseImageUrl(imageUrl);

      const lang = consultLanguage;

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: "user",
          content: text,
          image_url: displayUrl ?? undefined,
        },
      ]);
      scrollToBottomAfterPaint();

      const triage = await triageMessage(text, imageUrl, lang, fisioEdgeExtras);

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
            attachmentPath,
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
            attachmentPath,
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
          attachmentPath,
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
          attachmentPath,
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

      await respondToInitialMessage(text, triage, attachmentPath, lang);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      setFormError(
        err instanceof Error ? err.message : "No se pudo procesar tu mensaje. Inténtalo de nuevo."
      );
    } finally {
      setChatLoading(false);
    }
  }

  async function handleQuestionnaireSubmit() {
    setFormError(null);

    // Prefer refs so "Enviar ahora (urgencia)" can setState + submit with the same answers.
    const kneeAnswers = kneeAnswersRef.current;
    const hipAnswers = hipAnswersRef.current;

    const focusIssue = (
      issue: { message: string; section: string; questionId: string },
      sections: readonly string[],
      setIndex: (i: number) => void
    ) => {
      const esFallback = issue.message
        .replace(/^Responde:\s*/i, "")
        .replace(/\.$/, "");
      const localizedLabel = (() => {
        switch (questionnairePart) {
          case "shoulder":
            return localizeShoulderLabel(issue.questionId, esFallback, locale);
          case "elbow":
            return localizeElbowLabel(issue.questionId, esFallback, locale);
          case "wrist_hand":
            return localizeWristLabel(issue.questionId, esFallback, locale);
          case "finger":
            return localizeFingerLabel(issue.questionId, esFallback, locale);
          case "head":
            return localizeHeadLabel(issue.questionId, esFallback, locale);
          case "neck":
            return localizeNeckLabel(issue.questionId, esFallback, locale);
          case "ankle_foot":
            return localizeLowerLegLabel(issue.questionId, esFallback, locale);
          case "knee":
            return localizeKneeLabel(issue.questionId, esFallback, locale);
          case "back":
            return localizeBackLabel(issue.questionId, esFallback, locale);
          case "hip":
            return localizeHipLabel(issue.questionId, esFallback, locale);
          default:
            return esFallback;
        }
      })();
      setFormError(
        formatValidationIssueMessage(issue, locale, localizedLabel)
      );
      const idx = sections.findIndex((s) => s === issue.section);
      if (idx >= 0) setIndex(idx);
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
          focusIssue(sectionIssue, sections, setShoulderSectionIndex);
          return;
        }
      }
      const issue = validateShoulderAdaptive(shoulderAnswers, shoulderFocus);
      if (issue) {
        focusIssue(issue, sections, setShoulderSectionIndex);
        return;
      }
    } else if (questionnairePart === "elbow") {
      const sections = getVisibleElbowSections(elbowAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateElbowSection(lastSection, elbowAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setElbowSectionIndex);
          return;
        }
      }
      const issue = validateElbowAdaptive(elbowAnswers);
      if (issue) {
        focusIssue(issue, sections, setElbowSectionIndex);
        return;
      }
    } else if (questionnairePart === "wrist_hand") {
      const sections = getVisibleWristSections(wristAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateWristSection(lastSection, wristAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setWristSectionIndex);
          return;
        }
      }
      const issue = validateWristAdaptive(wristAnswers);
      if (issue) {
        focusIssue(issue, sections, setWristSectionIndex);
        return;
      }
    } else if (questionnairePart === "finger") {
      const sections = getVisibleFingerSections(fingerAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateFingerSection(lastSection, fingerAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setFingerSectionIndex);
          return;
        }
      }
      const issue = validateFingerAdaptive(fingerAnswers);
      if (issue) {
        focusIssue(issue, sections, setFingerSectionIndex);
        return;
      }
    } else if (questionnairePart === "head") {
      const sections = getVisibleHeadSections(headAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateHeadSection(lastSection, headAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setHeadSectionIndex);
          return;
        }
      }
      const issue = validateHeadAdaptive(headAnswers);
      if (issue) {
        focusIssue(issue, sections, setHeadSectionIndex);
        return;
      }
    } else if (questionnairePart === "neck") {
      const sections = getVisibleNeckSections(neckAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateNeckSection(lastSection, neckAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setNeckSectionIndex);
          return;
        }
      }
      const issue = validateNeckAdaptive(neckAnswers);
      if (issue) {
        focusIssue(issue, sections, setNeckSectionIndex);
        return;
      }
    } else if (questionnairePart === "ankle_foot") {
      const sections = getVisibleLowerLegSections(lowerLegAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateLowerLegSection(lastSection, lowerLegAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setLowerLegSectionIndex);
          return;
        }
      }
      const issue = validateLowerLegAdaptive(lowerLegAnswers);
      if (issue) {
        focusIssue(issue, sections, setLowerLegSectionIndex);
        return;
      }
    } else if (questionnairePart === "knee") {
      const sections = getVisibleKneeSections(kneeAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateKneeSection(lastSection, kneeAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setKneeSectionIndex);
          return;
        }
      }
      const issue = validateKneeAdaptive(kneeAnswers);
      if (issue) {
        focusIssue(issue, sections, setKneeSectionIndex);
        return;
      }
    } else if (questionnairePart === "back") {
      const sections = getVisibleBackSections(backAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateBackSection(lastSection, backAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setBackSectionIndex);
          return;
        }
      }
      const issue = validateBackAdaptive(backAnswers);
      if (issue) {
        focusIssue(issue, sections, setBackSectionIndex);
        return;
      }
    } else if (questionnairePart === "hip") {
      const sections = getVisibleHipSections(hipAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionIssue = validateHipSection(lastSection, hipAnswers);
        if (sectionIssue) {
          focusIssue(sectionIssue, sections, setHipSectionIndex);
          return;
        }
      }
      const issue = validateHipAdaptive(hipAnswers);
      if (issue) {
        focusIssue(issue, sections, setHipSectionIndex);
        return;
      }
    } else {
      const issue = validateGenericConsulta(genericAnswers);
      if (issue) {
        setFormError(
          formatValidationIssueMessage(
            issue,
            locale,
            locale === "en"
              ? issue.questionId === "zona"
                ? "Where does it hurt or bother you?"
                : issue.questionId === "evolucion"
                  ? "How long have you had this problem?"
                  : issue.questionId === "inicio"
                    ? "How did it start?"
                    : issue.questionId === "mecanismo"
                      ? "What might have caused it?"
                      : issue.message.replace(/^Responde:\s*/, "").replace(/\.$/, "")
              : issue.message.replace(/^Responde:\s*/, "").replace(/\.$/, "")
          )
        );
        return;
      }
    }

    setChatLoading(true);
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
        ? consultLanguage === "en"
          ? `⚠️ HIGH PRIORITY — RED FLAGS DETECTED\n\n${symptomContext}`
          : `⚠️ PRIORIDAD ALTA — BANDERAS ROJAS DETECTADAS\n\n${symptomContext}`
        : symptomContext) + multiZoneScopeNote;

    const physioPatientFlowNote = linkedPhysio
      ? consultLanguage === "en"
        ? redFlagsUrgent
          ? `\n\nPHYSIOTHERAPY FLOW + URGENCY (CRITICAL): Red flags are present. This guidance is for the patient. Do NOT ask for functional tests or hop tests. Prioritize HOSPITAL / ER and imaging. Do NOT say the report was already sent to the physio.`
          : `\n\nPHYSIOTHERAPY FLOW (CRITICAL): This guidance is for the patient. ALWAYS include the **Functional tests** section specific to the injured area. Do NOT say the report was already sent to the physio: they must answer the tests first.`
        : redFlagsUrgent
          ? `\n\nFLUJO FISIOTERAPIA + URGENCIA (CRÍTICO): Hay banderas rojas / PRIORIDAD ALTA. Esta orientación es para el paciente. OMITÉ **Pruebas funcionales** y **Clínicas en AIKinora cerca de ti**. NO pidas hop ni «aplica hielo» como prueba. Hielo/reposo solo en **Qué hacer mientras tanto**. Prioriza HOSPITAL / URGENCIAS e imagen en **Qué debes hacer ahora**. Incluye **Hospitales / Urgencias cerca de ti**. NO digas que el informe ya se envió al fisio.`
          : `\n\nFLUJO FISIOTERAPIA (CRÍTICO): Esta orientación es para el paciente. Incluye SIEMPRE la sección **Pruebas funcionales** (movimientos Sí/No; NO mezclar hielo/reposo ahí). NO digas que el informe ya se envió al fisio: primero debe responder a las pruebas.`
      : "";

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      if (linkedPhysio) {
        const patientFacingAi = await callEdgeText(
          {
            bodyArea: areaLabel,
            onsetType,
            painLevel,
            hadTrauma: hadTraumaVal,
            description: initialMessage,
            symptomContext: contextForAi + physioPatientFlowNote,
            conversationHistory: [],
            language: locale,
            ...(caseImageUrl ? { imageUrl: caseImageUrl } : {}),
          },
          fisioEdgeExtras
        );

        let conversationId = activeId;
        if (!conversationId) {
          if (conversations.length > 0 && !fisioNewConsultDraft) {
            throw new Error(
              locale === "en"
                ? "You can't open new chats in Fisioterapia. Continue an existing one or use the Consulta tab."
                : "En Fisioterapia no se pueden abrir chats nuevos. Continúa una consulta existente o usa la pestaña Consulta."
            );
          }
          const title = `${areaLabel} — ${new Date().toLocaleDateString(
            locale === "en" ? "en-US" : "es-ES"
          )}`;
          const { data: conv, error: convErr } = await supabase
            .from("conversations")
            .insert({
              title,
              user_id: user.id,
              kind: "fisioterapia",
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
          conversationId = conv.id;
          setActiveId(conv.id);
          setActiveTitle(title);
          setConversations((prev) => [conv as Conversation, ...prev].slice(0, 10));
        }

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
            generic: questionnairePart === "generic" ? genericAnswers : null,
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
              language: locale,
            });

        pendingPhysioReportRef.current = {
          patientId: user.id,
          conversationId,
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
          patientSummary: patientFacingAi,
          language: locale,
        };

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ conversation_id: conversationId, role: "assistant", content: combined })
          .select("id, role, content")
          .single();

        if (aiMsg) {
          beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
          setMessages((prev) => [...prev, aiMsg as Message]);
        }
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        dismissQuestionnaireLoading();

        const awaitingTests =
          !redFlagsUrgent &&
          (splitFunctionalTests(combined)?.tests.length ?? 0) >= 2;

        // Only send (and show “report sent”) when there are no outstanding Sí/No tests.
        if (awaitingTests) {
          pendingPhysioReportRef.current = {
            ...pendingPhysioReportRef.current!,
            awaitFunctionalTests: true,
          };
          setPhase("followup");
        } else {
          void (async () => {
            const reportParams = pendingPhysioReportRef.current;
            if (!reportParams) return;
            const sent = await maybeGenerateAndSendPhysioReport(reportParams);
            if (sent) {
              setPhysioReportSentBanner(true);
              pendingPhysioReportRef.current = null;
              const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name, {
                guest: guestMode,
                language: locale,
              });
              const { data: thanksMsg } = await supabase
                .from("messages")
                .insert({
                  conversation_id: conversationId,
                  role: "assistant",
                  content: thanks,
                })
                .select("id, role, content")
                .single();
              if (thanksMsg) {
                beginAssistantReveal(
                  (thanksMsg as Message).id,
                  (thanksMsg as Message).content
                );
                setMessages((prev) => [...prev, thanksMsg as Message]);
              }
              setPhase("complete");
            } else {
              setPhase("followup");
            }
          })();
        }
        return;
      }

      const answer = await callEdgeText(
        {
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
          conversationHistory: [],
          language: consultLanguage,
          ...(caseImageUrl ? { imageUrl: caseImageUrl } : {}),
        },
        fisioEdgeExtras
      );

      if (activeId) {
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ conversation_id: activeId, role: "assistant", content: answer })
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
            generic: questionnairePart === "generic" ? genericAnswers : null,
            redFlagsUrgent,
          },
        });

        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        setPhase("followup");
        dismissQuestionnaireLoading();
        runPostQuestionnaireFollowUp(
          activeId,
          questionnairePart,
          consultLanguage,
          answer,
          areaLabel
        );
        return;
      }

      const title = `${areaLabel} — ${new Date().toLocaleDateString(
        locale === "en" ? "en-US" : "es-ES"
      )}`;
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({
          title,
          user_id: user.id,
          kind: "consulta",
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
        .insert({ conversation_id: conv.id, role: "assistant", content: answer })
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
          generic: questionnairePart === "generic" ? genericAnswers : null,
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
      dismissQuestionnaireLoading();
      runPostQuestionnaireFollowUp(
        conv.id,
        questionnairePart,
        consultLanguage,
        answer,
        areaLabel
      );
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "No se pudo obtener la respuesta. Inténtalo de nuevo."
      );
    } finally {
      setChatLoading(false);
      setLoadingModal(false);
    }
  }

  async function handleFollowupSubmit() {
    const text =
      (pendingVoiceTextRef.current ?? chatInput).trim() ||
      (attachedUri ? consultAttachmentCaption(locale, attachedMime, attachedName) : "");
    pendingVoiceTextRef.current = null;
    if ((!text && !attachedUri) || phase !== "followup" || chatLoading || !activeId) {
      if (conversationModeRef.current) resumeConversationListening();
      return;
    }
    const userMsgId = `u-${Date.now()}`;
    setChatInput("");
    setChatLoading(true);

    try {
      const attachmentPath = await uploadOutgoingPhoto();
      const displayUrl = attachmentPath
        ? await consultPhotoAccessUrl(attachmentPath)
        : null;
      const imageUrl = await consultPhotoVisionUrl(attachmentPath);

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: "user",
          content: text,
          image_url: displayUrl ?? undefined,
        },
      ]);
      scrollToBottomAfterPaint();

      const triage = await triageMessage(text, imageUrl, consultLanguage, fisioEdgeExtras);
      let userSaved = false;

      async function saveUserMessage() {
        if (userSaved) return;
        await supabase.from("messages").insert({
          conversation_id: activeId,
          role: "user",
          content: text,
          image_url: attachmentPath,
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
          const history = [
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
                  ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url, locale)}`
                  : m.content,
              })),
            {
              role: "user" as const,
              content: attachmentPath
                ? `${text}\n${consultAttachmentHistoryNote(attachmentPath, locale)}`
                : text,
            },
          ].slice(-10);

          const answer = await callEdgeText(
            {
              bodyArea: "seguimiento",
              onsetType: text,
              painLevel: 0,
              hadTrauma: "No",
              description: text,
              symptomContext: functionalTestResultsFollowupContext(consultLanguage, {
                pendingNextZoneLabel: nextLabel,
              }),
              conversationHistory: history,
              language: consultLanguage,
              ...(imageUrl ? { imageUrl } : {}),
            },
            fisioEdgeExtras
          );

          const { data: aiMsg } = await supabase
            .from("messages")
            .insert({
              conversation_id: activeId,
              role: "assistant",
              content: answer,
            })
            .select("id, role, content")
            .single();

          beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
          setMessages((prev) => [...prev, aiMsg as Message]);
          return;
        }

        if (
          isClearStartNextPart(text, awaitingNextPart, initialMessage) ||
          (functionalTestsDone && wantsToContinueToNextQuestionnaire(text))
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
          // Resumen only after last-injury functional tests (or if already done).
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

        // Keep awaitingNextPart — answer the patient's actual message.
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

        const history = [
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
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url, locale)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentPath
              ? `${text}\n${consultAttachmentHistoryNote(attachmentPath, locale)}`
              : text,
          },
        ].slice(-10);

        const answer = await callEdgeText(
          {
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No",
            description: text,
            symptomContext: `${choiceHint}${testsHint}`,
            conversationHistory: history,
            language: consultLanguage,
            ...(imageUrl ? { imageUrl } : {}),
          },
          fisioEdgeExtras
        );

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: answer,
          })
          .select("id, role, content")
          .single();

        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);
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
        const sent = await maybeGenerateAndSendPhysioReport(pendingPhysio);
        if (sent) {
          setPhysioReportSentBanner(true);
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

        const sent = await maybeGenerateAndSendPhysioReport({
          ...pendingPhysio,
          symptomContext: pendingPhysio.symptomContext + functionalBlock,
          patientSummary: pendingPhysio.patientSummary + functionalBlock,
        });
        if (sent) setPhysioReportSentBanner(true);

        const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name, {
          guest: guestMode,
          language: locale,
        });
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: thanks,
          })
          .select("id, role, content")
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
          locale
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

        const history = [
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
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url, locale)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentPath
              ? `${text}\n${consultAttachmentHistoryNote(attachmentPath, locale)}`
              : text,
          },
        ].slice(-10);

        const rawAnswer = await callEdgeText(
          {
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No",
            description: text,
            symptomContext: functionalTestResultsFollowupContext(consultLanguage, {
              pendingNextZoneLabel: moreZonesPending ? nextLabel : null,
            }),
            conversationHistory: history,
            language: consultLanguage,
            ...(imageUrl ? { imageUrl } : {}),
          },
          fisioEdgeExtras
        );
        const answer = moreZonesPending
          ? rawAnswer
          : ensureAsksMoreRelatedQuestions(rawAnswer, consultLanguage);

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: answer,
          })
          .select("id, role, content")
          .single();

        beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
        setMessages((prev) => [...prev, aiMsg as Message]);

        if (!moreZonesPending) {
          // End of last injury's functional tests → multi-zone resumen, then follow-up Qs.
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

      if (exerciseOfferActive && !linkedPhysio) {
        await saveUserMessage();
        setShowUnrelatedCta(false);
        setChatLoading(true);
        setLoadingModal(true);
        try {
          if (declinesExerciseOffer(text)) {
            await finishConsultaSession(activeId, consultLanguage);
            return;
          }
          if (affirmsExerciseOffer(text)) {
            await sendPostConsultExercisePlan(activeId, text);
            await finishConsultaSession(activeId, consultLanguage);
            return;
          }
          await sendPostConsultExercisePlan(activeId, text);
          await finishConsultaSession(activeId, consultLanguage);
        } finally {
          setChatLoading(false);
          setLoadingModal(false);
        }
        return;
      }

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
          setChatLoading(true);
          setLoadingModal(true);
          try {
            await sendPostConsultExerciseOffer(activeId);
          } finally {
            setChatLoading(false);
            setLoadingModal(false);
          }
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

        const history = [
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
                ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url, locale)}`
                : m.content,
            })),
          {
            role: "user" as const,
            content: attachmentPath
              ? `${text}\n${consultAttachmentHistoryNote(attachmentPath, locale)}`
              : text,
          },
        ].slice(-10);

        const rawAnswer = await callEdgeText(
            {
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
              conversationHistory: history,
              language: consultLanguage,
              ...(imageUrl ? { imageUrl } : {}),
            },
            fisioEdgeExtras
          );
        const answer = postGuidanceAsked
          ? ensureAsksMoreRelatedQuestions(rawAnswer, consultLanguage)
          : rawAnswer;

        await appendAssistantMessage(activeId, answer);
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

      const history = [
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
              ? `${m.content}\n${consultAttachmentHistoryNote(m.image_url, locale)}`
              : m.content,
          })),
        {
          role: "user" as const,
          content: attachmentPath
            ? `${text}\n${consultAttachmentHistoryNote(attachmentPath, locale)}`
            : text,
        },
      ].slice(-10);

      const answer = await callEdgeText(
        {
          bodyArea: "seguimiento",
          onsetType: text,
          painLevel: 0,
          hadTrauma: "No",
          description: "",
          conversationHistory: history,
          language: consultLanguage,
          ...(imageUrl ? { imageUrl } : {}),
        },
        fisioEdgeExtras
      );

      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: activeId, role: "assistant", content: answer })
        .select("id, role, content")
        .single();

      beginAssistantReveal((aiMsg as Message).id, (aiMsg as Message).content);
      setMessages((prev) => [...prev, aiMsg as Message]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      setFormError("No se pudo procesar tu mensaje. Inténtalo de nuevo.");
    } finally {
      setChatLoading(false);
    }
  }

  sendVoiceTurnRef.current = (text: string) => {
    pendingVoiceTextRef.current = text;
    setChatInput(text);
    if (phase === "intro") void handleIntroSubmit();
    else if (phase === "followup") void handleFollowupSubmit();
    else resumeConversationListening();
  };

  useEffect(() => {
    if (!conversationModeRef.current) return;
    if (phase === "questionnaire") {
      clearSilenceTimer();
      stopMic();
      conversationBusyRef.current = true;
    } else if (phase === "followup" && !chatLoading && !revealingMessageId) {
      conversationBusyRef.current = false;
    }
  }, [phase, chatLoading, revealingMessageId, stopMic, clearSilenceTimer]);

  useEffect(() => {
    if (!conversationMode || !conversationBusyRef.current) return;
    if (chatLoading || revealingMessageId) return;
    if (phase === "questionnaire") return;
    const t = setTimeout(() => {
      if (
        conversationModeRef.current &&
        conversationBusyRef.current &&
        !chatLoading &&
        !revealingMessageId &&
        phaseRef.current !== "questionnaire"
      ) {
        resumeConversationListening();
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [conversationMode, chatLoading, revealingMessageId, phase, resumeConversationListening]);

  const showChatInput =
    historyLoaded &&
    !openingConversation &&
    !physioIntro &&
    phase !== "complete" &&
    (phase === "intro" || phase === "followup") &&
    (!linkedPhysio || Boolean(activeId) || conversations.length === 0 || fisioNewConsultDraft);
  const awaitingFunctionalTests =
    phase === "followup" ? latestUnansweredFunctionalTests(messages) : null;
  const showFisioPickExisting =
    Boolean(linkedPhysio) &&
    !fisioNewConsultDraft &&
    historyLoaded &&
    !openingConversation &&
    conversations.length > 0 &&
    !activeId;
  const showFisioBootstrap =
    Boolean(linkedPhysio) && (!historyLoaded || (openingConversation && messages.length === 0));
  const physioHighlightPhrases = collectPhysioHighlightPhrases(
    linkedPhysio,
    conversations
  );

  function renderTopBar() {
    return (
      <View
        style={[
          styles.chatTopBar,
          !guestMode && { paddingTop: screenHeaderTopInset(insets) },
        ]}
      >
        <Pressable
          style={styles.menuBtn}
          onPress={() => {
            setHistorySearch("");
            setHistoryOpen(true);
          }}
          accessibilityLabel={t.consulta.myConsultas}
        >
          <Ionicons name="menu" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.chatTopBarTitle} numberOfLines={1}>
          {activeTitle}
        </Text>
        <View style={styles.chatTopBarActions}>
          {!guestMode ? <AppBurgerMenu /> : <View style={styles.topBarSpacer} />}
        </View>
      </View>
    );
  }

  function renderHistoryDrawer() {
    const query = historySearch.trim().toLowerCase();
    const filtered = query
      ? conversations.filter((c) => c.title.toLowerCase().includes(query))
      : conversations;
    const groups = linkedPhysio
      ? groupConversationsByPhysio(filtered)
      : groupConversationsByDate(filtered, locale);

    return (
      <Modal
        visible={historyOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setHistoryOpen(false)}
      >
        <View style={styles.historyOverlay}>
          <View
            style={[
              styles.historyPanel,
              {
                paddingTop: screenHeaderTopInset(insets),
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.historyHeaderTitle}>
                {linkedPhysio
                  ? (locale === "en" ? "My physiotherapists" : "Mis fisioterapeutas")
                  : t.consulta.myConsultas}
              </Text>
              <Pressable
                style={styles.historyCloseBtn}
                onPress={() => setHistoryOpen(false)}
                accessibilityLabel="Cerrar"
              >
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

            {!linkedPhysio && (
              <Pressable
                style={({ pressed }) => [styles.historyNewBtn, pressed && styles.historyNewBtnPressed]}
                onPress={startNewConsultation}
              >
                <Ionicons name="add" size={16} color={Colors.white} />
                <Text style={styles.historyNewBtnText}>{t.consulta.newConsulta}</Text>
              </Pressable>
            )}
            {linkedPhysio && !guestMode && (
              <Text style={styles.historyHintText}>
                {locale === "en"
                  ? "This chat is for what your physiotherapist asked. For other questions, use the Consulta tab."
                  : "Este chat es para lo que te ha pedido tu fisioterapeuta. Para otras preguntas, usa la pestaña Consulta."}
              </Text>
            )}

            {linkedPhysio && !guestMode && (
              <Pressable
                style={({ pressed }) => [
                  styles.historyCodeBtn,
                  pressed && styles.historyCodeBtnPressed,
                ]}
                onPress={() => {
                  setPhysioCodeInput("");
                  setPhysioCodeError(null);
                  setShowPhysioCodeEntry(true);
                }}
              >
                <Ionicons name="key-outline" size={16} color={Colors.primary} />
                <Text style={styles.historyCodeBtnText}>
                  {locale === "en" ? "Enter another code" : "Introducir otro código"}
                </Text>
              </Pressable>
            )}

            {conversations.length > 0 && (
              <View style={styles.historySearchWrap}>
                <Ionicons name="search" size={15} color={Colors.textLight} />
                <TextInput
                  style={styles.historySearchInput}
                  value={historySearch}
                  onChangeText={setHistorySearch}
                  placeholder={locale === "en" ? "Search consultations" : "Buscar consultas"}
                  placeholderTextColor={Colors.textLight}
                  returnKeyType="search"
                />
                {historySearch.length > 0 && (
                  <Pressable onPress={() => setHistorySearch("")} hitSlop={8}>
                    <Ionicons name="close-circle" size={16} color={Colors.textLight} />
                  </Pressable>
                )}
              </View>
            )}

            <ScrollView style={styles.historyList} keyboardShouldPersistTaps="handled">
              {conversations.length === 0 && (
                <Text style={styles.historyEmpty}>{t.consulta.emptyHistory}</Text>
              )}
              {conversations.length > 0 && filtered.length === 0 && (
                <Text style={styles.historyEmpty}>
                  {locale === "en" ? "No matching consultations." : "No hay consultas que coincidan."}
                </Text>
              )}
              {groups.map((group) => (
                <View key={group.label} style={styles.historyGroup}>
                  {group.physioName ? (
                    <View style={styles.historyPhysioCard}>
                      <Text style={styles.historyPhysioName}>{group.physioName}</Text>
                      {group.clinicName ? (
                        <Text style={styles.historyPhysioClinic}>{group.clinicName}</Text>
                      ) : null}
                    </View>
                  ) : (
                    <Text style={styles.historyGroupLabel}>{group.label}</Text>
                  )}
                  {group.items.map((c) => {
                    const isActive = activeId === c.id;
                    return (
                      <View
                        key={c.id}
                        style={[styles.historyItem, isActive && styles.historyItemActive]}
                      >
                        <Pressable
                          style={styles.historyItemMain}
                          onPress={() => loadConversation(c.id, c.title)}
                        >
                          <Text
                            style={[
                              styles.historyItemTitle,
                              isActive && styles.historyItemTitleActive,
                            ]}
                            numberOfLines={2}
                          >
                            {c.title}
                          </Text>
                          <Text
                            style={[
                              styles.historyItemDate,
                              isActive && styles.historyItemDateActive,
                            ]}
                          >
                            {formatDate(c.created_at, locale)}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={styles.historyDeleteBtn}
                          onPress={() => deleteConversation(c.id)}
                          disabled={deletingId === c.id}
                          accessibilityLabel={`Eliminar consulta: ${c.title}`}
                        >
                          {deletingId === c.id ? (
                            <ActivityIndicator size="small" color={isActive ? Colors.white : Colors.textLight} />
                          ) : (
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color={isActive ? "#BFDBFE" : Colors.textLight}
                            />
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}
            </ScrollView>

            <View style={styles.historyFooter}>
              <Ionicons name="lock-closed" size={11} color={Colors.textLight} />
              <Text style={styles.historyFooterText}>
                {locale === "en"
                  ? "Your consultations are encrypted and private"
                  : "Tus consultas están cifradas y son privadas"}
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.historyBackdrop}
            onPress={() => setHistoryOpen(false)}
            accessibilityLabel="Cerrar menú"
          />
        </View>
      </Modal>
    );
  }

  if (phase === "questionnaire") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, paddingBottom: composerInset }}>
        {renderTopBar()}

        <QuestionnaireKeyboardProvider onFieldFocus={ensureQuestionnaireFieldVisible}>
        <ScrollView
          ref={questionnaireScrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.messageList,
            keyboardHeight > 0 ? { paddingBottom: Math.max(24, keyboardHeight * 0.35) } : null,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onScroll={(e) => {
            questionnaireScrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {messages.map((msg) => (
            <FadeInView
              key={msg.id}
              style={[
                styles.bubbleRow,
                msg.role === "user" ? styles.bubbleRowUser : styles.bubbleRowAI,
              ]}
            >
              {msg.role === "assistant" && <PhysioAvatar size={32} />}
              <View
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
                ]}
              >
                {msg.role === "user" ? (
                  <View>
                    {msg.image_url ? (
                      isConsultPdfUrl(msg.image_url) ? (
                        <View style={styles.fileChipUser}>
                          <Ionicons name="document-text-outline" size={18} color={Colors.white} />
                          <Text style={styles.fileChipTextUser}>PDF</Text>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: msg.image_url }}
                          style={styles.bubbleImage}
                          resizeMode="cover"
                        />
                      )
                    ) : null}
                    {msg.content ? (
                      <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{msg.content}</Text>
                    ) : null}
                  </View>
                ) : (
                  <AssistantMessageWithSources
                    content={msg.content}
                    renderBody={(body) => (
                      <BoldText
                        text={body}
                        style={styles.bubbleText}
                        boldStyle={styles.bubbleBold}
                        highlightPhrases={physioHighlightPhrases}
                        highlightStyle={styles.bubblePhysioHighlight}
                      />
                    )}
                  />
                )}
              </View>
            </FadeInView>
          ))}

          <View
            style={styles.questionnaireCard}
            onLayout={(e) => {
              questionnaireTopY.current = e.nativeEvent.layout.y;
            }}
          >
            <TrustPanel locale={locale} />
            {questionnairePart === "shoulder" ? (
              <>
                <ConsultaAdaptiveShoulder
                  value={shoulderAnswers}
                  onChange={setShoulderAnswers}
                  sectionIndex={shoulderSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setShoulderSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                  focus={resolveShoulderQuestionnaireFocus(initialMessage)}
                />
                {isLastShoulderSection(
                  shoulderAnswers,
                  shoulderSectionIndex,
                  resolveShoulderQuestionnaireFocus(initialMessage)
                ) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "elbow" ? (
              <>
                <ConsultaAdaptiveElbow
                  value={elbowAnswers}
                  onChange={setElbowAnswers}
                  sectionIndex={elbowSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setElbowSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastElbowSection(elbowAnswers, elbowSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "wrist_hand" ? (
              <>
                <ConsultaAdaptiveWrist
                  value={wristAnswers}
                  onChange={setWristAnswers}
                  sectionIndex={wristSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setWristSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastWristSection(wristAnswers, wristSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "finger" ? (
              <>
                <ConsultaAdaptiveFinger
                  value={fingerAnswers}
                  onChange={setFingerAnswers}
                  sectionIndex={fingerSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setFingerSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastFingerSection(fingerAnswers, fingerSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "head" ? (
              <>
                <ConsultaAdaptiveHead
                  value={headAnswers}
                  onChange={setHeadAnswers}
                  sectionIndex={headSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setHeadSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastHeadSection(headAnswers, headSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "neck" ? (
              <>
                <ConsultaAdaptiveNeck
                  value={neckAnswers}
                  onChange={setNeckAnswers}
                  sectionIndex={neckSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setNeckSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastNeckSection(neckAnswers, neckSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "ankle_foot" ? (
              <>
                <ConsultaAdaptiveLowerLeg
                  value={lowerLegAnswers}
                  onChange={setLowerLegAnswers}
                  sectionIndex={lowerLegSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setLowerLegSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastLowerLegSection(lowerLegAnswers, lowerLegSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "knee" ? (
              <>
                <ConsultaAdaptiveKnee
                  value={kneeAnswers}
                  onChange={setKneeAnswers}
                  sectionIndex={kneeSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setKneeSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                  onSubmitUrgency={(next) => {
                    kneeAnswersRef.current = next;
                    setKneeAnswers(next);
                    void handleQuestionnaireSubmit();
                  }}
                />
                {isLastKneeSection(kneeAnswers, kneeSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "back" ? (
              <>
                <ConsultaAdaptiveBack
                  value={backAnswers}
                  onChange={setBackAnswers}
                  sectionIndex={backSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setBackSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                />
                {isLastBackSection(backAnswers, backSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : questionnairePart === "hip" ? (
              <>
                <ConsultaAdaptiveHip
                  value={hipAnswers}
                  onChange={setHipAnswers}
                  sectionIndex={hipSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setHipSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={locale}
                  onSubmitUrgency={(next) => {
                    hipAnswersRef.current = next;
                    setHipAnswers(next);
                    void handleQuestionnaireSubmit();
                  }}
                />
                {isLastHipSection(hipAnswers, hipSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <ConsultaGenericFields
                  value={genericAnswers}
                  onChange={setGenericAnswers}
                  locale={locale}
                />
                {formError ? <Text style={styles.error}>{formError}</Text> : null}
                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                  onPress={handleQuestionnaireSubmit}
                >
                  <Text style={styles.submitBtnText}>
                    {locale === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
        </QuestionnaireKeyboardProvider>

        <Modal visible={loadingModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <View style={styles.modalAvatarWrap}>
              <PhysioAvatar size={56} style={{ marginRight: 0 }} />
            </View>
              <Text style={styles.modalTitle}>{t.consulta.analyzing}</Text>
              <Text style={styles.modalSub}>{t.consulta.analyzingSub}</Text>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showPhysioCodeEntry}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPhysioCodeEntry(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { alignItems: "stretch", width: "100%", maxWidth: 360 }]}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <Text style={[styles.modalTitle, { textAlign: "left", flex: 1 }]}>
                  {locale === "en" ? "Physiotherapist code" : "Código de tu fisioterapeuta"}
                </Text>
                <Pressable onPress={() => setShowPhysioCodeEntry(false)} hitSlop={8}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </Pressable>
              </View>
              <Text style={[styles.modalSub, { textAlign: "left", marginTop: 8 }]}>
                {locale === "en"
                  ? "Enter a code to start a new assigned consultation with your physiotherapist."
                  : "Introduce un código para empezar una nueva consulta asignada con tu fisioterapeuta."}
              </Text>
              <TextInput
                value={physioCodeInput}
                onChangeText={(v) => setPhysioCodeInput(v.toUpperCase())}
                placeholder="Ej. K7M2P9QX"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="characters"
                autoCorrect={false}
                style={{
                  marginTop: 14,
                  borderWidth: 1,
                  borderColor: Colors.borderStrong,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 16,
                  letterSpacing: 2,
                  color: Colors.text,
                  backgroundColor: Colors.white,
                }}
              />
              {physioCodeError ? (
                <Text style={{ color: "#991B1B", marginTop: 10, fontSize: 13 }}>{physioCodeError}</Text>
              ) : null}
              <Pressable
                onPress={() => void submitAnotherPhysioCode()}
                disabled={physioCodeBusy}
                style={{
                  marginTop: 16,
                  backgroundColor: Colors.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: physioCodeBusy ? 0.6 : 1,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: "700" }}>
                  {physioCodeBusy
                    ? locale === "en"
                      ? "Linking…"
                      : "Vinculando…"
                    : locale === "en"
                      ? "Continue to consultation"
                      : "Continuar a la consulta"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {renderHistoryDrawer()}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingBottom: composerInset }}>
      {renderTopBar()}

      {linkedPhysio && phase === "complete" ? null : linkedPhysio && physioReportSentBanner ? (
        <View
          style={{
            backgroundColor: "#ECFDF5",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#A7F3D0",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#065F46" }}>
            {locale === "en"
              ? "Report sent to your physiotherapist"
              : "Informe enviado a tu fisioterapeuta"}
          </Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#047857" }}>
            {locale === "en"
              ? "The clinical summary was sent successfully. They can review it before the appointment."
              : "El resumen clínico se ha enviado correctamente. Ya puede revisarlo antes de la cita."}
          </Text>
          <Pressable onPress={() => setPhysioReportSentBanner(false)} style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#065F46" }}>
              {locale === "en" ? "Close" : "Cerrar"}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {showFisioBootstrap ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={{ marginTop: 10, fontSize: 13, color: Colors.textSecondary }}>
            {locale === "en" ? "Loading…" : "Cargando…"}
          </Text>
        </View>
      ) : physioIntro &&
        phase === "intro" &&
        !activeId &&
        (!linkedPhysio || conversations.length === 0 || fisioNewConsultDraft) ? (
        <PhysioIntro onSkip={skipPhysioIntro} greeting={introGreeting} />
      ) : showFisioPickExisting ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.text, textAlign: "center" }}>
            {locale === "en"
              ? "Choose a consultation from your physiotherapist"
              : "Elige una consulta de tu fisioterapeuta"}
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              lineHeight: 18,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            {locale === "en"
              ? "You can open a new Fisioterapia consultation 24 hours after the last report sent to your physiotherapist. Until then, open one from the list or tap Enter another code once that time has passed. For other questions, use the Consulta tab."
              : "En Fisioterapia solo puedes abrir una consulta nueva 24 horas después del último informe enviado a tu fisioterapeuta. Mientras tanto, abre una de la lista o pulsa Introducir otro código cuando haya pasado ese tiempo. Para otras preguntas usa la pestaña Consulta."}
          </Text>
        </View>
      ) : (
      <View style={styles.chatScrollArea}>
        <ScrollView
          ref={chatScrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
          onLayout={(e) => {
            scrollMetrics.current.viewport = e.nativeEvent.layout.height;
            updateScrollDownVisibility();
          }}
          onContentSizeChange={(_, height) => {
            scrollMetrics.current.content = height;
            updateScrollDownVisibility();
          }}
          onScroll={(e) => {
            scrollMetrics.current.offset = e.nativeEvent.contentOffset.y;
            updateScrollDownVisibility();
          }}
          scrollEventThrottle={16}
        >
          {messages.map((msg) => (
            <FadeInView
              key={msg.id}
              onLayout={(e) => {
                messageOffsets.current[msg.id] = e.nativeEvent.layout.y;
              }}
              style={[
                styles.bubbleRow,
                msg.role === "user" ? styles.bubbleRowUser : styles.bubbleRowAI,
              ]}
            >
              {msg.role === "assistant" && <PhysioAvatar size={32} />}
              <View
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
                ]}
              >
                {msg.role === "user" ? (
                  <View>
                    {msg.image_url ? (
                      isConsultPdfUrl(msg.image_url) ? (
                        <View style={styles.fileChipUser}>
                          <Ionicons name="document-text-outline" size={18} color={Colors.white} />
                          <Text style={styles.fileChipTextUser}>PDF</Text>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: msg.image_url }}
                          style={styles.bubbleImage}
                          resizeMode="cover"
                        />
                      )
                    ) : null}
                    {msg.content ? (
                      <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{msg.content}</Text>
                    ) : null}
                  </View>
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
                        if (
                          msg.id === WELCOME_ID ||
                          autoSpokenIdsRef.current.has(msg.id)
                        ) {
                          return;
                        }
                        if (!conversationModeRef.current) return;
                        autoSpokenIdsRef.current.add(msg.id);
                        stopMicRef.current();
                        conversationBusyRef.current = true;
                        if (ttsSupported) {
                          speak(msg.content, msg.id, {
                            onEnd: () => {
                              if (phaseRef.current === "questionnaire") return;
                              resumeConversationListening();
                            },
                          });
                        } else if (phaseRef.current !== "questionnaire") {
                          resumeConversationListening();
                        }
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
                                <ConsultaAssistantBody
                                  text={body}
                                  style={styles.bubbleText}
                                  boldStyle={styles.bubbleBold}
                                  highlightPhrases={physioHighlightPhrases}
                                  highlightStyle={styles.bubblePhysioHighlight}
                                  onClinicPress={openClinicProfile}
                                />
                              );
                            }
                            return (
                              <View>
                                {parsed.before ? (
                                  <ConsultaAssistantBody
                                    text={parsed.before}
                                    style={styles.bubbleText}
                                    boldStyle={styles.bubbleBold}
                                    highlightPhrases={physioHighlightPhrases}
                                    highlightStyle={styles.bubblePhysioHighlight}
                                    onClinicPress={openClinicProfile}
                                  />
                                ) : null}
                                <ConsultaAssistantBody
                                  text={`**${parsed.heading}**`}
                                  style={styles.bubbleText}
                                  boldStyle={styles.bubbleBold}
                                  highlightPhrases={physioHighlightPhrases}
                                  highlightStyle={styles.bubblePhysioHighlight}
                                />
                                <FunctionalTestYesNo
                                  tests={parsed.tests}
                                  language={locale}
                                  disabled={chatLoading}
                                  onSubmit={(text) =>
                                    sendVoiceTurnRef.current(text)
                                  }
                                />
                                {parsed.after ? (
                                  <ConsultaAssistantBody
                                    text={parsed.after}
                                    style={styles.bubbleText}
                                    boldStyle={styles.bubbleBold}
                                    highlightPhrases={physioHighlightPhrases}
                                    highlightStyle={styles.bubblePhysioHighlight}
                                    onClinicPress={openClinicProfile}
                                  />
                                ) : null}
                              </View>
                            );
                          }}
                        />
                        {msg.id !== WELCOME_ID &&
                          !msg.id.startsWith("q-intro") &&
                          phase === "followup" &&
                          !isRevealing && (
                            <Text style={styles.bubbleDisclaimer}>
                              {t.consulta.disclaimer}
                            </Text>
                          )}
                        {msg.id !== WELCOME_ID && ttsSupported ? (
                          <Pressable
                            onPress={() => toggleSpeak(msg.content, msg.id)}
                            hitSlop={8}
                            style={styles.speakBtn}
                            accessibilityLabel={
                              speakingId === msg.id
                                ? "Detener audio"
                                : "Escuchar respuesta"
                            }
                          >
                            <Ionicons
                              name={speakingId === msg.id ? "stop" : "volume-high-outline"}
                              size={16}
                              color={
                                speakingId === msg.id ? Colors.primary : Colors.textSecondary
                              }
                            />
                          </Pressable>
                        ) : null}
                      </>
                    )}
                  </StreamingAssistantMessage>
                )}
              </View>
            </FadeInView>
          ))}
          {linkedPhysio && phase === "complete" ? (
            <View
              style={{
                marginTop: 16,
                marginHorizontal: 8,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#A7F3D0",
                backgroundColor: "#ECFDF5",
                paddingHorizontal: 20,
                paddingVertical: 24,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: "#059669",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="checkmark" size={28} color="#fff" />
              </View>
              <Text
                style={{
                  marginTop: 14,
                  fontSize: 20,
                  fontWeight: "800",
                  color: Colors.text,
                  textAlign: "center",
                }}
              >
                {locale === "en" ? "Thank you for your time!" : "¡Gracias por tu tiempo!"}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 22,
                  color: Colors.textSecondary,
                  textAlign: "center",
                }}
              >
                <Text style={styles.bubblePhysioHighlight}>
                  {physioDisplayName(linkedPhysio.physio_name)}
                </Text>
                {linkedPhysio.clinic_name?.trim() ? (
                  <>
                    {" "}
                    <Text style={styles.bubblePhysioHighlight}>
                      {linkedPhysio.clinic_name.trim()}
                    </Text>
                  </>
                ) : null}
                {locale === "en"
                  ? " has received all the information about your injury and will be ready to treat you."
                  : " ya ha recibido toda la información sobre tu molestia y podrá prepararse mejor para tu tratamiento."}
              </Text>
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 18,
                  color: Colors.textSecondary,
                  textAlign: "center",
                }}
              >
                {guestMode
                  ? locale === "en"
                    ? "If you want to keep talking with the AI, create an account."
                    : "Si quieres seguir hablando con la IA, crea una cuenta."
                  : locale === "en"
                    ? "If you want to keep using the AI, open the Consulta tab."
                    : "Si quieres seguir usando la IA, abre la pestaña Consulta."}
              </Text>
              {guestMode ? (
                <Pressable
                  onPress={onCreateAccount}
                  style={{
                    marginTop: 18,
                    backgroundColor: Colors.text,
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 22,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Colors.white, fontWeight: "700", fontSize: 15 }}>
                    {locale === "en" ? "Create an account" : "Crear cuenta"}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : !linkedPhysio && phase === "complete" ? (
            <View
              style={{
                marginTop: 16,
                marginHorizontal: 8,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#BFDBFE",
                backgroundColor: "#EFF6FF",
                paddingHorizontal: 20,
                paddingVertical: 24,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="checkmark" size={28} color="#fff" />
              </View>
              <Text
                style={{
                  marginTop: 14,
                  fontSize: 20,
                  fontWeight: "800",
                  color: Colors.text,
                  textAlign: "center",
                }}
              >
                {locale === "en" ? "Consultation finished" : "Consulta terminada"}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 20,
                  color: Colors.textSecondary,
                  textAlign: "center",
                }}
              >
                {locale === "en"
                  ? "Above you have Physio’s guidance and what it recommends you do next. If another issue comes up or you want to ask something else, open a new consultation."
                  : "Arriba tienes la orientación de Physio y lo que te recomienda hacer ahora. Si aparece otra molestia o quieres preguntar algo distinto, abre una nueva consulta."}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  {
                    marginTop: 18,
                    width: "100%",
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    shadowColor: "#2563EB",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 4,
                  },
                  pressed && { opacity: 0.92, transform: [{ translateY: 1 }] },
                ]}
                onPress={startNewConsultation}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.22)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                  {locale === "en" ? "New consultation" : "Nueva consulta"}
                </Text>
              </Pressable>
            </View>
          ) : !linkedPhysio && showUnrelatedCta ? (
            <View style={{ marginTop: 8, marginHorizontal: 8, alignItems: "center" }}>
              <Pressable
                style={({ pressed }) => [
                  {
                    width: "100%",
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    shadowColor: "#2563EB",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 4,
                  },
                  pressed && { opacity: 0.92, transform: [{ translateY: 1 }] },
                ]}
                onPress={startNewConsultation}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.22)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                  {locale === "en" ? "New consultation" : "Nueva consulta"}
                </Text>
              </Pressable>
            </View>
          ) : null}
          {chatLoading && !loadingModal && !openingConversation ? (
            <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
              <PhysioAvatar size={32} />
              <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                <TypingIndicator />
              </View>
            </View>
          ) : null}
        </ScrollView>
        <ScrollToBottomButton visible={showScrollDown} onPress={scrollToBottom} />
      </View>
      )}

      {showChatInput && (
        <View style={styles.inputBarWrap}>
          {attachedUri ? (
            <View style={styles.attachPreviewRow}>
              {isConsultImageMime(attachedMime) ? (
                <Image source={{ uri: attachedUri }} style={styles.attachPreview} />
              ) : (
                <View style={styles.fileChipPreview}>
                  <Ionicons name="document-text-outline" size={22} color={Colors.text} />
                  <Text style={styles.fileChipPreviewText} numberOfLines={1}>
                    {attachedName ?? "PDF"}
                  </Text>
                </View>
              )}
              <Pressable onPress={clearAttachment} hitSlop={8}>
                <Text style={styles.removePhotoText}>{t.consulta.removePhoto}</Text>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.inputBar}>
            {!conversationMode ? (
              <Pressable
                style={({ pressed }) => [
                  styles.micIconBtn,
                  chatLoading && styles.sendBtnDisabled,
                  pressed && styles.attachBtnPressed,
                ]}
                onPress={pickConsultAttachment}
                disabled={chatLoading}
                accessibilityLabel={t.consulta.attachFile}
              >
                <Ionicons name="add" size={24} color={Colors.textSecondary} />
              </Pressable>
            ) : null}
            <TextInput
              style={styles.chatInput}
              placeholder={
                conversationMode
                  ? listening
                    ? t.consulta.placeholderListening
                    : phase === "questionnaire"
                      ? t.consulta.placeholderQuestionnaire
                      : t.consulta.placeholderConversation
                  : linkedPhysio
                    ? t.consulta.placeholderFisio
                    : phase === "intro"
                      ? t.consulta.placeholderIntro
                      : t.consulta.placeholderFollowup
              }
              placeholderTextColor={Colors.textLight}
              value={chatInput}
              onChangeText={setChatInput}
              multiline
              maxLength={2000}
              editable={!chatLoading && !conversationMode}
            />
            {sttSupported ? (
              <Pressable
                style={({ pressed }) => [
                  styles.micIconBtn,
                  conversationMode && styles.micIconBtnActive,
                  chatLoading && !conversationMode && styles.sendBtnDisabled,
                  pressed && styles.attachBtnPressed,
                ]}
                onPress={toggleConversationMode}
                disabled={chatLoading && !conversationMode}
                accessibilityLabel={
                  conversationMode ? "Salir de conversación" : "Conversación por voz"
                }
              >
                <Ionicons
                  name={conversationMode ? "stop" : "mic-outline"}
                  size={22}
                  color={conversationMode ? Colors.white : Colors.textSecondary}
                />
              </Pressable>
            ) : null}
            {!conversationMode ? (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.micIconBtn,
                    chatLoading && styles.sendBtnDisabled,
                    pressed && styles.attachBtnPressed,
                  ]}
                  onPress={() => void takeConsultPhoto()}
                  disabled={chatLoading}
                  accessibilityLabel={t.consulta.takePhoto}
                >
                  <Ionicons name="camera-outline" size={22} color={Colors.textSecondary} />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.sendBtn,
                    (chatLoading || (!chatInput.trim() && !attachedUri)) &&
                      styles.sendBtnDisabled,
                    pressed && styles.sendBtnPressed,
                  ]}
                  onPress={() => {
                    if (!chatInput.trim() && !attachedUri) return;
                    stopMic();
                    cancelSpeech();
                    if (phase === "intro") handleIntroSubmit();
                    else handleFollowupSubmit();
                  }}
                  disabled={chatLoading || (!chatInput.trim() && !attachedUri)}
                  accessibilityLabel="Enviar"
                >
                  <Ionicons name="arrow-up" size={20} color={Colors.white} />
                </Pressable>
              </>
            ) : null}
          </View>
          {(conversationMode || sttError) && (
            <Text style={styles.voiceHint}>
              {sttError ??
                (phase === "questionnaire"
                  ? locale === "en"
                    ? "Conversation paused: complete the questionnaire. Then the AI will speak and you can continue."
                    : "Conversación en pausa: completa el cuestionario. Luego la IA hablará y podréis seguir."
                  : listening
                    ? locale === "en"
                      ? "Speak naturally. After 3 seconds of silence, it's the AI's turn."
                      : "Habla con naturalidad. Tras 3 segundos de silencio, es el turno de la IA."
                    : locale === "en"
                      ? "AI is responding…"
                      : "La IA está respondiendo…")}
            </Text>
          )}
        </View>
      )}

      <Modal visible={loadingModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalAvatarWrap}>
              <PhysioAvatar size={56} style={{ marginRight: 0 }} />
            </View>
            <Text style={styles.modalTitle}>{t.consulta.analyzing}</Text>
            <Text style={styles.modalSub}>{t.consulta.analyzingSub}</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPhysioCodeEntry}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhysioCodeEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { alignItems: "stretch", width: "100%", maxWidth: 360 }]}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <Text style={[styles.modalTitle, { textAlign: "left", flex: 1 }]}>
                {locale === "en" ? "Physiotherapist code" : "Código de tu fisioterapeuta"}
              </Text>
              <Pressable onPress={() => setShowPhysioCodeEntry(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>
            <Text style={[styles.modalSub, { textAlign: "left", marginTop: 8 }]}>
              {locale === "en"
                ? "Enter a code to start a new assigned consultation with your physiotherapist."
                : "Introduce un código para empezar una nueva consulta asignada con tu fisioterapeuta."}
            </Text>
            <TextInput
              value={physioCodeInput}
              onChangeText={(v) => setPhysioCodeInput(v.toUpperCase())}
              placeholder="Ej. K7M2P9QX"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="characters"
              autoCorrect={false}
              style={{
                marginTop: 14,
                borderWidth: 1,
                borderColor: Colors.borderStrong,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 16,
                letterSpacing: 2,
                color: Colors.text,
                backgroundColor: Colors.white,
              }}
            />
            {physioCodeError ? (
              <Text style={{ color: "#991B1B", marginTop: 10, fontSize: 13 }}>{physioCodeError}</Text>
            ) : null}
            <Pressable
              onPress={() => void submitAnotherPhysioCode()}
              disabled={physioCodeBusy}
              style={{
                marginTop: 16,
                backgroundColor: Colors.primary,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
                opacity: physioCodeBusy ? 0.6 : 1,
              }}
            >
              <Text style={{ color: Colors.white, fontWeight: "700" }}>
                {physioCodeBusy
                  ? locale === "en"
                    ? "Linking…"
                    : "Vinculando…"
                  : locale === "en"
                    ? "Continue to consultation"
                    : "Continuar a la consulta"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {renderHistoryDrawer()}
    </View>
  );
}

const styles = StyleSheet.create({
  chatTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  chatTopBarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  chatTopBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 40,
    justifyContent: 'flex-end',
  },
  /** Keeps the title centered when guest mode has no burger on the right. */
  topBarSpacer: {
    width: 40,
    height: 40,
  },
  historyOverlay: { flex: 1, flexDirection: 'row' },
  historyBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.35)' },
  historyPanel: {
    width: '82%',
    maxWidth: 320,
    alignSelf: 'stretch',
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  historyHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  historyCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historySearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
  },
  historySearchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    padding: 0,
  },
  historyList: { flex: 1, paddingHorizontal: 12 },
  historyGroup: { marginBottom: 8 },
  historyPhysioCard: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  historyPhysioName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  historyPhysioClinic: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  historyGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  historyEmpty: {
    paddingHorizontal: 4,
    paddingVertical: 16,
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 18,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    marginBottom: 6,
    overflow: 'hidden',
    backgroundColor: Colors.primarySoft,
  },
  historyItemActive: { backgroundColor: Colors.primary },
  historyItemMain: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  historyItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  historyItemTitleActive: { color: Colors.white },
  historyItemDate: { marginTop: 3, fontSize: 11, fontWeight: '500', color: Colors.textLight },
  historyItemDateActive: { color: '#BFDBFE' },
  historyDeleteBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  historyNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  historyNewBtnPressed: { backgroundColor: Colors.primaryDark },
  historyHintText: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    color: Colors.primaryDark,
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  historyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: Colors.white,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  historyCodeBtnPressed: { backgroundColor: '#EFF6FF' },
  historyCodeBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  historyNewBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  historyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  historyFooterText: {
    fontSize: 10.5,
    color: Colors.textLight,
    fontWeight: '500',
  },
  chatScrollArea: { flex: 1, position: 'relative' },
  chatScroll: { flex: 1 },
  messageList: { padding: 16, paddingBottom: 12 },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  /** Compact typing pill — hugs the three dots. */
  loadingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    letterSpacing: -0.1,
  },
  bubbleTextUser: { color: Colors.white },
  bubbleImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileChipUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  fileChipTextUser: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.white,
  },
  fileChipPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "70%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
  },
  fileChipPreviewText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  bubbleBold: { color: Colors.primary, fontWeight: '700' },
  bubblePhysioHighlight: {
    fontWeight: '700',
  },
  bubbleDisclaimer: { marginTop: 8, fontSize: 11, color: Colors.textLight, lineHeight: 15 },
  questionnaireCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  submitBtn: {
    marginTop: 16,
    minHeight: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitBtnPressed: { backgroundColor: Colors.primaryDark },
  submitBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  error: { color: Colors.danger, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  inputBarWrap: {
    backgroundColor: "rgba(248,250,252,0.82)",
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  attachPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  attachPreview: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  attachBtnPressed: { backgroundColor: Colors.primarySoft },
  micBtnListening: {
    borderColor: "#FECACA",
    backgroundColor: Colors.dangerSoft,
  },
  micIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  micIconBtnActive: {
    backgroundColor: Colors.primary,
  },
  conversationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  conversationBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  conversationBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
  conversationBtnTextActive: {
    color: Colors.white,
  },
  speakBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    padding: 4,
  },
  voiceHint: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  autoPlayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  autoPlayText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatInput: {
    flex: 1,
    maxHeight: 120,
    minHeight: 40,
    borderWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: "transparent",
    letterSpacing: -0.1,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnPressed: { backgroundColor: "#1E293B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  modalTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalSub: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
