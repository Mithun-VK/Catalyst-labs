import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { AIHero } from "@/components/sections/ai/AIHero";
import { AISection } from "@/components/sections/AISection";
import { ReliabilityGrid } from "@/components/sections/ai/ReliabilityGrid";
import { Impact } from "@/components/sections/Impact";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "AI Automation for Business Operations | Catalyst Labs",
  description:
    "Watch real AI workflows end to end, from customer message to business action. Built into your systems so the model can act, not just chat.",
  path: "/ai",
});

/**
 * AI & AUTOMATION - the system world, robotics register.
 *
 * This page previously opened with the shared PageHeader, which made it read
 * as the home page with different copy. It now has an identity of its own:
 * black ground, neon instrumentation, a sweeping sensor array, and telemetry
 * type throughout.
 *
 * The order is an argument, not a layout. The array claims the system watches
 * your operation continuously; the signal path shows one running end to end;
 * the failure grid answers the question a serious buyer actually has, which
 * is what happens on the day it does not work. Spectacle first, evidence
 * immediately after - a futuristic page that cannot answer the second
 * question is just a screensaver.
 */
export default function AIPage() {
  return (
    <World id="system">
      <JsonLd data={breadcrumbSchema([{ name: "AI & Automation", path: "/ai" }])} />
      <AIHero />
      <AISection showHeading={false} />
      <ReliabilityGrid />
      <Impact />
      <CTABand
        title="Not sure AI is the right tool?"
        accent="We'll tell you."
        lead="Plenty of problems are solved better by a query, a form or a scheduled job. We would rather build you the cheaper thing that works than the impressive thing that doesn't."
      />
    </World>
  );
}
