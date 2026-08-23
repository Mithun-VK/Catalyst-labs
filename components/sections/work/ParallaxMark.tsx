"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * PARALLAX MARK - wraps a project's planet badge or browser-chrome frame in
 * a scroll-linked scale/rotate, the same "grows toward the centre of the
 * screen, settles either side" mechanic the /services mark ring uses.
 * Same technique, two different visual skins - which is the
 * point: both pages' "completed work" sections should move the same way.
 */
export function ParallaxMark({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 15%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.4,
  });

  const scale = useTransform(progress, [0, 0.5, 1], [0.9, 1.04, 0.92]);
  const rotate = useTransform(progress, [0, 0.5, 1], [-3, 0, 3]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      style={reduced ? undefined : { scale, rotate }}
    >
      {children}
    </motion.div>
  );
}
