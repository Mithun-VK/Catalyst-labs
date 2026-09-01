"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A number that counts to its real value once it scrolls into view.
 *
 * anime.js drives this rather than Motion's spring (see Counter.tsx, which
 * does the same job on the Works page): the value here needs to land on an
 * exact integer at an exact time, which is a tween, not a spring settling
 * asymptotically toward a target. Keeping the two implementations separate is
 * deliberate - they are used on different pages, for different reasons, and
 * collapsing them would mean one of the two pages getting the wrong easing
 * behaviour for its context.
 *
 * FAIL-SAFE. The real value is rendered in the SSR markup, so without
 * JavaScript, under reduced motion, or before hydration, the correct number
 * is already on the page. The animation only ever replaces a number that is
 * already correct with the same number, counted up to.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let animation: ReturnType<typeof animate> | null = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect(); // Runs once.

        const counter = { n: 0 };
        animation = animate(counter, {
          n: value,
          duration,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.n));
          },
          onComplete: () => {
            // Never leave a rounding artefact in place of the real figure.
            el.textContent = String(value);
          },
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      // The tween drives a plain object, so pausing is enough to stop it
      // touching the DOM; the element is then restored to the real figure.
      animation?.pause();
      el.textContent = String(value);
    };
  }, [value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
