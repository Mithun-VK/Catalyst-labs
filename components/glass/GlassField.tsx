"use client";

import { useRef, type ReactNode } from "react";
import "@/components/glass/glass.css";

/**
 * Scope + pointer light for the glass page.
 *
 * Renders the `data-glass` root that glass.css tokens hang off, and keeps ONE
 * delegated pointer listener for the whole page: when the pointer is over a
 * `.glass` pane it writes the pointer's position into that pane's `--mx/--my`
 * and flags it lit, which the pane's ::before turns into a specular highlight
 * that tracks the cursor. One listener, one element touched per frame, no
 * per-pane React state. Does nothing for touch, and the CSS removes the
 * highlight under reduced motion.
 */
export function GlassField({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const lit = useRef<HTMLElement | null>(null);
  const frame = useRef(0);

  function clear() {
    if (lit.current) {
      lit.current.removeAttribute("data-lit");
      lit.current = null;
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const pane = (e.target as HTMLElement).closest<HTMLElement>(".glass");
    if (!pane) {
      clear();
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = pane.getBoundingClientRect();
      pane.style.setProperty("--mx", `${x - rect.left}px`);
      pane.style.setProperty("--my", `${y - rect.top}px`);
      if (lit.current !== pane) {
        clear();
        pane.setAttribute("data-lit", "true");
        lit.current = pane;
      }
    });
  }

  return (
    <div
      data-glass
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={clear}
    >
      {children}
    </div>
  );
}
