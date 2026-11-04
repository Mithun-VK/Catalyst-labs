"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { CtaFact } from "@/lib/cta";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { burst } from "@/components/cta/confetti";

/**
 * Real numbers from real projects, shown beside the ask.
 *
 *  - Standard pages: one fact at a time, quietly crossfading every few
 *    seconds, pausing while hovered or focused. Under reduced motion every
 *    fact is simply listed.
 *  - Works page: all facts at once as tilted stickers that bob gently and
 *    pop confetti when clicked.
 */
export function CtaProof({
  facts,
  variant,
}: {
  facts: CtaFact[];
  variant: "standard" | "poster";
}) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (variant !== "standard" || reduced || paused || facts.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % facts.length), 4800);
    return () => clearInterval(id);
  }, [variant, reduced, paused, facts.length]);

  if (facts.length === 0) return null;

  if (variant === "poster") {
    const surfaces = ["yellow", "pink", "mint", "orange"];
    const tilts = ["-3deg", "2deg", "-1.5deg", "3deg"];
    return (
      <ul aria-label="Results from recent projects" className="flex flex-wrap gap-4 pt-2">
        {facts.map((fact, i) => (
          <li
            key={fact.source}
            className="cta-sticker"
            data-surface={surfaces[i % surfaces.length]}
            style={{ "--tilt": tilts[i % tilts.length], "--bob": `${i * 0.7}s` } as React.CSSProperties}
          >
            <button type="button" onClick={(e) => burst(e.currentTarget, 16)} className="block text-left">
              <span className="block text-[length:clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-none tracking-[-0.03em]">
                {fact.value}
              </span>
              <span className="mt-1 block max-w-[11rem] text-[0.75rem] leading-snug">{fact.label}</span>
              <span className="mt-1.5 block font-mono text-[0.625rem] uppercase tracking-[0.14em] opacity-70">
                {fact.source}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (reduced) {
    return (
      <ul aria-label="Results from recent projects" className="grid gap-3 border-t border-line pt-4">
        {facts.map((fact) => (
          <li key={fact.source} className="text-small text-mute">
            <span className="text-paper">{fact.value}</span> {fact.label} · {fact.source}
          </li>
        ))}
      </ul>
    );
  }

  const fact = facts[index];
  return (
    <div
      className="border-t border-line pt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="label text-mute-deep">Recent results</p>
      <div className="mt-3 min-h-[5.5rem]" aria-live="off">
        <div key={fact.source} className="cta-fact">
          <span className="block text-h2 leading-none text-paper">{fact.value}</span>
          <span className="mt-2 block text-small text-mute">{fact.label}</span>
          <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-deep">
            {fact.source}
          </span>
        </div>
      </div>
      <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Choose a result">
        {facts.map((f, i) => (
          <button
            key={f.source}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show result ${i + 1}: ${f.source}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 w-6 cursor-pointer transition-colors duration-200",
              i === index ? "bg-ember" : "bg-line-strong hover:bg-mute"
            )}
          />
        ))}
      </div>
    </div>
  );
}
