"use client";

import { useState } from "react";
import {
  buildPhysioInviteShareText,
  buildPhysioWhatsAppInviteShareText,
} from "@/lib/physio-invite";

type Props = {
  inviteLink: string | null;
  whatsappInviteLink: string | null;
  inviteCode: string | null;
  codeBusy?: boolean;
  defaultOpen?: boolean;
  onRegenerate?: () => void | Promise<void>;
  title?: string;
  subtitle?: string;
};

const STEPS = [
  {
    title: "Comparte el enlace",
    body: "Envíaselo al paciente por WhatsApp, SMS o email.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 0 6.364l-3.75 3.75a4.5 4.5 0 0 1-6.364-6.364l1.5-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.81 15.312a4.5 4.5 0 0 1 0-6.364l3.75-3.75a4.5 4.5 0 0 1 6.364 6.364l-1.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Abre y pone su nombre",
    body: "Entra directo a la consulta previa. Sin escribir ningún código.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 0 1 15 0" />
      </svg>
    ),
  },
  {
    title: "Recibes el informe",
    body: "Cuando termine, el informe aparece en tu panel.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5v.75m3-1.5v1.5m3-3v3m-9.75 3h13.5A2.25 2.25 0 0 0 21 18.75V8.25A2.25 2.25 0 0 0 18.75 6H9.75A2.25 2.25 0 0 0 7.5 8.25v10.5A2.25 2.25 0 0 0 9.75 21Z" />
      </svg>
    ),
  },
];

export function VinculacionInviteCard({
  inviteLink,
  whatsappInviteLink,
  inviteCode,
  codeBusy = false,
  defaultOpen = false,
  onRegenerate,
  title = "Vinculación",
  subtitle = "Enlace de consulta previa para pacientes",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [moreOpen, setMoreOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "wa" | "code" | null>(null);

  async function markCopied(kind: "link" | "wa" | "code") {
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function copy(kind: "link" | "wa" | "code", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      await markCopied(kind);
    } catch {
      /* ignore */
    }
  }

  async function share(kind: "web" | "wa") {
    const url = kind === "wa" ? whatsappInviteLink : inviteLink;
    if (!url) return;
    setMoreOpen(false);
    const shareText =
      kind === "wa"
        ? buildPhysioWhatsAppInviteShareText()
        : buildPhysioInviteShareText();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title:
            kind === "wa"
              ? "AIKinora — consulta previa por WhatsApp"
              : "AIKinora — consulta previa",
          text: `${shareText}\n${url}`,
          url,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    await copy(kind === "wa" ? "wa" : "link", url);
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (open) setMoreOpen(false);
        }}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-blue-600 px-4 py-4 text-left text-white hover:bg-blue-700"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h4.5v4.5h-4.5V4.5Zm6 0h4.5v4.5h-4.5V4.5Zm6 0h4.5v4.5h-4.5V4.5Zm-12 6h4.5v4.5h-4.5v-4.5Zm6 0h4.5v4.5h-4.5v-4.5Zm6 0h4.5v4.5h-4.5v-4.5Zm-12 6h4.5v4.5h-4.5v-4.5Zm6 0h4.5v4.5h-4.5v-4.5Zm6 0h4.5v4.5h-4.5v-4.5Z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold tracking-tight">
              {title}
            </span>
            <span className="mt-0.5 block truncate text-xs font-medium text-blue-100">
              {subtitle}
            </span>
          </span>
        </div>
        <span className="text-blue-100" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <section className="mt-2.5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {step.icon}
                </span>
                <span>
                  <span className="block text-sm font-bold text-neutral-900">
                    {i + 1}. {step.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-neutral-500">
                    {step.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-4 min-h-14 rounded-xl border border-neutral-200 bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              Tu enlace (con código incluido)
            </p>
            {inviteLink ? (
              <p className="mt-1 break-all font-mono text-xs leading-relaxed text-neutral-800">
                {inviteLink}
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">Generando…</p>
            )}
          </div>

          <button
            type="button"
            disabled={!inviteLink || codeBusy}
            onClick={() => void share("web")}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {copied === "link"
              ? "Enlace copiado"
              : "Compartir enlace de consulta previa"}
          </button>

          {whatsappInviteLink ? (
            <button
              type="button"
              disabled={codeBusy}
              onClick={() => void share("wa")}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 hover:bg-green-100 disabled:opacity-50"
            >
              {copied === "wa" ? "Enlace WhatsApp listo" : "Compartir por WhatsApp"}
            </button>
          ) : null}

          <button
            type="button"
            disabled={!inviteCode && !codeBusy}
            onClick={() => setMoreOpen((v) => !v)}
            className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-bold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            Más opciones {moreOpen ? "▴" : "▾"}
          </button>

          {moreOpen && inviteCode ? (
            <div className="mt-2 overflow-hidden rounded-xl border border-neutral-200">
              {inviteLink ? (
                <button
                  type="button"
                  className="block min-h-11 w-full px-3.5 py-3 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                  onClick={() => {
                    setMoreOpen(false);
                    void copy("link", inviteLink);
                  }}
                >
                  {copied === "link" ? "Enlace copiado" : "Copiar enlace web"}
                </button>
              ) : null}
              {whatsappInviteLink ? (
                <button
                  type="button"
                  className="block min-h-11 w-full border-t border-neutral-100 px-3.5 py-3 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                  onClick={() => {
                    setMoreOpen(false);
                    void copy("wa", whatsappInviteLink);
                  }}
                >
                  {copied === "wa"
                    ? "Enlace WhatsApp copiado"
                    : "Copiar enlace WhatsApp"}
                </button>
              ) : null}
              <button
                type="button"
                className="block min-h-11 w-full border-t border-neutral-100 px-3.5 py-3 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                onClick={() => {
                  setMoreOpen(false);
                  void copy("code", inviteCode);
                }}
              >
                {copied === "code"
                  ? "Código copiado"
                  : "Copiar código (solo si hace falta)"}
              </button>
              {onRegenerate ? (
                <button
                  type="button"
                  disabled={codeBusy}
                  className="block min-h-11 w-full border-t border-neutral-100 px-3.5 py-3 text-left text-sm font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                  onClick={() => {
                    setMoreOpen(false);
                    void onRegenerate();
                  }}
                >
                  {codeBusy ? "Generando…" : "Generar código nuevo"}
                </button>
              ) : null}
            </div>
          ) : null}

          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            El paciente no escribe el código: va dentro del enlace. Si regeneras
            el código, solo cambia el enlace para pacientes nuevos.
          </p>
        </section>
      ) : null}
    </div>
  );
}
