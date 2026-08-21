import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/**
 * Every section on the page shares one skeleton: an id for the anchor nav, a
 * fluid vertical rhythm, and a hairline that reads as a spec-sheet divider.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  divider?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-24 py-(--space-section)",
        "defer-render",
        className
      )}
    >
      {divider ? (
        <div
          aria-hidden="true"
          className="rule-x pointer-events-none absolute inset-x-0 top-0"
        />
      ) : null}
      {children}
    </section>
  );
}

/** Uppercase mono eyebrow with the section index - the site's spine motif. */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label flex items-center gap-3 text-mute", className)}>
      {index ? (
        <>
          <span className="text-ember">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

/**
 * Compact section heading used on pages where the PageHeader already carries
 * the H1. It keeps the document outline unbroken (h1 → h2 → h3) and gives the
 * section a visible label instead of content starting out of nowhere.
 *
 * Aligned to the same 12-column grid as everything else: label in 1–3, title
 * in 4–9, note right-aligned in 10–12.
 */
export function CompactHeading({
  id,
  eyebrow,
  title,
  note,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="container-page">
      <Reveal>
        <div className="grid gap-x-(--space-gutter) gap-y-3 border-b border-line pb-6 lg:grid-cols-12 lg:items-baseline">
          <p className="label flex items-center gap-3 text-mute lg:col-span-3">
            <span className="text-ember">/</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            {eyebrow}
          </p>

          <h2 id={id} className="text-h3 text-paper lg:col-span-6">
            {title}
          </h2>

          {/* The count is orientation, not content - it earns a row only when
              there is a spare column for it. */}
          {note ? (
            <p className="hidden text-small text-mute lg:col-span-3 lg:block lg:text-right">
              {note}
            </p>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  aside,
  className,
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  /** Optional right-hand column content on wide screens. */
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "container-page",
        align === "center" && "text-center",
        className
      )}
    >
      <div
        className={cn(
          "grid gap-x-(--space-gutter) gap-y-8",
          aside ? "lg:grid-cols-12" : "",
          align === "center" && "justify-items-center"
        )}
      >
        <div className={cn(aside ? "lg:col-span-7" : "max-w-4xl")}>
          <Reveal>
            <Eyebrow
              index={index}
              className={align === "center" ? "justify-center" : ""}
            >
              {eyebrow}
            </Eyebrow>
          </Reveal>

          <Reveal delay={70}>
            <h2
              id={id}
              className="mt-6 text-h2 text-balance text-paper"
            >
              {title}
            </h2>
          </Reveal>

          {lead ? (
            <Reveal delay={140}>
              <p
                className={cn(
                  "mt-6 max-w-2xl text-lead text-mute",
                  align === "center" && "mx-auto"
                )}
              >
                {lead}
              </p>
            </Reveal>
          ) : null}
        </div>

        {aside ? (
          <Reveal delay={180} className="lg:col-span-5 lg:self-end">
            {aside}
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
