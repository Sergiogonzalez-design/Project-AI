import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  REVEAL_LINE_INTERVAL_MS,
  splitRevealLines,
  visibleTextFromLines,
} from "../lib/reveal-text-lines";

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
      return;
    }

    setVisibleCount(0);
    let count = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      count += 1;
      setVisibleCount(count);
      onRevealTickRef.current?.();

      if (count >= lines.length) {
        if (timer != null) clearInterval(timer);
        onRevealCompleteRef.current?.();
      }
    };

    tick();
    if (count < lines.length) {
      timer = setInterval(tick, REVEAL_LINE_INTERVAL_MS);
    }

    return () => {
      if (timer != null) clearInterval(timer);
    };
  }, [animate, content, lines.length]);

  const visibleText = visibleTextFromLines(lines, visibleCount);
  const isRevealing = animate && visibleCount < lines.length;

  return <>{children(visibleText, isRevealing)}</>;
}
