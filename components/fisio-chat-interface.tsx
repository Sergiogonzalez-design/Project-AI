"use client";

import { AssistantMessageWithSources } from "@/components/assistant-message-with-sources";
import { PhysioAvatar } from "@/components/physio-avatar";
import { PhysioIntro } from "@/components/physio-intro";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom-button";
import { StreamingAssistantMessage } from "@/components/streaming-assistant-message";
import { VoiceConversationButton } from "@/components/voice-conversation-button";
import { VoiceSpeakButton } from "@/components/voice-speak-button";
import { useKeyboardOverlap } from "@/hooks/use-keyboard-overlap";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { ClinicalTestMediaBlock } from "@/components/clinical-test-media";
import {
  clinicalTestRegionIdsForHeading,
  isClinicalRegionSectionLabel,
  leftoverIllustratedTests,
  nextIllustratedFallbackTest,
  pickIllustratedTestsForPruebasQuery,
  shouldShowClinicalTestImage,
  type ClinicalTestImage,
} from "@/lib/clinical-test-images";
import {
  consultAttachmentCaption,
  consultPhotoAccessUrl,
  consultPhotoVisionUrl,
  signConsultMessageAttachments,
  isConsultImageFile,
  isConsultPdfFile,
  isConsultPdfUrl,
  MAX_CONSULT_ATTACHMENT_BYTES,
  uploadConsultPhoto,
} from "@/lib/consult-photo";
import { createClient } from "@/lib/supabase/client";
import { stripVisibleMarkup } from "@/lib/strip-visible-markup";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string | null;
  image_url?: string | null;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

const WELCOME_ID = "welcome";
const WELCOME_MESSAGE =
  "Hola. Soy Physio, el asistente clínico de AIKinora para fisioterapeutas. Pregúntame por diferenciales, maniobras (Neer, Hawkins, Lachman, Spurling…), interpretación de hallazgos o criterio de imagen.";

const INTRO_GREETING =
  "¡Hola! Soy Physio. Esta consulta es técnica, pensada para fisioterapeutas. ¿En qué puedo ayudarte?";

function formatTime(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function welcomeMessage(): Message {
  return { id: WELCOME_ID, role: "assistant", content: WELCOME_MESSAGE };
}

/** Remove leftover markdown asterisks and hashes after bold segments are extracted. */
function stripMarkdownStars(text: string) {
  return stripVisibleMarkup(text);
}

function parseNumberedLine(
  text: string
): { title: string; body: string | null } | null {
  const plain = stripMarkdownStars(text.trim().replace(/^\*\s+/, "• "));
  if (!/^\d+[.)]\s+\S/.test(plain)) return null;
  const withColon = /^(\d+[.)]\s+[^:]+):\s+(.+)$/.exec(plain);
  if (withColon) {
    return { title: `${withColon[1]}:`, body: withColon[2] };
  }
  // Long parenthetical is a description, not part of the title
  // (short bits like "(LCP)" stay on the title).
  const withParen = /^(\d+[.)]\s+.+?)\s+(\([^)]{12,}\)\.?)\s*$/.exec(plain);
  if (withParen) {
    return { title: withParen[1].trim(), body: withParen[2] };
  }
  return { title: plain, body: null };
}

function isShortSectionTitle(text: string): boolean {
  const plain = stripMarkdownStars(text).trim();
  if (!plain || plain.length > 60) return false;
  if ((plain.match(/,/g) ?? []).length >= 2) return false;
  return true;
}

function renderInlineParts(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold text-neutral-900">
        {stripMarkdownStars(part.slice(2, -2))}
      </strong>
    ) : (
      <span key={i}>{stripMarkdownStars(part)}</span>
    )
  );
}

