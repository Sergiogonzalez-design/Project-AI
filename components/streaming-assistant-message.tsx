"use client";

import {
  buildRevealChunks,
  revealDelayMs,
  visibleTextFromChunks,
} from "@/lib/reveal-text-lines";
import { useEffect, useMemo, useRef, useState } from "react";

type RevealCompleteMeta = { interrupted: boolean };

type Props = {
  content: string;
  animate: boolean;
  /** Show full text at once and fire onRevealComplete (avoids layout jitter). */
  completeImmediately?: boolean;
  onRevealComplete?: (meta?: RevealCompleteMeta) => void;
  onRevealTick?: () => void;
  children: (visibleText: string, isRevealing: boolean) => React.ReactNode;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function StreamingAssistantMessage({
  content,
  animate,
  completeImmediately = false,
  onRevealComplete,
  onRevealTick,
  children,
}: Props) {
  const chunks = useMemo(() => buildRevealChunks(content), [content]);
  const [visibleCount, setVisibleCount] = useState(
    animate && !completeImmediately && !prefersReducedMotion()
      ? 0
      : chunks.length
  );
  const onRevealCompleteRef = useRef(onRevealComplete);
  const onRevealTickRef = useRef(onRevealTick);
  const wasAnimatingRef = useRef(false);
  const instantCompleteRef = useRef(false);

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
    onRevealTickRef.current = onRevealTick;
  });

  useEffect(() => {
    if (!completeImmediately) {
      instantCompleteRef.current = false;
      return;
    }
    if (instantCompleteRef.current) return;
    instantCompleteRef.current = true;
    wasAnimatingRef.current = false;
    setVisibleCount(chunks.length);
    onRevealCompleteRef.current?.({ interrupted: false });
  }, [completeImmediately, chunks.length]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    let completed = false;

    const finish = (interrupted = false) => {
      if (completed) return;
      completed = true;
      onRevealCompleteRef.current?.({ interrupted });
    };

    const clear = () => {
      if (timer != null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };

    // Historical / non-active bubbles: show full text without firing complete.
    if (!animate || completeImmediately) {
      wasAnimatingRef.current = false;
      setVisibleCount(chunks.length);
      return clear;
    }

    wasAnimatingRef.current = true;

    if (prefersReducedMotion() || chunks.length === 0) {
      setVisibleCount(chunks.length);
      finish();
      return clear;
    }

    setVisibleCount(0);
    let count = 0;

    const scheduleNext = () => {
      if (cancelled) return;
      if (count >= chunks.length) {
        finish();
        return;
      }

      const delay = revealDelayMs(content, chunks, count);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        count += 1;
        setVisibleCount(count);
        onRevealTickRef.current?.();
        scheduleNext();
      }, delay);
    };

    timer = window.setTimeout(() => {
      if (cancelled) return;
      count = 1;
      setVisibleCount(1);
      onRevealTickRef.current?.();
      scheduleNext();
    }, 40);

    return () => {
      cancelled = true;
      clear();
      // Interrupted mid-reveal (e.g. conversation reload): still notify so parent can clear id.
      if (wasAnimatingRef.current && !completed) {
        finish(true);
      }
    };
  }, [animate, completeImmediately, content, chunks.length]);

  const visibleText = visibleTextFromChunks(content, chunks, visibleCount);
  const isRevealing =
    animate && !completeImmediately && visibleCount < chunks.length;

  return (
    <div className={isRevealing ? "assistant-message-revealing" : undefined}>
      {children(visibleText, isRevealing)}
    </div>
  );
}
