import type { Project } from "@/content/projects";

/**
 * The editorial number rail down the left edge of the pinned showcase - the
 * "active navigation/motion element" the brief asks the oversized project
 * numbers to become, and now also real navigation: clicking a number jumps
 * the showcase straight to that project. WorksShowcase owns the click
 * behaviour (it is the only place that knows the pin's scroll math - see
 * `scrollToProject` there) and drives the active number's scale/opacity and
 * the progress line's fill via the `data-number-item` / `data-progress-line`
 * markers; this file only renders correct, accessible markup.
 *
 * Real `<button>` elements, not styled `<li>`s: keyboard-focusable and
 * activatable with Enter/Space for free, which a click handler on a plain
 * list item is not. The list semantics (`<ol><li>`) are kept around each
 * button so the ordering is still announced as a list to assistive tech.
 *
 * The mark itself is deliberately a plain square with no visible digit -
 * that reads as a register/index mark, not a numbered menu, which is the
 * intended design. The project name is still there for anyone who needs
 * it: `aria-label` on the button and an `sr-only` digit inside carry the
 * same information a visible "01" would, so a screen reader or Ctrl+F
 * search loses nothing that a sighted mouse user has.
 *
 * Sits above whichever of the six flood colours (or the dark "ink" surface)
 * happens to be showing behind it at that moment, so it cannot read its
 * contrast from a single project's `[data-surface]` tokens the way content
 * INSIDE a panel does. `.number-rail-mark` instead uses a fixed white base
 * with `mix-blend-mode: difference` (see globals.css) - a small, deliberate
 * exception to the token system, and the standard technique for a fixed
 * overlay mark that must stay legible against an unpredictable, changing
 * background without a colour conditional for every surface.
 *
 * A thin line, not a bar - this reads as a printed register mark, not a
 * video-player scrubber. The fill is a fixed-height div scaled with
 * `transform: scaleY()`, not an animated `height` - height changes lay out
 * every frame, scaleY is compositor-only, and this repaints on every scroll
 * tick of the whole showcase, so the difference is not academic.
 */
export function ProjectNumberNav({
  projects,
}: {
  projects: Pick<Project, "slug" | "name">[];
}) {
  return (
    <nav
      aria-label="Jump to project"
      className="absolute left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:gap-5"
    >
      <div
        aria-hidden="true"
        className="number-rail-mark pointer-events-none relative h-40 w-px opacity-25"
      >
        <div
          data-progress-line
          className="number-rail-mark absolute inset-x-0 top-0 h-full w-px origin-top scale-y-0 opacity-100"
        />
      </div>

      <ol className="flex flex-col items-center gap-4">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <button
              type="button"
              data-number-item
              data-number-index={i}
              aria-label={`Go to ${project.name}`}
              className="number-rail-mark block h-3.5 w-3.5 cursor-pointer rounded-[3px] opacity-40 outline-offset-4 transition-opacity duration-(--duration-base) hover:opacity-70 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-current"
            >
              <span className="sr-only">{String(i + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
