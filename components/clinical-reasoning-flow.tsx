"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  applyAnswer,
  advanceFromConclusion,
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
import type {
  ClinicalConclusionNode,
  ClinicalTestNode,
  HypothesisProbability,
} from "@/lib/clinical-reasoning/types";

function probabilityBadgeClass(p: HypothesisProbability): string {
  if (p === "alta") return "bg-red-100 text-red-800";
  if (p === "media") return "bg-amber-100 text-amber-900";
  return "bg-neutral-100 text-neutral-700";
}

function probabilityLabel(p: HypothesisProbability): string {
  if (p === "alta") return "Alta probabilidad";
  if (p === "media") return "Probabilidad media";
  return "Baja probabilidad";
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

      {image ? (
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
      ) : (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
          Ilustración no disponible para esta maniobra
        </div>
      )}

      {videoSrc ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-black">
          <video
            key={videoSrc}
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            className="aspect-square w-full bg-black object-contain"
            aria-label={`Vídeo demostrativo: ${node.title}`}
          >
            Tu navegador no puede reproducir este vídeo.
          </video>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Vídeo demostrativo
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Espacio reservado — podrás añadir el vídeo de esta prueba más adelante.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAnswer("positive")}
          className="rounded-2xl bg-emerald-600 px-6 py-5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          Positivo
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
          Negativo
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

function ConclusionScreen({
  node,
  onContinue,
  canContinue,
}: {
  node: ClinicalConclusionNode;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">{node.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{node.summary}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Hipótesis orientativas
        </h3>
        {node.hypotheses.map((h) => (
          <div
            key={h.name}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-neutral-900">{h.name}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${probabilityBadgeClass(h.probability)}`}
              >
                {probabilityLabel(h.probability)}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-neutral-600">{h.rationale}</p>
          </div>
        ))}
      </div>

      {canContinue ? (
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary w-full justify-center py-3"
        >
          Continuar con otra prueba
        </button>
      ) : (
        <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Has llegado al final de este recorrido. Puedes volver atrás para revisar
          respuestas o cerrar y contrastar con el informe completo.
        </p>
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
            No hay un árbol de razonamiento clínico disponible para esta consulta.
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
            Árbol de razonamiento clínico
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            {tree.title}
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
        Guía interactiva basada en las pruebas recomendadas en el informe. Las
        respuestas orientan hacia hipótesis probables — no sustituyen el juicio
        clínico ni pruebas complementarias.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-5 py-6 shadow-sm">
        {currentNode.type === "test" ? (
          <TestScreen node={currentNode} onAnswer={handleAnswer} />
        ) : (
          <ConclusionScreen
            node={currentNode}
            onContinue={handleContinue}
            canContinue={canContinue}
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
          Reiniciar árbol
        </button>
      </div>
    </main>
  );
}
