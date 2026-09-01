/**
 * Scroll a focused questionnaire input so it sits above the software keyboard
 * (visualViewport), not underneath it.
 */
export function ensureQuestionnaireFieldVisible(
  el: HTMLElement,
  gapPx = 20
): void {
  if (typeof window === "undefined") return;

  const run = () => {
    const vv = window.visualViewport;
    const visibleTop = vv ? vv.offsetTop + gapPx : gapPx;
    const visibleBottom = vv
      ? vv.offsetTop + vv.height - gapPx
      : window.innerHeight - gapPx;

    const rect = el.getBoundingClientRect();
    if (rect.top >= visibleTop && rect.bottom <= visibleBottom) return;

    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    // After layout settles (keyboard animation), nudge the nearest scroll parent.
    window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const top = vv ? vv.offsetTop + gapPx : gapPx;
      const bottom = vv
        ? vv.offsetTop + vv.height - gapPx
        : window.innerHeight - gapPx;
      let delta = 0;
      if (r.bottom > bottom) delta = r.bottom - bottom;
      else if (r.top < top) delta = r.top - top;
      if (delta === 0) return;

      const scrollParent = nearestScrollParent(el);
      if (scrollParent) {
        scrollParent.scrollTop += delta;
      } else {
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    }, 120);
  };

  requestAnimationFrame(() => requestAnimationFrame(run));
}

function nearestScrollParent(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
