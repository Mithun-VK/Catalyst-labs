"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * SERVICE CONNECTION - the thin line from the service content to the
 * deliverables panel: content → produces → this. Purely decorative and
 * secondary, which is why it is a single hairline-weight stroke at low
 * opacity rather than a bold graphic element, and why it is hidden below
 * `lg` - the two columns it connects only sit side by side at that
 * breakpoint; stacked on mobile there is nothing meaningful to draw.
 *
 * Framer Motion's `pathLength` (0 -> 1 keyed by `serviceId`), not GSAP's
 * DrawSVG - that plugin needs a paid Club GreenSock licence, and
 * `pathLength` produces the identical stroke-draw effect natively with no
 * manual dasharray measurement.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export function ServiceConnection({ serviceId }: { serviceId: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className="pointer-events-none absolute -left-[7%] top-1/2 hidden h-10 w-[7%] -translate-y-1/2 overflow-visible text-ember lg:block"
      aria-hidden="true"
      focusable="false"
    >
      <AnimatePresence>
        <motion.path
          key={serviceId}
          d="M0,20 H70 Q90,20 90,0"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.65, ease: EASE }}
        />
      </AnimatePresence>
    </svg>
  );
}
