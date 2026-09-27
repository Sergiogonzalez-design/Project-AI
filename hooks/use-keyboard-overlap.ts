"use client";

import { useEffect, useState } from "react";

const MIN_KEYBOARD_OVERLAP_PX = 120;

function isEditableFocused(): boolean {
  const el = document.activeElement;
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "TEXTAREA") return true;
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type;
    return !["button", "checkbox", "radio", "submit", "reset", "file", "hidden"].includes(
      type
    );
  }
  return false;
}

function likelySoftKeyboardDevice(): boolean {
  if (typeof window === "undefined") return false;
  // Mouse/trackpad desktop: never lift the composer for visualViewport chrome gaps.
  if (window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0) {
    return false;
  }
  return true;
}

/**
 * Soft-keyboard overlap in CSS pixels. 0 on desktop and when the keyboard is closed.
 */
export function useKeyboardOverlap() {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      if (!likelySoftKeyboardDevice() || !isEditableFocused()) {
        setOverlap(0);
        return;
      }
      const vvBottom = vv.offsetTop + vv.height;
      const layoutBottom = Math.max(
        window.innerHeight,
        document.documentElement?.clientHeight ?? 0
      );
      const next = Math.max(0, Math.round(layoutBottom - vvBottom));
      setOverlap(next >= MIN_KEYBOARD_OVERLAP_PX ? next : 0);
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
