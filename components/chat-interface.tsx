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
  buildPhysioLinkedIntroGreeting,
  buildPhysioLinkedWelcome,
  physioDisplayName,
} from "@/lib/physio-linked-welcome";
import { PhysioReportCompleteCard } from "@/components/physio-report-complete-card";
import { bodyPartLabel, type BodyPartId } from "@/lib/body-parts";
import {
  defaultGenericConsultaAnswers,
  formatGenericConsulta,
  validateGenericConsulta,
  type GenericConsultaAnswers,
} from "@/lib/consulta-generic";
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
  shouldStartQuestionnaire,
  wantsFunctionalTestsNow,
  wantsToContinueToNextQuestionnaire,
  type AdaptiveQuestionnairePart,
} from "@/lib/consulta-triage";
import { ConsultaCompleteCard } from "@/components/consulta-complete-card";
import { ConsultaNewConsultaPrompt } from "@/components/consulta-new-consulta-prompt";
import { shouldShowClinicalTestImage } from "@/lib/clinical-test-images";
import {
  PHOTO_ONLY_CAPTION,
  uploadConsultPhoto,
} from "@/lib/consult-photo";
import {
  detectConsultLanguage,
  type ConsultLanguage,
} from "@/lib/consult-language";
import { AssistantMessageWithSources } from "@/components/assistant-message-with-sources";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
type Phase = "intro" | "questionnaire" | "followup" | "complete";

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";
const WELCOME_MESSAGE =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia, duda sobre ejercicios o lo que necesites.";
const WELCOME_ID = "welcome";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function formatTime(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/** Groups conversations into ChatGPT-style relative date buckets for the sidebar. */
function groupConversationsByDate(conversations: Conversation[]) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const buckets: { label: string; items: Conversation[] }[] = [
    { label: "Hoy", items: [] },
    { label: "Ayer", items: [] },
    { label: "Últimos 7 días", items: [] },
    { label: "Anteriores", items: [] },
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
function groupConversationsByPhysio(conversations: Conversation[]) {
  const groups: { label: string; items: Conversation[] }[] = [];
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

function welcomeMessage(content: string = WELCOME_MESSAGE): Message {
  return { id: WELCOME_ID, role: "assistant", content };
}

function stripMarkdownStars(text: string) {
  return text
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
    .replace(/\*/g, "");
}

function renderAssistantContent(content: string) {
  const shownTestIds = new Set<string>();

  return content.split("\n").map((line, li) => {
    const trimmed = line.trim();
    const isInlineFuente =
      /^Fuente:/i.test(trimmed) ||
      /^- Fuente:/i.test(trimmed) ||
      /^Source:/i.test(trimmed) ||
      /^- Source:/i.test(trimmed);

    if (isInlineFuente) {
      return (
        <a
          key={li}
          href="/conocimientos"
          className="mt-0.5 block text-xs text-blue-600/90 underline-offset-2 hover:underline"
        >
          {trimmed}
          {li < content.split("\n").length - 1 ? "\n" : ""}
        </a>
      );
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
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
              {withBody ? `${withBody[1]}:` : plain}
            </strong>
            {withBody ? (
              <span className="text-neutral-900"> {withBody[2]}</span>
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
              {stripMarkdownStars(wholeBoldMatch[1])}
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
              {stripMarkdownStars(headingText)}
            </strong>
          </p>
          {imageBlock}
        </div>
      );
    }

    const rendered = line.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-bold text-blue-700">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
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

type LinkedPhysioInfo = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

type ChatInterfaceProps = {
  /** When set (Fisioterapia flow), welcome copy names the linked physio and explains the report. */
  linkedPhysio?: LinkedPhysioInfo | null;
  /** Called when the patient links another physio via invite code. */
  onLinkedPhysioChange?: (physio: LinkedPhysioInfo) => void;
};

export function ChatInterface({
  linkedPhysio = null,
  onLinkedPhysioChange,
}: ChatInterfaceProps) {
  const supabase = createClient();
  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name)
    : WELCOME_MESSAGE;
  const introGreeting = linkedPhysio
    ? buildPhysioLinkedIntroGreeting(linkedPhysio.physio_name)
    : undefined;
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const questionnaireRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("Nueva consulta");
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
  const [consultLanguage, setConsultLanguage] = useState<ConsultLanguage>("es");

  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  /** Injury photo kept from intro through the questionnaire for the clinical AI call */
  const [caseImageUrl, setCaseImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [revealingMessageId, setRevealingMessageId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

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

  function clearAttachment() {
    setAttachedFile(null);
    if (attachedPreview?.startsWith("blob:")) URL.revokeObjectURL(attachedPreview);
    setAttachedPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function onPhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen (JPG, PNG o WebP).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("La imagen es demasiado grande (máx. ~12 MB).");
      return;
    }
    if (attachedPreview?.startsWith("blob:")) URL.revokeObjectURL(attachedPreview);
    setAttachedFile(file);
    setAttachedPreview(URL.createObjectURL(file));
  }

  async function uploadOutgoingPhoto(): Promise<string | null> {
    if (!attachedFile) return null;
    const url = await uploadConsultPhoto(attachedFile);
    clearAttachment();
    return url;
  }

  useEffect(() => { loadConversations(); }, []);

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

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  const scrollToMessageStart = useCallback((id: string) => {
    requestAnimationFrame(() => {
      messageRefs.current.get(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
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
    if (revealingMessageId) {
      scrollToMessageStart(revealingMessageId);
    }
  }, [revealingMessageId, scrollToMessageStart]);

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
    setHistoryLoaded(true);
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setCaseImageUrl(null);
    clearAttachment();
    setPhysioReportSentBanner(false);

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
    setOpeningConversation(false);
    setHistoryLoaded(true);
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
    try {
      const { data: patientProfile } = await supabase
        .from("profiles")
        .select("physio_id")
        .eq("id", params.patientId)
        .maybeSingle();
      const physioId = (patientProfile as { physio_id?: string | null } | null)?.physio_id;
      if (!physioId) return { sent: false };

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
      const answer = (raw as { answer?: string } | null)?.answer;
      if (!answer) return { sent: false };

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
        setRevealingMessageId((aiMsg as Message).id);
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
      setRevealingMessageId((aiMsg as Message).id);
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
      if (linkedPhysio) return;
      if (evaluations.length >= 2) {
        await appendMultiPartFinalSummary(conversationId, evaluations, language);
      }
      // Keep chat open for functional tests / related questions — do NOT finish here.
      const offeredTests =
        Boolean(completedSummary) &&
        /\*\*Preguntas de valoración funcional\*\*|Functional assessment questions|\*\*Preguntas de valoraci[oó]n funcional\*\*/i.test(
          completedSummary ?? ""
        );
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
    let answer = triage.answer?.trim() ?? "";

    if (!answer) {
      if (triage.intent === "symptom_other") {
        answer = await callAI(
          {
            mode: "clinical_screen",
            message: text,
            bodyArea: bodyAreaLabelFromText(text),
            ...(imageUrl ? { imageUrl } : {}),
          },
          language
        );
      } else {
        answer = await callAI(
          {
            mode: "general_chat",
            message: text,
            ...(imageUrl ? { imageUrl } : {}),
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
    setRevealingMessageId(aiMsgId);
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

  async function handleIntroSubmit() {
    const text = input.trim() || (attachedFile ? PHOTO_ONLY_CAPTION : "");
    if ((!text && !attachedFile) || loading || phase !== "intro" || physioIntro) return;
    const userMsgId = `user-${Date.now()}`;
    setInput("");
    setLoading(true);

    try {
      const imageUrl = await uploadOutgoingPhoto();
      if (imageUrl) setCaseImageUrl(imageUrl);

      const lang = detectConsultLanguage(text, consultLanguage);
      setConsultLanguage(lang);

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: imageUrl },
      ]);

      const triage = await triageMessage(text, imageUrl, lang);

      if (
        isMetaOrClarificationQuery(text) ||
        isInformationalOrEducationalQuery(text)
      ) {
        await respondToInitialMessage(
          text,
          { action: "respond", intent: "general", answer: triage.answer },
          imageUrl,
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
          imageUrl,
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

      await respondToInitialMessage(text, triage, imageUrl, lang);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
      alert(err instanceof Error ? err.message : "Error al procesar tu mensaje.");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuestionnaireSubmit() {
    if (loading) return;

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
          setShoulderSectionError(sectionErr);
          setShoulderSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateShoulderAdaptive(shoulderAnswers, shoulderFocus);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "elbow") {
      const sections = getVisibleElbowSections(elbowAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateElbowSection(lastSection, elbowAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setElbowSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateElbowAdaptive(elbowAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "wrist_hand") {
      const sections = getVisibleWristSections(wristAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateWristSection(lastSection, wristAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setWristSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateWristAdaptive(wristAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "finger") {
      const sections = getVisibleFingerSections(fingerAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateFingerSection(lastSection, fingerAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setFingerSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateFingerAdaptive(fingerAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "head") {
      const sections = getVisibleHeadSections(headAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateHeadSection(lastSection, headAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setHeadSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateHeadAdaptive(headAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "neck") {
      const sections = getVisibleNeckSections(neckAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateNeckSection(lastSection, neckAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setNeckSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateNeckAdaptive(neckAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "ankle_foot") {
      const sections = getVisibleLowerLegSections(lowerLegAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateLowerLegSection(lastSection, lowerLegAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setLowerLegSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateLowerLegAdaptive(lowerLegAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "knee") {
      const sections = getVisibleKneeSections(kneeAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateKneeSection(lastSection, kneeAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setKneeSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateKneeAdaptive(kneeAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "back") {
      const sections = getVisibleBackSections(backAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateBackSection(lastSection, backAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setBackSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateBackAdaptive(backAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else if (questionnairePart === "hip") {
      const sections = getVisibleHipSections(hipAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateHipSection(lastSection, hipAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setHipSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateHipAdaptive(hipAnswers);
      if (err) {
        setShoulderSectionError(err);
        return;
      }
    } else {
      const err = validateGenericConsulta(genericAnswers);
      if (err) {
        setShoulderSectionError(err);
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

      // Fisioterapia: clinical orientation is for the physio report only — patient sees a thank-you.
      if (linkedPhysio) {
        const clinicalForPhysio = await callAI({
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
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
          if (conversations.length > 0) {
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
            patientFacingSummaryHidden: true,
          },
        });

        const { sent, physioLabel } = await maybeGenerateAndSendPhysioReport({
          patientId: user.id,
          conversationId: conv.id,
          bodyArea: areaLabel,
          onsetType,
          painLevel,
          hadTrauma: hadTraumaVal,
          description: initialMessage,
          symptomContext: contextForAi,
          patientSummary: clinicalForPhysio,
          language: consultLanguage,
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

        // Optional short confirmation in history (not the clinical report).
        const thanks = buildPhysioLinkedCompletionMessage(linkedPhysio.physio_name);
        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: conv.id,
            role: "assistant",
            content: thanks,
          })
          .select("id, role, content, created_at")
          .single();

        if (conv.isNew) {
          setActiveId(conv.id);
          setActiveTitle(conv.title);
          setConversations((prev) => [conv as Conversation, ...prev].slice(0, 10));
        }
        if (aiMsg) setMessages((prev) => [...prev, aiMsg as Message]);
        markPartEvaluated(questionnairePart);
        setCaseImageUrl(null);
        setPhase("complete");
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

        setRevealingMessageId((aiMsg as Message).id);
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
      setRevealingMessageId((aiMsg as Message).id);
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
    const text = input.trim() || (attachedFile ? PHOTO_ONLY_CAPTION : "");
    if ((!text && !attachedFile) || loading || phase !== "followup" || !activeId) return;
    const userMsgId = `user-${Date.now()}`;
    setInput("");
    setLoading(true);

    try {
      const imageUrl = await uploadOutgoingPhoto();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, image_url: imageUrl },
      ]);

      const triage = await triageMessage(text, imageUrl, consultLanguage);
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

      // Fisioterapia: if the chat started without the questionnaire, open it on symptom follow-up
      if (
        linkedPhysio &&
        partEvaluationsRef.current.length === 0 &&
        evaluatedParts.length === 0 &&
        !awaitingNextPart &&
        pendingParts.length === 0
      ) {
        const combinedText = [initialMessage, text].filter(Boolean).join("\n").trim();
        const source = shouldOpenSymptomQuestionnaire(combinedText) ? combinedText : text;
        if (shouldOpenSymptomQuestionnaire(source)) {
          await saveUserMessage();
          if (imageUrl) setCaseImageUrl(imageUrl);
          const refined = refineTriageBodyPart(triage, source);
          if (
            refined.action === "questionnaire" &&
            refined.bodyPart &&
            startQuestionnaireQueue(source, consultLanguage, refined.bodyPart)
          ) {
            return;
          }
          if (refined.intent === "symptom_other") {
            const { part } = questionnaireForText(source);
            if (
              !startQuestionnaireQueue(
                source,
                consultLanguage,
                part === "generic" ? "generic" : part
              )
            ) {
              beginQuestionnaire(
                source,
                part === "generic" ? "generic" : part,
                consultLanguage
              );
            }
            return;
          }
          if (startQuestionnaireQueue(source, consultLanguage)) {
            return;
          }
        }
      }

      // After "dónde te duele del brazo?" — open the questionnaire for the zone they named
      if (pendingComplaintText && !linkedPhysio) {
        await saveUserMessage();
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

          const aiText = await callAI({
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No especificado",
            description: text,
            symptomContext: `${functionalTestResultsFollowupContext(consultLanguage)}
${betweenPartsChoiceContext(doneLabel, nextLabel, consultLanguage, {
  functionalTestsDone: true,
})}`,
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
            setRevealingMessageId((aiMsg as Message).id);
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

        if (isDeclineNextPart(text)) {
          setAwaitingNextPart(null);
          setPendingParts([]);
          await appendMultiPartFinalSummary(
            activeId,
            partEvaluationsRef.current,
            consultLanguage
          );
          await activateRelatedFollowup(activeId, consultLanguage, {
            offeredTests: true,
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
          setRevealingMessageId((aiMsg as Message).id);
          setMessages((prev) => [...prev, aiMsg as Message]);
        }
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

        const aiText = ensureAsksMoreRelatedQuestions(
          await callAI({
            bodyArea: "seguimiento",
            onsetType: text,
            painLevel: 0,
            hadTrauma: "No",
            description: text,
            symptomContext: functionalTestResultsFollowupContext(consultLanguage),
            conversationHistory,
            ...(imageUrl ? { imageUrl } : {}),
          }),
          consultLanguage
        );

        const { data: aiMsg } = await supabase
          .from("messages")
          .insert({
            conversation_id: activeId,
            role: "assistant",
            content: aiText,
          })
          .select("id, role, content")
          .single();

        setRevealingMessageId((aiMsg as Message).id);
        setMessages((prev) => [...prev, aiMsg as Message]);

        if (!hasMoreZonesPending(completedPart)) {
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

      setRevealingMessageId((aiMsg as Message).id);
      setMessages((prev) => [...prev, aiMsg as Message]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setInput("");
    setConsultLanguage("es");
    setCaseImageUrl(null);
    clearAttachment();
    setMobileSidebarOpen(false);
    setPhysioReportSentBanner(false);
    setFisioNewConsultDraft(true);
    setHistoryLoaded(true);
    setOpeningConversation(false);
  }

  function handleAnotherPhysioLinked(physio: LinkedPhysioInfo) {
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
    setFunctionalTestsCompletedParts([]);
    functionalTestsCompletedRef.current = [];
    setRelatedFollowupActive(false);
    setPostGuidanceAsked(false);
    setShowUnrelatedCta(false);
    setPendingComplaintText(null);
    setInput("");
    setConsultLanguage("es");
    setCaseImageUrl(null);
    clearAttachment();
    setMobileSidebarOpen(false);
  }

  const SidebarContent = () => {
    const filtered = sidebarSearch.trim()
      ? conversations.filter((c) =>
          c.title.toLowerCase().includes(sidebarSearch.trim().toLowerCase())
        )
      : conversations;
    const groups = linkedPhysio
      ? groupConversationsByPhysio(filtered)
      : groupConversationsByDate(filtered);

    return (
      <div className="flex h-full flex-col p-3">
        {!linkedPhysio && (
          <button
            type="button"
            onClick={startNewConsultation}
            className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Nueva consulta
          </button>
        )}
        {linkedPhysio && (
          <p className="mb-3 rounded-xl bg-blue-50 px-3 py-2.5 text-[11px] leading-snug text-blue-700">
            Este chat es para lo que te ha pedido tu fisioterapeuta. Para otras preguntas, usa la pestaña{" "}
            <span className="font-semibold">Consulta</span>.
          </p>
        )}

        {linkedPhysio && (
          <button
            type="button"
            onClick={() => setShowPhysioCodeEntry(true)}
            className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Introducir otro código
          </button>
        )}

        <div className="relative mb-3">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Buscar consultas…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 transition-colors focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50"
          />
        </div>

        <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {linkedPhysio ? "Mis fisioterapeutas" : "Mis consultas"}
        </p>

        <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-1 py-3 text-xs text-slate-400">
              {sidebarSearch.trim()
                ? "No se encontraron consultas."
                : "Aún no tienes consultas guardadas."}
            </p>
          )}
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-2 text-[11px] font-semibold text-slate-900">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((c) => {
                  const isActive = activeId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`group flex items-stretch gap-0.5 rounded-xl transition-colors duration-150 ${
                        isActive ? "bg-blue-600" : "hover:bg-slate-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => loadConversation(c.id, c.title)}
                        className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                          isActive ? "text-white" : "text-slate-600"
                        }`}
                      >
                        <p className="truncate font-medium">{c.title}</p>
                        <p className={`mt-0.5 ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                          {formatDate(c.created_at)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteConversation(c.id)}
                        disabled={deletingId === c.id}
                        aria-label={`Eliminar consulta: ${c.title}`}
                        className={`flex shrink-0 items-center justify-center rounded-xl px-2 transition-colors disabled:opacity-50 ${
                          isActive
                            ? "text-blue-200 hover:bg-blue-700 hover:text-white"
                            : "text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        }`}
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

        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 px-1 pt-3 text-[11px] text-slate-400">
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
    Boolean(linkedPhysio) && (!historyLoaded || (openingConversation && messages.length === 0));
  const inputPlaceholder =
    phase === "intro"
      ? "Cuéntanos qué te pasa…"
      : linkedPhysio
        ? "Responde sobre tu caso (informe para tu fisio)…"
        : "Pregunta lo que quieras";
  const onSend = phase === "intro" ? handleIntroSubmit : handleFollowupSubmit;

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-slate-50">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="animate-fade-in-up relative z-10 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-bold text-slate-900">Consultas</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
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
        className={`hidden md:flex ${desktopSidebarOpen ? "w-72" : "w-0"} shrink-0 overflow-hidden border-r border-slate-200 bg-white transition-all duration-200 ease-out`}
      >
        <div className="w-72">
          <SidebarContent />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setDesktopSidebarOpen((o) => !o)}
        className="hidden md:flex shrink-0 items-center border-r border-slate-200 bg-white px-1 text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-600"
        title={desktopSidebarOpen ? "Ocultar" : "Mostrar consultas"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={desktopSidebarOpen ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 shrink-0 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Mis consultas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <p className="flex-1 truncate text-sm font-semibold text-slate-800">{activeTitle}</p>
          {!linkedPhysio && (
            <button
              type="button"
              onClick={startNewConsultation}
              className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              + Nueva
            </button>
          )}
        </div>

        {linkedPhysio && phase === "complete" ? null : linkedPhysio && physioReportSentBanner ? (
          <div className="shrink-0 border-b border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Informe enviado a tu fisioterapeuta
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  El resumen clínico de esta consulta se ha enviado correctamente
                  {linkedPhysioLabel ? ` a ${linkedPhysioLabel}` : ""}. Ya puede
                  revisarlo en su panel antes de la cita.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhysioReportSentBanner(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1">
        <div
          ref={messagesRef}
          onScroll={updateScrollDownVisibility}
          className="scrollbar-thin h-full min-h-0 overflow-y-auto overscroll-contain"
        >
          {showFisioBootstrap ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">Cargando…</p>
            </div>
          ) : physioIntro &&
            phase === "intro" &&
            !activeId &&
            (!linkedPhysio || conversations.length === 0 || fisioNewConsultDraft) ? (
            <PhysioIntro onSkip={skipPhysioIntro} greeting={introGreeting} />
          ) : showFisioPickExisting ? (
            <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                Elige una consulta de tu fisioterapeuta
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                En Fisioterapia no puedes abrir chats nuevos. Abre una consulta de la
                lista (asignada por tu fisioterapeuta) o ve a la pestaña{" "}
                <span className="font-semibold text-slate-700">Consulta</span> para
                otras preguntas.
              </p>
            </div>
          ) : (
          <div
            className={`mx-auto w-full max-w-3xl space-y-5 px-4 py-4 sm:space-y-6 sm:px-6 lg:px-8 ${
              phase === "questionnaire" ? "pb-6" : "pb-4"
            }`}
          >
            {messages.map((msg) => {
              const time = formatTime(msg.created_at);
              return (
                <div
                  key={msg.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(msg.id, el);
                    else messageRefs.current.delete(msg.id);
                  }}
                  className={`animate-fade-in-up flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-100">
                      <PhysioAvatar size={36} />
                    </div>
                  )}
                  <div className={`flex max-w-[92%] flex-col sm:max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:px-4 sm:py-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-800 shadow-[var(--shadow-card)]"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="space-y-2">
                          {msg.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={msg.image_url}
                              alt="Foto de la lesión"
                              className="max-h-56 w-full rounded-xl object-cover"
                            />
                          ) : null}
                          {msg.content ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
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
                            updateScrollDownVisibility();
                          }}
                          onRevealTick={updateScrollDownVisibility}
                        >
                          {(visibleText, isRevealing) => (
                            <>
                              <AssistantMessageWithSources
                                content={visibleText}
                                renderBody={(body) => (
                                  <div className="whitespace-pre-wrap">
                                    {renderAssistantContent(body)}
                                  </div>
                                )}
                              />
                              {msg.id !== WELCOME_ID &&
                                !msg.id.startsWith("q-intro") &&
                                phase === "followup" &&
                                !isRevealing && (
                                  <p className="mt-2 text-xs text-slate-400">
                                    Orientación informativa, no diagnóstico médico.
                                  </p>
                                )}
                            </>
                          )}
                        </StreamingAssistantMessage>
                      )}
                    </div>
                    {time && (
                      <span className="mt-1 px-1 text-[11px] text-slate-400">{time}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {linkedPhysio && phase === "complete" ? (
              <PhysioReportCompleteCard
                physioName={linkedPhysio.physio_name}
                clinicName={linkedPhysio.clinic_name}
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                    />
                    {isLastKneeSection(kneeAnswers, kneeSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                    />
                    {isLastHipSection(hipAnswers, hipSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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
                      className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
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

        {showChatInput && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
            {attachedPreview ? (
              <div className="animate-fade-in-up mb-2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachedPreview}
                  alt="Vista previa"
                  className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <button
                  type="button"
                  onClick={clearAttachment}
                  disabled={loading}
                  className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
                >
                  Quitar foto
                </button>
              </div>
            ) : null}
            <div className="flex w-full items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[var(--shadow-card)] transition-shadow duration-150 focus-within:border-blue-300 focus-within:shadow-[var(--shadow-elevated)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder={inputPlaceholder}
                rows={1}
                disabled={loading}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={onPhotoSelected}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={loading}
                title="Adjuntar foto de la lesión"
                aria-label="Adjuntar foto de la lesión"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onSend}
                disabled={(!input.trim() && !attachedFile) || loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-all duration-150 hover:bg-blue-700 active:scale-[0.94] disabled:opacity-40 disabled:hover:bg-blue-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
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
