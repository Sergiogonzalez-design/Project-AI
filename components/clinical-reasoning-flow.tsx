"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  applyAnswer,
  advanceFromConclusion,
  countCompletedManiobras,
  createSession,
  getNode,
  getTreeForSession,
  goBack,
  pushStep,
  type ReasoningSession,
} from "@/lib/clinical-reasoning";
import { CLINICAL_TEST_IMAGES } from "@/lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "@/lib/clinical-test-videos";
import { bodyPartLabel } from "@/lib/body-parts";
import { isThighOrHamstringComplaint } from "@/lib/detect-body-part";
import type {
  ClinicalConclusionNode,
  ClinicalHypothesis,
  ClinicalTestNode,
  HypothesisProbability,
} from "@/lib/clinical-reasoning/types";

const PROBABILITY_ORDER: Record<HypothesisProbability, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

function sortHypotheses(hypotheses: ClinicalHypothesis[]): ClinicalHypothesis[] {
  return [...hypotheses].sort(
    (a, b) => PROBABILITY_ORDER[a.probability] - PROBABILITY_ORDER[b.probability]
  );
}

function probabilityBadgeClass(p: HypothesisProbability): string {
  if (p === "alta") return "bg-blue-100 text-blue-800";
  if (p === "media") return "bg-amber-100 text-amber-900";
  return "bg-neutral-100 text-neutral-700";
}

function probabilityLabel(p: HypothesisProbability): string {
  if (p === "alta") return "Alta probabilidad";
  if (p === "media") return "Probabilidad media";
  return "Baja probabilidad";
}

function ClinicalTestVideo({
  src,
  title,
  poster,
}: {
  src: string;
  title: string;
  poster?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-black">
      {failed ? (
        <div className="flex aspect-video w-full items-center justify-center bg-neutral-900 px-4 py-8 text-center text-sm text-neutral-300">
          No se pudo cargar el vídeo demostrativo. Recarga la página o prueba otro
          navegador.
        </div>
      ) : (
        <video
          key={src}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black object-contain"
          aria-label={`Vídeo demostrativo: ${title}`}
          onError={() => setFailed(true)}
        >
          Tu navegador no puede reproducir este vídeo.
        </video>
      )}
    </div>
  );
}

