"use client";

import { useEffect, useRef } from "react";

/**
 * Headline whose letters swell as the pointer comes near them - the Works
 * page's playful equivalent of a hover state. Renders the plain text for
 * assistive tech and as the no-JS fallback; the per-letter spans are
 * decorative. Only active for a fine pointer with motion allowed, and only
 * while the headline is on screen.
 */
export function ProximityText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    let visible = false;
    let frame = 0;
    let x = -9999;
    let y = -9999;

    const paint = () => {
      frame = 0;
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / 150);
        el.style.transform = t > 0 ? `scale(${1 + t * 0.4}) translateY(${-t * 6}px)` : "";
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      x = y = -9999;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) onLeave();
    });
    io.observe(root);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const words = text.split(" ");
  return (
    <span ref={rootRef} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span
                key={ci}
                data-letter
                className="inline-block transition-transform duration-150 ease-out will-change-transform"
              >
                {ch}
              </span>
            ))}
            {wi < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
