import { site } from "@/lib/site";
import { OG_SIZE } from "@/lib/seo";
import { renderOgCard } from "@/lib/og";

export const alt = `${site.name} - software, AI and automation engineering`;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Site-wide share card. Pages with a card of their own in lib/og-cards.ts
 * point at /og/... instead; everything else falls back to this one.
 */
export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: "Software · AI · Automation",
    title: "We build the software that moves businesses forward.",
    lead: site.shortDescription,
  });
}
