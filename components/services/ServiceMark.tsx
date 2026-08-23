/**
 * SERVICE MARK
 *
 * A quiet monogram for each practice - one thin-line motif per service,
 * drawn from what the practice actually is rather than a generic tech icon.
 * The register is closer to a fashion house's signet detail than a UI icon
 * set: single-weight strokes, a lot of empty space inside the frame, no
 * fill except the one small dot each mark uses as a full stop.
 *
 * Pure inline SVG, currentColor throughout, so a mark re-colours correctly
 * wherever it is placed (the gold accent on the resting state, ivory inside
 * the inverted teal panel) with no prop for colour ever needed.
 */

export type ServiceMarkKind =
  | "ai-automation"
  | "custom-software"
  | "web"
  | "mobile"
  | "saas-mvp"
  | "data-integrations";

export function ServiceMark({
  kind,
  className,
}: {
  kind: ServiceMarkKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <Mark kind={kind} />
    </svg>
  );
}

function Mark({ kind }: { kind: ServiceMarkKind }) {
  switch (kind) {
    /* A cycle that doesn't quite close - automation as a loop with a gap
       for judgement to enter, plus the one point where a person steps in. */
    case "ai-automation":
      return (
        <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M32 12 A20 20 0 1 1 13.8 24.4" />
          <path d="M32 12 L26 8 M32 12 L28 18" />
          <circle cx="44" cy="44" r="2" fill="currentColor" stroke="none" />
        </g>
      );

    /* Layered panels - a system built from parts that stack, not one slab. */
    case "custom-software":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <rect x="14" y="14" width="28" height="20" />
          <rect x="22" y="30" width="28" height="20" />
          <circle cx="46" cy="18" r="1.6" fill="currentColor" stroke="none" />
        </g>
      );

    /* A single-rule browser frame - the smallest true mark of "a page". */
    case "web":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <rect x="10" y="16" width="44" height="32" rx="2" />
          <path d="M10 24h44" />
          <circle cx="16" cy="20" r="1.1" fill="currentColor" stroke="none" />
        </g>
      );

    /* A slim device silhouette, nothing on the screen - the mark is the
       object, not a UI captured inside it. */
    case "mobile":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <rect x="22" y="8" width="20" height="48" rx="4" />
          <path d="M29 50h6" strokeLinecap="round" />
        </g>
      );

    /* An ascending line inside a bounding circle - growth, held to a
       deliberate shape rather than let run off unbounded. */
    case "saas-mvp":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <circle cx="32" cy="32" r="20" />
          <path
            d="M20 38 L27 30 L34 35 L44 22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="44" cy="22" r="1.6" fill="currentColor" stroke="none" />
        </g>
      );

    /* Three points, joined - separate systems made to talk. */
    case "data-integrations":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <path d="M18 44 L32 20 L46 44 Z" strokeLinejoin="round" />
          <circle cx="18" cy="44" r="2" fill="currentColor" stroke="none" />
          <circle cx="46" cy="44" r="2" fill="currentColor" stroke="none" />
          <circle cx="32" cy="20" r="2" fill="currentColor" stroke="none" />
        </g>
      );

    default:
      return null;
  }
}
