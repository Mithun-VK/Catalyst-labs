import Link from "next/link";
import { STATUS_LABEL, type Project } from "@/content/projects";
import { BrowserFrame, PlanetBadge } from "@/components/projects/ProjectVisual";
import { Tilt } from "@/components/motion/Tilt";
import { Magnetic } from "@/components/motion/Magnetic";
import { parseMetric } from "@/lib/parseMetric";
import { ImpactTypography } from "@/components/sections/work/showcase/ImpactTypography";
import { BlueprintOverlay } from "@/components/sections/work/showcase/BlueprintOverlay";

/**
 * One project's full case-study content, in the exact DOM shape the desktop
 * WorksShowcase controller (see WorksShowcase.tsx) expects to find via its
 * `data-role="..."` / `data-gsap="..."` markers.
 *
 * DELIBERATELY has no animation of its own beyond ordinary CSS transitions
 * (hover states) - every entrance/exit value is written imperatively by GSAP.
 * That split means this file stays server-renderable markup: with no
 * JavaScript, under `prefers-reduced-motion`, or below the 1024px cut where
 * WorksShowcase never mounts its ScrollTrigger, every panel simply sits in
 * normal document flow, fully visible, in the order below - the "no
 * important information may depend on animation" requirement is met by
 * construction, not by a fallback branch.
 *
 * Metric numbers render their REAL recorded value from the start
 * (`metric.value.toFixed(...)`), never a placeholder "0" - GSAP counts up
 * FROM zero only once it takes over, and restores the original text on
 * cleanup (see WorksShowcase.tsx). The page is never allowed to show an
 * invented number.
 */

const SURFACE: Record<NonNullable<Project["accent"]>, string> = {
  orange: "orange",
  acid: "acid",
  pink: "pink",
  blue: "blue",
  yellow: "yellow",
  mint: "mint",
};

export function ProjectPanel({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const flip = index % 2 === 1;
  const impactWords = [
    "Built",
    "Tested",
    "Deployed",
    project.href ? "Live" : STATUS_LABEL[project.status],
  ];

  return (
    <article
      data-panel
      data-index={index}
      data-surface={SURFACE[project.accent ?? "orange"]}
      className="relative flex min-h-screen w-full items-center overflow-hidden py-24"
    >
      {/* Covers the surface at rest; the showcase controller wipes this
          clear via clip-path as the project enters - the "colour field
          reveal" the brief asks for, played once per project. */}
      <div
        data-gsap="field-mask"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "var(--color-ink)" }}
      />

      <div
        aria-hidden="true"
        className="halftone-corner pointer-events-none absolute -right-16 -top-16 z-0 h-72 w-72"
      />

      <div
        data-gsap="content-wrap"
        className="container-page relative z-20 grid w-full items-center gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12"
      >
        {/* ---- visual --------------------------------------------------- */}
        <div
          className={`flex flex-col items-center gap-5 lg:col-span-4 lg:justify-self-center ${flip ? "lg:order-2 lg:col-start-9" : "lg:order-1"}`}
        >
          <div data-role="visual" className="w-full">
            <Tilt>
              {project.image ? (
                <BrowserFrame project={project} />
              ) : (
                <PlanetBadge project={project} />
              )}
            </Tilt>
          </div>

          {project.href ? (
            <span data-gsap="live-stamp" className="live-pill">
              <span className="live-pill-dot" aria-hidden="true" />
              Live
            </span>
          ) : null}
        </div>

        {/* ---- text ------------------------------------------------------ */}
        <div
          className={`lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-6"}`}
        >
          <p
            data-role="meta"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.2em]"
          >
            <span data-role="number" className="inline-block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span>{project.domain}</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span>
              {STATUS_LABEL[project.status]} · {project.year}
            </span>
          </p>

          <div data-role="title" className="relative mt-5 overflow-hidden">
            {/* Registration-offset ghost: sits a couple of px off the real
                headline and settles to zero at the tail of the mask wipe -
                a brief print-registration cue, not a glitch. */}
            <span
              data-gsap="title-ghost"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 font-semibold uppercase leading-[0.88] tracking-[-0.045em] opacity-0"
              style={{ fontSize: "clamp(2.25rem, 0.5rem + 5.6vw, 5.25rem)" }}
            >
              {project.name}
            </span>
            <h3
              data-gsap="title-inner"
              className="font-semibold uppercase leading-[0.88] tracking-[-0.045em]"
              style={{ fontSize: "clamp(2.25rem, 0.5rem + 5.6vw, 5.25rem)" }}
            >
              {project.name}
            </h3>
          </div>

          <p data-role="description" className="mt-7 max-w-(--measure-wide) text-lead">
            {project.summary}
          </p>

          <ul
            data-role="metrics"
            className="mt-8 grid gap-2.5 border-t-2 border-paper/30 pt-6"
          >
            {project.proof.map((item) => {
              const metric = parseMetric(item);
              return (
                <li
                  key={item}
                  data-metric-row
                  className="flex items-start gap-3 text-small"
                >
                  <span aria-hidden="true" className="hex-bullet mt-[0.3em]" />
                  {metric ? (
                    <span>
                      {metric.prefix}
                      <span
                        data-metric-value
                        data-target={metric.value}
                        data-decimals={metric.decimals}
                      >
                        {metric.value.toFixed(metric.decimals)}
                      </span>
                      {metric.suffix}
                    </span>
                  ) : (
                    <span>{item}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <ul data-role="tech" className="mt-7 flex flex-wrap gap-2">
            {project.technology.map((tech) => (
              <li key={tech} className="comic-tag tech-pill">
                {tech}
              </li>
            ))}
          </ul>

          {project.href ? (
            <div data-role="cta" className="mt-9">
              <Magnetic>
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comic-pill comic-press no-underline"
                  style={
                    {
                      "--comic-fill": "var(--color-paper)",
                      "--comic-fill-text": "var(--surface, var(--color-ink))",
                    } as React.CSSProperties
                  }
                >
                  Visit {project.href.replace("https://", "")}
                  <span aria-hidden="true" data-gsap="cta-arrow" className="inline-block">
                    ↗
                  </span>
                </Link>
              </Magnetic>
            </div>
          ) : null}
        </div>
      </div>

      <BlueprintOverlay stages={project.technology.slice(0, 4)} />
      <ImpactTypography words={impactWords} />
    </article>
  );
}
