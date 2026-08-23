/**
 * The subtle technical pipeline strip shown low in a panel during its exit
 * transition - "engineering depth without becoming an infographic."
 *
 * Stages are the project's own `technology` list (already verified, already
 * on the page in the tech-pill row above), never an invented pipeline name -
 * this is the same real facts read out in a different register, not a new
 * claim. Capped at four entries so the strip stays a gesture, not a diagram.
 *
 * The connecting line is a single SVG path with `pathLength=1`, drawn by
 * WorksShowcase via `strokeDashoffset` the same way the project glyphs are -
 * one technique for every path-draw moment on this page.
 */
export function BlueprintOverlay({ stages }: { stages: string[] }) {
  if (stages.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-blueprint
      className="pointer-events-none absolute inset-x-0 bottom-14 z-20 opacity-0"
    >
      <div className="container-page">
        <svg
          viewBox={`0 0 ${stages.length * 100} 4`}
          preserveAspectRatio="none"
          className="h-px w-full text-paper/50"
        >
          <path
            data-blueprint-path
            pathLength={1}
            d={`M0 2 H${stages.length * 100}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div className="mt-3 flex justify-between font-mono text-[0.625rem] uppercase tracking-[0.2em] text-paper/60">
          {stages.map((stage) => (
            <span key={stage} data-blueprint-label>
              {stage}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
