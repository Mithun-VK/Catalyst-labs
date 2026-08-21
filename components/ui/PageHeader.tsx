import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

/**
 * THE ALIGNMENT CONTRACT
 *
 * Every route renders this component and nothing else above the fold, so the
 * breadcrumb, eyebrow, H1 and lead land on identical baselines and identical
 * columns on every page of the site. Consistency across pages is what reads
 * as "designed"; a bespoke header per page is what reads as "assembled".
 *
 * Grid: content occupies columns 1–7, the meta aside occupies 9–12. The gap
 * between them is the same gutter token used by every other section.
 */

export type Crumb = { label: string; href?: string };

export function PageHeader({
  index,
  eyebrow,
  title,
  lead,
  crumbs = [],
  actions,
  meta,
  className,
}: {
  /** Section number in the site's running order. Keeps the spine motif. */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  /** Right-hand column: specification-style facts, never decoration. */
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative isolate overflow-hidden border-b border-line pt-32 pb-16 sm:pt-40 sm:pb-20",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-50"
      />

      <div className="container-page">
        {crumbs.length > 0 ? (
          <Reveal>
            <Breadcrumbs crumbs={crumbs} />
          </Reveal>
        ) : null}

        <div className="mt-8 grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="label flex items-center gap-3 text-mute">
                {index ? (
                  <>
                    <span className="text-ember">{index}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                  </>
                ) : null}
                <span>{eyebrow}</span>
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-6 text-h1 text-paper">{title}</h1>
            </Reveal>

            {lead ? (
              <Reveal delay={140}>
                <p className="mt-6 max-w-2xl text-lead text-mute">{lead}</p>
              </Reveal>
            ) : null}

            {actions ? (
              <Reveal delay={200}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {actions}
                </div>
              </Reveal>
            ) : null}
          </div>

          {meta ? (
            <Reveal delay={180} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              {meta}
            </Reveal>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="label inline-flex min-h-6 items-center py-1.5 text-mute-deep transition-colors duration-(--duration-base) hover:text-paper"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "label inline-flex min-h-6 items-center py-1.5",
                    isLast ? "text-paper" : "text-mute-deep"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast ? (
                <span aria-hidden="true" className="text-mute-deep/50">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Specification block for the header's right column. Facts only. */
export function MetaList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line border-t border-line">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-baseline justify-between gap-6 py-3.5"
        >
          <dt className="label shrink-0 text-mute-deep">{item.label}</dt>
          <dd className="text-right text-small text-paper-dim">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
