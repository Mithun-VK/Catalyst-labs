import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll-reveal wrapper - a SERVER component.
 *
 * Renders plain markup carrying `data-reveal`; the reveal itself is a pure
 * CSS scroll-driven animation (see `globals.css`). There is no controller and
 * no IntersectionObserver, so no JavaScript ships for this at all and the
 * client bundle does not grow with the number of revealed blocks.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  /**
   * Stagger within a group, expressed in ms for call-site familiarity.
   * Reveals are scroll-driven, so this converts to a shift in the element's
   * animation range rather than a time delay - 60ms reads as a 4% offset.
   * Capped so a large value can never push a block's reveal past the point
   * where it has already scrolled into view.
   */
  delay?: number;
  /** "clip" wipes in horizontally - used for rules and headline lines. */
  variant?: "rise" | "clip";
  as?: ElementType;
  className?: string;
}) {
  const stagger = Math.min(delay / 15, 18);

  return (
    <Tag
      data-reveal={variant === "clip" ? "clip" : ""}
      style={
        stagger
          ? ({ "--reveal-stagger": `${stagger}%` } as React.CSSProperties)
          : undefined
      }
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
