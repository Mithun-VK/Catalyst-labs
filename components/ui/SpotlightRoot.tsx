"use client";

import { useEffect } from "react";

/**
 * SPOTLIGHT ROOT.
 *
 * Feeds `--spot-x` / `--spot-y` to whichever `.spotlight` panel the pointer is
 * currently over, so the panel's 1px edge illuminates under the cursor. The
 * paint half lives in globals.css; this is only the coordinate source.
 *
 * One delegated listener on the document rather than a listener per panel:
 * the number of spotlight panels grows with the page, the cost here does not.
 * Writes are batched into a single rAF so a burst of pointermove events
 * produces at most one style write per frame.
 *
 * Custom properties are set on the panel's own style, so a panel that is
 * never hovered keeps the CSS fallback (centred gradient) and no JS ever
 * touches it.
 */
export function SpotlightRoot() {
  useEffect(() => {
    // Coarse pointers have no hover state to track, and the effect is purely
    // a hover affordance - so the listener is never attached on touch.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;
    // The panel we last wrote to, so we can clear it on exit.
    let current: HTMLElement | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      pending = null;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const panel = target?.closest?.(".spotlight") as HTMLElement | null;

      if (panel !== current) {
        // Leaving a panel: drop the custom properties so it returns to the
        // CSS default instead of freezing at the last known position.
        if (current) {
          current.style.removeProperty("--spot-x");
          current.style.removeProperty("--spot-y");
        }
        current = panel;
      }

      if (!panel) {
        pending = null;
        return;
      }

      const rect = panel.getBoundingClientRect();
      pending = {
        el: panel,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      if (current) {
        current.style.removeProperty("--spot-x");
        current.style.removeProperty("--spot-y");
      }
    };
  }, []);

  return null;
}
