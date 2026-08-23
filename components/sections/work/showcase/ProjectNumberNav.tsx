/**
 * The editorial number rail down the left edge of the pinned showcase - the
 * "active navigation/motion element" the brief asks the oversized project
 * numbers to become. Purely presentational: WorksShowcase drives the active
 * number's scale/opacity and the progress line's height via the
 * `data-number-item` / `data-progress-line` markers.
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
 * video-player scrubber.
 */
export function ProjectNumberNav({ count }: { count: number }) {
  return (
    <nav
      aria-hidden="true"
      className="pointer-events-none absolute left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:gap-5"
    >
      <div className="number-rail-mark relative h-40 w-px opacity-25">
        <div
          data-progress-line
          className="number-rail-mark absolute inset-x-0 top-0 w-px origin-top opacity-100"
          style={{ height: "0%" }}
        />
      </div>

      <ol className="flex flex-col items-center gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            data-number-item
            data-number-index={i}
            className="number-rail-mark font-mono text-[0.6875rem] uppercase tracking-[0.15em] opacity-40"
          >
            {String(i + 1).padStart(2, "0")}
          </li>
        ))}
      </ol>
    </nav>
  );
}
