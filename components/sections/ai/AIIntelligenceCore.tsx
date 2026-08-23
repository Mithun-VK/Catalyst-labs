"use client";

import { useEffect, useState, useId } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { useInView, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * AI INTELLIGENCE CORE - the hero's signature artifact.
 *
 * The visual story, in order: small chips on the left feed data toward the
 * centre (CRM, API, Documents); a reasoning core sits in the middle, built
 * from layered rotating rings and a pulsing centre; six capability nodes
 * (Perceive, Reason, Plan, Tools, Memory, Act) ring the core, each wired to
 * it by a traced connection line; a chip on the right receives what comes
 * out (Action). That is the actual claim - data in, reasoning, an agent
 * acting - not a generic glowing orb.
 *
 * This is the one component on the site that uses `motion` (Framer Motion).
 * Everywhere else uses the site's zero-JS scroll-driven CSS reveal system,
 * which is deliberate and stays that way - but a continuous, physically
 * damped mouse-parallax and a coordinated multi-layer hover response are
 * genuinely hard to do well in plain CSS, and this is the one place on the
 * page where that interaction is the entire point.
 *
 * PERFORMANCE: the parallax spring only exists on fine-pointer, hover-
 * capable devices - touch and coarse pointers get the artifact with no
 * mouse tracking at all, not a disabled one still doing the math. The agent
 * status cycle only runs while the artifact is in view (useInView) and never
 * runs under reduced motion, where it holds on a single resting label.
 */

/*
 * Angles are offset 30deg off the four compass points on purpose: a node
 * sitting at exactly 90deg (straight down) put its label directly on top of
 * the agent-status readout anchored at the bottom of the artifact, and one
 * at -90deg would have collided with the top edge the same way. Offsetting
 * the whole ring keeps every label clear of both.
 */
const NODES = [
  { id: "perceive", label: "Perceive", angle: -60, detail: "Reads the input as it arrives." },
  { id: "reason", label: "Reason", angle: 0, detail: "Weighs it against your rules." },
  { id: "plan", label: "Plan", angle: 60, detail: "Decides what happens next." },
  { id: "tools", label: "Tools", angle: 120, detail: "Calls the systems it needs." },
  { id: "memory", label: "Memory", angle: 180, detail: "Keeps the record of what it did." },
  { id: "act", label: "Act", angle: 240, detail: "Writes back, or hands off to a person." },
] as const;

const AGENT_STATES = [
  "Perceiving input",
  "Reasoning",
  "Planning action",
  "Executing",
] as const;

const RADIUS = 42; // percent of the container, from centre to each node

export function AIIntelligenceCore() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [ref, inView] = useInView<HTMLDivElement>("-10% 0px");
  const [hovered, setHovered] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [stateIndex, setStateIndex] = useState(0);
  const gradId = useId();

  // Pointer position, normalised to -0.5..0.5 of the container. Springed so
  // the artifact settles physically rather than snapping to the cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const depthNear = useTransform(sx, (v) => v * -14);
  const depthNearY = useTransform(sy, (v) => v * -14);
  const depthFar = useTransform(sx, (v) => v * -6);
  const depthFarY = useTransform(sy, (v) => v * -6);

  useEffect(() => {
    if (!inView || reduced) {
      setStateIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStateIndex((i) => (i + 1) % AGENT_STATES.length);
    }, 2400);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setHovered(false);
    setActiveNode(null);
  };

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[26rem]"
      onPointerMove={onMove}
      onPointerEnter={() => fine && setHovered(true)}
      onPointerLeave={onLeave}
    >
      {/* Ambient atmosphere - not mouse-reactive, the constant backdrop the
          rest of the artifact moves against. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-20%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-signal) 20%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Input / output chips - the "data enters, action leaves" claim,
          stated in three words rather than left to the visual alone. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[10%] flex flex-col gap-2 sm:left-[-6%]"
        style={reduced ? undefined : { x: depthFar, y: depthFarY }}
      >
        {["CRM", "API", "Docs"].map((s) => (
          <span key={s} className="readout text-mute-deep">
            {s}
          </span>
        ))}
      </motion.div>
      {/* Positioned upper-right rather than mid-right: with the node ring
          offset 30deg off-compass (see the NODES comment), "Reason" sits at
          the pure-right position, and a mid-right chip landed right on top
          of its label. Upper-right clears both Reason and Plan. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[8%] sm:right-[-4%]"
        style={reduced ? undefined : { x: depthNear, y: depthNearY }}
      >
        <span className="readout text-signal">Action</span>
      </motion.div>

      {/* The tilting stage. Rings, connections and nodes all live inside
          this one transformed layer so the parallax reads as one physical
          object rather than several things drifting independently. */}
      <motion.div
        className="absolute inset-0"
        style={
          reduced
            ? undefined
            : { rotateX, rotateY, transformPerspective: 800 }
        }
      >
        {/* Connection network, drawn once beneath the nodes. */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          {NODES.map((n) => {
            const rad = (n.angle * Math.PI) / 180;
            const x = 50 + RADIUS * Math.cos(rad);
            const y = 50 + RADIUS * Math.sin(rad);
            const isActive = activeNode === n.id;
            return (
              <motion.line
                key={n.id}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="var(--color-signal)"
                strokeWidth={isActive ? 0.7 : 0.35}
                initial={false}
                animate={{ opacity: isActive ? 0.9 : hovered ? 0.45 : 0.25 }}
                transition={{ duration: 0.25 }}
              />
            );
          })}
        </svg>

        {/* Rings. */}
        {[0, 9, 18].map((inset, i) => (
          <div
            key={inset}
            className="ai-core-ring"
            data-spin={i % 2 === 0 ? "cw" : "ccw"}
            style={
              {
                inset: `${inset}%`,
                "--spin-duration": `${34 - i * 8}s`,
              } as React.CSSProperties
            }
            aria-hidden="true"
          />
        ))}

        {/* Core glow - energy rises on hover, per the brief's explicit
            "increase energy" hover response. */}
        <motion.div
          className="ai-core-glow"
          aria-hidden="true"
          animate={
            reduced
              ? undefined
              : { scale: hovered ? 1.18 : 1, opacity: hovered ? 1 : 0.75 }
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={
            reduced ? undefined : { animation: "cl-pulse 3.4s ease-in-out infinite" }
          }
        />

        {/* Orbit nodes. */}
        {NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 50 + RADIUS * Math.cos(rad);
          const y = 50 + RADIUS * Math.sin(rad);
          const isActive = activeNode === n.id;
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-ink text-[0.5rem] font-mono uppercase tracking-wider text-mute-deep"
                onPointerEnter={() => fine && setActiveNode(n.id)}
                onPointerLeave={() => fine && setActiveNode(null)}
                onFocus={() => setActiveNode(n.id)}
                onBlur={() => setActiveNode(null)}
                whileHover={reduced ? undefined : { scale: 1.2 }}
                whileTap={reduced ? undefined : { scale: 0.95 }}
                animate={
                  reduced
                    ? undefined
                    : {
                        borderColor: isActive
                          ? "var(--color-signal)"
                          : "var(--color-line-strong)",
                      }
                }
                aria-describedby={`${n.id}-detail`}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="sr-only">{n.label}</span>
              </motion.button>

              {/* Label - always present in the DOM (not hover-only content),
                  visible permanently on touch/coarse devices, and as a
                  animated tooltip on fine pointers. */}
              <div
                id={`${n.id}-detail`}
                className={`pointer-events-none absolute top-full mt-2 w-max max-w-[9rem] text-center ${
                  fine ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
                }`}
              >
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-paper-dim">
                  {n.label}
                </p>
                {!fine ? (
                  <p className="mt-0.5 text-[0.6875rem] leading-snug text-mute-deep">
                    {n.detail}
                  </p>
                ) : (
                  <AnimatePresence>
                    {isActive ? (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="mt-0.5 text-[0.6875rem] leading-snug text-mute-deep"
                      >
                        {n.detail}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Agent status readout - decorative, cycling, never the only place a
          fact lives. Freezes on "System online" under reduced motion or
          before the artifact has scrolled into view. */}
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap">
        <span className="signal-dot" aria-hidden="true" />
        <span className="readout text-mute-deep">
          <AnimatePresence mode="wait">
            <motion.span
              key={inView && !reduced ? stateIndex : "idle"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {inView && !reduced ? AGENT_STATES[stateIndex] : "System online"}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}