function renderAssistantContent(
  content: string,
  fallbackTests: ClinicalTestImage[] = []
) {
  const shownTestIds = new Set<string>();
  let currentRegionIds: readonly string[] | null = null;
  const nodes: ReactNode[] = [];

  function mediaFor(test: ClinicalTestImage) {
    return <ClinicalTestMediaBlock test={test} />;
  }

  function pushLeftovers(regionIds: readonly string[] | null, keyPrefix: string) {
    const leftover = leftoverIllustratedTests(
      fallbackTests,
      shownTestIds,
      regionIds
    );
    leftover.forEach((t) => {
      shownTestIds.add(t.id);
      nodes.push(
        <div key={`${keyPrefix}-${t.id}`} className="mt-3">
          <p className="text-neutral-900">
            <strong className="font-bold text-blue-700">{t.title}</strong>
          </p>
          {mediaFor(t)}
        </div>
      );
    });
  }

  content.split("\n").forEach((line, li) => {
    const trimmed = line.trim().replace(/^\*\s+/, "• ");
    if (
      /^Fuente:/i.test(trimmed) ||
      /^- Fuente:/i.test(trimmed) ||
      /^Source:/i.test(trimmed) ||
      /^- Source:/i.test(trimmed)
    ) {
      return;
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

    const headingCandidate =
      !numberedText
        ? (headingText ??
          wholeBoldMatch?.[1] ??
          (isClinicalRegionSectionLabel(trimmed)
            ? stripMarkdownStars(trimmed)
            : null))
        : null;
    if (headingCandidate) {
      const nextIds = clinicalTestRegionIdsForHeading(headingCandidate);
      if (nextIds && nextIds.join(",") !== currentRegionIds?.join(",")) {
        if (currentRegionIds) {
          pushLeftovers(currentRegionIds, `flush-${li}`);
        }
        currentRegionIds = nextIds;
      }
    }

    const matched = shouldShowClinicalTestImage({
      numberedText,
      headingText,
      wholeBoldText: wholeBoldMatch?.[1] ?? null,
    });
    let showImage =
      matched && !shownTestIds.has(matched.id) ? matched : null;
    if (
      showImage &&
      currentRegionIds &&
      !currentRegionIds.includes(showImage.id)
    ) {
      showImage = null;
    }
    if (showImage) shownTestIds.add(showImage.id);
    if (!showImage && numberedText && currentRegionIds) {
      showImage = nextIllustratedFallbackTest(
        fallbackTests,
        shownTestIds,
        currentRegionIds
      );
      if (showImage) shownTestIds.add(showImage.id);
    }

    const mediaBlock = showImage ? mediaFor(showImage) : null;

    if (numberedText) {
      const parsed = parseNumberedLine(trimmed) ?? {
        title: stripMarkdownStars(numberedText),
        body: null,
      };
      const displayTitle = showImage
        ? parsed.title.replace(
            /^(\d+[.)]\s+)[^:]+(:?)/,
            `$1${showImage.title}$2`
          )
        : parsed.title;
      nodes.push(
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p className="text-neutral-900">
            <strong className="font-bold text-blue-700">{displayTitle}</strong>
            {parsed.body ? (
              <span className="text-neutral-900"> {parsed.body}</span>
            ) : null}
          </p>
          {mediaBlock}
        </div>
      );
      return;
    }

    if (wholeBoldMatch && !numberedText) {
      const title = stripMarkdownStars(wholeBoldMatch[1]);
      nodes.push(
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p>
            <strong
              className={
                isShortSectionTitle(title)
                  ? "font-bold text-blue-700"
                  : "font-bold text-neutral-900"
              }
            >
              {title}
            </strong>
          </p>
          {mediaBlock}
        </div>
      );
      return;
    }

    if (headingText) {
      const title = stripMarkdownStars(headingText);
      nodes.push(
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p>
            <strong
              className={
                isShortSectionTitle(title)
                  ? "font-bold text-blue-700"
                  : "font-bold text-neutral-900"
              }
            >
              {title}
            </strong>
          </p>
          {mediaBlock}
        </div>
      );
      return;
    }

    const regionLabel = isClinicalRegionSectionLabel(trimmed)
      ? stripMarkdownStars(trimmed)
      : null;
    if (regionLabel && isShortSectionTitle(regionLabel)) {
      nodes.push(
        <div key={li} className={li > 0 ? "mt-3" : undefined}>
          <p>
            <strong className="font-bold text-blue-700">{regionLabel}</strong>
          </p>
          {mediaBlock}
        </div>
      );
      return;
    }

    nodes.push(
      <div key={li} className={li > 0 ? "mt-2" : undefined}>
        <p className="text-neutral-900">{renderInlineParts(trimmed)}</p>
        {mediaBlock}
      </div>
    );
  });

  pushLeftovers(currentRegionIds, "end-region");
  leftoverIllustratedTests(fallbackTests, shownTestIds, null).forEach((t) => {
    shownTestIds.add(t.id);
    nodes.push(
      <div key={`end-all-${t.id}`} className="mt-3">
        <p className="text-neutral-900">
          <strong className="font-bold text-blue-700">{t.title}</strong>
        </p>
        {mediaFor(t)}
      </div>
    );
  });

  return nodes;
}

