"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * SYSTEM CORE - the hero's 3D object, precision world.
 *
 * An abstract representation of the thing this studio actually sells: not a
 * product, but a system with layers - interface, logic, data, infrastructure -
 * held in one structure. Four SVG planes stacked along Z inside a shared
 * perspective, so it reads as depth rather than as a flat badge, with the
 * ember accents landing only on the core plane.
 *
 * WHY CSS 3D AND NOT WEBGL. Every visual requirement here - real depth,
 * parallax, layer separation, crisp linework at any size - is reachable with
 * four transformed SVGs on the compositor. A WebGL context for this would add
 * a runtime dependency, a canvas, a render loop and a device-capability
 * fallback to draw what is fundamentally line art. The site already runs one
 * canvas in this hero (ReactionField, behind this) and a second GPU context
 * stacked on it is exactly the "multiple heavy scenes simultaneously" case
 * worth avoiding.
 *
 * COST CONTROL, in the same register as ReactionField beside it:
 *  - Cursor parallax writes ONE transform on the stage element, from a
 *    rAF-coalesced pointer handler. The layers themselves never re-write
 *    their own transforms; their Z offsets are static and inherited.
 *  - The idle drift is a single anime.js loop on that same stage, paused
 *    whenever the hero is off screen or the tab is hidden.
 *  - Fine pointers only. A coarse pointer gets the composition and the
 *    entrance, without a tracking loop that has nothing to track.
 *  - Under reduced motion the whole thing renders as a static composition,
 *    fully formed - no entrance, no drift, no tracking.
 */

/** Peak stage rotation from cursor, in degrees. Deliberately restrained. */
const TILT_X = 7;
const TILT_Y = 9;
/** Fraction of the remaining distance covered per frame - a cheap ease. */
const TRACKING_EASE = 0.07;

export function SystemCore({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    // Scoped to this instance's own root, so two SystemCores on one page
    // could never drive each other's layers.
    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-core-layer]")
    );
    const accents = Array.from(
      root.querySelectorAll<SVGElement>("[data-core-accent]")
    );

    if (reduced) {
      // Static composition: everything at its resting, fully-formed state.
      // Also resets `root` itself - `usePrefersReducedMotion` starts `false`
      // and only flips to `true` a tick later (see lib/hooks.ts), so on a
      // page loaded already scrolled past the hero, the scroll-exit
      // ScrollTrigger below can transiently mount and write an exited
      // opacity/transform onto `root` BEFORE this branch ever runs.
      // `ScrollTrigger.kill()` (in the cleanup below) stops future updates
      // but does not undo styles it already wrote, so without this explicit
      // reset that exited state would stick even once reduced motion is
      // correctly detected.
      utils.set(layers, { opacity: 1, scale: 1 });
      utils.set(accents, { opacity: 1 });
      root.style.opacity = "";
      root.style.transform = "";
      return;
    }

    /* ---- entrance ---------------------------------------------------
       anime.js earns its place here: this is one timeline coordinating
       three property groups (layer opacity/scale/rotation, then accent
       opacity/scale) across four layers and every accent point within them,
       with a stagger and a cross-fade offset ("-=520") that have to stay in
       step. Expressing it as hand-placed CSS animation-delays per element,
       the way the old hero markup did (see Hero.tsx history), is exactly
       what drifts once anyone touches the composition. */
    const intro = createTimeline({ defaults: { ease: "outExpo" } })
      .add(layers, {
        opacity: [0, 1],
        scale: [0.86, 1],
        rotateZ: [-12, 0],
        duration: 1100,
        delay: stagger(110),
      })
      .add(
        accents,
        { opacity: [0, 1], scale: [0, 1], duration: 620, delay: stagger(70) },
        "-=520"
      );

    /* ---- idle drift --------------------------------------------------
       One continuously running animation, on ONE element, so the object is
       alive without the page paying for nine of them. */
    const drift = animate(stage, {
      rotateZ: [0, 1.4, 0, -1.4, 0],
      duration: 22000,
      ease: "inOutSine",
      loop: true,
      autoplay: false,
    });

    /* ---- cursor parallax ---------------------------------------------
       The stage's rotateX/rotateY are written here; anime.js owns rotateZ
       on the same element. They compose because they are separate
       properties of one transform, and only this handler writes X/Y. */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let tracking = false;

    const track = () => {
      currentX += (targetX - currentX) * TRACKING_EASE;
      currentY += (targetY - currentY) * TRACKING_EASE;
      utils.set(stage, { rotateX: currentX, rotateY: currentY });

      // Settle and stop rather than spin a loop forever on sub-pixel deltas.
      if (Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(track);
    };

    const kick = () => {
      if (!raf && tracking) raf = requestAnimationFrame(track);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      // Measured against the VIEWPORT, not the object: the core should
      // acknowledge the pointer anywhere in the hero, not only when it is
      // directly over a 400px box.
      targetY = ((e.clientX / window.innerWidth) * 2 - 1) * TILT_Y;
      targetX = -((e.clientY / window.innerHeight) * 2 - 1) * TILT_X;
      kick();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    /* ---- lifecycle ----------------------------------------------------
       Nothing runs while the hero is off screen or the tab is in the
       background. */
    const resume = () => {
      if (document.visibilityState !== "visible") return;
      drift.play();
      if (fine && !tracking) {
        tracking = true;
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerleave", onPointerLeave);
      }
    };

    const suspend = () => {
      drift.pause();
      if (tracking) {
        tracking = false;
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? resume() : suspend()),
      { threshold: 0 }
    );
    io.observe(root);

    const onVisibility = () =>
      document.visibilityState === "visible" ? resume() : suspend();
    document.addEventListener("visibilitychange", onVisibility);

    /* ---- scroll exit ---------------------------------------------------
       GSAP, not anime.js or the pointer loop above: this is a single value
       scrubbed directly to scroll position as the hero leaves the top of
       the viewport, which is ScrollTrigger's job everywhere else on this
       site (WorksShowcase, ApproachGrid, WhyUsRows). Written to `root`
       (scale/opacity), never to `stage` - `stage` already carries the
       pointer rotation and the anime.js drift, and a third system writing
       the same element's transform would fight both. */
    gsap.registerPlugin(ScrollTrigger);
    const exitTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        root.style.opacity = String(1 - self.progress * 0.6);
        root.style.transform = `scale(${1 - self.progress * 0.12})`;
      },
    });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      suspend();
      intro.revert();
      drift.revert();
      exitTrigger.kill();
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
    >
      <div
        ref={stageRef}
        className="relative mx-auto aspect-square w-full max-w-[26rem]"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Depth order back -> front. Each plane sits at its own Z and holds
            still relative to the others; only the stage moves. */}
        <CoreLayer z={-150} opacity={0.3}>
          <GridPlane />
        </CoreLayer>

        <CoreLayer z={-70} opacity={0.55}>
          <RingPlane />
        </CoreLayer>

        <CoreLayer z={10} opacity={1}>
          <CorePlane />
        </CoreLayer>

        <CoreLayer z={110} opacity={0.9}>
          <NodePlane />
        </CoreLayer>
      </div>
    </div>
  );
}

