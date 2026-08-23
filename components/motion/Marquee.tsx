import { cn } from "@/lib/cn";

/**
 * MARQUEE - a seamless scrolling line of text.
 *
 * The track holds the content TWICE and translates by exactly -50%, so the
 * second copy is in the first copy's starting position at the moment the
 * animation loops. That is what makes the seam invisible at any width,
 * without measuring anything at runtime.
 *
 * A SERVER component: the duplicate is rendered in the markup and the motion
 * is a single CSS animation on one composited layer. No JS, no resize
 * observer, no per-frame work.
 *
 * The duplicate is hidden from assistive tech so the line is announced once.
 * Hovering pauses it (see globals.css) - a moving line the reader cannot stop
 * is a line they cannot read. Under reduced motion it holds still entirely.
 */
export function Marquee({
  text,
  repeat = 4,
  duration = 34,
  className,
  itemClassName,
  "data-surface": surface,
}: {
  text: string;
  /** Copies per half-track. Enough to overflow the widest viewport. */
  repeat?: number;
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  className?: string;
  itemClassName?: string;
  /** Flood the band with a section surface colour. See globals.css. */
  "data-surface"?: string;
}) {
  const half = Array.from({ length: repeat });

  return (
    <div
      data-surface={surface}
      className={cn("marquee relative flex overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="marquee-track" data-run>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {half.map((_, i) => (
              <span key={i} className={cn("shrink-0", itemClassName)}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
