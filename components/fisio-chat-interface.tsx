"use client";

import { AssistantMessageWithSources } from "@/components/assistant-message-with-sources";
import { PhysioAvatar } from "@/components/physio-avatar";
import { PhysioIntro } from "@/components/physio-intro";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom-button";
import { StreamingAssistantMessage } from "@/components/streaming-assistant-message";
import { PHOTO_ONLY_CAPTION, uploadConsultPhoto } from "@/lib/consult-photo";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";

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
  "Hola. Soy Physio, el asistente clínico de Kinora para fisioterapeutas. Pregúntame por diferenciales, maniobras (Neer, Hawkins, Lachman, Spurling…), interpretación de hallazgos o criterio de imagen.";

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

function renderAssistantContent(content: string) {
  return content.split("\n").map((line, li) => (
    <p key={li} className={li > 0 ? "mt-2" : undefined}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  ));
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
    setActiveId(id);
    setActiveTitle(conv.title);
    setMessages((msgs as Message[]) ?? []);
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
    const text = input.trim() || (attachedFile ? PHOTO_ONLY_CAPTION : "");
    if ((!text && !attachedFile) || loading) return;
    setInput("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada.");

      const imageUrl = await uploadOutgoingPhoto();

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
        image_url: imageUrl ?? null,
      };
      const { data: savedUser } = await supabase
        .from("messages")
        .insert(userMsg)
        .select("id, role, content, created_at, image_url")
        .single();

      const uiMessages: Message[] = [
        ...(messages.length === 0 ? [welcomeMessage()] : messages),
        (savedUser as Message) ?? {
          id: crypto.randomUUID(),
          role: "user",
          content: text,
          image_url: imageUrl,
        },
      ];
      setMessages(uiMessages);

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
    } finally {
      setLoading(false);
    }
  }

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
          <aside className="relative z-10 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-bold text-slate-900">Consultas clínicas</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <button
                type="button"
                onClick={() => void startNewConsultation()}
                className="mb-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white"
              >
                + Nueva consulta
              </button>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void openConversation(c.id)}
                  className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${
                    activeId === c.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"
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
        className={`hidden md:flex ${desktopSidebarOpen ? "w-72" : "w-0"} shrink-0 overflow-hidden border-r border-slate-200 bg-white transition-all`}
      >
        <div className="flex w-72 flex-col p-3">
          <button
            type="button"
            onClick={() => void startNewConsultation()}
            className="mb-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Nueva consulta
          </button>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {conversations.map((c) => (
              <div key={c.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void openConversation(c.id)}
                  className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-left text-sm ${
                    activeId === c.id
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="block truncate">{c.title}</span>
                </button>
                <button
                  type="button"
                  disabled={deletingId === c.id}
                  onClick={() => void deleteConversation(c.id)}
                  className="rounded-lg p-1.5 text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
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
          <button
            type="button"
            onClick={() => void startNewConsultation()}
            className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            + Nueva
          </button>
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
                {messages.map((msg) => {
                  const time = formatTime(msg.created_at);
                  return (
                    <div
                      key={msg.id}
                      ref={(el) => {
                        if (el) messageRefs.current.set(msg.id, el);
                        else messageRefs.current.delete(msg.id);
                      }}
                      className={`animate-fade-in-up flex items-start gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-100">
                          <PhysioAvatar size={36} />
                        </div>
                      )}
                      <div
                        className={`flex max-w-[92%] flex-col sm:max-w-[85%] ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
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
                                  alt="Foto clínica"
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
                                    <div className="whitespace-pre-wrap">
                                      {renderAssistantContent(body)}
                                    </div>
                                  )}
                                />
                              )}
                            </StreamingAssistantMessage>
                          )}
                        </div>
                        {time ? (
                          <span className="mt-1 text-[10px] text-slate-400">{time}</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {loading ? (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-100">
                      <PhysioAvatar size={36} />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-[var(--shadow-card)]">
                      Pensando…
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
            className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 sm:px-4"
          >
            <div className="mx-auto max-w-3xl">
              {attachedPreview ? (
                <div className="mb-2 flex items-center gap-2">
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
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Quitar foto
                  </button>
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Pregunta clínica… (p. ej. diferencial hombro con Hawkins +)"
                  className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  disabled={loading}
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
                  title="Adjuntar foto"
                  aria-label="Adjuntar foto"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !attachedFile)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                  aria-label="Enviar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
