"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

/**
 * CATALYST SYSTEM MAP - the page's visual centrepiece.
 *
 * A centre "Systems" hub with the six real practices arranged around it,
 * connected by traced lines - the argument that Catalyst Labs combines
 * capabilities into one system rather than selling six disconnected
 * services. Every node IS one of the real entries in content/services.ts;
 * there is no separate five-node taxonomy invented for this diagram that
 * would need to be kept in sync with the real service list by hand.
 *
 * MOTION SPLIT. The lines draw in once via the site's CSS scroll-driven
 * reveal (.trace-path, animation-timeline: view()) - this diagram does not
 * pin or scrub, so it has no reason to reach for GSAP, which is reserved on
 * this page for ServicesSection's actual pinned experience. Hover state
 * (the info panel below the map) is Motion, the same as every other local
 * interaction on the page.
 *
 * MOBILE: no hover-only content. The vertical list below `lg` shows every
 * service's summary and index permanently - see the file's second return
 * branch.
 */
export function CatalystSystemMap() {
  const [active, setActive] = useState<string | null>(null);
  const gradId = useId();
  const activeService = services.find((s) => s.id === active) ?? null;

  return (
    <section
      aria-labelledby="system-map-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-mute-deep">
            System / 02
          </p>
          <h2
            id="system-map-heading"
            className="mt-6 max-w-[20ch] text-paper"
            style={{
              fontSize: "clamp(1.875rem, 1rem + 3.4vw, 3.75rem)",
              lineHeight: "0.98",
              letterSpacing: "-0.03em",
              fontWeight: 500,
            }}
          >
            One system, six capabilities.
          </h2>
          <p className="mt-6 max-w-(--measure-wide) text-lead text-mute">
            Most engagements draw on more than one of these at once. They are
            built as one connected practice, not six teams that happen to
            share an invoice.
          </p>
        </Reveal>

        {/* ---- desktop: the hub-and-spoke diagram ------------------- */}
        <div className="relative mt-20 hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-[38rem]">
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full overflow-visible text-ember"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="180" fill={`url(#${gradId})`} opacity="0.35" />
              {services.map((s, i) => {
                const { x, y } = nodePosition(i, services.length);
                return (
                  <path
                    key={s.id}
                    d={`M200,200 L${x},${y}`}
                    className="trace-path"
                    data-run
                    style={
                      {
                        "--trace-length": 150,
                        "--trace-stagger": `${i * 5}%`,
                        opacity: active === s.id ? 0.9 : 0.3,
                        transition: "opacity 300ms",
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </svg>

            {/* Centre hub */}
            <div className="system-node absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center">
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-mute-deep">
                Catalyst
              </span>
              <span className="mt-0.5 text-small font-medium uppercase tracking-[0.04em] text-paper">
                Systems
              </span>
            </div>

            {/* Capability nodes */}
            {services.map((s, i) => {
              const { xPct, yPct } = nodePositionPercent(i, services.length);
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive((cur) => (cur === s.id ? null : cur))}
                  onFocus={() => setActive(s.id)}
                  onBlur={() => setActive((cur) => (cur === s.id ? null : cur))}
                  className="system-node absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-sm px-4 py-3.5 text-left"
                  style={{ left: `${xPct}%`, top: `${yPct}%` }}
                  aria-expanded={active === s.id}
                  aria-controls="system-map-detail"
                >
                  <span className="font-mono text-[0.625rem] tabular text-mute-deep">
                    {s.index}
                  </span>
                  <span className="mt-1 block text-small font-medium uppercase tracking-[0.02em] text-paper">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Info layer - reserves its own height so the diagram never
              reflows when a node's summary appears or disappears. */}
          <div
            id="system-map-detail"
            className="mx-auto mt-4 h-16 max-w-md text-center"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              {activeService ? (
                <motion.p
                  key={activeService.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-small text-mute"
                >
                  <span className="text-paper">{activeService.title}.</span>{" "}
                  {activeService.summary}.
                </motion.p>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-small text-mute-deep"
                >
                  Hover a capability to read what it covers.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---- mobile: a vertical list, every summary always visible --- */}
        <ol className="mt-14 border-t border-line lg:hidden">
          {services.map((s) => (
            <li key={s.id} className="flex gap-4 border-b border-line py-5">
              <span className="font-mono text-[0.6875rem] tabular text-mute-deep">
                {s.index}
              </span>
              <div>
                <p className="text-small font-medium uppercase tracking-[0.02em] text-paper">
                  {s.title}
                </p>
                <p className="mt-1 text-small text-mute">{s.summary}.</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** SVG-space coordinates (0-400 viewBox) for node `i` of `total`, on a ring
    of radius 150 around the 200,200 centre - evenly spaced starting from
    the top. */
function nodePosition(i: number, total: number) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.round(200 + 150 * Math.cos(angle)),
    y: Math.round(200 + 150 * Math.sin(angle)),
  };
}

/** Same ring, expressed as a percentage of the container for CSS
    positioning of the HTML node buttons layered over the SVG. */
function nodePositionPercent(i: number, total: number) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  return {
    xPct: 50 + 37.5 * Math.cos(angle),
    yPct: 50 + 37.5 * Math.sin(angle),
  };
}
