import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Line-by-line text reveal - a SERVER component, zero JS.
 *
 * Each word is masked by its own line box and rises out of it as the block
 * scrolls into view, driven entirely by the scroll-driven animation in
 * globals.css.
 *
 * Lines are passed EXPLICITLY rather than split from a single string. Where a
 * sentence breaks is a composition decision in display type, and it cannot be
 * derived on the server anyway - the wrap point depends on the rendered width.
 * Passing lines also keeps each mask exactly one line tall, which is what
 * makes the rise read as glyphs emerging rather than a block sliding.
 *
 * Accessibility: the words are real text in document order, so the whole
 * string is selectable and is announced normally. Under reduced motion the
 * global rule collapses the animation and the text is simply present.
 */
export function TextReveal({
  lines,
  as: Tag = "span",
  className,
  lineClassName,
  variant = "rise",
}: {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** Applied to each line box - used for per-line colour or alignment. */
  lineClassName?: string;
  /**
   * "rise" (default) - a plain rise out of the line mask, used everywhere.
   * "pop" - an overshoot-and-settle bounce for the comic register (Works).
   * Both are scroll-driven and share the same fail-safe: with the reveal
   * CSS absent or under reduced motion, the words are simply present.
   */
  variant?: "rise" | "pop";
}) {
  // A single counter across all lines, so the cascade continues down the
  // block instead of restarting on every line.
  let wordIndex = 0;

  return (
    <Tag data-text-reveal={variant === "pop" ? "pop" : ""} className={cn(className)}>
      {lines.map((line, li) => (
        <span key={li} className={cn("tr-line", lineClassName)}>
          {line.split(" ").map((word, wi, all) => {
            const i = wordIndex++;
            return (
              <span
                key={`${li}-${wi}`}
                className="tr-word"
                style={{ "--i": i } as React.CSSProperties}
              >
                {wi < all.length - 1 ? `${word} ` : word}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/**
 * A group whose children cascade as they enter. Pure wrapper: the indices are
 * assigned by nth-child in CSS, so this adds no elements of its own and can
 * be dropped onto a grid or flex container directly.
 */
export function Stagger({
  children,
  step = 3,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  /** Offset per item, in % of the scroll range. Larger = slower cascade. */
  step?: number;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      data-stagger
      style={{ "--stagger-step": `${step}%` } as React.CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