/**
 * Same chat UX as the patient consulta (Physio intro, avatar, bubbles, history),
 * but free-form technical clinical chat via mode=physio_chat.
 */
export function FisioChatInterface() {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("Nueva consulta clínica");
  const [messages, setMessages] = useState<Message[]>([]);
  const [physioIntro, setPhysioIntro] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealingMessageId, setRevealingMessageId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);

  const messagesRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const autoSpokenIdsRef = useRef<Set<string>>(new Set());
  const [conversationMode, setConversationMode] = useState(false);
  const conversationModeRef = useRef(false);
  const conversationBusyRef = useRef(false);
  const startMicRef = useRef<() => void>(() => {});
  const stopMicRef = useRef<() => void>(() => {});
  const sendVoiceTurnRef = useRef<() => void>(() => {});
  const pendingVoiceTextRef = useRef<string | null>(null);
  const hearingTextRef = useRef("");
  const silenceTimerRef = useRef<number | null>(null);
  const SILENCE_MS = 3000;
  const keyboardOverlap = useKeyboardOverlap();

  const {
    supported: ttsSupported,
    speakingId,
    speak,
    cancel: cancelSpeech,
    toggle: toggleSpeak,
  } = useSpeechSynthesis({ language: "es" });

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
    window.setTimeout(() => {
      if (conversationModeRef.current && !conversationBusyRef.current) {
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
    language: "es",
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
        pendingVoiceTextRef.current = text;
        flushSync(() => setInput(text));
        sendVoiceTurnRef.current();
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
    for (const m of messages) {
      if (m.role === "assistant") autoSpokenIdsRef.current.add(m.id);
    }
    conversationModeRef.current = true;
    setConversationMode(true);
    conversationBusyRef.current = false;
    cancelSpeech();
    startMic();
  }

  useEffect(() => {
    if (!conversationMode) return;
    if (revealingMessageId) return;

    const last = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.id !== WELCOME_ID);
    if (!last || autoSpokenIdsRef.current.has(last.id)) return;

    autoSpokenIdsRef.current.add(last.id);
    stopMicRef.current();
    conversationBusyRef.current = true;
    speak(last.content, last.id, {
      onEnd: () => resumeConversationListening(),
    });
  }, [
    messages,
    revealingMessageId,
    conversationMode,
    speak,
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

  async function loadConversations() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .ilike("title", "Clínica%")
      .order("created_at", { ascending: false })
      .limit(30);
    setConversations((data as Conversation[]) ?? []);
  }

  useEffect(() => {
    void loadConversations();
  }, []);

  function skipPhysioIntro() {
    if (!physioIntro || activeId) return;
    setPhysioIntro(false);
    setMessages((prev) => (prev.length === 0 ? [welcomeMessage()] : prev));
  }

  useEffect(() => {
    if (!physioIntro || activeId) return;
    const timer = setTimeout(() => skipPhysioIntro(), 5000);
    return () => clearTimeout(timer);
  }, [physioIntro, activeId]);

  async function startNewConsultation() {
    setActiveId(null);
    setActiveTitle("Nueva consulta clínica");
    setMessages([welcomeMessage()]);
    setPhysioIntro(false);
    setInput("");
    setRevealingMessageId(null);
    setMobileSidebarOpen(false);
    clearAttachment();
  }

  async function openConversation(id: string) {
    const { data: conv } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", id)
      .maybeSingle();
    if (!conv) return;
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, role, content, created_at, image_url")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    const resolved = await signConsultMessageAttachments((msgs as Message[]) ?? []);
    setActiveId(id);
    setActiveTitle(conv.title);
    setMessages(resolved);
    setPhysioIntro(false);
    setMobileSidebarOpen(false);
    clearAttachment();
  }

  async function deleteConversation(id: string) {
    setDeletingId(id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) await startNewConsultation();
    setDeletingId(null);
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text =
      (pendingVoiceTextRef.current ?? input).trim() ||
      (attachedFile ? consultAttachmentCaption(attachedFile) : "");
    pendingVoiceTextRef.current = null;
    if ((!text && !attachedFile) || loading) {
      if (conversationModeRef.current) resumeConversationListening();
      return;
    }
    setInput("");

    const optimisticId = crypto.randomUUID();
    const optimisticUser: Message = {
      id: optimisticId,
      role: "user",
      content: text,
      image_url: attachedPreview ?? undefined,
    };
    const base = messages.length === 0 ? [welcomeMessage()] : messages;
    const uiMessages: Message[] = [...base, optimisticUser];
    flushSync(() => {
      setMessages(uiMessages);
      setLoading(true);
    });
    requestAnimationFrame(() => scrollToBottom());

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");

      const attachmentPath = await uploadOutgoingPhoto();
      const displayUrl = attachmentPath
        ? await consultPhotoAccessUrl(attachmentPath)
        : null;
      const imageUrl = await consultPhotoVisionUrl(attachmentPath);

      if (displayUrl) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, image_url: displayUrl } : m
          )
        );
      }

      let conversationId = activeId;
      if (!conversationId) {
        const title = `Clínica — ${new Date().toLocaleDateString("es-ES")}`;
        const { data: conv, error: convErr } = await supabase
          .from("conversations")
          .insert({ title, user_id: user.id })
          .select("id, title, created_at")
          .single();
        if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");
        conversationId = conv.id;
        setActiveId(conv.id);
        setActiveTitle(conv.title);
        setConversations((prev) => [conv as Conversation, ...prev].slice(0, 30));

        await supabase.from("messages").insert({
          conversation_id: conv.id,
          role: "assistant",
          content: WELCOME_MESSAGE,
        });
      }

      const userMsg = {
        conversation_id: conversationId,
        role: "user" as const,
        content: text,
        image_url: attachmentPath ?? null,
      };
      const { data: savedUser } = await supabase
        .from("messages")
        .insert(userMsg)
        .select("id, role, content, created_at, image_url")
        .single();

      if (savedUser) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? (savedUser as Message) : m))
        );
      }

      const history = uiMessages
        .filter((m) => m.id !== WELCOME_ID)
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error: fnError } = await supabase.functions.invoke("ai-consult", {
        body: {
          mode: "physio_chat",
          message: text,
          conversationHistory: history.slice(-12),
          language: "es",
          ...(imageUrl ? { imageUrl } : {}),
        },
      });
      if (fnError) throw fnError;
      const answer =
        (data as { answer?: string } | null)?.answer?.trim() ||
        "No he podido generar una respuesta. Inténtalo de nuevo.";

      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: answer,
        })
        .select("id, role, content, created_at")
        .single();

      const assistantMsg = (aiMsg as Message) ?? {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: answer,
      };
      setRevealingMessageId(assistantMsg.id);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al consultar la IA.");
      if (conversationModeRef.current) resumeConversationListening();
    } finally {
      setLoading(false);
    }
  }

  sendVoiceTurnRef.current = () => {
    void handleSend();
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

  const showChatInput = !physioIntro;

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
          <aside className="relative z-10 flex w-72 flex-col sidebar-panel shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3.5">
              <span className="text-sm font-semibold text-slate-900">Consultas clínicas</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="btn-icon !h-9 !w-9"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <button
                type="button"
                onClick={() => void startNewConsultation()}
                className="new-chat-btn mb-4"
              >
                <span className="new-chat-btn__icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
                Nueva consulta
              </button>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void openConversation(c.id)}
                  className={`sidebar-item mb-1 w-full px-3 py-2.5 text-left text-[13px] font-semibold ${
                    activeId === c.id ? "sidebar-item--active text-slate-900" : "text-slate-700"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <aside
        className={`hidden md:flex ${desktopSidebarOpen ? "w-72" : "w-0"} shrink-0 overflow-hidden border-r border-slate-200/80 sidebar-panel transition-all`}
      >
        <div className="flex w-72 flex-col p-4">
          <button
            type="button"
            onClick={() => void startNewConsultation()}
            className="new-chat-btn mb-4"
          >
            <span className="new-chat-btn__icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
            Nueva consulta
          </button>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {conversations.map((c) => (
              <div key={c.id} className={`sidebar-item group ${activeId === c.id ? "sidebar-item--active" : ""}`}>
                <button
                  type="button"
                  onClick={() => void openConversation(c.id)}
                  className="min-w-0 flex-1 rounded-[14px] px-3 py-2.5 text-left text-[13px] font-semibold text-slate-700"
                >
                  <span className="block truncate">{c.title}</span>
                </button>
                <button
                  type="button"
                  disabled={deletingId === c.id}
                  onClick={() => void deleteConversation(c.id)}
                  className="rounded-xl px-2.5 text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  aria-label="Eliminar"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setDesktopSidebarOpen((o) => !o)}
        className="hidden shrink-0 items-center border-r border-slate-200 bg-white px-1 text-slate-400 hover:bg-slate-50 hover:text-blue-600 md:flex"
        title={desktopSidebarOpen ? "Ocultar" : "Mostrar consultas"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={desktopSidebarOpen ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Mis consultas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <p className="flex-1 truncate text-sm font-semibold text-slate-800">{activeTitle}</p>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={messagesRef}
            onScroll={updateScrollDownVisibility}
            className="scrollbar-thin h-full min-h-0 overflow-y-auto overscroll-contain"
          >
            {physioIntro && !activeId ? (
              <PhysioIntro greeting={INTRO_GREETING} onSkip={skipPhysioIntro} />
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-4 pb-4 sm:space-y-6 sm:px-6 lg:px-8">
                {messages.map((msg, msgIndex) => {
                  const time = formatTime(msg.created_at);
                  const prevUser =
                    msg.role === "assistant"
                      ? [...messages.slice(0, msgIndex)]
                          .reverse()
                          .find((m) => m.role === "user")
                      : undefined;
                  const pruebasFallback = prevUser
                    ? pickIllustratedTestsForPruebasQuery(prevUser.content)
                    : [];
                  return (
                    <div
                      key={msg.id}
                      ref={(el) => {
                        if (el) messageRefs.current.set(msg.id, el);
                        else messageRefs.current.delete(msg.id);
                      }}
                      className={`animate-fade-in-up flex w-full min-w-0 items-start gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
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
                                    PDF
                                  </div>
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={msg.image_url}
                                    alt="Foto clínica"
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
                              animate={revealingMessageId === msg.id}
                              onRevealComplete={() => {
                                if (revealingMessageId === msg.id) {
                                  setRevealingMessageId(null);
                                }
                                updateScrollDownVisibility();
                              }}
                              onRevealTick={updateScrollDownVisibility}
                            >
                              {(visibleText) => (
                                <AssistantMessageWithSources
                                  content={visibleText}
                                  renderBody={(body) => (
                                    <div className="whitespace-pre-wrap break-words">
                                      {renderAssistantContent(
                                        body,
                                        pruebasFallback
                                      )}
                                    </div>
                                  )}
                                />
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
                            <span className="text-[10px] text-slate-400">{time}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading ? (
                  <div className="animate-fade-in-up flex items-start gap-3">
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
                ) : null}
              </div>
            )}
          </div>
          <ScrollToBottomButton visible={showScrollDown} onClick={scrollToBottom} />
        </div>

        {showChatInput ? (
          <form
            onSubmit={(e) => void handleSend(e)}
            className="shrink-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent px-4 pt-2 sm:px-6"
            style={{
              paddingBottom:
                keyboardOverlap > 0
                  ? keyboardOverlap + 8
                  : "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto w-full max-w-3xl">
              {attachedFile ? (
                <div className="mb-2 flex items-center gap-2">
                  {attachedPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={attachedPreview}
                      alt="Vista previa"
                      className="h-14 w-14 rounded-[16px] object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-14 max-w-[70%] items-center gap-2 rounded-[16px] bg-slate-100 px-3 ring-1 ring-slate-200">
                      <span className="truncate text-xs font-semibold text-slate-700">
                        {attachedFile.name}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={clearAttachment}
                    disabled={loading}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
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
                      void handleSend();
                    }
                  }}
                  rows={1}
                  placeholder={
                    conversationMode
                      ? listening
                        ? "Te escucho…"
                        : "Conversación activa…"
                      : "Pregunta clínica…"
                  }
                  className="chat-composer__input min-w-0 flex-1 basis-0"
                  disabled={loading || conversationMode}
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
                      type="submit"
                      disabled={loading}
                      onClick={() => {
                        stopMic();
                        cancelSpeech();
                      }}
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
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
