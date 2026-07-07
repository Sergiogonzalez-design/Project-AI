"use client";

import {
  ConsultaAdaptiveShoulder,
  isLastShoulderSection,
} from "@/components/consulta-adaptive-shoulder";
import { ConsultaGenericFields } from "@/components/consulta-generic-fields";
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
  validateShoulderAdaptive,
  validateShoulderSection,
  type ShoulderAdaptiveAnswers,
} from "@/lib/consulta-shoulder-adaptive";
import {
  questionnaireForText,
  questionnaireIntroMessage,
} from "@/lib/detect-body-part";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; created_at: string };
type Phase = "intro" | "questionnaire" | "followup";

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";
const WELCOME_MESSAGE = "¿Qué te duele? Cuéntanos en detalle qué te pasa.";
const WELCOME_ID = "welcome";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function welcomeMessage(): Message {
  return { id: WELCOME_ID, role: "assistant", content: WELCOME_MESSAGE };
}

function renderAssistantContent(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold text-blue-700">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function ChatInterface() {
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("Nueva consulta");
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [initialMessage, setInitialMessage] = useState("");
  const [questionnairePart, setQuestionnairePart] = useState<BodyPartId | "generic">("shoulder");
  const [shoulderAnswers, setShoulderAnswers] = useState<ShoulderAdaptiveAnswers>(
    defaultShoulderAdaptiveAnswers
  );
  const [genericAnswers, setGenericAnswers] = useState<GenericConsultaAnswers>(
    defaultGenericConsultaAnswers
  );
  const [shoulderSectionIndex, setShoulderSectionIndex] = useState(0);
  const [shoulderSectionError, setShoulderSectionError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, phase]);

  async function loadConversations() {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    setConversations((data as Conversation[]) ?? []);
  }

  async function loadConversation(id: string, title: string) {
    setActiveId(id);
    setActiveTitle(title);
    setLoading(true);
    setMobileSidebarOpen(false);
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
    setPhase("followup");
    setLoading(false);
  }

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async function callAI(body: Record<string, unknown>): Promise<string> {
    const session = await getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error en la IA");
    const data = (await res.json()) as { answer: string };
    return data.answer;
  }

  function conversationTitleFromText(text: string): string {
    const short = text.trim().slice(0, 40);
    return short.length < text.trim().length ? `${short}…` : short;
  }

  function buildSymptomContext(): string {
    const introBlock = `Descripción inicial del paciente:\n${initialMessage}`;
    if (questionnairePart === "shoulder") {
      return [introBlock, "", formatShoulderAdaptive(shoulderAnswers, introBlock)].join("\n");
    }
    return formatGenericConsulta(genericAnswers, introBlock);
  }

  async function handleIntroSubmit() {
    if (!input.trim() || loading || phase !== "intro") return;
    const text = input.trim();
    setInput("");

    const { part } = questionnaireForText(text);
    const introBotMsg = questionnaireIntroMessage(part);

    setInitialMessage(text);
    setQuestionnairePart(part);
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setShoulderSectionError(null);

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: text },
      { id: `q-intro-${Date.now()}`, role: "assistant", content: introBotMsg },
    ]);
    setPhase("questionnaire");
  }

  async function handleQuestionnaireSubmit() {
    if (loading) return;

    if (questionnairePart === "shoulder") {
      const sections = getVisibleShoulderSections(shoulderAnswers);
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const sectionErr = validateShoulderSection(lastSection, shoulderAnswers);
        if (sectionErr) {
          setShoulderSectionError(sectionErr);
          setShoulderSectionIndex(sections.length - 1);
          return;
        }
      }
      const err = validateShoulderAdaptive(shoulderAnswers);
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
    const { part, detected } = questionnaireForText(initialMessage);
    const areaLabel =
      part === "shoulder"
        ? "Hombro"
        : detected.length > 0
          ? detected.map((p) => bodyPartLabel(p)).join(", ")
          : conversationTitleFromText(initialMessage);
    const painLevel =
      questionnairePart === "shoulder"
        ? shoulderAnswers.intensidad_dolor
        : genericAnswers.intensidad_dolor;
    const onsetType =
      questionnairePart === "shoulder"
        ? `${shoulderAnswers.inicio} — ${shoulderAnswers.evolucion}. Mecanismo: ${shoulderAnswers.mecanismo}`
        : `${genericAnswers.inicio} — ${genericAnswers.evolucion}. Mecanismo: ${genericAnswers.mecanismo}`;
    const hadTraumaVal =
      questionnairePart === "shoulder"
        ? shoulderAnswers.mecanismo === "Caída" || shoulderAnswers.mecanismo === "Golpe directo"
          ? `Sí: ${shoulderAnswers.mecanismo}`
          : "No"
        : genericAnswers.mecanismo === "Caída" || genericAnswers.mecanismo === "Golpe directo"
          ? `Sí: ${genericAnswers.mecanismo}`
          : "No";
    const redFlagsUrgent =
      questionnairePart === "shoulder"
        ? detectRedFlags(shoulderAnswers).urgent
        : genericAnswers.rf_deformidad === "Sí" ||
          genericAnswers.rf_fiebre === "Sí" ||
          genericAnswers.rf_perdida_sensibilidad === "Sí";
    const contextForAi = redFlagsUrgent
      ? `⚠️ PRIORIDAD ALTA — BANDERAS ROJAS DETECTADAS\n\n${symptomContext}`
      : symptomContext;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      const title = `${areaLabel} — ${new Date().toLocaleDateString("es-ES")}`;
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({ title, user_id: user.id })
        .select("id, title, created_at")
        .single();
      if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");

      await supabase.from("messages").insert({
        conversation_id: conv.id,
        role: "assistant",
        content: WELCOME_MESSAGE,
      });
      for (const msg of messages) {
        if (msg.id === WELCOME_ID) continue;
        await supabase.from("messages").insert({
          conversation_id: conv.id,
          role: msg.role,
          content: msg.content,
        });
      }

      const aiText = await callAI({
        bodyArea: areaLabel,
        onsetType,
        painLevel,
        hadTrauma: hadTraumaVal,
        description: initialMessage,
        symptomContext: contextForAi,
        conversationHistory: [],
      });

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
          generic: questionnairePart === "generic" ? genericAnswers : null,
          redFlagsUrgent,
        },
      });

      setActiveId(conv.id);
      setActiveTitle(title);
      setConversations((prev) => [conv as Conversation, ...prev]);
      setMessages((prev) => [...prev, aiMsg as Message]);
      setPhase("followup");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al analizar tu caso.");
    } finally {
      setLoading(false);
      setLoadingModal(false);
    }
  }

  async function handleFollowupSubmit() {
    if (!input.trim() || loading || phase !== "followup" || !activeId) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    const tempUserId = `temp-user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempUserId, role: "user", content: text }]);

    try {
      await supabase.from("messages").insert({
        conversation_id: activeId,
        role: "user",
        content: text,
      });

      const conversationHistory = messages
        .filter(
          (m) =>
            m.id !== WELCOME_ID &&
            !m.id.startsWith("q-intro") &&
            !m.id.startsWith("temp-")
        )
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const aiText = await callAI({
        bodyArea: "seguimiento",
        onsetType: text,
        painLevel: 0,
        hadTrauma: "No",
        description: "",
        conversationHistory,
      });

      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: activeId, role: "assistant", content: aiText })
        .select("id, role, content")
        .single();

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== tempUserId)
          .concat([
            { id: `user-${Date.now()}`, role: "user", content: text },
            aiMsg as Message,
          ])
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserId));
    } finally {
      setLoading(false);
    }
  }

  function startNewConsultation() {
    setActiveId(null);
    setActiveTitle("Nueva consulta");
    setMessages([welcomeMessage()]);
    setPhase("intro");
    setInitialMessage("");
    setQuestionnairePart("shoulder");
    setShoulderAnswers(defaultShoulderAdaptiveAnswers());
    setGenericAnswers(defaultGenericConsultaAnswers());
    setShoulderSectionIndex(0);
    setShoulderSectionError(null);
    setInput("");
    setMobileSidebarOpen(false);
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Mis consultas</h2>
        <button
          type="button"
          onClick={startNewConsultation}
          className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
        >
          + Nueva
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1">
        {conversations.length === 0 && (
          <p className="px-1 py-3 text-xs text-slate-400">Aún no tienes consultas guardadas.</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => loadConversation(c.id, c.title)}
            className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
              activeId === c.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50"
            }`}
          >
            <p className="truncate font-medium">{c.title}</p>
            <p className={`mt-0.5 ${activeId === c.id ? "text-blue-200" : "text-slate-400"}`}>
              {formatDate(c.created_at)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const showChatInput = phase === "intro" || phase === "followup";
  const inputPlaceholder =
    phase === "intro" ? "Cuéntanos qué te pasa…" : "Escribe tu pregunta…";
  const onSend = phase === "intro" ? handleIntroSubmit : handleFollowupSubmit;

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50" style={{ height: "calc(100dvh - 64px)" }}>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3">
              <span className="text-sm font-bold text-slate-700">Consultas</span>
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
        className={`hidden md:flex ${desktopSidebarOpen ? "w-64" : "w-0"} shrink-0 overflow-hidden border-r border-blue-100 bg-white transition-all duration-200`}
      >
        <div className="w-64">
          <SidebarContent />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setDesktopSidebarOpen((o) => !o)}
        className="hidden md:flex shrink-0 items-center border-r border-blue-100 bg-white px-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title={desktopSidebarOpen ? "Ocultar" : "Mostrar consultas"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={desktopSidebarOpen ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <div className="flex items-center gap-3 border-b border-blue-100 bg-white px-4 py-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 md:hidden"
            aria-label="Mis consultas"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <p className="flex-1 truncate text-sm font-semibold text-slate-700">{activeTitle}</p>
          <button
            type="button"
            onClick={startNewConsultation}
            className="shrink-0 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            + Nueva
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div
            className={`mx-auto max-w-3xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 ${
              phase === "questionnaire" ? "pb-28" : "pb-4"
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    IA
                  </div>
                )}
                <div
                  className={`max-w-[92%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[85%] sm:px-4 sm:py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="whitespace-pre-wrap">{renderAssistantContent(msg.content)}</div>
                  )}
                  {msg.role === "assistant" &&
                    msg.id !== WELCOME_ID &&
                    !msg.id.startsWith("q-intro") &&
                    phase === "followup" && (
                      <p className="mt-2 text-xs text-slate-400">
                        Orientación informativa, no diagnóstico médico.
                      </p>
                    )}
                </div>
              </div>
            ))}

            {phase === "questionnaire" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                {questionnairePart === "shoulder" ? (
                  <>
                    <ConsultaAdaptiveShoulder
                      value={shoulderAnswers}
                      onChange={setShoulderAnswers}
                      sectionIndex={shoulderSectionIndex}
                      onSectionIndexChange={setShoulderSectionIndex}
                      sectionError={shoulderSectionError}
                      onSectionError={setShoulderSectionError}
                    />
                    {isLastShoulderSection(shoulderAnswers, shoulderSectionIndex) && (
                      <button
                        type="button"
                        onClick={handleQuestionnaireSubmit}
                        disabled={loading}
                        className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        Obtener orientación de la IA
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <ConsultaGenericFields value={genericAnswers} onChange={setGenericAnswers} />
                    {shoulderSectionError && (
                      <p className="mb-3 text-sm text-red-600">{shoulderSectionError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleQuestionnaireSubmit}
                      disabled={loading}
                      className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      Obtener orientación de la IA
                    </button>
                  </>
                )}
              </div>
            )}

            {loading && !loadingModal && phase === "followup" && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  IA
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {showChatInput && (
          <div className="shrink-0 border-t border-blue-100 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
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
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-slate-400">
              La IA puede cometer errores. Considera verificar la información importante.
            </p>
          </div>
        )}
      </div>

      {loadingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-800">
              Nuestra IA está analizando tu caso
            </p>
            <p className="mt-2 text-sm text-slate-500">Estaremos contigo en breve.</p>
          </div>
        </div>
      )}
    </div>
  );
}
