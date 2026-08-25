"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { worldForPath, type WorldId } from "@/lib/worlds";

/**
 * CUSTOM CURSOR.
 *
 * The motion half of the cursor; the marks themselves are drawn in
 * globals.css. A dot tracks the pointer exactly and a reticle trails it,
 * changing state over anything interactive.
 *
 * WORLD-AWARE. Each design world gets its own cursor personality - the
 * comic blob on the poster world, the jeweller's caliper on the atelier
 * world, the instrument crosshair on the system world - because a single
 * house cursor on five deliberately different pages reads as an oversight.
 * The LOOK is CSS, keyed off `data-world` on the layer; the FEEL is the
 * tuning table below, which changes how the thing physically moves.
 *
 * ELEMENT OWNERSHIP (the rule that keeps this from stuttering).
 * Every animated element has exactly ONE owner, so a per-frame JS write and
 * a CSS state transition can never fight over the same property:
 *
 *   .cursor-ring   JS    translate only (pointer position, magnet-adjusted)
 *   .cursor-warp   JS    rotate + scale only (velocity squash-and-stretch)
 *   .cursor-shape  CSS   state transitions (hover, press, text)
 *   .cursor-tick   CSS   state transitions
 *   .cursor-dot    JS    translate only
 *
 * COLOUR (see globals.css). There is exactly one colour variable,
 * `--cursor-accent`, set per world on the layer and read by every mark. The
 * adaptive-contrast fallback overrides that same variable with a LITERAL
 * near-black or near-white - never a role token like `--color-ink`, which
 * inverts per world and previously painted the cursor ivory-on-ivory (a
 * measured 1.00:1) on both light worlds.
 *
 * Fine pointers only, and never under reduced motion: a trailing, stretching
 * element is exactly the kind of motion that preference is asking us to drop.
 */

type Tuning = {
  /** Share of the remaining distance the reticle covers each frame. */
  ease: number;
  /** Velocity -> stretch conversion, and the ceiling on it. */
  stretch: number;
  maxStretch: number;
  /** How strongly the reticle is pulled to the centre of a hovered control. */
  magnet: number;
};

/**
 * How each world MOVES. Read as a personality: the poster world is loose and
 * exaggerated, the atelier world is heavy and restrained, the system world is
 * near-instant and barely deforms because instruments do not wobble.
 */
const TUNING: Record<WorldId, Tuning> = {
  precision: { ease: 0.18, stretch: 0.012, maxStretch: 0.34, magnet: 0.18 },
  poster: { ease: 0.26, stretch: 0.03, maxStretch: 0.8, magnet: 0.34 },
  atelier: { ease: 0.11, stretch: 0.005, maxStretch: 0.16, magnet: 0.12 },
  studio: { ease: 0.2, stretch: 0.016, maxStretch: 0.44, magnet: 0.24 },
  system: { ease: 0.34, stretch: 0.004, maxStretch: 0.12, magnet: 0.1 },
};

