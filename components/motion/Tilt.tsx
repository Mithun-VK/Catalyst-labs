"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Restrained cursor tilt for a primary product visual - the Works showcase's
 * browser frame / planet badge. Modelled directly on Magnetic.tsx: same
 * listener placement (the element itself, not the document), same
 * fine-pointer + reduced-motion guards, same rAF-coalesced write.
 *
 * Movement is capped deliberately small (see MAX_* below) - a case-study
 * artifact should feel like it responds to the room, not like a game engine.
 */
const MAX_ROTATE_X = 2;
const MAX_ROTATE_Y = 3;
const MAX_SCALE = 1.02;

export function Tilt({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let rx = 0;
    let ry = 0;
    let scale = 1;

    const write = () => {
      frame = 0;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      ry = px * MAX_ROTATE_Y * 2;
      rx = -py * MAX_ROTATE_X * 2;
      scale = MAX_SCALE;
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onLeave = () => {
      rx = 0;
      ry = 0;
      scale = 1;
      if (!frame) frame = requestAnimationFrame(write);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ transition: "transform var(--duration-slow) var(--ease-out-quart)" }}
    >
      {children}
    </div>
  );
}
