"use client";

import { motion } from "motion/react";
import type { Service } from "@/content/services";

/**
 * SERVICE PROGRESS - the number rail for the pinned service experience.
 *
 * Every number is always present (so a reader scanning the page - or a
 * screen reader, since this list is real DOM, not a canvas) sees the whole
 * sequence at a glance), but only the active one carries full weight: the
 * others sit at reduced opacity with no foil treatment. `segmentProgress`
 * (0-1, how far scroll has moved through the CURRENT service) drives a thin
 * fill on the active number's own connector, so the indicator interpolates
 * smoothly rather than jumping the instant the index changes.
 *
 * Plain Framer Motion, no GSAP here: this is a value-driven re-render (React
 * state passed down as props), not a scroll-position measurement, which is
 * exactly the split the two libraries are used for on this page.
 */
export function ServiceProgress({
  services,
  activeIndex,
  segmentProgress,
}: {
  services: readonly Service[];
  activeIndex: number;
  segmentProgress: number;
}) {
  return (
    <ol className="flex gap-6 lg:flex-col lg:gap-8">
      {services.map((service, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        return (
          <li key={service.id} className="relative">
            <motion.p
              className="atelier-numeral origin-left"
              aria-hidden="true"
              animate={{
                opacity: isActive ? 1 : isDone ? 0.55 : 0.28,
                scale: isActive ? 1 : 0.82,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: "clamp(1.5rem, 1rem + 2vw, 2.5rem)" }}
            >
              {service.index}
            </motion.p>

            {/* Connector: a hairline that fills as the reader moves through
                THIS service's own segment of scroll, empties once they move
                on. Only the active item's fill is ever mid-way - every
                earlier one is simply full. */}
            <span
              aria-hidden="true"
              className="mt-1.5 hidden h-px w-8 overflow-hidden bg-line-strong lg:block"
            >
              <motion.span
                className="block h-full origin-left bg-ember"
                animate={{
                  scaleX: isDone ? 1 : isActive ? segmentProgress : 0,
                }}
                transition={
                  isActive
                    ? { duration: 0.05, ease: "linear" }
                    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </span>

            <span className="sr-only">{service.title}</span>
          </li>
        );
      })}
    </ol>
  );
}