/** Magnetism only makes sense for a control small enough to have a centre. */
const MAGNET_MAX_W = 360;
const MAGNET_MAX_H = 160;

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const world = worldForPath(pathname ?? "/");

  const layerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const warpRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const layer = layerRef.current;
    const ring = ringRef.current;
    const warp = warpRef.current;
    const shape = shapeRef.current;
    const dot = dotRef.current;
    if (!layer || !ring || !warp || !shape || !dot) return;

    const root = document.documentElement;
    const tune = TUNING[world.id];

    /* The world's own accent, resolved to literal rgb by the engine. Read
       from `color` on a real element rather than from the custom property:
       computed `color` is always a concrete rgb() string, whereas a custom
       property can hand back an unresolved `var(...)` chain. Contrast is
       cleared first so this reads the world's colour and not a previous
       page's flipped fallback. */
    layer.removeAttribute("data-contrast");
    const baseAccent = parseRgb(getComputedStyle(shape).color);

    let px = 0;
    let py = 0;
    let rx = 0;
    let ry = 0;
    let prevRx = 0;
    let prevRy = 0;
    let started = false;
    let running = false;
    let frame = 0;
    let lastTarget: Element | null = null;
    let magnetEl: Element | null = null;
    let recheck = 0;

    const tick = () => {
      // Where the reticle wants to be: the pointer, pulled toward the centre
      // of a hovered control when one is magnetised.
      let tx = px;
      let ty = py;
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        // A control removed or collapsed mid-hover has a zero rect; ignore it
        // rather than dragging the cursor to the top-left corner.
        if (r.width > 0 && r.height > 0) {
          tx += (r.left + r.width / 2 - px) * tune.magnet;
          ty += (r.top + r.height / 2 - py) * tune.magnet;
        }
      }

      prevRx = rx;
      prevRy = ry;
      rx += (tx - rx) * tune.ease;
      ry += (ty - ry) * tune.ease;

      // Squash and stretch along the direction of travel. Driven by the
      // SMOOTHED reticle delta rather than raw pointer velocity, which would
      // pass every jitter straight through to the shape.
      const dx = rx - prevRx;
      const dy = ry - prevRy;
      const speed = Math.hypot(dx, dy);
      const s = Math.min(speed * tune.stretch, tune.maxStretch);

      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      warp.style.transform =
        s > 0.001
          ? `rotate(${Math.atan2(dy, dx)}rad) scale(${1 + s}, ${1 - s * 0.6})`
          : "";

      // Idle stop: once the reticle is within half a pixel of its target
      // there is nothing left to see, so snap it exactly there and yield the
      // main thread instead of burning a frame callback forever. Half a pixel
      // is below the threshold of a visible jump, and an exponential approach
      // would otherwise never formally arrive. A magnetised control keeps the
      // loop alive, since its rect can move under a stationary pointer.
      if (!magnetEl && speed < 0.4 && Math.hypot(tx - rx, ty - ry) < 0.5) {
        ring.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        warp.style.transform = "";
        rx = tx;
        ry = ty;
        running = false;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;

      if (!started) {
        started = true;
        // Snap to the first known position rather than flying in from 0,0.
        rx = px;
        ry = py;
        prevRx = px;
        prevRy = py;
        root.classList.add("has-custom-cursor");
        layer.setAttribute("data-on", "");
      }
      start();

      const target = e.target as Element | null;
      if (target !== lastTarget) {
        lastTarget = target;
        applyTarget(target);
      }
    };

    const evaluateContrast = (target: Element | null) => {
      const contrast = baseAccent ? contrastFor(target, baseAccent) : null;
      if (contrast) layer.setAttribute("data-contrast", contrast);
      else layer.removeAttribute("data-contrast");
    };

    const applyTarget = (target: Element | null) => {
      const variant = variantFor(target);
      if (variant) ring.setAttribute("data-variant", variant);
      else ring.removeAttribute("data-variant");

      // Magnetise only to a genuine, reasonably sized control.
      const control =
        variant === "link" ? target?.closest?.(INTERACTIVE) ?? null : null;
      if (control) {
        const r = control.getBoundingClientRect();
        magnetEl =
          r.width <= MAGNET_MAX_W && r.height <= MAGNET_MAX_H ? control : null;
      } else {
        magnetEl = null;
      }

      evaluateContrast(target);

      /* A surface can CHANGE COLOUR under a stationary pointer: the nav CTA
         fills with the accent on hover, which is the exact moment an
         accent-coloured cursor would disappear into it. The reading above
         happens on the frame the pointer arrives, before that transition has
         run, so take a second reading once it has settled. */
      window.clearTimeout(recheck);
      recheck = window.setTimeout(() => evaluateContrast(target), 320);
    };

    const onDown = () => ring.setAttribute("data-active", "");
    const onUp = () => ring.removeAttribute("data-active");

    // Leaving the window (or switching tabs) hides the marks, so a stale
    // cursor is never left painted over the page.
    const hide = () => layer.removeAttribute("data-on");
    const show = () => {
      if (started) layer.setAttribute("data-on", "");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerenter", show);
    window.addEventListener("blur", hide);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerenter", show);
      window.removeEventListener("blur", hide);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(recheck);
      root.classList.remove("has-custom-cursor");
    };
  }, [reduced, world.id]);

  /* Rendered for every visitor, including coarse pointers: the elements are
     inert and invisible until `data-on` is set, and rendering them on the
     server keeps the markup identical across hydration. */
  return (
    <div
      ref={layerRef}
      className="cursor-layer"
      data-world={world.id}
      aria-hidden="true"
    >
      <div ref={ringRef} className="cursor-ring">
        <div ref={warpRef} className="cursor-warp">
          <span ref={shapeRef} className="cursor-shape" />
          <span className="cursor-tick cursor-tick-tl" />
          <span className="cursor-tick cursor-tick-tr" />
          <span className="cursor-tick cursor-tick-br" />
          <span className="cursor-tick cursor-tick-bl" />
        </div>
      </div>
      {/* Must remain a FOLLOWING sibling of the ring - the dot's interactive
          state is selected with `.cursor-ring[...] ~ .cursor-dot`. */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

const INTERACTIVE = "a[href], button, [role='button'], summary, label, select";
const TEXT_INPUT =
  "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio'])";

function variantFor(target: Element | null): "link" | "text" | null {
  if (!target?.closest) return null;
  if (target.closest(TEXT_INPUT)) return "text";
  if (target.closest(INTERACTIVE)) return "link";
  return null;
}

/**
 * Picks a cursor colour that stays visible on the surface underneath.
 *
 * The world's own accent is kept whenever it clears 3:1 against that surface.
 * Below that - most visibly on a filled primary CTA - we fall back to
 * whichever of near-black or near-white reads better. Both fallbacks are
 * LITERAL colours: the role tokens (`--color-ink`, `--color-paper`) inverse
 * themselves between the dark and light worlds, so resolving the fallback
 * through them is what previously painted an ivory cursor on an ivory page.
 */
function contrastFor(
  target: Element | null,
  accent: [number, number, number]
): "dark" | "light" | null {
  const bg = surfaceColor(target);
  if (!bg) return null;

  const surface = relativeLuminance(bg[0], bg[1], bg[2]);
  if (contrastRatio(relativeLuminance(...accent), surface) >= 3) return null;

  const dark = contrastRatio(relativeLuminance(8, 9, 10), surface);
  const light = contrastRatio(relativeLuminance(244, 243, 239), surface);
  return dark >= light ? "dark" : "light";
}

/** First non-transparent background colour walking up from the target. */
function surfaceColor(target: Element | null): [number, number, number] | null {
  let el: Element | null = target;
  // A bounded walk: deep trees are common and this runs on every target
  // change, so it must not become a full ancestor scan.
  for (let i = 0; el && i < 8; i++, el = el.parentElement) {
    const parsed = parseRgb(getComputedStyle(el).backgroundColor);
    if (parsed) return parsed;
  }
  return null;
}

function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  // Fully or mostly transparent: keep walking up to the real surface.
  if (parts.length > 3 && parts[3] < 0.5) return null;
  return [parts[0], parts[1], parts[2]];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: number, b: number): number {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}
