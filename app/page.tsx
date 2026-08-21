import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import {
  AIPreview,
  ProcessPreview,
  ServicesPreview,
  WorkPreview,
} from "@/components/sections/previews";

export const metadata: Metadata = buildMetadata({
  title: "Website & Software Development in Chennai | Catalyst Labs",
  description:
    "We build websites, software and AI automation that make businesses more visible and easier to buy from. Chennai studio, engineered for outcomes.",
  path: "",
});

/**
 * Home.
 *
 * Its job is to answer "what is this company and can they build my thing" in
 * the first screen, then route the visitor to the page that answers their
 * particular question. Each preview shows the shape of a section and hands
 * off - the detail lives on its own route.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WorkPreview />
      <ServicesPreview />
      <AIPreview />
      <ProcessPreview />
      <WhyUs />
      <CTABand />
    </>
  );
}
