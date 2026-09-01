"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A restrained animated backdrop for the home page's closing CTA - the
 * "subtle animated grid/data visual" the section calls for, without
 * reaching for a second canvas system (ReactionField already covers that
 * job in the hero). A handful of intersection points on the section's
 * existing `.grid-field` line pattern take a slow, staggered pulse: quiet
 * enough to read as "the system is alive," never as attention-seeking
 * decoration behind a headline someone is trying to read.
 *
 * anime.js, not GSAP or Motion: this is a fixed set of DOM nodes on one
 * looping timeline with a stagger, which is exactly anime's job on this
 * page (see SystemCore, CountUp). One loop, paused off screen and under
 * reduced motion, cleaned up on unmount.
 */
const COLS = 7;
const ROWS = 4;

export function PulseGrid({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-pulse-dot]"));
    const loop = animate(dots, {
      opacity: [0.12, 0.55, 0.12],
      scale: [1, 1.6, 1],
      duration: 3400,
      delay: stagger(90, { from: "center", grid: [COLS, ROWS] }),
      loop: true,
      autoplay: false,
      ease: "inOutSine",
    });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? loop.play() : loop.pause()),
      { threshold: 0 }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      loop.revert();
      utils.set(dots, { opacity: 0.12, scale: 1 });
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <span
          key={i}
          data-pulse-dot
          className="flex items-center justify-center opacity-[0.12]"
        >
          <span className="h-1 w-1 rounded-full bg-ember" />
        </span>
      ))}
    </div>
  );
}
