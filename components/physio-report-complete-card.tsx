"use client";

import Link from "next/link";
import { physioDisplayName } from "@/lib/physio-linked-welcome";

type Props = {
  physioName?: string | null;
  clinicName?: string | null;
  guestMode?: boolean;
};

export function PhysioReportCompleteCard({
  physioName,
  clinicName,
  guestMode = false,
}: Props) {
  const name = physioDisplayName(physioName);
  const subtitle = clinicName?.trim()
    ? `${name} · ${clinicName.trim()}`
    : name;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-[var(--shadow-elevated)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          ¡Gracias por tu tiempo!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <span className="font-semibold text-slate-800">{subtitle}</span> ya ha
          recibido toda la información sobre tu molestia y podrá prepararse mejor
          para tu tratamiento.
        </p>
        {guestMode ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Si quieres seguir hablando con la IA, crea una cuenta.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Crear cuenta
            </Link>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Si quieres seguir usando la IA (dudas, orientación, ejercicios…), abre
              la pestaña <span className="font-semibold text-slate-700">Consulta</span>.
            </p>
            <Link
              href="/consulta"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Ir a Consulta
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
