"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; created_at: string };

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function ChatInterface() {
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<"form" | "chat">("form");

  const [area, setArea] = useState("");
  const [onset, setOnset] = useState("");
  const [pain, setPain] = useState(5);
  const [hadTrauma, setHadTrauma] = useState<"No" | "Sí">("No");
  const [traumaDetail, setTraumaDetail] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Desktop: sidebar collapse. Mobile: drawer overlay.
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
    setView("chat");
    setLoading(false);
  }

  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async function callAI(
    bodyArea: string, onsetType: string, painLevel: number,
    hadTraumaVal: string, desc: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const session = await getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
      body: JSON.stringify({ bodyArea, onsetType, painLevel, hadTrauma: hadTraumaVal, description: desc, conversationHistory: history }),
    });
    if (!res.ok) throw new Error("Error en la IA");
    const data = await res.json() as { answer: string };
    return data.answer;
  }

  async function handleFormSubmit() {
    setFormError(null);
    if (!area) { setFormError("Selecciona la zona del cuerpo."); return; }
    if (!onset.trim()) { setFormError("Describe cómo y cuándo empezó."); return; }
    if (hadTrauma === "Sí" && !traumaDetail.trim()) { setFormError("Describe el golpe o gesto brusco."); return; }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
      const title = `${area} — ${new Date().toLocaleDateString("es-ES")}`;
      const { data: conv, error: convErr } = await supabase
        .from("conversations").insert({ title, user_id: user.id }).select("id, title, created_at").single();
      if (!conv) throw new Error(convErr?.message ?? "No se pudo crear la consulta.");

      const { data: userMsg, error: userMsgErr } = await supabase
        .from("messages").insert({ conversation_id: conv.id, role: "user", content: userContent })
        .select("id, role, content").single();
      if (!userMsg) throw new Error(userMsgErr?.message ?? "Error guardando mensaje.");

      const aiText = await callAI(area, onset.trim(), pain, hadTraumaVal, description.trim(), []);

      const { data: aiMsg } = await supabase
        .from("messages").insert({ conversation_id: conv.id, role: "assistant", content: aiText })
        .select("id, role, content").single();

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
      setActiveTitle(title);
      setMessages([userMsg as Message, aiMsg as Message]);
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

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, role: "user", content: text }]);

    try {
      await supabase.from("messages").insert({ conversation_id: activeId, role: "user", content: text });

      const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const session = await getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: JSON.stringify({ bodyArea: "seguimiento", onsetType: text, painLevel: 0, hadTrauma: "No", description: "", conversationHistory: history }),
      });

      const aiData = await res.json() as { answer: string };
      const { data: aiMsg } = await supabase
        .from("messages").insert({ conversation_id: activeId, role: "assistant", content: aiData.answer })
        .select("id, role, content").single();

      setMessages((prev) =>
        prev.filter((m) => m.id !== tempId).concat([
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
    setActiveId(null); setActiveTitle("");
    setMessages([]);
    setArea(""); setOnset(""); setPain(5); setHadTrauma("No");
    setTraumaDetail(""); setDescription(""); setFormError(null);
    setView("form");
    setMobileSidebarOpen(false);
  }

  /* ── Shared sidebar content ── */
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

  return (
    /* Use dynamic viewport height so mobile browsers address bar doesn't cause overflow */
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100dvh - 64px)" }}>

      {/* ── Mobile sidebar drawer overlay ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
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

      {/* ── Desktop sidebar ── */}
      <aside className={`hidden md:flex ${desktopSidebarOpen ? "w-64" : "w-0"} shrink-0 overflow-hidden border-r border-blue-100 bg-white transition-all duration-200`}>
        <div className="w-64">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop sidebar toggle */}
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

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {view === "form" ? (
          <>
            {/* Mobile top bar for form view */}
            <div className="flex items-center gap-3 border-b border-blue-100 bg-white px-4 py-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50"
                aria-label="Mis consultas"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-slate-700">Nueva consulta</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
              <div className="mx-auto max-w-xl">
                <h1 className="mb-1 text-xl font-bold text-slate-800 sm:text-2xl hidden md:block">Nueva consulta</h1>
                <p className="mb-6 text-sm text-slate-500 leading-relaxed hidden md:block">
                  Describe tus síntomas. La IA analizará tu caso y podrás continuar la conversación.
                </p>

                {/* Body area text input */}
                <label className="mb-2 block text-sm font-semibold text-slate-700">Zona del cuerpo</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ej: Hombro derecho, rodilla izquierda, espalda baja…"
                  className="mb-5 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

                <label className="mb-2 block text-sm font-semibold text-slate-700">¿Cómo y cuándo empezó?</label>
                <textarea
                  value={onset} onChange={(e) => setOnset(e.target.value)}
                  placeholder="Ej: Hace 3 días jugando al fútbol, de repente…" rows={3}
                  className="mb-5 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nivel de dolor: <span className="text-blue-600 font-bold">{pain}/10</span>
                </label>
                <input
                  type="range" min={1} max={10} value={pain}
                  onChange={(e) => setPain(Number(e.target.value))}
                  className="mb-5 w-full accent-blue-600"
                />

                <label className="mb-2 block text-sm font-semibold text-slate-700">¿Hubo golpe, caída o gesto brusco?</label>
                <div className="mb-4 flex gap-3">
                  {(["No", "Sí"] as const).map((v) => (
                    <button
                      key={v} type="button" onClick={() => setHadTrauma(v)}
                      className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors ${
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
                    value={traumaDetail} onChange={(e) => setTraumaDetail(e.target.value)}
                    placeholder="Describe el golpe, caída o gesto brusco" rows={2}
                    className="mb-5 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                )}

                <label className="mb-2 block text-sm font-semibold text-slate-700">Información adicional (opcional)</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cualquier detalle adicional…" rows={3}
                  className="mb-5 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

                {formError && <p className="mb-4 text-sm text-red-600">{formError}</p>}

                <button
                  type="button" onClick={handleFormSubmit} disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
                >
                  Enviar consulta
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Chat view */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Chat header (mobile + desktop) */}
            <div className="flex items-center gap-3 border-b border-blue-100 bg-white px-4 py-3 shrink-0">
              {/* Mobile: hamburger to open sidebar */}
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 sm:px-5 sm:py-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      IA
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-blue-100 text-slate-800 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={i} className="font-bold text-blue-700">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </div>
                    )}
                    {msg.role === "assistant" && (
                      <p className="mt-2 text-xs text-slate-400">⚠️ Orientación informativa, no diagnóstico médico.</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">IA</div>
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
            <div className="shrink-0 border-t border-blue-100 bg-white px-3 py-3 sm:px-4 sm:py-3">
              <div className="mx-auto flex max-w-3xl items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                  }}
                  placeholder="Escribe tu pregunta…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-blue-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
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

      {/* ── Loading modal ── */}
      {loading && view === "form" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
            {/* Spinner */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-8 w-8 animate-spin text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
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
            <p className="mt-2 text-sm text-slate-500">
              Estaremos contigo en breve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
