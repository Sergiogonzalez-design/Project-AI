import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { ConsultaGenericFields } from "../components/ConsultaGenericFields";
import { DismissKeyboard } from "../components/DismissKeyboard";
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
  resolveShoulderQuestionnaireFocus,
  validateShoulderAdaptive,
  validateShoulderSection,
  type ShoulderAdaptiveAnswers,
} from "../lib/consulta-shoulder-adaptive";
import {
  defaultElbowAdaptiveAnswers,
  detectElbowRedFlags,
  formatElbowAdaptive,
  getVisibleElbowSections,
  validateElbowAdaptive,
  validateElbowSection,
  type ElbowAdaptiveAnswers,
} from "../lib/consulta-elbow-adaptive";
import {
  defaultFingerAdaptiveAnswers,
  detectFingerRedFlags,
  formatFingerAdaptive,
  getVisibleFingerSections,
  validateFingerAdaptive,
  validateFingerSection,
  type FingerAdaptiveAnswers,
} from "../lib/consulta-finger-adaptive";
import {
  defaultWristAdaptiveAnswers,
  detectWristRedFlags,
  formatWristAdaptive,
  getVisibleWristSections,
  validateWristAdaptive,
  validateWristSection,
  type WristAdaptiveAnswers,
} from "../lib/consulta-wrist-adaptive";
import {
  defaultNeckAdaptiveAnswers,
  detectNeckRedFlags,
  formatNeckAdaptive,
  getVisibleNeckSections,
  validateNeckAdaptive,
  validateNeckSection,
  type NeckAdaptiveAnswers,
} from "../lib/consulta-neck-adaptive";
import {
  defaultHeadAdaptiveAnswers,
  detectHeadRedFlags,
  formatHeadAdaptive,
  getVisibleHeadSections,
  validateHeadAdaptive,
  validateHeadSection,
  type HeadAdaptiveAnswers,
} from "../lib/consulta-head-adaptive";
import {
  defaultLowerLegAdaptiveAnswers,
  detectLowerLegRedFlags,
  formatLowerLegAdaptive,
  getVisibleLowerLegSections,
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
  validateKneeAdaptive,
  validateKneeSection,
  type KneeAdaptiveAnswers,
} from "../lib/consulta-knee-adaptive";
import {
  defaultBackAdaptiveAnswers,
  detectBackRedFlags,
  formatBackAdaptive,
  getVisibleBackSections,
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
} from "../lib/detect-body-part";
import {
  betweenPartsChoiceContext,
  isClearStartNextPart,
  isDeclineNextPart,
  isMetaOrClarificationQuery,
  nextPartReadyMessage,
  pendingPartsFromText,
  reportsFunctionalTestResults,
  respondToUserMessage,
  shouldStartQuestionnaire,
  triageMessage,
  wantsFunctionalTestsNow,
  wantsToContinueToNextQuestionnaire,
  type AdaptiveQuestionnairePart,
} from "../lib/consulta-triage";
import { callEdgeText, callEdgeJson } from "../lib/consulta-api";
import {
  detectConsultLanguage,
  type ConsultLanguage,
} from "../lib/consult-language";
import {
  photoOnlyCaption,
  uploadConsultPhotoFromUri,
} from "../lib/consult-photo";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { getNotificationsEnabled } from "../lib/notifications";
import {
  buildPhysioLinkedCompletionMessage,
  buildPhysioLinkedIntroGreeting,
  buildPhysioLinkedWelcome,
  physioDisplayName,
} from "../lib/physio-linked-welcome";
import { refreshSmartReminders } from "../lib/smart-reminders";
import { supabase } from "../lib/supabase";
import { FadeInView } from "../components/ui/FadeInView";
import { TrustPanel } from "../components/ui/TrustPanel";

const WELCOME_MESSAGE =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia, duda sobre ejercicios o lo que necesites.";
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

type ConversationGroup = { label: string; items: Conversation[] };

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
    const name = c.physio_name?.trim() || "Fisioterapeuta";
    const clinic = c.clinic_name?.trim();
    const label = clinic ? `${name} — ${clinic}` : name;
    const idx = indexByLabel.get(label);
    if (idx === undefined) {
      indexByLabel.set(label, groups.length);
      groups.push({ label, items: [c] });
    } else {
      groups[idx].items.push(c);
    }
  }

  return groups;
}

