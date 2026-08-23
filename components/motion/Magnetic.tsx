"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Magnetic hover for a primary CTA.
 *
 * The wrapper - not the child - carries the transform, so the button keeps
 * its own hover and focus transitions without the two fighting over the same
 * property. Movement is capped well below the control's size: a CTA that
 * slides out from under the pointer is a usability bug wearing a costume.
 *
 * Listeners are attached to the wrapper rather than the document, and the
 * pull is computed from the pointer's offset within the element, so cost is
 * proportional to hovering one button rather than to moving the mouse at all.
 *
 * Never runs on coarse pointers or under reduced motion; in both cases the
 * child renders as an ordinary, fully functional control.
 */
export function Magnetic({
  children,
  strength = 0.28,
  max = 10,
  className,
}: {
  children: ReactNode;
  /** Fraction of the pointer's offset applied as movement. */
  strength?: number;
  /** Hard cap in px, in each axis. */
  max?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const write = () => {
      frame = 0;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = Math.max(-max, Math.min(max, dx * strength));
      ty = Math.max(-max, Math.min(max, dy * strength));
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!frame) frame = requestAnimationFrame(write);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [reduced, strength, max]);

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      style={{ transition: "transform var(--duration-slow) var(--ease-out-quart)" }}
    >
      {children}
    </span>
  );
}
