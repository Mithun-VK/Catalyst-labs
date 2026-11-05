"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { processStages } from "@/content/process";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";
import { cn } from "@/lib/cn";

/**
 * PROCESS - the five real stages as one timeline track plus one shared detail
 * pane, instead of five tall cards. Choosing a stop fills the track up to it.
 * WAI-ARIA tabs with arrow-key support.
 */
export function ProcessTimeline() {
  const [i, setI] = useState(0);
  const n = processStages.length;
  const stage = processStages[i];

  const go = (next: number) => {
    const k = (next + n) % n;
    setI(k);
    document.getElementById(`stage-tab-${k}`)?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="process" aria-labelledby="process-heading" className={SVC_SECTION}>
        <div className="container-page">
          <SvcHeading
            id="process-heading"
            index="03"
            eyebrow="Process"
            title="Systematic, not improvised."
            aside={
              <Link href="/process" className="text-small text-ember underline-offset-4 hover:underline">
                The process in full →
              </Link>
            }
          />

          <div className="glass mt-8 p-5 sm:p-7">
            <div
              role="tablist"
              aria-label="Process stages"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  go(i + 1);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  go(i - 1);
                }
              }}
              className="relative grid grid-cols-5"
            >
              {/* Track and its fill, running through the centre of the dots. */}
              <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[1.0625rem] h-px bg-[var(--color-line-strong)]" />
              <span
                aria-hidden="true"
                className="absolute left-[10%] top-[1.0625rem] h-[2px] origin-left bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: "80%", transform: `scaleX(${i / (n - 1)})` }}
              />
              {processStages.map((s, k) => {
                const on = k === i;
                const done = k <= i;
                return (
                  <button
                    key={s.index}
                    id={`stage-tab-${k}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls="stage-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setI(k)}
                    className="group relative flex cursor-pointer flex-col items-center gap-2 px-1 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
                  >
                    <span
                      className={cn(
                        "relative z-10 flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full border font-mono text-[0.6875rem] transition-colors duration-300",
                        done
                          ? "border-[var(--color-ember)] bg-ember text-on-ember"
                          : "border-white/80 bg-white/80 text-mute group-hover:text-paper"
                      )}
                    >
                      {s.index}
                    </span>
                    <span className={cn("text-[0.75rem] font-medium sm:text-small", on ? "text-paper" : "text-mute")}>
                      {s.title}
                    </span>
                    <span className="hidden font-mono text-[0.625rem] uppercase tracking-wider text-mute-deep sm:block">
                      {s.duration}
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${i}`} className="mt-6 grid">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ember">
                      Stage {stage.index} · {stage.duration}
                    </p>
                    <h3 className="mt-1.5 text-h3 text-paper">{stage.title}</h3>
                    <p className="mt-2 text-body text-mute">{stage.body}</p>
                  </div>
                  <div className="glass-inset p-4 lg:col-span-5">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep">
                      You receive
                    </p>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                      {stage.output.map((o) => (
                        <li key={o} className="flex items-start gap-2.5 text-small text-paper-dim">
                          <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
