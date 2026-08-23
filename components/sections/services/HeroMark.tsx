"use client";

import { motion } from "motion/react";

/**
 * HERO MARK - "SERVICES" printed into place, large enough to dominate the
 * top of the viewport the way the brief's "major editorial statement" asks
 * for. Purely decorative (aria-hidden): the page's real H1 is the headline
 * beneath it ("Engineering, commissioned deliberately.") - a page gets one
 * H1, and a giant wordmark repeating the nav label is not it.
 *
 * A masked clip-path reveal, not a fade: the text is fully laid out from
 * frame one and a clip-path rectangle uncovers it left-to-right, so it
 * reads as ink actually being printed onto the page rather than a block
 * fading into visibility. Motion, not the site's CSS view-timeline reveal,
 * because clip-path-as-percentage is a value Motion interpolates directly;
 * translating that into a single CSS keyframe would need the exact same
 * mechanism this component already is.
 */
export function HeroMark() {
  return (
    <motion.p
      aria-hidden="true"
      className="select-none overflow-hidden font-mono uppercase leading-none text-mute-deep"
      style={{
        fontSize: "clamp(2.5rem, 1rem + 9vw, 8rem)",
        letterSpacing: "-0.01em",
      }}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.85 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      Services
    </motion.p>
  );
}