function TestScreen({
  node,
  onAnswer,
}: {
  node: ClinicalTestNode;
  onAnswer: (result: "positive" | "negative") => void;
}) {
  const image = CLINICAL_TEST_IMAGES.find((t) => t.id === node.testId);
  const videoSrc = getClinicalTestVideoSrc(node.testId);
  const isRouteNode = node.testId.startsWith("route-");
  const positiveTitle = isRouteNode ? "Sí" : "Positivo";
  const negativeTitle = isRouteNode ? "No" : "Negativo";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">{node.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          {node.description}
        </p>
        {node.evidenceNote ? (
          <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-900">
            {node.evidenceNote}
          </p>
        ) : null}
      </div>

      {!isRouteNode && (image || videoSrc) ? (
        <div className="flex flex-col gap-4">
          {!isRouteNode && image ? (
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <Image
                src={image.src}
                alt={image.title}
                width={640}
                height={360}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          ) : null}

          {!isRouteNode && videoSrc ? (
            <ClinicalTestVideo
              src={videoSrc}
              title={node.title}
              poster={image?.src}
            />
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAnswer("positive")}
          className="rounded-2xl bg-emerald-600 px-6 py-5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          {positiveTitle}
          {node.positive.label ? (
            <span className="mt-1 block text-sm font-normal text-emerald-100">
              {node.positive.label}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onAnswer("negative")}
          className="rounded-2xl bg-neutral-800 px-6 py-5 text-base font-semibold text-white shadow-sm transition hover:bg-neutral-900 active:scale-[0.99]"
        >
          {negativeTitle}
          {node.negative.label ? (
            <span className="mt-1 block text-sm font-normal text-neutral-300">
              {node.negative.label}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

function hypothesisCardClass(p: HypothesisProbability, isFinal: boolean): string {
  const base = isFinal
    ? "rounded-xl border-2 bg-white px-4 py-3.5 shadow-sm"
    : "rounded-xl border bg-white px-4 py-3 shadow-sm";
  const accent =
    p === "alta"
      ? "border-blue-200 border-l-4 border-l-blue-500"
      : p === "media"
        ? "border-amber-200 border-l-4 border-l-amber-400"
        : "border-neutral-200 border-l-4 border-l-neutral-400";
  return `${base} ${accent}`;
}

function ConclusionScreen({
  node,
  onContinue,
  canContinue,
  hadPriorManiobra,
}: {
  node: ClinicalConclusionNode;
  onContinue: () => void;
  canContinue: boolean;
  hadPriorManiobra: boolean;
}) {
  const isFinal = !canContinue;
  const continueLabel = hadPriorManiobra
    ? "Continuar con otra maniobra →"
    : "Continuar con maniobra →";
  const continueHint = hadPriorManiobra
    ? "Continúa con otra maniobra para afinar el razonamiento diferencial."
    : "Continúa con una maniobra para afinar el razonamiento diferencial.";

  return (
    <div className="flex flex-col gap-5">
      {isFinal ? (
        <div className="overflow-hidden rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-600 via-blue-600 to-emerald-600 px-5 py-4 text-white shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100">
            Conclusión clínica final
          </p>
          <p className="mt-1.5 text-base font-semibold leading-snug">
            Secuencia exploratoria concluida — hipótesis más probables según los
            hallazgos registrados
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 px-4 py-3">
          <p className="text-xs font-semibold text-blue-800">
            Conclusión parcial
          </p>
          <p className="mt-0.5 text-sm text-blue-700/90">{continueHint}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-neutral-900">{node.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{node.summary}</p>
      </div>

      <div
        className={`space-y-3 rounded-2xl p-4 ${
          isFinal
            ? "border-2 border-blue-200 bg-gradient-to-b from-blue-50 via-white to-emerald-50/80 shadow-inner"
            : "border border-blue-100 bg-blue-50/50"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-blue-200/80 pb-2.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
              isFinal ? "bg-blue-600" : "bg-blue-500"
            }`}
            aria-hidden
          >
            ?
          </span>
          <h3
            className={`uppercase tracking-wide text-blue-800 ${
              isFinal ? "text-sm font-extrabold" : "text-xs font-bold"
            }`}
          >
            Hipótesis orientativas
          </h3>
        </div>
        {sortHypotheses(node.hypotheses).map((h) => (
          <div key={h.name} className={hypothesisCardClass(h.probability, isFinal)}>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`font-semibold text-neutral-900 ${isFinal ? "text-base" : ""}`}>
                {h.name}
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${probabilityBadgeClass(h.probability)}`}
              >
                {probabilityLabel(h.probability)}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{h.rationale}</p>
          </div>
        ))}
      </div>

      {canContinue ? (
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary w-full justify-center py-3.5 text-base shadow-md"
        >
          {continueLabel}
        </button>
      ) : (
        <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 px-5 py-4 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white"
              aria-hidden
            >
              ✓
            </span>
            Exploración concluida
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            No quedan maniobras en esta secuencia. Puedes retroceder para revisar
            hallazgos o cerrar y contrastar con el informe completo.
          </p>
        </div>
      )}
    </div>
  );
}

export function ClinicalReasoningFlow({
  patientId,
  patientName,
  reportId,
  bodyArea,
  physioReport,
}: {
  patientId: string;
  patientName: string | null;
  reportId: string;
  bodyArea: string | null;
  physioReport: string;
}) {
  const initialSession = useMemo(
    () =>
      createSession({
        reportId,
        bodyArea,
        physioReport,
      }),
    [reportId, bodyArea, physioReport]
  );

  const [session, setSession] = useState<ReasoningSession | null>(initialSession);

  const tree = session ? getTreeForSession(session) : null;
  const currentNode =
    session && tree ? getNode(tree, session.currentNodeId) : null;

  const backHref = `/fisio/patients/${patientId}${
    patientName ? `?name=${encodeURIComponent(patientName)}` : ""
  }`;

  const handleAnswer = useCallback(
    (result: "positive" | "negative") => {
      if (!session || !tree || !currentNode || currentNode.type !== "test") return;
      const nextId = applyAnswer(tree, currentNode.id, result);
      if (!nextId) return;
      setSession(pushStep(session, nextId, result));
    },
    [session, tree, currentNode]
  );

  const handleContinue = useCallback(() => {
    if (!session || !tree || !currentNode || currentNode.type !== "conclusion") return;
    const nextId = advanceFromConclusion(tree, currentNode.id);
    if (!nextId) return;
    setSession(pushStep(session, nextId));
  }, [session, tree, currentNode]);

  const handleBackStep = useCallback(() => {
    setSession((prev) => (prev ? goBack(prev) : prev));
  }, []);

  if (!initialSession || !session || !tree || !currentNode) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link href={backHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Volver al informe
        </Link>
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-5 py-8 text-center">
          <p className="text-sm text-neutral-600">
            No hay un flujo de razonamiento clínico disponible para esta consulta.
          </p>
        </div>
      </main>
    );
  }

  const stepNumber = session.steps.length;
  const canContinue =
    currentNode.type === "conclusion" &&
    Boolean(currentNode.nextNodeId && tree.nodes[currentNode.nextNodeId]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href={backHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
        ← Volver al informe
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Razonamiento clínico por pruebas
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            {bodyArea && isThighOrHamstringComplaint(bodyArea)
              ? `Razonamiento clínico — ${bodyArea}`
              : tree.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {patientName ? `${patientName} · ` : ""}
            {bodyArea || bodyPartLabel(session.bodyPart)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
          Paso {stepNumber}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-neutral-500">
        Secuencia interactiva de pruebas especiales según el informe. Los
        hallazgos orientan hipótesis probables — no sustituyen el juicio clínico
        ni pruebas complementarias.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-5 py-6 shadow-sm">
        {currentNode.type === "test" ? (
          <TestScreen node={currentNode} onAnswer={handleAnswer} />
        ) : (
          <ConclusionScreen
            node={currentNode}
            onContinue={handleContinue}
            canContinue={canContinue}
            hadPriorManiobra={countCompletedManiobras(session, tree) > 0}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {session.steps.length > 1 ? (
          <button
            type="button"
            onClick={handleBackStep}
            className="btn-secondary text-sm"
          >
            ← Paso anterior
          </button>
        ) : null}
        <button
          type="button"
          onClick={() =>
            setSession({
              ...session,
              currentNodeId: session.entryNodeId,
              steps: [{ nodeId: session.entryNodeId, at: new Date().toISOString() }],
            })
          }
          className="btn-secondary text-sm"
        >
          Reiniciar secuencia
        </button>
      </div>
    </main>
  );
}
