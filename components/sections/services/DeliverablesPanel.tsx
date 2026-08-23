"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Service } from "@/content/services";

/**
 * DELIVERABLES PANEL - the right-hand plate, content re-populated per
 * active service. The plate itself (`.luxury-panel`, the teal-tinted fill
 * and gold corner already established on this page) never moves - only
 * what is written on it changes, which is what keeps this reading as "a
 * fixed panel updating" rather than "a card flying around".
 *
 * Items reveal sequentially (x: 12 -> 0, opacity 0 -> 1, ~0.1s apart) via
 * a Framer Motion stagger container, and each row's own divider draws in
 * with `scaleX` from the left edge - "information loading into a system",
 * not a generic list fade.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, x: 14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export function DeliverablesPanel({ service }: { service: Service }) {
  return (
    <div className="luxury-panel relative rounded-sm p-6 sm:p-7">
      <span
        aria-hidden="true"
        className="luxury-corner left-0 top-0 border-l border-t"
      />

      <div className="grid">
        <AnimatePresence initial={false}>
          <motion.div
            key={service.id}
            className="[grid-area:1/1]"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            variants={container}
          >
            <motion.p
              className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep"
              variants={item}
            >
              What is handed over
            </motion.p>

            <ul className="mt-5 grid gap-3">
              {service.deliverables.map((deliverable) => (
                <motion.li
                  key={deliverable}
                  variants={item}
                  className="relative overflow-hidden pb-3 text-small text-paper-dim"
                >
                  {deliverable}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  />
                </motion.li>
              ))}
            </ul>

            {service.id === "ai-automation" ? (
              <motion.div variants={item}>
                <Link
                  href="/ai"
                  className="mt-6 inline-flex items-center gap-2 text-small text-ember underline-offset-4 hover:underline"
                >
                  See worked AI scenarios
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
