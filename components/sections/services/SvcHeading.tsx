import type { ReactNode } from "react";

/**
 * One heading pattern for every Services section, so the page reads as one
 * system: a numbered eyebrow, a compact H2 (capped at 3rem rather than the
 * 3.75rem the old sections used) and an optional aside that sits on the same
 * baseline instead of taking its own row.
 */
export function SvcHeading({
  id,
  index,
  eyebrow,
  title,
  aside,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.26em] text-mute-deep">
          {index} · {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-3 max-w-[24ch] text-paper"
          style={{
            fontSize: "clamp(1.75rem, 1rem + 2.4vw, 3rem)",
            lineHeight: "1.02",
            letterSpacing: "-0.03em",
            fontWeight: 500,
          }}
        >
          {title}
        </h2>
      </div>
      {aside ? <div className="max-w-sm text-small text-mute">{aside}</div> : null}
    </div>
  );
}

/** Shared vertical rhythm for the Services sections: about half the site default. */
export const SVC_SECTION = "relative scroll-mt-32 py-12 sm:py-16 lg:py-20";
