"use client";

import {
  buildRevealChunks,
  revealDelayMs,
  visibleTextFromChunks,
} from "../lib/reveal-text-lines";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, View } from "react-native";

type RevealCompleteMeta = { interrupted: boolean };

type Props = {
  content: string;
  animate: boolean;
  /** Show full text at once and fire onRevealComplete (instant mode). */
  completeImmediately?: boolean;
  onRevealComplete?: (meta?: RevealCompleteMeta) => void;
  onRevealTick?: () => void;
  children: (visibleText: string, isRevealing: boolean) => React.ReactNode;
};

export function StreamingAssistantMessage({
  content,
  animate,
  completeImmediately = false,
  onRevealComplete,
  onRevealTick,
  children,
}: Props) {
  const chunks = useMemo(() => buildRevealChunks(content), [content]);
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : chunks.length);
  const [reduceMotion, setReduceMotion] = useState(false);
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
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(Boolean(enabled));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let completed = false;

    const finish = (interrupted = false) => {
      if (completed) return;
      completed = true;
      onRevealCompleteRef.current?.({ interrupted });
    };

    const clear = () => {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    if (!animate || completeImmediately) {
      wasAnimatingRef.current = false;
      setVisibleCount(chunks.length);
      return clear;
    }

    wasAnimatingRef.current = true;

    if (reduceMotion || chunks.length === 0) {
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
      timer = setTimeout(() => {
        if (cancelled) return;
        count += 1;
        setVisibleCount(count);
        onRevealTickRef.current?.();
        scheduleNext();
      }, delay);
    };

    timer = setTimeout(() => {
      if (cancelled) return;
      count = 1;
      setVisibleCount(1);
      onRevealTickRef.current?.();
      scheduleNext();
    }, 40);

    return () => {
      cancelled = true;
      clear();
      if (wasAnimatingRef.current && !completed) {
        finish(true);
      }
    };
  }, [animate, completeImmediately, content, chunks, reduceMotion]);

  const visibleText = visibleTextFromChunks(content, chunks, visibleCount);
  const isRevealing =
    animate && !completeImmediately && visibleCount < chunks.length;

  return <View>{children(visibleText, isRevealing)}</View>;
}
