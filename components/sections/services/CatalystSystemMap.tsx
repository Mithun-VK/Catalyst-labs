"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * CATALYST SYSTEM MAP - the page's visual centrepiece.
 *
 * A centre "Systems" hub with the six real practices arranged around it,
 * connected by traced lines - the argument that Catalyst Labs combines
 * capabilities into one system rather than selling six disconnected
 * services. Every node IS one of the real entries in content/services.ts;
 * there is no separate taxonomy invented for this diagram that would need
 * to be kept in sync with the real service list by hand. The detail panel
 * draws on `outcome`, `deliverables` and `stack` - real fields already
 * written for the service detail pages, not new copy invented for this
 * component. It stays a teaser (one outcome line, four stack tags) rather
 * than reproducing ServicesSection's full deliverables list two sections
 * below - the map is the overview, the pinned index is the deep dive.
 *
 * MOTION SPLIT. The lines and nodes draw in once via the site's CSS
 * scroll-driven reveal (.trace-path / [data-stagger], animation-timeline:
 * view()) - this diagram does not pin or scrub, so it has no reason to
 * reach for GSAP, which is reserved on this page for ServicesSection's
 * actual pinned experience. Everything that reacts to the pointer (the
 * info panel crossfade, the node lift, the hub pulse) is Motion, the same
 * as every other local interaction on the page. The pulse fires once per
 * activation rather than looping - a continuous decorative animation next
 * to this much text would be a distraction, not a polish.
 *
 * INTERACTION: hover/focus previews a node; a click or tap PINS it, so the
 * panel survives the pointer leaving (hover alone excludes touch users -
 * see the "hover vs tap" rule this was built against).
 *
 * MOBILE: no hover-only content. The vertical list below `lg` shows every
 * service's summary, outcome and deliverable count permanently - see the
 * file's second return branch.
 */
export function CatalystSystemMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const gradId = useId();
  const active = pinned ?? hovered;
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
                    data-active={active === s.id ? "true" : "false"}
                    style={
                      {
                        "--trace-length": 150,
                        "--trace-stagger": `${i * 5}%`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </svg>

            {/* Centre hub */}
            <Reveal
              variant="scale"
              className="system-node absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center"
            >
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-mute-deep">
                Catalyst
              </span>
              <span className="mt-0.5 text-small font-medium uppercase tracking-[0.04em] text-paper">
                Systems
              </span>

              {/* One-shot pulse ring, fired on every activation - not a
                  loop, so it reads as "a connection was made" rather than
                  a decorative heartbeat. */}
              <AnimatePresence>
                {active ? (
                  <motion.span
                    key={active}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full border border-ember"
                    initial={{ opacity: 0.55, scale: 0.85 }}
                    animate={{ opacity: 0, scale: 1.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                ) : null}
              </AnimatePresence>
            </Reveal>

            {/* Capability nodes */}
            <div data-stagger style={{ "--stagger-step": "3%" } as React.CSSProperties}>
              {services.map((s, i) => {
                const { xPct, yPct } = nodePositionPercent(i, services.length);
                const isPinned = pinned === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() =>
                      setHovered((cur) => (cur === s.id ? null : cur))
                    }
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered((cur) => (cur === s.id ? null : cur))}
                    onClick={() =>
                      setPinned((cur) => (cur === s.id ? null : s.id))
                    }
                    className="system-node absolute w-36 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm px-4 py-3.5 text-left"
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    data-active={active === s.id ? "true" : "false"}
                    aria-pressed={isPinned}
                    aria-expanded={active === s.id}
                    aria-controls="system-map-detail"
                  >
                    <span className="font-mono text-[0.625rem] tabular text-mute-deep">
                      {s.index}
                    </span>
                    <span className="mt-1 block text-small font-medium uppercase tracking-[0.02em] text-paper">
                      {s.title}
                    </span>
                    <span className="mt-1.5 block font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-mute-deep">
                      {s.deliverables.length} deliverables
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info layer - reserves its own height so the diagram never
              reflows as the panel's content changes with the active
              service. */}
          <div
            id="system-map-detail"
            className="relative mx-auto mt-6 min-h-[9.5rem] max-w-xl"
            aria-live="polite"
          >
            <div className="grid">
              <AnimatePresence mode="wait">
                {activeService ? (
                  <motion.div
                    key={activeService.id}
                    className="[grid-area:1/1]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-center text-small text-mute">
                      <span className="text-paper">{activeService.title}.</span>{" "}
                      {activeService.summary}.
                    </p>
                    <p className="mt-2 text-center text-[0.8125rem] leading-relaxed text-mute-deep">
                      {activeService.outcome}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ember">
                        {activeService.deliverables.length} deliverables
                      </span>
                      <span aria-hidden="true" className="h-3 w-px bg-line" />
                      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {activeService.stack.slice(0, 4).map((tech) => (
                          <li
                            key={tech}
                            className="font-mono text-[0.625rem] uppercase tracking-wider text-mute-deep"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Link
                        href={`/services/${activeService.id}`}
                        className="inline-flex items-center gap-1.5 text-small text-ember underline-offset-4 hover:underline"
                      >
                        Explore this practice
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    className="[grid-area:1/1] pt-14 text-center text-small text-mute-deep"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Hover, focus or tap a capability to see what it covers,
                    delivers and runs on.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
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
                <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-mute-deep">
                  {s.deliverables.length} deliverables
                </p>
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
