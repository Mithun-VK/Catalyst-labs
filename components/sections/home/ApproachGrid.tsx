"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tilt } from "@/components/motion/Tilt";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The four-domain grid, restructured from a plain `Reveal` fade into a
 * scroll-scrubbed ignition: each cell's accent rule draws in and the card
 * settles from a slight recess as it crosses the same point in the
 * viewport, GSAP-scrubbed to scroll position rather than time - the same
 * "engineered, not decorative" register as the Works showcase, at section
 * scale instead of full-page scale. `Tilt` (already built for the Works
 * product visuals) gives each settled card a restrained cursor response, so
 * the grid stays alive between scroll events too.
 *
 * GSAP, not Motion, for the entrance: four cards driven by ONE ScrollTrigger
 * each is comfortably GSAP's job (see the site's established split -
 * `WorksShowcase.tsx`). Motion (via Tilt) owns the hover physics on the same
 * cards - two libraries, two different jobs, never fighting over the same
 * property.
 */
export function ApproachGrid({ children }: { children: React.ReactNode[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>("[data-approach-cell]", root);
      cells.forEach((cell) => {
        const rule = cell.querySelector<HTMLElement>("[data-approach-rule]");
        gsap.set(cell, { opacity: 0, y: 28, scale: 0.97 });
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

        gsap.to(cell, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cell,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
        if (rule) {
          gsap.to(rule, {
            scaleX: 1,
            duration: 0.5,
            delay: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cell,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="grid gap-px border border-line bg-line sm:grid-cols-2"
    >
      {children}
    </div>
  );
}

/** One cell. `Tilt` only wraps the card face, so the reveal above (which
    animates the OUTER cell) and the hover tilt (which animates Tilt's own
    inner div) never write to the same transform. */
export function ApproachCell({ children }: { children: React.ReactNode }) {
  return (
    <div data-approach-cell className="bg-ink">
      <Tilt className="h-full w-full">
        <div className="px-7 py-9 sm:px-8 sm:py-10">{children}</div>
      </Tilt>
    </div>
  );
}
