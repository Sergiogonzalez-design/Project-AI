"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { THERAPIST } from "@/lib/therapist";

type TherapistMessage = {
  id: string;
  sender_role: "user" | "therapist";
  content: string;
  created_at: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MensajesInterface() {
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TherapistMessage[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const client = createClient();

    async function init() {
      setLoading(true);
      setError(null);

      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        setError("Inicia sesión para ver tus mensajes.");
        setLoading(false);
        return;
      }

      const { data: profile } = await client
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .maybeSingle();
      setIsPremium(profile?.is_premium ?? false);

      let tid: string | null = null;
      const { data: existing } = await client
        .from("therapist_threads")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        tid = existing.id;
      } else {
        const { data: created, error: createErr } = await client
          .from("therapist_threads")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        if (createErr) {
          setError(createErr.message);
          setLoading(false);
          return;
        }
        tid = created.id;
      }

      setThreadId(tid);

      const { data: msgs, error: msgsErr } = await client
        .from("therapist_messages")
        .select("id, sender_role, content, created_at")
        .eq("thread_id", tid)
        .order("created_at", { ascending: true });

      if (msgsErr) {
        setError(msgsErr.message);
      } else {
        setMessages((msgs as TherapistMessage[]) ?? []);
      }

      channel = client
        .channel(`therapist-messages-${tid}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "therapist_messages",
            filter: `thread_id=eq.${tid}`,
          },
          (payload) => {
            const row = payload.new as TherapistMessage;
            setMessages((prev) =>
              prev.some((m) => m.id === row.id) ? prev : [...prev, row]
            );
          }
        )
        .subscribe();

      setLoading(false);
    }

    init();

    return () => {
      if (channel) client.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    if (!input.trim() || !threadId || !isPremium || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    setError(null);

    const { error: sendErr } = await supabase.from("therapist_messages").insert({
      thread_id: threadId,
      sender_role: "user",
      content: text,
    });

    if (sendErr) {
      setError(sendErr.message);
      setInput(text);
    }
    setSending(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>Premium</span>
            <span className="opacity-75">· En desarrollo</span>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Mensajes</h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Canal directo con tu entrenador atlético.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* Therapist card */}
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-lg font-bold text-white">
            {THERAPIST.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800">{THERAPIST.name}</p>
            <p className="text-sm text-blue-600">{THERAPIST.role}</p>
            <p className="mt-1 text-xs text-slate-500">{THERAPIST.bio}</p>
          </div>
        </div>

        {!isPremium && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Función Premium</p>
            <p className="mt-1 text-amber-800">
              Pronto podrás enviar mensajes directos a David. Por ahora puedes leer
              su mensaje de bienvenida y preparar tu consulta.
            </p>
          </div>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        {/* Chat area */}
        <div className="flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {loading ? (
              <p className="text-center text-sm text-slate-400">Cargando conversación…</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No hay mensajes todavía.</p>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender_role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {THERAPIST.initials}
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "border border-blue-100 bg-slate-50 text-slate-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`mt-1.5 text-[10px] ${
                          isUser ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-blue-100 p-3 sm:p-4">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  isPremium
                    ? "Escribe tu mensaje para David…"
                    : "Activa Premium para enviar mensajes"
                }
                rows={1}
                disabled={!isPremium || sending}
                className="flex-1 resize-none rounded-xl border border-blue-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!isPremium || !input.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
