"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * STUDIO TYPE - the about page's opening statement.
 *
 * Type as the interface. Each letter lifts as the pointer approaches it, so
 * the headline behaves like a surface with weight rather than a picture of
 * one. This is the page's whole visual identity - there is no other device on
 * it - which is why the cost is worth paying here and nowhere else.
 *
 * PERFORMANCE. The naive version of this reads every letter's position on
 * every pointer move, which is a full layout pass per frame. Instead the
 * geometry is measured ONCE per resize into a flat array, the move handler is
 * coalesced into a single rAF, and each frame only writes a custom property.
 * No layout is read while the pointer is moving.
 *
 * The transform itself lives in CSS (`.studio-letter`), driven by `--pull`,
 * so JS never touches `transform` and the two cannot fight.
 *
 * Skipped entirely on coarse pointers and under reduced motion - there is no
 * pointer to approach on a touchscreen, and the letters simply render as
 * ordinary text. The words are real text either way, so the heading is
 * selectable and announced normally.
 */
export function StudioType({ lines }: { lines: readonly string[] }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    const aura = auraRef.current;
    if (!root) return;

    const letters = Array.from(
      root.querySelectorAll<HTMLElement>(".studio-letter")
    );
    if (!letters.length) return;

    // Flat arrays rather than objects: this is read in the hot loop.
    const cx = new Float64Array(letters.length);
    const cy = new Float64Array(letters.length);
    let frame = 0;
    let px = 0;
    let py = 0;
    // The root's own viewport offset, so the aura can be positioned in the
    // root's coordinate space without a second layout read per frame.
    let rootLeft = 0;
    let rootTop = 0;

    const measure = () => {
      const rr = root.getBoundingClientRect();
      rootLeft = rr.left;
      rootTop = rr.top;
      for (let i = 0; i < letters.length; i++) {
        const r = letters[i].getBoundingClientRect();
        cx[i] = r.left + r.width / 2;
        cy[i] = r.top + r.height / 2;
      }
    };

    /* Radius is generous so the effect reads as a field rather than a
       spotlight following one glyph at a time. */
    const RADIUS = 220;

    const apply = () => {
      frame = 0;
      for (let i = 0; i < letters.length; i++) {
        const dx = px - cx[i];
        const dy = py - cy[i];
        const dist = Math.hypot(dx, dy);
        const pull = dist > RADIUS ? 0 : 1 - dist / RADIUS;
        letters[i].style.setProperty("--pull", pull.toFixed(3));
      }
      /* The aura rides the SAME frame and the same pointer read as the
         letters - it is a second mark driven by one listener, not a second
         listener. Positioned relative to the root because it is a child of
         it, so it stays correct as the page scrolls under the pointer. */
      if (aura) {
        aura.style.transform = `translate3d(${px - rootLeft}px, ${py - rootTop}px, 0)`;
      }
    };

    const onEnter = () => {
      // Geometry is re-read on entry rather than only at mount: the letters
      // arrive on a staggered entrance animation, so their boxes are still
      // moving for the first second or so of the page's life.
      measure();
      aura?.setAttribute("data-on", "");
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const l of letters) l.style.setProperty("--pull", "0");
      aura?.removeAttribute("data-on");
    };

    measure();
    // Scroll changes viewport-relative centres just as much as resize does.
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  /* One counter across every line, so the entrance cascades down the whole
     headline instead of restarting on each line. Spaces are counted too -
     otherwise the stagger would visibly compress across a word break. */
  let index = 0;

  return (
    <div ref={rootRef} className="relative">
      <span ref={auraRef} aria-hidden="true" className="studio-aura" />
      {lines.map((line, li) => (
        <span key={li} className="studio-line block">
          {Array.from(line).map((ch, ci) => {
            const i = index++;
            return ch === " " ? (
              <span key={ci}> </span>
            ) : (
              <span
                key={ci}
                className="studio-letter"
                style={{ "--i": i } as React.CSSProperties}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
