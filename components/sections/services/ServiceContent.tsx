"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Service } from "@/content/services";

/**
 * SERVICE CONTENT - title, description and CTA for the active service.
 *
 * Framer Motion only (the pin/scrub mechanics live in ServicesSection via
 * GSAP; this component just reacts to `service` changing). The outgoing
 * block blurs, rises and fades out while the incoming one blurs in from
 * below - the "morphing into the next state" brief, not a hard cut.
 *
 * STACKING: both grid children share the same [grid-area:1/1] cell, so the
 * outgoing and incoming blocks overlap in place during the crossfade
 * instead of the incoming one jumping in below a still-present outgoing
 * block. The grid auto-sizes to the taller of the two, so nothing below
 * this component needs a guessed min-height.
 *
 * The heading uses its own masked line reveal (a plain overflow-hidden
 * mask + translateY), not the site's CSS-only <TextReveal>: TextReveal is
 * driven by `animation-timeline: view()`, keyed to the element's scroll
 * position - correct for content that scrolls INTO view, but this heading
 * never moves on screen (it sits inside a pinned section), so a
 * scroll-position-driven trigger would never fire a second time. Re-keying
 * a Motion element by `service.id` is what actually retriggers the reveal
 * on every service change.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export function ServiceContent({ service }: { service: Service }) {
  return (
    <div className="grid">
      <AnimatePresence initial={false}>
        <motion.div
          key={service.id}
          className="[grid-area:1/1]"
          initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(3px)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h3
            className="overflow-hidden uppercase text-paper"
            style={{
              fontSize: "clamp(1.75rem, 1rem + 3.2vw, 3.5rem)",
              lineHeight: "1.02",
              letterSpacing: "-0.03em",
              fontWeight: 500,
            }}
          >
            <motion.span
              className="block"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            >
              {service.title}
            </motion.span>
          </h3>

          <motion.p
            className="mt-7 max-w-(--measure-wide) text-lead text-paper-dim"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          >
            {service.summary}.
          </motion.p>

          <motion.p
            className="mt-6 max-w-(--measure-wide) text-body text-mute"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          >
            {service.problem}
          </motion.p>
          <motion.p
            className="mt-4 max-w-(--measure-wide) text-body text-mute"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.19 }}
          >
            {service.solution}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.24 }}
          >
            <Link
              href={`/services/${service.id}`}
              className="group mt-10 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-small tracking-[0.04em] text-paper transition-colors duration-(--duration-base) hover:border-ember hover:text-ember"
            >
              Explore {service.title}
              <span
                aria-hidden="true"
                className="transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
