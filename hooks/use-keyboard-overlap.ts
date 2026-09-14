"use client";

import { useEffect, useState } from "react";

/**
 * How many CSS pixels the software keyboard overlaps the layout viewport.
 * 0 when the keyboard is closed, or when the browser already resizes the page.
 */
export function useKeyboardOverlap() {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // Prefer visualViewport bottom vs the taller of layout metrics.
      // On iOS Safari, `100dvh` shells often stay tall while `vv.height` shrinks,
      // so `innerHeight - vv.height` alone can wrongly report 0 overlap.
      const vvBottom = vv.offsetTop + vv.height;
      const layoutBottom = Math.max(
        window.innerHeight,
        document.documentElement?.clientHeight ?? 0
      );
      const next = Math.max(0, Math.round(layoutBottom - vvBottom));
      setOverlap(next);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("focusin", update);
    window.addEventListener("focusout", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("focusin", update);
      window.removeEventListener("focusout", update);
    };
  }, []);

  return overlap;
}
