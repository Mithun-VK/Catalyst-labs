"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { animate, stagger } from "animejs";
import type { Service } from "@/content/services";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The service index, restructured from a static ruled list (CSS-only hover)
 * into an interactive one. Two jobs, two libraries:
 *
 *  - MOTION owns the hover sweep - a spring-driven accent panel that fills
 *    the row from the left, the kind of state-driven interaction Motion's
 *    variants are built for. It replaces the old plain colour transition,
 *    which read as a link, not as an interactive index.
 *  - ANIME.JS owns the one-time entrance: index numerals count in with a
 *    stagger as the list crosses into view - a timeline sequence on a fixed
 *    set of elements, anime's actual job, run once via IntersectionObserver
 *    rather than on every scroll tick.
 *
 * Still a real navigation list underneath both: every row is a `<Link>`
 * with its full text present in the server-rendered HTML, so none of this
 * is required for the content or the navigation to work.
 *
 * The hover state lives on `motion.li` (real geometry at rest, so a pointer
 * can actually land on it) and cascades to the sweep/arrow via named
 * `variants` rather than each of them declaring its own `whileHover`. That
 * distinction matters here specifically: the sweep starts at `scaleX: 0`,
 * which is a zero-area shape for hit-testing, so a `whileHover` declared on
 * the sweep ITSELF can never fire - there is nothing there for the pointer
 * to land on until after the hover it is supposed to trigger.
 */
const sweepVariants = { rest: { scaleX: 0 }, hover: { scaleX: 1 } };
const arrowVariants = { rest: { x: 0 }, hover: { x: 6 } };

export function CapabilitiesList({ services }: { services: Service[] }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const indices = Array.from(root.querySelectorAll<HTMLElement>("[data-cap-index]"));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(indices, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 560,
          delay: stagger(70),
          ease: "outExpo",
        });
      },
      { threshold: 0.2 }
    );
    io.observe(root);

    return () => io.disconnect();
  }, [reduced]);

  return (
    <ul ref={rootRef} className="border-t border-line">
      {services.map((service) => (
        <motion.li
          key={service.id}
          className="border-b border-line"
          initial="rest"
          whileHover={reduced ? undefined : "hover"}
          animate="rest"
        >
          <Link
            href={`/services/${service.id}`}
            className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 overflow-hidden py-7 sm:gap-x-10 lg:py-8"
          >
            {/* The hover fill. transform-origin left + scaleX, not width -
                a compositor-only property, the same discipline the rest of
                the site's motion holds to. Variant state comes from the
                <motion.li> ancestor above, not its own whileHover. */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 origin-left bg-ember/[0.06]"
              variants={sweepVariants}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            />

            <span
              data-cap-index
              className="relative font-mono text-[0.75rem] tabular text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember"
            >
              {service.index}
            </span>

            <span className="relative min-w-0">
              <span className="block text-h2 text-paper transition-colors duration-(--duration-base) group-hover:text-ember">
                {service.title}
              </span>
              <span className="mt-2 block max-w-(--measure) text-body text-mute">
                {service.summary}
              </span>
            </span>

            {/* Affordance only - the whole row is the target. */}
            <motion.span
              aria-hidden="true"
              className="relative text-mute-deep group-hover:text-ember"
              variants={arrowVariants}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              →
            </motion.span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
