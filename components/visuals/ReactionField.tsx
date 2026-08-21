"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * REACTION FIELD - signature visual, hero background.
 *
 * A lattice of points holding a low resting energy. Two things raise it:
 * the pointer, which lights the field around it, and periodic reactions that
 * propagate outward as expanding wavefronts - a catalyst spreading through a
 * medium. Points crossing a high enough energy shift from paper to ember.
 *
 * Cost control: one canvas, no per-point objects in the hot loop, points
 * batched into a small number of fill passes, the rAF loop suspended when the
 * hero is scrolled out of view, and a single static frame under reduced
 * motion. Everything here is decorative and hidden from assistive tech.
 */

const SPACING = 34; // logical px between lattice points
const POINTER_RADIUS = 190;
const WAVE_SPEED = 340; // px per second
const WAVE_MAX_RADIUS = 560;
const WAVE_BAND = 62; // thickness of the active wavefront
const MAX_WAVES = 3;
const LEVELS = 9;

type Wave = { x: number; y: number; born: number };

export function ReactionField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let originX = 0;
    let originY = 0;

    // Pre-baked fill styles so the hot loop never builds a colour string.
    const paperFills = Array.from(
      { length: LEVELS },
      (_, i) => `rgba(242,241,236,${(0.1 + i * 0.05).toFixed(3)})`
    );
    const emberFills = Array.from(
      { length: LEVELS },
      (_, i) => `rgba(255,91,40,${(0.28 + i * 0.08).toFixed(3)})`
    );

    // Bucketed coordinates: [x, y, size] triples per energy level.
    const paperBuckets: number[][] = Array.from({ length: LEVELS }, () => []);
    const emberBuckets: number[][] = Array.from({ length: LEVELS }, () => []);

    const pointer = { x: -9999, y: -9999, active: false };
    const waves: Wave[] = [];
    let raf = 0;
    let running = false;
    let lastSpawn = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = parent!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const ratio = dpr();

      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);

      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;
      // Centre the lattice so it never looks cropped from one edge.
      originX = (width - (cols - 1) * SPACING) / 2;
      originY = (height - (rows - 1) * SPACING) / 2;
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < LEVELS; i++) {
        paperBuckets[i].length = 0;
        emberBuckets[i].length = 0;
      }

      // Retire finished waves.
      for (let i = waves.length - 1; i >= 0; i--) {
        if (((now - waves[i].born) / 1000) * WAVE_SPEED > WAVE_MAX_RADIUS) {
          waves.splice(i, 1);
        }
      }

      const pr2 = POINTER_RADIUS * POINTER_RADIUS;

      for (let r = 0; r < rows; r++) {
        const y = originY + r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = originX + c * SPACING;

          // Resting energy: a slow diagonal gradient keeps the field from
          // reading as a flat screen of identical dots.
          let energy = 0.1 + ((c + r) % 7) * 0.009;

          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < pr2) {
              const t = 1 - Math.sqrt(d2) / POINTER_RADIUS;
              energy += t * t * 0.75;
            }
          }

          for (let w = 0; w < waves.length; w++) {
            const wave = waves[w];
            const age = (now - wave.born) / 1000;
            const radius = age * WAVE_SPEED;
            const dx = x - wave.x;
            const dy = y - wave.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const offset = Math.abs(dist - radius);
            if (offset < WAVE_BAND) {
              const band = 1 - offset / WAVE_BAND;
              const decay = 1 - radius / WAVE_MAX_RADIUS;
              energy += band * band * decay * 0.95;
            }
          }

          if (energy <= 0.05) continue;

          const clamped = energy > 1 ? 1 : energy;
          const level = Math.min(LEVELS - 1, (clamped * LEVELS) | 0);
          const size = 1.6 + clamped * 2;
          const bucket = clamped > 0.55 ? emberBuckets[level] : paperBuckets[level];
          bucket.push(x, y, size);
        }
      }

      for (let i = 0; i < LEVELS; i++) {
        paint(paperBuckets[i], paperFills[i]);
        paint(emberBuckets[i], emberFills[i]);
      }
    }

    function paint(bucket: number[], fill: string) {
      if (bucket.length === 0) return;
      ctx!.fillStyle = fill;
      ctx!.beginPath();
      for (let i = 0; i < bucket.length; i += 3) {
        const size = bucket[i + 2];
        const half = size / 2;
        ctx!.rect(bucket[i] - half, bucket[i + 1] - half, size, size);
      }
      ctx!.fill();
    }

    function spawnWave(now: number, atPointer = false) {
      if (waves.length >= MAX_WAVES) return;
      waves.push({
        x: atPointer && pointer.active ? pointer.x : Math.random() * width,
        y: atPointer && pointer.active ? pointer.y : Math.random() * height,
        born: now,
      });
      lastSpawn = now;
    }

    function frame(now: number) {
      if (!running) return;
      // Reactions fire on a loose interval so the field never looks metronomic.
      if (now - lastSpawn > 2600 + Math.random() * 2200) spawnWave(now);
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      lastSpawn = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // --- pointer ---------------------------------------------------------
    function onPointerMove(e: PointerEvent) {
      // Coarse pointers (touch) skip the field light entirely - it would only
      // fire under the user's own finger.
      if (e.pointerType === "touch") return;
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      spawnWave(performance.now(), true);
    }

    resize();

    if (reduced) {
      // One static frame: the lattice, at rest.
      draw(performance.now());
      return () => {};
    }

    /**
     * The hero headline is the LCP element. Painting a full lattice frame
     * during hydration competes with it for the main thread, so the first
     * frame waits for the browser to go idle. `start()` is deferred the same
     * way below.
     */
    const idle: (cb: () => void) => number =
      "requestIdleCallback" in window
        ? (cb) =>
            (window as unknown as {
              requestIdleCallback: (c: () => void, o?: { timeout: number }) => number;
            }).requestIdleCallback(cb, { timeout: 1200 })
        : (cb) => window.setTimeout(cb, 300);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(parent);

    // Only animate while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(parent);

    const onVisibility = () =>
      document.visibilityState === "visible" ? start() : stop();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    idle(start);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
