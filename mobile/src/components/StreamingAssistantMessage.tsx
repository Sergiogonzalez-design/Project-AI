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
  onRevealComplete?: (meta?: RevealCompleteMeta) => void;
  onRevealTick?: () => void;
  children: (visibleText: string, isRevealing: boolean) => React.ReactNode;
};

export function StreamingAssistantMessage({
  content,
  animate,
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

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
    onRevealTickRef.current = onRevealTick;
  });

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

    if (!animate) {
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
  }, [animate, content, chunks, reduceMotion]);

  const visibleText = visibleTextFromChunks(content, chunks, visibleCount);
  const isRevealing = animate && visibleCount < chunks.length;

  return <View>{children(visibleText, isRevealing)}</View>;
}
