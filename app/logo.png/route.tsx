import { ImageResponse } from "next/og";

/**
 * Organization logo for structured data.
 *
 * Google's logo rich result needs a real, crawlable raster image - an inline
 * SVG mark in the DOM does not qualify. Generating it here keeps it in sync
 * with the brand tokens and avoids committing a binary that drifts.
 *
 * 512×512, well above the 112px minimum, on an opaque ground because
 * transparent logos render unpredictably in search surfaces.
 */

// Note: `contentType` is not a valid Route Handler export (that belongs to
// metadata image files). ImageResponse sets `content-type: image/png` itself.
export const runtime = "nodejs";
const SIZE = 512;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090a",
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "26px solid #f2f1ec",
          }}
        >
          <div style={{ width: 116, height: 116, background: "#ff5b28" }} />
        </div>
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
