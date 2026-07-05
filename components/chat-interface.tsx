"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; created_at: string };

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";

const bodyAreas = ["Hombro","Codo","Muñeca / Mano","Espalda alta","Espalda baja","Cadera","Rodilla","Tobillo / Pie","Cuello","Otro"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function ChatInterface() {
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Conversations list
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<"form" | "chat">("form");

  // Form state
  const [area, setArea] = useState("");
  const [onset, setOnset] = useState("");
  const [pain, setPain] = useState(5);
  const [hadTrauma, setHadTrauma] = useState<"No" | "Sí">("No");
  const [traumaDetail, setTraumaDetail] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Chat state
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    setConversations((data as Conversation[]) ?? []);
  }

  async function loadConversation(id: string) {
    setActiveId(id);
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
    setView("chat");
    setLoading(false);
  }

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async function callAI(
    bodyArea: string,
    onsetType: string,
    painLevel: number,
    hadTraumaVal: string,
    desc: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const session = await getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({
        bodyArea,
        onsetType,
        painLevel,
        hadTrauma: hadTraumaVal,
        description: desc,
        conversationHistory: history,
      }),
    });
    if (!res.ok) throw new Error("Error en la IA");
    const data = await res.json() as { answer: string };
    return data.answer;
  }

  async function handleFormSubmit() {
    setFormError(null);
    if (!area) { setFormError("Selecciona la zona del cuerpo."); return; }
    if (!onset.trim()) { setFormError("Describe cómo y cuándo empezó."); return; }
    if (hadTrauma === "Sí" && !traumaDetail.trim()) {
      setFormError("Describe el golpe o gesto brusco."); return;
    }
    setLoading(true);

    const hadTraumaVal = hadTrauma === "No" ? "No" : `Sí: ${traumaDetail.trim()}`;
    const userContent = [
      `Zona afectada: ${area}`,
      `Cómo empezó: ${onset.trim()}`,
      `Nivel de dolor: ${pain}/10`,
      `Traumatismo: ${hadTraumaVal}`,
      description.trim() ? `Detalles: ${description.trim()}` : "",
    ].filter(Boolean).join("\n");

    try {
      // Create conversation
      const { data: conv } = await supabase
        .from("conversations")
        .insert({ title: `${area} — ${new Date().toLocaleDateString("es-ES")}` })
        .select("id, title, created_at")
        .single();

      if (!conv) throw new Error("No se pudo crear la consulta.");

      // Save user message
      const { data: userMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: conv.id, role: "user", content: userContent })
        .select("id, role, content")
        .single();

      // Get AI response
      const aiText = await callAI(area, onset.trim(), pain, hadTraumaVal, description.trim(), []);

      // Save AI message
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: conv.id, role: "assistant", content: aiText })
        .select("id, role, content")
        .single();

      // Also save to consultas table for admin view
      await supabase.from("consultas").insert({
        body_area: area,
        started_when: onset.trim() || "No especificado",
        onset_type: onset.trim() || "No especificado",
        pain_level: pain,
        had_trauma: hadTraumaVal,
        description: description.trim() || null,
      });

      setConversations((prev) => [conv as Conversation, ...prev]);
      setActiveId(conv.id);
      setMessages([
        userMsg as Message,
        aiMsg as Message,
      ]);
      setView("chat");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!input.trim() || !activeId || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    // Optimistic add
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, role: "user", content: text }]);

    try {
      // Save user message
      await supabase.from("messages").insert({
        conversation_id: activeId,
        role: "user",
        content: text,
      });

      // Build history for context (last 8 messages)
      const history = messages
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      // Get AI response (use text as the follow-up question, no form fields)
      const session = await getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          bodyArea: "seguimiento",
          onsetType: text,
          painLevel: 0,
          hadTrauma: "No",
          description: "",
          conversationHistory: history,
        }),
      });

      const aiData = await res.json() as { answer: string };
      const aiText = aiData.answer;

      // Save AI message
      const { data: aiMsg } = await supabase
        .from("messages")
        .insert({ conversation_id: activeId, role: "assistant", content: aiText })
        .select("id, role, content")
        .single();

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== tempId)
          .concat([
            { id: `user-${Date.now()}`, role: "user", content: text },
            aiMsg as Message,
          ])
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setLoading(false);
    }
  }

  function startNewConsultation() {
    setActiveId(null);
    setMessages([]);
    setArea(""); setOnset(""); setPain(5); setHadTrauma("No");
    setTraumaDetail(""); setDescription(""); setFormError(null);
    setView("form");
  }

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} shrink-0 overflow-hidden border-r border-blue-100 bg-white transition-all duration-200`}
      >
        <div className="flex h-full w-64 flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Consultas</h2>
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
              <p className="text-xs text-slate-400 px-1 py-2">
                Aún no tienes consultas guardadas.
              </p>
            )}
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => loadConversation(c.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                  activeId === c.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-blue-50"
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
      </aside>

      {/* Toggle sidebar button */}
      <button
        type="button"
        onClick={() => setSidebarOpen((o) => !o)}
        className="shrink-0 border-r border-blue-100 bg-white px-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title={sidebarOpen ? "Ocultar" : "Mostrar consultas"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={sidebarOpen ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {view === "form" ? (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-xl">
              <h1 className="mb-1 text-2xl font-bold text-slate-800">Nueva consulta</h1>
              <p className="mb-8 text-sm text-slate-500 leading-relaxed">
                Describe tus síntomas. La IA analizará tu caso y podrás continuar
                la conversación con más preguntas.
              </p>

              {/* Body area chips */}
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Zona del cuerpo
              </label>
              <div className="mb-6 flex flex-wrap gap-2">
                {bodyAreas.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setArea(a)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      area === a
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>

              {/* Onset */}
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ¿Cómo y cuándo empezó?
              </label>
              <textarea
                value={onset}
                onChange={(e) => setOnset(e.target.value)}
                placeholder="Ej: Hace 3 días jugando al fútbol, de repente…"
                rows={3}
                className="mb-6 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />

              {/* Pain level */}
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nivel de dolor: <span className="text-blue-600">{pain}/10</span>
              </label>
              <input
                type="range" min={1} max={10} value={pain}
                onChange={(e) => setPain(Number(e.target.value))}
                className="mb-6 w-full accent-blue-600"
              />

              {/* Trauma */}
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ¿Hubo golpe, caída o gesto brusco?
              </label>
              <div className="mb-4 flex gap-3">
                {(["No", "Sí"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setHadTrauma(v)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      hadTrauma === v
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {hadTrauma === "Sí" && (
                <textarea
                  value={traumaDetail}
                  onChange={(e) => setTraumaDetail(e.target.value)}
                  placeholder="Describe el golpe, caída o gesto brusco"
                  rows={2}
                  className="mb-6 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              )}

              {/* Description */}
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Información adicional (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cualquier detalle adicional…"
                rows={3}
                className="mb-6 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />

              {formError && (
                <p className="mb-4 text-sm text-red-600">{formError}</p>
              )}

              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Analizando…" : "Enviar consulta"}
              </button>
            </div>
          </div>
        ) : (
          /* Chat view */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      IA
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-blue-100 text-slate-800 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === "assistant" && (
                      <p className="mt-2 text-xs text-slate-400">
                        ⚠️ Orientación informativa, no diagnóstico médico.
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    IA
                  </div>
                  <div className="rounded-2xl rounded-bl-sm border border-blue-100 bg-white px-4 py-3 shadow-sm">
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

            {/* Input bar */}
            <div className="border-t border-blue-100 bg-white px-4 py-3">
              <div className="mx-auto flex max-w-3xl items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Escribe tu pregunta… (Enter para enviar)"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-blue-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
