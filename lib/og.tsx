import { ImageResponse } from "next/og";
import { site } from "./site";
import { OG_SIZE } from "./seo";

/**
 * Share-card renderer, used by the site-wide /opengraph-image and by the
 * per-page cards under /og/... (see lib/og-cards.ts). Size: see OG_SIZE.
 *
 * System-safe fonts only, so nothing has to be fetched to render. Avoid the
 * rupee sign and other glyphs outside basic Latin in card text: the bundled
 * fallback font does not carry them.
 */

export type OgCard = {
  /** Small uppercase line above the title, e.g. "Case study". */
  eyebrow: string;
  title: string;
  /** Optional supporting line under the title. Keep it under ~110 chars. */
  lead?: string;
};

/** Long titles step down so they never run past three lines. */
function titleSize(title: string) {
  if (title.length <= 40) return 78;
  if (title.length <= 60) return 66;
  if (title.length <= 80) return 56;
  return 48;
}

export function renderOgCard({ eyebrow, title, lead }: OgCard) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090a",
          padding: 72,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Lattice */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(242,241,236,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,241,236,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #f2f1ec",
            }}
          >
            <div style={{ width: 12, height: 12, background: "#ff5b28" }} />
          </div>
          <div
            style={{
              color: "#f2f1ec",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginLeft: 12,
              color: "#8b9099",
              fontSize: 18,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f2f1ec",
              fontSize: titleSize(title),
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          {lead ? (
            <div
              style={{
                marginTop: 28,
                color: "#8b9099",
                fontSize: 26,
                lineHeight: 1.4,
                maxWidth: 900,
                display: "flex",
              }}
            >
              {lead}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(242,241,236,0.14)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", color: "#8b9099", fontSize: 20 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
          <div style={{ color: "#ff5b28", fontSize: 20, display: "flex" }}>
            {site.location.city}, {site.location.country}
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
