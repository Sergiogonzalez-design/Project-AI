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
      const next = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - vv.offsetTop)
      );
      setOverlap(next);
      if (next > 0) {
        window.scrollTo(0, 0);
      }
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
