"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * PARALLAX INDEX - the giant background number behind each Works poster,
 * now tied to scroll position rather than a single scale-in. As the row
 * travels through the viewport the number drifts vertically at a different
 * rate than the row's own content - the classic parallax cue that reads as
 * "this sits on a plane behind everything else" - matching the same
 * scroll-linked technique the /services pinned experience uses, so the two pages'
 * "completed work" sections move the same way even though everything else
 * about them (palette, register, layout) is deliberately different.
 *
 * Kept as its own small client component rather than making the whole
 * PosterRow client: everything else in that row (text staging, the proof
 * list, technology tags) already works well as the site's zero-JS CSS
 * scroll-driven reveal, and this is the one piece that specifically needs a
 * continuously-changing value rather than a single enter-and-hold.
 */
export function ParallaxIndex({
  index,
  flip,
}: {
  index: number;
  flip: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Drifts further than the row itself moves - the number "lags" behind,
  // which is what makes it read as further back than the poster content.
  const y = useTransform(smooth, [0, 1], ["-14%", "14%"]);
  const scale = useTransform(smooth, [0, 0.5, 1], [0.92, 1, 0.92]);

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className="poster-index pointer-events-none absolute -top-6 select-none opacity-[0.16] sm:-top-10"
      style={{
        ...(flip ? { right: "-0.06em" } : { left: "-0.06em" }),
        ...(reduced ? {} : { y, scale }),
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </motion.span>
  );
}
