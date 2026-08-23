"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, type Service } from "@/content/services";
import { ServiceMark, type ServiceMarkKind } from "@/components/services/ServiceMark";
import { ServiceProgress } from "@/components/sections/services/ServiceProgress";
import { ServiceContent } from "@/components/sections/services/ServiceContent";
import { DeliverablesPanel } from "@/components/sections/services/DeliverablesPanel";
import { ServiceConnection } from "@/components/sections/services/ServiceConnection";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks";

/**
 * SERVICES SECTION - a pinned, scroll-scrubbed walk through the six
 * practices, on desktop. GSAP + ScrollTrigger own the scroll mechanics
 * (pinning, progress tracking); Framer Motion owns everything that reacts
 * to the resulting `activeIndex` (see ServiceContent, DeliverablesPanel,
 * ServiceConnection, ServiceProgress) - the split the brief asked for, and
 * the one each library is actually best at.
 *
 * MECHANICS. `wrapperRef` is a spacer sized to `services.length * 100vh`;
 * `pinRef` (one screen tall) is pinned against it from the moment its top
 * hits the viewport top until the wrapper's bottom reaches the viewport
 * bottom. `self.progress` (0-1 across that whole pin) is split into
 * `services.length` equal segments - `activeIndex` is which segment the
 * reader is in, `segmentProgress` is how far through that segment (both fed
 * to ServiceProgress for the interpolated rail fill). Segments are derived
 * from `services.length`, never hardcoded, so the experience keeps working
 * unchanged if a practice is added or removed.
 *
 * DESKTOP ONLY. Below `lg`, or under reduced motion, this renders
 * `MobileServiceList` instead - every service stacked in normal document
 * flow with a single scroll-reveal each, no pin, no scrub. Pinning a tall
 * spacer on a small screen is exactly the "excessive scroll distance /
 * broken viewport" failure mode the brief calls out, so mobile gets a
 * structurally different, deliberately simpler component rather than the
 * desktop experience with effects switched off.
 *
 * CLEANUP. `gsap.context()` scopes every tween/ScrollTrigger this component
 * creates; `ctx.revert()` on unmount (including on the reduced-motion /
 * mobile branches, since the effect's own guard clause returns before
 * creating anything for them to revert) removes them and their DOM
 * side-effects (the pin-spacer, inline styles GSAP wrote) so navigating
 * away and back, or a viewport resize crossing the desktop breakpoint,
 * never leaves a stale ScrollTrigger measuring against a layout that no
 * longer exists.
 */
gsap.registerPlugin(ScrollTrigger);

const MARK_FOR_SERVICE: Record<string, ServiceMarkKind> = {
  "ai-automation": "ai-automation",
  "custom-software": "custom-software",
  web: "web",
  mobile: "mobile",
  "saas-mvp": "saas-mvp",
  "data-integrations": "data-integrations",
};

function markFor(service: Service): ServiceMarkKind {
  return MARK_FOR_SERVICE[service.id] ?? "custom-software";
}

export function ServicesSection() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinnedExperience = isDesktop && !reduced;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);

  useEffect(() => {
    if (!pinnedExperience || !wrapperRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        scrub: 1,
        onUpdate: (self) => {
          const count = services.length;
          const raw = self.progress * count;
          const idx = Math.min(count - 1, Math.floor(raw));
          setActiveIndex(idx);
          setSegmentProgress(raw - idx);
        },
      });
    });

    return () => ctx.revert();
  }, [pinnedExperience]);

  if (!pinnedExperience) {
    return <MobileServiceList />;
  }

  const active = services[activeIndex];

  return (
    <section aria-labelledby="practices-heading" className="relative">
      <h2 id="practices-heading" className="sr-only">
        Practices
      </h2>

      <div ref={wrapperRef} style={{ height: `${services.length * 100}vh` }}>
        <div
          ref={pinRef}
          className="container-page grid h-screen items-center gap-x-(--space-gutter) lg:grid-cols-12"
        >
          <div className="lg:col-span-1">
            <ServiceProgress
              services={services}
              activeIndex={activeIndex}
              segmentProgress={segmentProgress}
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-3">
            <motion.div
              key={`mark-${active.id}`}
              className="luxury-mark-ring mb-8 h-14 w-14 text-ember"
              initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ServiceMark kind={markFor(active)} className="h-7 w-7" />
            </motion.div>

            <ServiceContent service={active} />
          </div>

          <div className="relative lg:col-span-3 lg:col-start-10">
            <ServiceConnection serviceId={active.id} />
            <DeliverablesPanel service={active} />

            <p className="mt-5 text-[0.75rem] leading-relaxed text-mute-deep">
              Built on {active.stack.slice(0, 3).join(", ")}
              {active.stack.length > 3 ? " and more" : ""}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * MOBILE / REDUCED-MOTION FALLBACK - every practice in normal document
 * flow, each revealing once via a plain `whileInView` fade-and-rise. No
 * pin, no scrub, no crossfade between services (there is nothing to cross
 * FADE between - they are all simply present, in order), and no per-row
 * parallax: the brief is explicit that mobile should feel deliberately
 * simple, not like the desktop experience with the expensive parts
 * stripped out.
 */
function MobileServiceList() {
  return (
    <section aria-labelledby="practices-heading-m">
      <h2 id="practices-heading-m" className="sr-only">
        Practices
      </h2>

      <ul>
        {services.map((service) => (
          <li key={service.id} className="border-t border-line">
            <motion.article
              className="container-page py-16 sm:py-20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4">
                <div className="luxury-mark-ring h-14 w-14 shrink-0 text-ember">
                  <ServiceMark kind={markFor(service)} className="h-7 w-7" />
                </div>
                <p className="atelier-numeral" aria-hidden="true">
                  {service.index}
                </p>
              </div>

              <h3
                className="mt-6 uppercase text-paper"
                style={{
                  fontSize: "clamp(1.75rem, 1rem + 3.2vw, 3.5rem)",
                  lineHeight: "1.02",
                  letterSpacing: "-0.03em",
                  fontWeight: 500,
                }}
              >
                {service.title}
              </h3>

              <p className="mt-6 max-w-(--measure-wide) text-lead text-paper-dim">
                {service.summary}.
              </p>
              <p className="mt-5 max-w-(--measure-wide) text-body text-mute">
                {service.problem}
              </p>
              <p className="mt-4 max-w-(--measure-wide) text-body text-mute">
                {service.solution}
              </p>

              <Link
                href={`/services/${service.id}`}
                className="group mt-8 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-small tracking-[0.04em] text-paper transition-colors duration-(--duration-base) hover:border-ember hover:text-ember"
              >
                Explore {service.title}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <div className="luxury-panel relative mt-10 rounded-sm p-6">
                <span
                  aria-hidden="true"
                  className="luxury-corner left-0 top-0 border-l border-t"
                />
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep">
                  What is handed over
                </p>
                <ul className="mt-5 grid gap-3">
                  {service.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="border-b border-line pb-3 text-small text-paper-dim last:border-b-0 last:pb-0"
                    >
                      {deliverable}
                    </li>
                  ))}
                </ul>

                {service.id === "ai-automation" ? (
                  <Link
                    href="/ai"
                    className="mt-6 inline-flex items-center gap-2 text-small text-ember underline-offset-4 hover:underline"
                  >
                    See worked AI scenarios
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>
            </motion.article>
          </li>
        ))}
      </ul>
    </section>
  );
}
