"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The value chain as a live instrument panel: idea, system, automation,
 * impact. A single charge advances along the rail every couple of seconds so
 * the hero has one continuously evolving element - and exactly one. The
 * interval only runs while the strip is on screen.
 */

const STAGES = [
  { key: "idea", label: "Idea", detail: "The problem, stated plainly" },
  { key: "system", label: "Software", detail: "A system that holds the work" },
  { key: "automation", label: "Automation", detail: "The repetition removed" },
  { key: "impact", label: "Impact", detail: "Hours, speed, accuracy" },
] as const;

export function ChainStrip() {
  const [ref, inView] = useInView<HTMLDivElement>("0px");
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!inView || reduced) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(
      () => setActive((i) => (i + 1) % STAGES.length),
      2200
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="w-full">
      <ol className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
        {STAGES.map((stage, i) => {
          const isActive = !reduced && i === active;
          return (
            <li
              key={stage.key}
              className="relative flex min-h-[7rem] flex-col justify-between gap-3 bg-ink px-4 py-4 sm:px-5 sm:py-5"
            >
              {/* Charge rail across the top edge of the active cell. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-ember transition-transform duration-[900ms] ease-(--ease-out-quart)"
                style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
              />

              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 transition-colors duration-(--duration-slow)"
                  style={{
                    backgroundColor: isActive
                      ? "var(--color-ember)"
                      : "var(--color-mute-deep)",
                  }}
                />
                <span
                  className="label transition-colors duration-(--duration-slow)"
                  style={{
                    color: isActive ? "var(--color-paper)" : "var(--color-mute)",
                  }}
                >
                  {stage.label}
                </span>
              </div>

              <p
                className="text-small text-balance transition-colors duration-(--duration-slow)"
                style={{
                  color: isActive
                    ? "var(--color-paper-dim)"
                    : "var(--color-mute-deep)",
                }}
              >
                {stage.detail}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