function BoldText({ text, style, boldStyle }: {
  text: string;
  style?: object;
  boldStyle?: object;
}) {
  const lines = text.split("\n");

  return (
    <Text style={style}>
      {lines.map((line, li) => {
        const trimmed = line.trim();
        const isInlineFuente =
          /^Fuente:/i.test(trimmed) ||
          /^- Fuente:/i.test(trimmed) ||
          /^Source:/i.test(trimmed) ||
          /^- Source:/i.test(trimmed);

        if (isInlineFuente) {
          return (
            <Text
              key={li}
              style={[style, { fontSize: 12, color: "#2563eb", marginTop: 2 }]}
            >
              {trimmed}
              {li < lines.length - 1 ? "\n" : ""}
            </Text>
          );
        }

        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <Text key={li}>
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <Text key={i} style={[style, boldStyle ?? { fontWeight: "700" }]}>
                    {part.slice(2, -2)}
                  </Text>
                );
              }
              return <Text key={i}>{part}</Text>;
            })}
            {li < lines.length - 1 ? "\n" : ""}
          </Text>
        );
      })}
    </Text>
  );
}

function welcomeMessage(content: string = WELCOME_MESSAGE): Message {
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

type LinkedPhysioInfo = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

type AIInquiriesScreenProps = {
  linkedPhysio?: LinkedPhysioInfo | null;
};

export function AIInquiriesScreen({ linkedPhysio = null }: AIInquiriesScreenProps) {
  const headerHeight = useHeaderHeight();
  const { t, locale } = useI18n();
  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name)
    : WELCOME_MESSAGE;
  const introGreeting = linkedPhysio
    ? buildPhysioLinkedIntroGreeting(linkedPhysio.physio_name)
    : undefined;
  const fisioEdgeExtras = linkedPhysio
    ? {
        fisioterapiaFlow: true,
        linkedPhysioName: linkedPhysio.physio_name,
        linkedClinicName: linkedPhysio.clinic_name ?? null,
      }
    : undefined;

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
  const [functionalTestsCompletedParts, setFunctionalTestsCompletedParts] =
    useState<AdaptiveQuestionnairePart[]>([]);
  const functionalTestsCompletedRef = useRef(functionalTestsCompletedParts);
  functionalTestsCompletedRef.current = functionalTestsCompletedParts;
  const [consultLanguage, setConsultLanguage] = useState<"es" | "en">(locale);

  const [chatInput, setChatInput] = useState("");
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const [caseImageUrl, setCaseImageUrl] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [revealingMessageId, setRevealingMessageId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState(t.consulta.newConsulta.replace("+ ", ""));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [physioReportSentBanner, setPhysioReportSentBanner] = useState(false);

  const chatScrollRef = useRef<ScrollView>(null);
  const questionnaireScrollRef = useRef<ScrollView>(null);
  const questionnaireTopY = useRef(0);
  const messageOffsets = useRef<Record<string, number>>({});
  const scrollMetrics = useRef({ offset: 0, viewport: 0, content: 0 });

  useEffect(() => {
    loadConversations();
  }, []);

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

  const scrollToMessageStart = useCallback((id: string) => {
    const y = messageOffsets.current[id];
    if (y != null) {
      chatScrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    }
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
    if (revealingMessageId) {
      requestAnimationFrame(() => scrollToMessageStart(revealingMessageId));
    }
  }, [revealingMessageId, scrollToMessageStart]);

  useEffect(() => {
    updateScrollDownVisibility();
  }, [messages, chatLoading, phase, physioIntro, updateScrollDownVisibility]);

  async function loadConversations() {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at, physio_id, physio_name, clinic_name")
      .eq("kind", linkedPhysio ? "fisioterapia" : "consulta")
      .order("created_at", { ascending: false })
      .limit(linkedPhysio ? 30 : 10);
    const list = (data as Conversation[]) ?? [];
    setConversations(list);

    if (linkedPhysio && list.length > 0) {
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setCaseImageUrl(null);
    setAttachedUri(null);
    setPhysioReportSentBanner(false);

    const { data } = await supabase
      .from("messages")
      .select("id, role, content, image_url")
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
      setPhase("followup");
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
        : t.consulta.newConsulta.replace("+ ", "")
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setInput("");
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

  function startNewConsultation() {
    if (linkedPhysio) return;

    setActiveId(null);
    setActiveTitle(t.consulta.newConsulta.replace("+ ", ""));
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setChatInput("");
    setAttachedUri(null);
    setCaseImageUrl(null);
    setConsultLanguage(locale);
    setHistoryOpen(false);
  }

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
  }

  function pickConsultPhoto() {
    Alert.alert(t.consulta.attachPhoto, undefined, [
      {
        text: t.consulta.takePhoto,
        onPress: () => {
          void (async () => {
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
            setAttachedUri(result.assets[0].uri);
            setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
          })();
        },
      },
      {
        text: t.consulta.choosePhoto,
        onPress: () => {
          void (async () => {
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
            setAttachedUri(result.assets[0].uri);
            setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
          })();
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
    const answer = await respondToUserMessage(text, triage, imageUrl, language, fisioEdgeExtras);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

    if (linkedPhysio && conversations.length > 0) {
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
    setInitialMessage(text);
    setCaseImageUrl(null);
    const aiMsgId = `ai-${Date.now()}`;
    setRevealingMessageId(aiMsgId);
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
    try {
      const { data: patientProfile } = await supabase
        .from("profiles")
        .select("physio_id")
        .eq("id", params.patientId)
        .maybeSingle();
      const physioId = (patientProfile as { physio_id?: string | null } | null)?.physio_id;
      if (!physioId) return false;

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
      const answer = (raw as { answer?: string } | null)?.answer;
      if (!answer) return false;

      const { error: insertError } = await supabase.from("clinical_reports").insert({
        patient_id: params.patientId,
        physio_id: physioId,
        conversation_id: params.conversationId,
        body_area: params.bodyArea,
        patient_summary: params.patientSummary,
        physio_report: answer,
      });
      if (insertError) {
        console.error("No se pudo guardar el informe para el fisioterapeuta:", insertError);
        return false;
      }
      return true;
    } catch (err) {
      console.error("No se pudo generar el informe para el fisioterapeuta:", err);
      return false;
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
      return formatKneeAdaptive(kneeAnswers, introBlock);
    }
    if (questionnairePart === "back") {
      return formatBackAdaptive(backAnswers, introBlock);
    }
    if (questionnairePart === "hip") {
      return formatHipAdaptive(hipAnswers, introBlock);
    }
    return formatGenericConsulta(genericAnswers, introBlock);
  }

  function beginQuestionnaire(
    text: string,
    part: AdaptiveQuestionnairePart | "generic",
    language: ConsultLanguage = consultLanguage,
    remainingCount = 0
  ) {
    setInitialMessage(text);
    setQuestionnairePart(part);
    setAwaitingNextPart(null);
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setElbowAnswers(defaultElbowAdaptiveAnswers());
    setWristAnswers(defaultWristAdaptiveAnswers());
    setFingerAnswers(defaultFingerAdaptiveAnswers());
    setHeadAnswers(defaultHeadAdaptiveAnswers());
    setNeckAnswers(defaultNeckAdaptiveAnswers());
    setLowerLegAnswers(
      part === "ankle_foot"
        ? withAnkleFootFocusFromText(text, resolveAnkleFootFocus(text))
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

    let intro = questionnaireIntroMessage(part, language, text);
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
    const queue = pendingPartsFromText(text, evaluatedParts);
    if (queue.length === 0 && preferredFirst && preferredFirst !== "generic") {
      beginQuestionnaire(text, preferredFirst, language, 0);
      setPendingParts([]);
      return true;
    }
    if (queue.length === 0 && preferredFirst === "generic") {
      beginQuestionnaire(text, "generic", language, 0);
      setPendingParts([]);
      return true;
    }
    if (queue.length === 0) return false;

    // Always follow mention order in the patient's text (first written = first asked).
    // Do not reorder by triage.bodyPart — that often picks the last zone named.
    const first = queue[0];
    const rest = queue.slice(1);
    setPendingParts(rest);
    beginQuestionnaire(text, first, language, rest.length);
    return true;
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
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: answer,
        })
        .select("id, role, content")
        .single();
      if (aiMsg) {
        setRevealingMessageId((aiMsg as Message).id);
        setMessages((prev) => [...prev, aiMsg as Message]);
      }
    } catch {
      // Individual per-zone orientations already shown; summary is best-effort.
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
      await appendMultiPartFinalSummary(conversationId, evaluations, language);
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
    const text = chatInput.trim() || (attachedUri ? photoOnlyCaption(locale) : "");
    if ((!text && !attachedUri) || phase !== "intro" || physioIntro || chatLoading) return;
    const userMsgId = `user-${Date.now()}`;
    setChatInput("");
    setChatLoading(true);
    setFormError(null);

    try {
      const imageUrl = await uploadOutgoingPhoto();
      if (imageUrl) setCaseImageUrl(imageUrl);

      const lang = detectConsultLanguage(text, locale || consultLanguage);
      setConsultLanguage(lang);

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: imageUrl },
      ]);

      const triage = await triageMessage(text, imageUrl, lang, fisioEdgeExtras);

      if (isMetaOrClarificationQuery(text)) {
        await respondToInitialMessage(
          text,
          { action: "respond", intent: "general", answer: triage.answer },
          imageUrl,
          lang
        );
        return;
      }

      if (shouldStartQuestionnaire(triage, evaluatedParts)) {
        startQuestionnaireQueue(text, lang, triage.bodyPart);
        return;
      }

      if (triage.intent === "symptom_other") {
        const { part } = questionnaireForText(text);
        if (!startQuestionnaireQueue(text, lang, part === "generic" ? "generic" : part)) {
          beginQuestionnaire(text, part === "generic" ? "generic" : part, lang);
        }
        return;
      }

      // Local multi-part detection even if triage returned respond
      if (startQuestionnaireQueue(text, lang)) {
        return;
      }

      await respondToInitialMessage(text, triage, imageUrl, lang);
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

    if (questionnairePart === "shoulder") {
      const shoulderFocus = resolveShoulderQuestionnaireFocus(initialMessage);
      const sections = getVisibleShoulderSections(shoulderAnswers, shoulderFocus);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateShoulderSection(
          lastSection,
          shoulderAnswers,
          shoulderFocus
        );
        if (sectionErr) {
          setFormError(sectionErr);
          setShoulderSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateShoulderAdaptive(shoulderAnswers, shoulderFocus);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "elbow") {
      const sections = getVisibleElbowSections(elbowAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateElbowSection(lastSection, elbowAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setElbowSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateElbowAdaptive(elbowAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "wrist_hand") {
      const sections = getVisibleWristSections(wristAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateWristSection(lastSection, wristAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setWristSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateWristAdaptive(wristAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "finger") {
      const sections = getVisibleFingerSections(fingerAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateFingerSection(lastSection, fingerAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setFingerSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateFingerAdaptive(fingerAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "head") {
      const sections = getVisibleHeadSections(headAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateHeadSection(lastSection, headAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setHeadSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateHeadAdaptive(headAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "neck") {
      const sections = getVisibleNeckSections(neckAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateNeckSection(lastSection, neckAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setNeckSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateNeckAdaptive(neckAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "ankle_foot") {
      const sections = getVisibleLowerLegSections(lowerLegAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateLowerLegSection(lastSection, lowerLegAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setLowerLegSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateLowerLegAdaptive(lowerLegAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "knee") {
      const sections = getVisibleKneeSections(kneeAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateKneeSection(lastSection, kneeAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setKneeSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateKneeAdaptive(kneeAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "back") {
      const sections = getVisibleBackSections(backAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateBackSection(lastSection, backAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setBackSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateBackAdaptive(backAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else if (questionnairePart === "hip") {
      const sections = getVisibleHipSections(hipAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateHipSection(lastSection, hipAnswers);
        if (sectionErr) {
          setFormError(sectionErr);
          setHipSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateHipAdaptive(hipAnswers);
      if (err) {
        setFormError(err);
        return;
      }
    } else {
      const err = validateGenericConsulta(genericAnswers);
      if (err) {
        setFormError(err);
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
        : questionnairePart === "generic"
          ? patientFacingPartLabel("generic", initialMessage, consultLanguage)
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
            ? headAnswers.mecanismo.includes("Golpe / traumatismo en la cabeza") ||
              headAnswers.rf_trauma === "Sí"
              ? `Sí: ${headAnswers.mecanismo.join(", ") || "trauma"}`
              : "No"
          : questionnairePart === "neck"
            ? neckAnswers.mecanismo.includes("Caída") ||
              neckAnswers.mecanismo.includes("Golpe directo / traumatismo") ||
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

      if (linkedPhysio) {
        const clinicalForPhysio = await callEdgeText(
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

        let conversationId = activeId;
        if (!conversationId) {
          if (conversations.length > 0) {
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
            patientFacingSummaryHidden: true,
          },
        });

        const sent = await maybeGenerateAndSendPhysioReport({
          patientId: user.id,
          conversationId,
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
          patientSummary: clinicalForPhysio,
          language: consultLanguage,
        });
        if (sent) setPhysioReportSentBanner(true);

        const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name);
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({ conversation_id: conversationId, role: "assistant", content: thanks })
          .select("id, role, content")
          .single();

        if (aiMsg) setMessages((prev) => [...prev, aiMsg as Message]);
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        setPhase("complete");
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

        setRevealingMessageId((aiMsg as Message).id);
        setMessages((prev) => [...prev, aiMsg as Message]);
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        setPhase("followup");
        await offerNextPendingPart(
          activeId,
          questionnairePart,
          consultLanguage,
          answer,
          areaLabel
        );
        if (await getNotificationsEnabled()) {
          void refreshSmartReminders(locale);
        }
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
      setRevealingMessageId((aiMsg as Message).id);
      setMessages((prev) => [...prev, aiMsg as Message]);
      markPartEvaluated(questionnairePart);
      setCaseImageUrl(null);
      setPhase("followup");
      await offerNextPendingPart(
        conv.id,
        questionnairePart,
        consultLanguage,
        answer,
        areaLabel
      );
      if (await getNotificationsEnabled()) {
        void refreshSmartReminders(locale);
      }
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
    const text = chatInput.trim() || (attachedUri ? photoOnlyCaption(locale) : "");
    if ((!text && !attachedUri) || phase !== "followup" || chatLoading || !activeId) return;
    const userMsgId = `u-${Date.now()}`;
    setChatInput("");
    setChatLoading(true);

    try {
      const imageUrl = await uploadOutgoingPhoto();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: imageUrl },
      ]);

      const triage = await triageMessage(text, imageUrl, consultLanguage, fisioEdgeExtras);
      let userSaved = false;

      async function saveUserMessage() {
        if (userSaved) return;
        await supabase.from("messages").insert({
          conversation_id: activeId,
          role: "user",
          content: text,
          image_url: imageUrl,
        });
        userSaved = true;
      }

      if (awaitingNextPart) {
        await saveUserMessage();

        const lastEval =
          partEvaluationsRef.current[partEvaluationsRef.current.length - 1];
        const completedPart = lastEval?.part;
        if (
          reportsFunctionalTestResults(text) &&
          completedPart &&
          completedPart !== "generic"
        ) {
          markFunctionalTestsDone(completedPart);
        }
        const functionalTestsDone = isFunctionalTestsDoneForPart(completedPart);

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

        if (isDeclineNextPart(text)) {
          setAwaitingNextPart(null);
          setPendingParts([]);
          await appendMultiPartFinalSummary(
            activeId,
            partEvaluationsRef.current,
            consultLanguage
          );
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
                ? `${m.content}\n[El paciente adjuntó una foto de la lesión]`
                : m.content,
            })),
          {
            role: "user" as const,
            content: imageUrl
              ? `${text}\n[El paciente adjuntó una foto de la lesión]`
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

        setRevealingMessageId((aiMsg as Message).id);
        setMessages((prev) => [...prev, aiMsg as Message]);
        return;
      } else if (shouldStartQuestionnaire(triage, evaluatedParts)) {
        await saveUserMessage();
        if (imageUrl) setCaseImageUrl(imageUrl);
        startQuestionnaireQueue(text, consultLanguage, triage.bodyPart);
        return;
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
              ? `${m.content}\n[El paciente adjuntó una foto de la lesión]`
              : m.content,
          })),
        {
          role: "user" as const,
          content: imageUrl
            ? `${text}\n[El paciente adjuntó una foto de la lesión]`
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

      setRevealingMessageId((aiMsg as Message).id);
      setMessages((prev) => [...prev, aiMsg as Message]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      setFormError("No se pudo procesar tu mensaje. Inténtalo de nuevo.");
    } finally {
      setChatLoading(false);
    }
  }

  const showChatInput =
    historyLoaded &&
    !openingConversation &&
    !physioIntro &&
    phase !== "complete" &&
    (phase === "intro" || phase === "followup") &&
    (!linkedPhysio || Boolean(activeId) || conversations.length === 0);
  const showFisioPickExisting =
    Boolean(linkedPhysio) &&
    historyLoaded &&
    !openingConversation &&
    conversations.length > 0 &&
    !activeId;
  const showFisioBootstrap =
    Boolean(linkedPhysio) && (!historyLoaded || (openingConversation && messages.length === 0));

  function renderTopBar() {
    return (
      <View style={styles.chatTopBar}>
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
        {!linkedPhysio && (
          <Pressable style={styles.newBtn} onPress={startNewConsultation}>
            <Ionicons name="add" size={16} color={Colors.white} />
            <Text style={styles.newBtnText}>{t.consulta.new}</Text>
          </Pressable>
        )}
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
          <View style={[styles.historyPanel, { marginTop: headerHeight }]}>
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
            {linkedPhysio && (
              <Text style={styles.historyHintText}>
                {locale === "en"
                  ? "This chat is for what your physiotherapist asked. For other questions, use the Consulta tab."
                  : "Este chat es para lo que te ha pedido tu fisioterapeuta. Para otras preguntas, usa la pestaña Consulta."}
              </Text>
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
                  <Text style={styles.historyGroupLabel}>{group.label}</Text>
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
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {renderTopBar()}

        <ScrollView
          ref={questionnaireScrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
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
                      <Image
                        source={{ uri: msg.image_url }}
                        style={styles.bubbleImage}
                        resizeMode="cover"
                      />
                    ) : null}
                    {msg.content ? (
                      <Text style={[styles.bubbleText, styles.bubbleTextUser]}>{msg.content}</Text>
                    ) : null}
                  </View>
                ) : (
                  <AssistantMessageWithSources
                    content={msg.content}
                    renderBody={(body) => (
                      <BoldText text={body} style={styles.bubbleText} boldStyle={styles.bubbleBold} />
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
            <TrustPanel locale={consultLanguage} />
            {questionnairePart === "shoulder" ? (
              <>
                <ConsultaAdaptiveShoulder
                  value={shoulderAnswers}
                  onChange={setShoulderAnswers}
                  sectionIndex={shoulderSectionIndex}
                  onSectionIndexChange={withQuestionnaireScroll(setShoulderSectionIndex)}
                  sectionError={formError}
                  onSectionError={setFormError}
                  locale={consultLanguage}
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
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastElbowSection(elbowAnswers, elbowSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastWristSection(wristAnswers, wristSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastFingerSection(fingerAnswers, fingerSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastHeadSection(headAnswers, headSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastNeckSection(neckAnswers, neckSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastLowerLegSection(lowerLegAnswers, lowerLegSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastKneeSection(kneeAnswers, kneeSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastBackSection(backAnswers, backSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
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
                  locale={consultLanguage}
                />
                {isLastHipSection(hipAnswers, hipSectionIndex) && (
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={handleQuestionnaireSubmit}
                  >
                    <Text style={styles.submitBtnText}>
                      {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                    </Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <ConsultaGenericFields
                  value={genericAnswers}
                  onChange={setGenericAnswers}
                  locale={consultLanguage}
                />
                {formError ? <Text style={styles.error}>{formError}</Text> : null}
                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                  onPress={handleQuestionnaireSubmit}
                >
                  <Text style={styles.submitBtnText}>
                    {consultLanguage === "en" ? "Get AI guidance" : "Obtener orientación de la IA"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

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
        {renderHistoryDrawer()}
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
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
            Informe enviado a tu fisioterapeuta
          </Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#047857" }}>
            El resumen clínico se ha enviado correctamente. Ya puede revisarlo antes de la cita.
          </Text>
          <Pressable onPress={() => setPhysioReportSentBanner(false)} style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#065F46" }}>Cerrar</Text>
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
        (!linkedPhysio || conversations.length === 0) ? (
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
              ? "You can't open new chats in Fisioterapia. Open one from the list or use the Consulta tab for other questions."
              : "En Fisioterapia no puedes abrir chats nuevos. Abre una consulta de la lista o usa la pestaña Consulta para otras preguntas."}
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
                      <Image
                        source={{ uri: msg.image_url }}
                        style={styles.bubbleImage}
                        resizeMode="cover"
                      />
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
                      updateScrollDownVisibility();
                    }}
                    onRevealTick={updateScrollDownVisibility}
                  >
                    {(visibleText, isRevealing) => (
                      <>
                        <AssistantMessageWithSources
                          content={visibleText}
                          renderBody={(body) => (
                            <ConsultaAssistantBody
                              text={body}
                              style={styles.bubbleText}
                              boldStyle={styles.bubbleBold}
                            />
                          )}
                        />
                        {msg.id !== WELCOME_ID &&
                          !msg.id.startsWith("q-intro") &&
                          phase === "followup" &&
                          !isRevealing && (
                            <Text style={styles.bubbleDisclaimer}>
                              {t.consulta.disclaimer}
                            </Text>
                          )}
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
                  lineHeight: 20,
                  color: Colors.textSecondary,
                  textAlign: "center",
                }}
              >
                {locale === "en"
                  ? `${physioDisplayName(linkedPhysio.physio_name)} has received all the information about your injury and will be ready to treat you.`
                  : `${physioDisplayName(linkedPhysio.physio_name)} ya ha recibido toda la información sobre tu molestia y podrá prepararse mejor para tu tratamiento.`}
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
                {locale === "en"
                  ? "If you want to keep using the AI, open the Consulta tab."
                  : "Si quieres seguir usando la IA, abre la pestaña Consulta."}
              </Text>
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
              <Image source={{ uri: attachedUri }} style={styles.attachPreview} />
              <Pressable onPress={clearAttachment} hitSlop={8}>
                <Text style={styles.removePhotoText}>{t.consulta.removePhoto}</Text>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.chatInput}
              placeholder={
                phase === "intro"
                  ? t.consulta.placeholderIntro
                  : linkedPhysio
                    ? locale === "en"
                      ? "Reply about your case (report for your physio)…"
                      : "Responde sobre tu caso (informe para tu fisio)…"
                    : t.consulta.placeholderFollowup
              }
              placeholderTextColor={Colors.textLight}
              value={chatInput}
              onChangeText={setChatInput}
              multiline
              maxLength={2000}
              editable={!chatLoading}
            />
            <Pressable
              style={({ pressed }) => [
                styles.attachBtn,
                chatLoading && styles.sendBtnDisabled,
                pressed && styles.attachBtnPressed,
              ]}
              onPress={pickConsultPhoto}
              disabled={chatLoading}
              accessibilityLabel={t.consulta.attachPhoto}
            >
              <Ionicons name="camera-outline" size={20} color={Colors.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                (!chatInput.trim() && !attachedUri) || chatLoading
                  ? styles.sendBtnDisabled
                  : null,
                pressed && styles.sendBtnPressed,
              ]}
              onPress={phase === "intro" ? handleIntroSubmit : handleFollowupSubmit}
              disabled={(!chatInput.trim() && !attachedUri) || chatLoading}
            >
              <Ionicons name="send" size={18} color={Colors.white} />
            </Pressable>
          </View>
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
      {renderHistoryDrawer()}
    </KeyboardAvoidingView>
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
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  newBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700', letterSpacing: -0.1 },
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
  bubbleRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowAI: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '82%', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12 },
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  bubbleText: { fontSize: 15, lineHeight: 22, color: Colors.text, letterSpacing: -0.1 },
  bubbleTextUser: { color: Colors.white },
  bubbleImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  bubbleBold: { color: Colors.primary, fontWeight: '700' },
  bubbleDisclaimer: { marginTop: 8, fontSize: 11, color: Colors.textLight, lineHeight: 15 },
  loadingBubble: { paddingVertical: 14, paddingHorizontal: 20 },
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
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnPressed: { backgroundColor: Colors.primaryDark },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  error: { color: Colors.danger, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  inputBarWrap: {
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  attachPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  attachPreview: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  attachBtnPressed: { backgroundColor: Colors.primarySoft },
  chatInput: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.primarySoft,
    letterSpacing: -0.1,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnPressed: { backgroundColor: Colors.primaryDark },
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
