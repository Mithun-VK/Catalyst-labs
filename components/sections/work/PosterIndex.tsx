import Link from "next/link";
import { projects, STATUS_LABEL, type Project } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger } from "@/components/motion/TextReveal";
import { ParallaxIndex } from "@/components/sections/work/ParallaxIndex";
import { ParallaxMark } from "@/components/sections/work/ParallaxMark";
import { BrowserFrame, PlanetBadge } from "@/components/projects/ProjectVisual";
import { Counter } from "@/components/motion/Counter";
import { parseMetric } from "@/lib/parseMetric";

/**
 * POSTER INDEX - poster world, comic register.
 *
 * Every project owns a full-bleed field of saturated colour, at rest. Not on
 * hover: a page that is only colourful while the pointer is over it is not a
 * colourful page, and on a phone it never becomes one at all. Scrolling this
 * page should feel like flicking through a stack of printed posters.
 *
 * TWO MARK TREATMENTS, chosen by what actually exists for a project:
 *  - A project with a real, public site (`project.image`) gets a screenshot
 *    of it, framed in browser chrome. A real screenshot is stronger evidence
 *    than a generated mark, and this site would rather show the genuine
 *    article wherever one exists (see content/projects.ts).
 *  - Everything else - an API, a research stack, anything with no public
 *    page to screenshot - keeps the circular "planet" badge and its
 *    generated glyph (see ProjectGlyph). A screenshot of a site nobody can
 *    visit is not evidence, so this project never fakes one.
 *
 * The finish on both is drawn from the studio's own client sites, not one
 * generic template: the coloured glow and rotating sweep on the planet
 * badge read from quinelements.com's glowing radar disc, the browser-chrome
 * frame is the universal "this is a real website" convention every one of
 * those four screenshots actually is, the small bordered "Live" readout
 * reads from arkangel.co.in's own market-data pill (and only ever appears
 * on a project that actually has an href), and the restraint - one glow,
 * one sweep, a handful of dots - reads from fashionprofiles.in.
 *
 * SCROLL CHOREOGRAPHY. Each row used to enter as one lump - mark, headline,
 * proof list and tags all rising together. It is now staged: the giant
 * background index drifts continuously as the row crosses the viewport
 * (ParallaxIndex, Motion-driven - a value that keeps changing, not a single
 * enter-and-hold), the mark scales and rotates on the same scroll-linked
 * mechanic (ParallaxMark), the text rises a beat behind that, and the proof
 * list and technology tags cascade in item by item via Stagger. Text staging
 * stays the site's zero-JS scroll-driven CSS reveal (see globals.css) -
 * only the two elements that need a continuously-changing value pull in
 * Motion, the same GSAP/Motion split the /services pinned experience uses.
 *
 * Each field carries `data-surface`, which re-themes the colour tokens for
 * that section (see the SURFACES block in globals.css). That is why nothing
 * in this file sets a text colour: `text-paper`, `text-mute` and the
 * hairlines all resolve to values chosen for the colour underneath, so black
 * type lands on lime and white type lands on electric blue without a single
 * conditional here. `.comic-panel`, `.comic-tag` and `.comic-pill` follow the
 * same rule through `--color-paper`, which is why the thick outlines stay
 * correct on every one of the six floods without a colour ever being named
 * in this file.
 *
 * A SERVER component with no JavaScript. Hover only adds movement - the mark
 * lifts and the title shifts - so a touch device loses nothing but motion.
 */

/** Surface per project, driven by the data rather than the row's position. */
const SURFACE: Record<NonNullable<Project["accent"]>, string> = {
  orange: "orange",
  acid: "acid",
  pink: "pink",
  blue: "blue",
  yellow: "yellow",
  mint: "mint",
};

export function PosterIndex() {
  return (
    <section aria-labelledby="poster-index-heading">
      <h2 id="poster-index-heading" className="sr-only">
        Selected projects
      </h2>

      <ul>
        {projects.map((project, i) => (
          <PosterRow key={project.slug} project={project} index={i} />
        ))}
      </ul>
    </section>
  );
}

