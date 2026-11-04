import Link from "next/link";
import { STATUS_LABEL, type Project } from "@/content/projects";
import { Counter } from "@/components/motion/Counter";
import { parseMetric } from "@/lib/parseMetric";
import { DeckVisual } from "@/components/sections/work/deck/DeckVisual";

/**
 * One project as a full-colour poster. `data-surface` re-themes the colour
 * tokens for the whole card (see the SURFACES block in globals.css), so no
 * text colour is named here: black lands on lime, white on blue, and the
 * thick comic outlines stay correct on every flood.
 *
 * A server component. The only client pieces inside are the count-up numbers.
 */

const SURFACE: Record<NonNullable<Project["accent"]>, string> = {
  orange: "orange",
  acid: "acid",
  pink: "pink",
  blue: "blue",
  yellow: "yellow",
  mint: "mint",
};

const TILT = ["-1.5deg", "1deg", "-0.5deg"];

export function PosterCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const stats = project.stats ?? [];

  return (
    <article
      id={`deck-card-${project.slug}`}
      data-surface={SURFACE[project.accent ?? "orange"]}
      aria-labelledby={`deck-title-${project.slug}`}
      className="deck-card relative overflow-hidden border-t-[3px] border-paper"
    >
      {/* Giant outlined index, cropped by the poster's own edge. Decorative:
          the real number is in the metadata line, where it is announced. */}
      <div
        aria-hidden="true"
        className="deck-number pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] select-none font-semibold leading-none tracking-[-0.06em] text-[length:clamp(9rem,26vw,24rem)]"
      >
        {number}
      </div>

      <div
        aria-hidden="true"
        className="halftone-corner pointer-events-none absolute -right-16 -top-16 z-0 h-64 w-64"
      />

      <div className="container-page relative z-10 grid w-full items-center gap-x-(--space-gutter) gap-y-12 py-16 lg:grid-cols-12 lg:py-12">
        {/* ---- visual ---------------------------------------------------- */}
        <div
          className={`relative min-w-0 lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : "lg:order-1"}`}
        >
          <DeckVisual project={project} priority={index === 0} />

          {project.href ? (
            <span
              className="live-pill absolute -top-3 right-0 z-30 rotate-[4deg] sm:-right-2"
              aria-label="Live"
            >
              <span className="live-pill-dot" aria-hidden="true" />
              Live
            </span>
          ) : null}

          {project.sticker ? (
            <span className="comic-tag absolute -left-1 -top-4 z-30 -rotate-[6deg] bg-paper px-3 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--surface)] sm:-left-3">
              {project.sticker}
            </span>
          ) : null}
        </div>

        {/* ---- text ------------------------------------------------------ */}
        <div
          className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-6"}`}
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
            <span>{number}</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span>{project.domain}</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span>
              {STATUS_LABEL[project.status]} · {project.year}
            </span>
          </p>

          <h3
            id={`deck-title-${project.slug}`}
            className="mt-4 break-words font-semibold uppercase leading-[0.9] tracking-[-0.045em] text-[length:clamp(2.5rem,1rem+5.2vw,5.5rem)]"
          >
            {project.name}
          </h3>

          <p className="mt-5 max-w-(--measure-wide) text-lead">{project.summary}</p>
          <p className="deck-detail mt-3 max-w-(--measure-wide) text-body text-mute">
            {project.detail}
          </p>

          {stats.length > 0 ? (
            <ul className="mt-7 flex flex-wrap gap-4">
              {stats.map((stat, i) => {
                const metric = parseMetric(stat.value);
                return (
                  <li
                    key={stat.label}
                    className="comic-panel max-w-[15rem] px-4 py-3"
                    style={
                      {
                        background: "var(--color-paper)",
                        color: "var(--surface)",
                        transform: `rotate(${TILT[i % TILT.length]})`,
                        "--comic-offset": "5px",
                      } as React.CSSProperties
                    }
                  >
                    <span className="block text-[length:clamp(1.5rem,1rem+1.6vw,2.25rem)] font-semibold leading-none tracking-[-0.03em]">
                      {metric ? (
                        <>
                          {metric.prefix}
                          <Counter value={metric.value} decimals={metric.decimals} />
                          {metric.suffix}
                        </>
                      ) : (
                        stat.value
                      )}
                    </span>
                    <span className="mt-1.5 block text-[0.75rem] leading-snug opacity-80">
                      {stat.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {/* Full proof list. With headline stats on show it is secondary, so
              it drops out while posters are stacked to keep each one on a
              single screen. */}
          {project.proof.length > 0 ? (
            <ul
              className={`mt-6 grid gap-2 border-t-2 border-paper/30 pt-5 ${stats.length > 0 ? "deck-detail" : ""}`}
            >
              {project.proof.map((item) => (
                <li key={item} className="flex items-start gap-3 text-small">
                  <span aria-hidden="true" className="hex-bullet mt-[0.3em]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.technology.map((tech) => (
              <li key={tech} className="comic-tag">
                {tech}
              </li>
            ))}
          </ul>

          {project.href || project.caseStudy ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {project.href ? (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comic-pill comic-press no-underline"
                  style={
                    {
                      "--comic-fill": "var(--color-paper)",
                      "--comic-fill-text": "var(--surface)",
                    } as React.CSSProperties
                  }
                >
                  Visit {project.href.replace("https://", "")}
                  <span aria-hidden="true">↗</span>
                </Link>
              ) : null}
              {project.caseStudy ? (
                <Link
                  href={`/work/${project.caseStudy}`}
                  className="comic-pill comic-press no-underline"
                  style={
                    {
                      "--comic-fill": "var(--surface)",
                      "--comic-fill-text": "var(--color-paper)",
                    } as React.CSSProperties
                  }
                >
                  Read the case study
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
