"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { impacts } from "@/content/impact";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * IMPACT - the same real before/after ledger as the shared Impact section,
 * made interactive: one Before | After switch flips every card at once, so
 * the visitor performs the change instead of reading about it. Plays the flip
 * once on first view (motion allowed, not if the visitor already toggled).
 */
type Mode = "before" | "after";

export function ImpactToggle() {
  const [mode, setMode] = useState<Mode>("before");
  const touched = useRef(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("after");
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            if (!touched.current) setMode("after");
          }, 900);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const choose = (m: Mode) => {
    touched.current = true;
    setMode(m);
    track("cta_chip_select", { location: "services_impact", option: m });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} id="impact" aria-labelledby="impact-heading" className={SVC_SECTION}>
        <div className="container-page">
          <SvcHeading
            id="impact-heading"
            index="02"
            eyebrow="Impact"
            title={
              <>
                What actually <span className="accent-word text-ember">changes</span> once it ships.
              </>
            }
            aside={
              <div role="radiogroup" aria-label="Show the situation" className="glass-chip inline-flex p-1">
                {(["before", "after"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => choose(m)}
                    className={cn(
                      "relative min-h-10 cursor-pointer rounded-full px-5 text-small capitalize transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]",
                      mode === m ? "text-on-ember" : "text-mute hover:text-paper"
                    )}
                  >
                    {mode === m ? (
                      <motion.span
                        layoutId="impact-pill"
                        className="absolute inset-0 rounded-full bg-ember"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative">{m === "before" ? "Today" : "After we ship"}</span>
                  </button>
                ))}
              </div>
            }
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {impacts.map((item, i) => (
              <li key={item.id} className={cn("glass glass-lift flex flex-col p-5", i === 4 && "sm:col-span-2 lg:col-span-1")}>
                <h3 className="text-body font-medium text-paper">{item.title}</h3>
                <p className="mt-2 flex-1 text-small text-mute">{item.body}</p>
                <div className="mt-4 min-h-[2.75rem] border-t border-white/70 pt-3">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={mode}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.3 } }}
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                      className={cn(
                        "flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wider",
                        mode === "before" ? "text-mute-deep line-through decoration-mute-deep/60" : "text-ember"
                      )}
                    >
                      {mode === "after" ? (
                        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 8.5l3 3 7-7" />
                        </svg>
                      ) : null}
                      {mode === "before" ? item.before : item.after}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}
