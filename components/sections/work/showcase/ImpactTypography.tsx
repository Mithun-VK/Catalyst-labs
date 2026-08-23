/**
 * The cinematic transition words ("BUILT." / "TESTED." / "DEPLOYED." / a
 * closing status word) shown briefly as a project's panel compresses into
 * the next. Nested INSIDE each ProjectPanel rather than as a page-level
 * overlay, so it inherits that panel's own `[data-surface]` colour tokens -
 * `text-paper` is already the correct high-contrast colour for whichever of
 * the six floods is currently showing, with no extra contrast logic needed
 * here.
 *
 * Purely presentational: opacity, scale and clip-path all start at rest
 * (invisible) and are driven entirely by WorksShowcase's scroll-scrubbed
 * timeline via the `data-impact-word` / `data-word-index` markers below.
 * Never permanently part of the project's content - these words describe the
 * BUILD PROCESS in general, not a claim about the specific project, which is
 * why the same four-stage language applies to every project uniformly.
 */
export function ImpactTypography({ words }: { words: string[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      {words.map((word, i) => (
        <span
          key={word}
          data-impact-word
          data-word-index={i}
          className="impact-word absolute font-semibold uppercase leading-none tracking-[-0.03em] text-paper opacity-0"
        >
          {word}.
        </span>
      ))}
    </div>
  );
}
