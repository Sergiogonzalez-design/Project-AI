"use client";

import { useEffect, useState } from "react";

const MIN_KEYBOARD_OVERLAP_PX = 120;
/** If the visual viewport is this close to the layout height, the keyboard is down. */
const CLOSED_VIEWPORT_SLACK_PX = 48;

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

function measureOverlap(): number {
  const vv = window.visualViewport;
  if (!vv || !likelySoftKeyboardDevice()) return 0;
  const layoutBottom = Math.max(
    window.innerHeight,
    document.documentElement?.clientHeight ?? 0
  );
  const vvBottom = vv.offsetTop + vv.height;
  const raw = Math.max(0, Math.round(layoutBottom - vvBottom));
  // Keyboard dismissed but the field still focused (common on iOS): treat as closed.
  if (raw < CLOSED_VIEWPORT_SLACK_PX) return 0;
  if (!isEditableFocused()) return 0;
  return raw >= MIN_KEYBOARD_OVERLAP_PX ? raw : 0;
}

/**
 * Soft-keyboard overlap in CSS pixels. 0 on desktop and when the keyboard is closed.
 */
export function useKeyboardOverlap() {
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;
    const update = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = measureOverlap();
        setOverlap((prev) => (prev === next ? prev : next));
        // iOS Safari can leave the document scrolled after dismiss/reopen.
        if (next === 0 && (window.scrollY !== 0 || window.scrollX !== 0)) {
          window.scrollTo(0, 0);
        }
      });
    };

    let blurTimer = 0;
    const onFocusOut = () => {
      window.clearTimeout(blurTimer);
      blurTimer = window.setTimeout(update, 80);
    };
    const onFocusIn = () => {
      window.clearTimeout(blurTimer);
      update();
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(blurTimer);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return overlap;
}