function PosterRow({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <li
      data-surface={SURFACE[project.accent ?? "orange"]}
      className="group relative overflow-hidden"
    >
      {/* The index, set enormous and cropped by the field's own edge. This is
          the device that makes the block read as a poster rather than a
          coloured section. Decorative - the real number is in the metadata
          line below, where it is announced. Now drifts on scroll (see
          ParallaxIndex) rather than only scaling in once. */}
      <ParallaxIndex index={index} flip={flip} />

      {/* md:, not lg: - this component only ever renders below the 1024px
          cut (see app/work/page.tsx), so a `lg:` breakpoint here would never
          fire and tablet would get the same single-column phone layout as a
          390px screen despite having the width for the side-by-side
          composition. `md:` (768px) is what actually gives the tablet tier
          its own "reduced" layout, distinct from the mobile stack. */}
      <article className="container-page relative grid items-center gap-x-(--space-gutter) gap-y-10 py-20 md:grid-cols-12 md:py-28">
        {/* ---- mark --------------------------------------------------- */}
        <div
          className={`flex flex-col items-center gap-4 md:col-span-4 md:justify-self-center ${flip ? "md:order-2 md:col-start-9" : "md:order-1"}`}
        >
          {/* data-mark-mobile scopes the CSS glyph-draw reveal below to this
              (PosterIndex-only) tree - PlanetBadge/BrowserFrame are SHARED
              with the desktop showcase, which drives the same glyph paths
              imperatively via GSAP inline styles. A CSS animation targeting
              them unscoped would win the cascade over GSAP's inline styles
              there and break the scroll-scrubbed draw, so this only ever
              matches the mobile/tablet presentation. */}
          <div data-mark-mobile className="relative w-full">
            <div
              aria-hidden="true"
              className="halftone-corner pointer-events-none absolute -right-6 -top-6 z-0 h-32 w-32"
            />
            <ParallaxMark>
              {project.image ? (
                <BrowserFrame project={project} />
              ) : (
                <PlanetBadge project={project} />
              )}
            </ParallaxMark>
          </div>

          {/* The one fact worth surfacing on the mark itself: whether this
              is something you can actually go and visit right now.
              arkangel.co.in's own bordered, mono-font status pill, borrowed
              for the one instrument reading that belongs here - shown only
              where it is true, never as decoration. "stamp" plays it in with
              a small scale/rotate settle rather than a plain rise - reading
              as a physical deployment stamp, matching the desktop showcase's
              LiveStamp without needing any JS to do it. */}
          {project.href ? (
            <Reveal delay={120} variant="stamp">
              <span className="live-pill">
                <span className="live-pill-dot" aria-hidden="true" />
                Live
              </span>
            </Reveal>
          ) : null}
        </div>

        {/* ---- text ------------------------------------------------- */}
        {/* min-w-0: without it, a CSS grid track sizes to its content's
            intrinsic width rather than the track width, so a long unbroken
            project name (e.g. "SAFEMERCHANT") could push the column wider
            than its 7-of-12 share instead of wrapping inside it. */}
        <div
          className={`min-w-0 md:col-span-7 ${flip ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-6"}`}
        >
          <Reveal delay={70}>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
              <span>{project.domain}</span>
              <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
              <span>
                {STATUS_LABEL[project.status]} · {project.year}
              </span>
            </p>
          </Reveal>

          <Reveal delay={110}>
            {/*
              Two different clamp curves meet at the md: cut, because the
              column this heading sits in changes shape there: below 768px
              it has the whole container width (a single stacked column);
              at 768px+ it shares the row with the mark and only gets 7 of
              12 grid columns (see the grid on the <article> above). Reusing
              one vw-based curve across both meant a size tuned to look
              right full-width was too large for the narrower tablet column
              - "SAFEMERCHANT" (one unbroken word, so it cannot wrap to
              rescue itself) ran off the right edge at 768-1023px. Below
              md: the plain rem clamp is unchanged from before. `break-words`
              is the safety net under both: if a future project name is
              still too wide for its column, it breaks rather than overflows.
            */}
            <h3
              className="mt-5 break-words font-semibold uppercase leading-[0.88] tracking-[-0.045em] transition-transform duration-(--duration-slow) ease-(--ease-out-quart) group-hover:translate-x-2 text-[length:clamp(2.5rem,1rem+6.4vw,6rem)] md:text-[length:clamp(2.25rem,1.5rem+3.5vw,4.25rem)]"
            >
              {project.name}
            </h3>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-7 max-w-(--measure-wide) text-lead">
              {project.summary}
            </p>
          </Reveal>
          <Reveal delay={170}>
            <p className="mt-4 max-w-(--measure-wide) text-body text-mute">
              {project.detail}
            </p>
          </Reveal>

          {/* Recorded results only - never an estimate. Cascades in item by
              item rather than arriving as one flat block. */}
          <Stagger
            as="ul"
            step={2}
            className="mt-8 grid gap-2.5 border-t-2 border-paper/30 pt-6"
          >
            {project.proof.map((item) => {
              const metric = parseMetric(item);
              return (
                <li key={item} className="flex items-start gap-3 text-small">
                  <span aria-hidden="true" className="hex-bullet mt-[0.3em]" />
                  {metric ? (
                    <span>
                      {metric.prefix}
                      <Counter value={metric.value} decimals={metric.decimals} />
                      {metric.suffix}
                    </span>
                  ) : (
                    item
                  )}
                </li>
              );
            })}
          </Stagger>

          <Stagger
            as="ul"
            step={1.5}
            className="mt-7 flex flex-wrap gap-2"
          >
            {project.technology.map((tech) => (
              <li key={tech} className="comic-tag">
                {tech}
              </li>
            ))}
          </Stagger>

          {project.href ? (
            <Reveal delay={220}>
              <Link
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="comic-pill comic-press mt-9 no-underline"
                style={
                  {
                    "--comic-fill": "var(--color-paper)",
                    "--comic-fill-text": "var(--surface, var(--color-ink))",
                  } as React.CSSProperties
                }
              >
                Visit {project.href.replace("https://", "")}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </article>
    </li>
  );
}

