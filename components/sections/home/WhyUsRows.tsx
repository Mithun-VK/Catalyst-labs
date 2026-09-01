"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Differentiator } from "@/content/impact";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The five differentiators, restructured from "outline numeral, fills on
 * hover" into "outline numeral, CHARGES as it crosses the reading band" -
 * scroll position driving the fill, not the pointer. A mouse user still
 * gets the same read scrolling down the list that used to require hovering
 * every row in turn; a touch visitor (who was never going to hover a
 * numeral) now gets the effect too.
 *
 * GSAP `scrub: true` ties the numeral's colour directly to scroll position
 * inside a fixed band around the row - no time-based tween, no catch-up
 * loop needed here the way the Works showcase needs one: a single row
 * crossing a ~50vh band is short enough that scrub alone reads as smooth at
 * any scroll speed.
 *
 * Renders its own rows (rather than taking them as a render-prop) because
 * this is a Client Component and its caller, WhyUs, is a Server Component -
 * a function crossing that boundary as a prop is a hard Next.js error, not
 * a style preference. `items` (plain data) is the only thing that crosses.
 */
export function WhyUsRows({ items }: { items: Differentiator[] }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // GSAP interpolates colour numerically, so it needs a literal `rgb()`
    // to animate toward - it cannot resolve `var(--color-ember)` (a custom
    // property) or `color-mix()` (a browser paint-time function) itself.
    // Reading it off a probe element's computed style is the standard way
    // to turn a design token into a value GSAP can actually tween.
    const probe = document.createElement("span");
    probe.style.color = "var(--color-ember)";
    document.body.appendChild(probe);
    const emberRgb = getComputedStyle(probe).color;
    probe.remove();
    const emberFill = emberRgb.startsWith("rgb(")
      ? emberRgb.replace("rgb(", "rgba(").replace(")", ", 0.32)")
      : emberRgb;

    const ctx = gsap.context(() => {
      const numerals = gsap.utils.toArray<HTMLElement>("[data-whyus-numeral]", root);
      numerals.forEach((numeral) => {
        gsap.set(numeral, { color: "transparent" });
        gsap.to(numeral, {
          color: emberFill,
          ease: "none",
          scrollTrigger: {
            trigger: numeral,
            start: "top 78%",
            end: "top 38%",
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <ul ref={rootRef} className="border-t border-line">
      {items.map((item, i) => (
        <li key={item.id} className="border-b border-line">
          <Reveal delay={i * 50}>
            <div className="grid grid-cols-1 items-start gap-4 py-8 md:grid-cols-12 md:gap-x-(--space-gutter) md:py-10">
              <div className="md:col-span-3">
                <span
                  data-whyus-numeral
                  aria-hidden="true"
                  className="block font-display text-[3.5rem] leading-[0.8] tracking-[-0.05em] text-transparent md:text-[4.5rem]"
                  style={{ WebkitTextStroke: "1px var(--color-line-strong)" }}
                >
                  {item.index}
                </span>
              </div>

              <h3 className="text-h3 text-paper md:col-span-4">{item.title}</h3>

              <p className="text-body text-mute md:col-span-5">{item.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
