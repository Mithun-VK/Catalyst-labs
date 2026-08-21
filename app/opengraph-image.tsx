import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} - software, AI and automation engineering`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card, generated at the edge from the same tokens as the site. Uses
 * system-safe fonts only, so nothing has to be fetched to render it.
 */
export default function OpengraphImage() {
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
            Software · AI · Automation
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f2f1ec",
              fontSize: 78,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              maxWidth: 940,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            We build the software that moves businesses forward.
          </div>
          <div
            style={{
              marginTop: 28,
              color: "#8b9099",
              fontSize: 26,
              lineHeight: 1.4,
              maxWidth: 820,
              display: "flex",
            }}
          >
            {site.shortDescription}
          </div>
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
          <div style={{ display: "flex", gap: 28, color: "#5d636c", fontSize: 20 }}>
            <span>AI</span>
            <span>Automation</span>
            <span>Web</span>
            <span>Mobile</span>
            <span>SaaS</span>
            <span>Data</span>
          </div>
          <div style={{ color: "#ff5b28", fontSize: 20, display: "flex" }}>
            {site.location.city}, {site.location.country}
          </div>
        </div>
      </div>
    ),
    size
  );
}
