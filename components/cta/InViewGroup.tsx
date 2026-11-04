"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wrapper that flips `data-inview="true"` the first time it scrolls into
 * view, so CSS transitions keyed on that attribute (see cta.css) can play a
 * staged entrance. Content is fully visible without JavaScript: the CSS only
 * hides it while the attribute is explicitly "false", which is set after
 * mount.
 */
export function InViewGroup({
  children,
  className,
  threshold = 0.35,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"pending" | "false" | "true">("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setState("true");
      return;
    }
    setState("false");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("true");
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      data-inview={state === "pending" ? undefined : state}
    >
      {children}
    </div>
  );
}
