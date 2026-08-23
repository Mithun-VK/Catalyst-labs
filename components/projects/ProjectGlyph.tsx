import { cn } from "@/lib/cn";

/**
 * PROJECT GLYPH
 *
 * An abstract technical mark standing in for a project preview.
 *
 * The alternative was worse. There are no product screenshots to publish for
 * most of this work - several projects are APIs, research stacks or covered
 * by agreement - and the usual fillers (stock photography, a laptop mockup,
 * an invented dashboard) would be decoration pretending to be evidence.
 *
 * Each glyph is instead drawn from what the system actually is: a scoring
 * curve for the fraud model, a mean-reverting spread for the trading stack, a
 * ledger for the compliance platform. Pure inline SVG - no image request, no
 * layout shift, and it re-colours with the world because every stroke uses
 * currentColor.
 */

export type GlyphKind =
  | "curve"
  | "spread"
  | "ledger"
  | "weave"
  | "circuit"
  | "lattice"
  | "flow";

/** Maps a project's domain to the mark that describes it. */
export function glyphForDomain(domain: string): GlyphKind {
  const d = domain.toLowerCase();
  if (d.includes("payments")) return "curve";
  if (d.includes("trading")) return "spread";
  if (d.includes("quantitative")) return "spread";
  if (d.includes("compliance")) return "ledger";
  if (d.includes("apparel")) return "weave";
  if (d.includes("ev ")) return "circuit";
  if (d.includes("cryptography")) return "lattice";
  if (d.includes("security")) return "lattice";
  if (d.includes("data")) return "flow";
  return "flow";
}

export function ProjectGlyph({
  kind,
  className,
}: {
  kind: GlyphKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Baseline grid, common to every mark. data-gsap is inert without JS -
          only the desktop showcase controller (WorksShowcase) ever queries
          it, to fade the grid in a beat before the signature path draws. */}
      <g data-gsap="glyph-grid" stroke="currentColor" strokeWidth="0.5" opacity="0.18">
        <path d="M0 20h120M0 40h120M0 60h120" />
        <path d="M30 0v80M60 0v80M90 0v80" />
      </g>
      <Mark kind={kind} />
    </svg>
  );
}

function Mark({ kind }: { kind: GlyphKind }) {
  switch (kind) {
    /* A classifier's ROC curve: the shape of a model that separates. */
    case "curve":
      return (
        <g>
          <path
            d="M8 72 L112 8"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          <path
            data-gsap="glyph-path"
            pathLength={1}
            d="M8 72 C 30 40, 46 20, 112 8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle data-gsap="glyph-point" cx="112" cy="8" r="2.4" fill="currentColor" />
        </g>
      );

    /* A spread oscillating around its mean, with the entry bands. */
    case "spread":
      return (
        <g>
          <path d="M4 40h112" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <path
            d="M4 24h112M4 56h112"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.45"
          />
          <path
            data-gsap="glyph-path"
            pathLength={1}
            d="M4 40 L18 22 L30 46 L44 26 L58 52 L72 30 L86 48 L100 34 L116 40"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      );

    /* Stacked ledger rows - records reconciling to a total. */
    case "ledger":
      return (
        <g stroke="currentColor" strokeLinecap="round">
          <path data-gsap="glyph-path" pathLength={1} d="M12 18h64" strokeWidth="1.5" />
          <path data-gsap="glyph-path" pathLength={1} d="M12 30h84" strokeWidth="1.5" opacity="0.75" />
          <path data-gsap="glyph-path" pathLength={1} d="M12 42h48" strokeWidth="1.5" opacity="0.6" />
          <path data-gsap="glyph-path" pathLength={1} d="M12 54h72" strokeWidth="1.5" opacity="0.45" />
          <path data-gsap="glyph-path" pathLength={1} d="M12 66h100" strokeWidth="2.2" />
        </g>
      );

    /* Warp and weft - a sourcing and production grid. */
    case "weave":
      return (
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path data-gsap="glyph-path" pathLength={1} d="M20 14v52M36 14v52M52 14v52M68 14v52M84 14v52M100 14v52" opacity="0.55" />
          <path data-gsap="glyph-path" pathLength={1} d="M14 22h92M14 34h92M14 46h92M14 58h92" opacity="0.9" />
        </g>
      );

    /* A charge path routed like a circuit trace. */
    case "circuit":
      return (
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path data-gsap="glyph-path" pathLength={1} d="M8 60 H40 V26 H72 V56 H112" strokeWidth="1.6" />
          <circle data-gsap="glyph-point" cx="8" cy="60" r="2.6" fill="currentColor" stroke="none" />
          <circle data-gsap="glyph-point" cx="112" cy="56" r="2.6" fill="currentColor" stroke="none" />
          <path data-gsap="glyph-path" pathLength={1} d="M56 18 L50 34 H60 L54 48" strokeWidth="1.6" />
        </g>
      );

    /* A key lattice: points and the edges that must all hold. */
    case "lattice":
      return (
        <g stroke="currentColor" strokeWidth="1">
          <path data-gsap="glyph-path" pathLength={1} d="M24 60 L48 20 L96 34 L72 66 Z" />
          <path data-gsap="glyph-path" pathLength={1} d="M24 60 L96 34M48 20L72 66" opacity="0.45" />
          {[
            [24, 60],
            [48, 20],
            [96, 34],
            [72, 66],
          ].map(([cx, cy]) => (
            <circle data-gsap="glyph-point" key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" stroke="none" />
          ))}
        </g>
      );

    /* Many inputs converging into one pipeline. */
    case "flow":
    default:
      return (
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path data-gsap="glyph-path" pathLength={1} d="M10 18 C 44 18, 44 40, 78 40" />
          <path data-gsap="glyph-path" pathLength={1} d="M10 40 H78" opacity="0.85" />
          <path data-gsap="glyph-path" pathLength={1} d="M10 62 C 44 62, 44 40, 78 40" />
          <path data-gsap="glyph-path" pathLength={1} d="M78 40 H112" strokeWidth="2.2" />
          <circle data-gsap="glyph-point" cx="112" cy="40" r="2.6" fill="currentColor" stroke="none" />
        </g>
      );
  }
}
