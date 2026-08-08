"use client";

import {
  REVEAL_LINE_INTERVAL_MS,
  splitRevealLines,
  visibleTextFromLines,
} from "@/lib/reveal-text-lines";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  content: string;
  animate: boolean;
  onRevealComplete?: () => void;
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
  const lines = useMemo(() => splitRevealLines(content), [content]);
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : lines.length);
  const onRevealCompleteRef = useRef(onRevealComplete);
  const onRevealTickRef = useRef(onRevealTick);

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
    onRevealTickRef.current = onRevealTick;
  });

  useEffect(() => {
    if (!animate) {
      setVisibleCount(lines.length);
      // Still notify so conversation TTS / scroll hooks can run for non-animated replies.
      onRevealCompleteRef.current?.();
      return;
    }

    setVisibleCount(0);
    let count = 0;
    let timer: number | null = null;
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      onRevealCompleteRef.current?.();
    };

    const tick = () => {
      count += 1;
      setVisibleCount(count);
      onRevealTickRef.current?.();

      if (count >= lines.length) {
        if (timer != null) window.clearInterval(timer);
        finish();
      }
    };

    tick();
    if (count < lines.length) {
      timer = window.setInterval(tick, REVEAL_LINE_INTERVAL_MS);
    }
    return () => {
      if (timer != null) window.clearInterval(timer);
    };
  }, [animate, content, lines.length]);

  const visibleText = visibleTextFromLines(lines, visibleCount);
  const isRevealing = animate && visibleCount < lines.length;

  return <>{children(visibleText, isRevealing)}</>;
}
