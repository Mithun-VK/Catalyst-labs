"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A number that counts up from zero once it scrolls into view - the mobile/
 * tablet counterpart to the desktop showcase's scroll-scrubbed counters
 * (WorksShowcase.tsx). Desktop ties the count to scroll POSITION because the
 * showcase is pinned and scrubbed anyway; there is no pin on a phone, so this
 * counts on TIME instead, triggered once by intersection - the same
 * "spring settles toward a target" pattern `motion` already provides, reused
 * rather than reinventing a second animation approach for one page.
 *
 * Renders the real final value in the initial markup (SSR-safe, and correct
 * even if JS never runs, or under reduced motion). The spring only takes
 * over - starting from "0" - once mounted, in view, and motion is allowed.
 */
export function Counter({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20, mass: 0.6 });
  const animating = inView && !reduced;

  useEffect(() => {
    if (animating) motionValue.set(value);
  }, [animating, value, motionValue]);

  useEffect(() => {
    if (!animating) return;
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals);
    });
  }, [animating, spring, decimals]);

  return <span ref={ref}>{animating ? "0" : value.toFixed(decimals)}</span>;
}