/**
 * One plane in the stack. `opacity` is baked as a static style rather than
 * animated per-frame: atmospheric depth here is a fixed property of the
 * layer, not something the interaction changes.
 */
function CoreLayer({
  z,
  opacity,
  children,
}: {
  z: number;
  opacity: number;
  children: React.ReactNode;
}) {
  return (
    <div
      data-core-layer
      className="absolute inset-0 opacity-0"
      style={{ transform: `translateZ(${z}px)` }}
    >
      <div style={{ opacity }} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The four planes. Plain SVG line art, drawn on a shared 200x200 viewBox so
   they register with each other. Colours come from the world's own tokens -
   nothing here names a hex value.
   -------------------------------------------------------------------------- */

const SVG_PROPS = {
  viewBox: "0 0 200 200",
  fill: "none",
  className: "h-full w-full",
} as const;

/** Back plane: the infrastructure grid. */
function GridPlane() {
  return (
    <svg {...SVG_PROPS}>
      <g stroke="var(--color-line-strong)" strokeWidth="0.5">
        {[40, 70, 100, 130, 160].map((v) => (
          <line key={`h${v}`} x1="30" y1={v} x2="170" y2={v} />
        ))}
        {[40, 70, 100, 130, 160].map((v) => (
          <line key={`v${v}`} x1={v} y1="30" x2={v} y2="170" />
        ))}
      </g>
      <rect
        x="30"
        y="30"
        width="140"
        height="140"
        stroke="var(--color-line-strong)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Second plane: the orbital ring with its instrument ticks. */
function RingPlane() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="100" cy="100" r="76" stroke="var(--color-line-strong)" strokeWidth="1" />
      <circle cx="100" cy="100" r="60" stroke="var(--color-line)" strokeWidth="0.75" />
      <g stroke="var(--color-line-strong)" strokeWidth="1">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const inner = i % 6 === 0 ? 68 : 72;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * inner}
              y1={100 + Math.sin(a) * inner}
              x2={100 + Math.cos(a) * 76}
              y2={100 + Math.sin(a) * 76}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** Core plane: the structure itself, and the only plane carrying ember. */
function CorePlane() {
  return (
    <svg {...SVG_PROPS}>
      {/* An isometric cube read as a wireframe - the "system" as one object. */}
      <g stroke="var(--color-paper)" strokeWidth="1.25" strokeLinejoin="round">
        <path d="M100 46 L146 72 L146 128 L100 154 L54 128 L54 72 Z" />
        <path d="M100 46 L100 100 L146 128" />
        <path d="M100 100 L54 128" />
      </g>
      <g stroke="var(--color-ember)" strokeWidth="1.25" strokeLinejoin="round">
        <path d="M100 46 L146 72 L100 100 L54 72 Z" />
      </g>
      {/* Vertices. These are the accents the entrance pops in last. */}
      {[
        [100, 46],
        [146, 72],
        [146, 128],
        [100, 154],
        [54, 128],
        [54, 72],
        [100, 100],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          data-core-accent
          cx={cx}
          cy={cy}
          r={i === 6 ? 3.5 : 2.5}
          fill={i === 6 ? "var(--color-ember)" : "var(--color-paper)"}
          className="opacity-0"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  );
}

/** Front plane: the few points that sit closest to the viewer. */
function NodePlane() {
  return (
    <svg {...SVG_PROPS}>
      <g>
        {[
          [38, 54],
          [166, 96],
          [72, 168],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r="9"
              stroke="var(--color-line-strong)"
              strokeWidth="0.75"
            />
            <circle
              data-core-accent
              cx={cx}
              cy={cy}
              r="2.5"
              fill="var(--color-ember)"
              className="opacity-0"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
