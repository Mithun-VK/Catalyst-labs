"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * CUSTOM CURSOR.
 *
 * The motion half of the cursor; the marks themselves are drawn in
 * globals.css. A 7px ember dot tracks the pointer exactly, and a 36px bracket
 * trails it, opening into corner ticks over anything interactive.
 *
 * Rules this file must not break:
 *  - JS owns `transform` on .cursor-ring and .cursor-dot and nothing else may,
 *    or the per-frame position write and the CSS state transition will fight.
 *    Every state change here is an attribute, never an inline transform.
 *  - The native cursor is only hidden after a real pointermove, so keyboard
 *    and no-JS visits keep it. That is why `has-custom-cursor` is added in the
 *    move handler rather than on mount.
 *  - Fine pointers only, and never under reduced motion: a trailing element
 *    is exactly the kind of motion that preference is asking us to drop.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const root = document.documentElement;

    // Pointer position, and the ring's trailing position.
    let px = 0;
    let py = 0;
    let rx = 0;
    let ry = 0;
    let started = false;
    let frame = 0;
    let lastTarget: Element | null = null;

    const tick = () => {
      // Exponential approach: the ring covers ~18% of the remaining distance
      // each frame, which reads as weight without feeling laggy.
      rx += (px - rx) * 0.18;
      ry += (py - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;

      if (!started) {
        started = true;
        // Snap the ring to the first known position rather than flying in
        // from the top-left corner.
        rx = px;
        ry = py;
        root.classList.add("has-custom-cursor");
        ring.setAttribute("data-on", "");
        dot.setAttribute("data-on", "");
        frame = requestAnimationFrame(tick);
      }

      const target = e.target as Element | null;
      if (target !== lastTarget) {
        lastTarget = target;
        applyTarget(target);
      }
    };

    const applyTarget = (target: Element | null) => {
      const variant = variantFor(target);
      if (variant) ring.setAttribute("data-variant", variant);
      else ring.removeAttribute("data-variant");

      const contrast = contrastFor(target);
      if (contrast) ring.setAttribute("data-contrast", contrast);
      else ring.removeAttribute("data-contrast");
    };

    // Leaving the window (or switching tabs) hides the marks, so a stale
    // cursor is never left painted over the page.
    const hide = () => {
      ring.removeAttribute("data-on");
      dot.removeAttribute("data-on");
    };
    const show = () => {
      if (started) {
        ring.setAttribute("data-on", "");
        dot.setAttribute("data-on", "");
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerenter", show);
    window.addEventListener("blur", hide);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerenter", show);
      window.removeEventListener("blur", hide);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  // Rendered for every visitor, including coarse pointers: the elements are
  // inert and invisible until `data-on` is set, and rendering them on the
  // server keeps the markup identical across hydration.
  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-tick cursor-tick-tl" />
        <span className="cursor-tick cursor-tick-tr" />
        <span className="cursor-tick cursor-tick-br" />
        <span className="cursor-tick cursor-tick-bl" />
      </div>
      {/* Must remain a FOLLOWING sibling of the ring - the dot's interactive
          and contrast states are selected with `.cursor-ring[...] ~ .cursor-dot`. */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

const INTERACTIVE = "a[href], button, [role='button'], summary, label, select";
const TEXT_INPUT =
  "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio'])";

function variantFor(target: Element | null): "link" | "text" | null {
  if (!target?.closest) return null;
  if (target.closest(TEXT_INPUT)) return "text";
  if (target.closest(INTERACTIVE)) return "link";
  return null;
}

/**
 * Picks a cursor colour that stays visible on the surface underneath.
 *
 * Ember is the default and is left in place whenever it clears 3:1 against
 * the surface. Below that - most visibly on the ember-filled primary CTA -
 * we switch to whichever of ink or paper reads better, rather than leaving
 * an ember cursor to disappear into an ember button.
 */
function contrastFor(target: Element | null): "ink" | "paper" | null {
  const bg = surfaceColor(target);
  if (!bg) return null;

  const ember = relativeLuminance(255, 91, 40);
  const surface = relativeLuminance(bg[0], bg[1], bg[2]);
  if (contrastRatio(ember, surface) >= 3) return null;

  const ink = contrastRatio(relativeLuminance(8, 9, 10), surface);
  const paper = contrastRatio(relativeLuminance(242, 241, 236), surface);
  return ink >= paper ? "ink" : "paper";
}

/** First non-transparent background colour walking up from the target. */
function surfaceColor(target: Element | null): [number, number, number] | null {
  let el: Element | null = target;
  // A bounded walk: deep trees are common and this runs on every target
  // change, so it must not become a full ancestor scan.
  for (let i = 0; el && i < 8; i++, el = el.parentElement) {
    const parsed = parseRgb(getComputedStyle(el).backgroundColor);
    if (parsed) return parsed;
  }
  return null;
}

function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  // Fully or mostly transparent: keep walking up to the real surface.
  if (parts.length > 3 && parts[3] < 0.5) return null;
  return [parts[0], parts[1], parts[2]];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: number, b: number): number {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}
