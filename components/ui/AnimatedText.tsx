import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Staged headline entrance. Each line sits in an overflow-clipped box and
 * rises into place on a delay, so the headline assembles line by line rather
 * than fading in as one block. Pure CSS - no client JS above the fold.
 * Under reduced motion the global override lands every line immediately.
 */
export function AnimatedLines({
  lines,
  className,
  lineClassName,
  delayStep = 90,
  initialDelay = 60,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delayStep?: number;
  initialDelay?: number;
}) {
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span
            className={cn("block will-change-transform", lineClassName)}
            style={{
              animation: `cl-fade-up 900ms var(--ease-out-quart) both`,
              animationDelay: `${initialDelay + i * delayStep}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
