import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { GlassField } from "@/components/glass/GlassField";
import { GlassAurora } from "@/components/glass/GlassAurora";
import { GlassHero } from "@/components/sections/services/GlassHero";
import { ServicesSubnav } from "@/components/sections/services/ServicesSubnav";
import { PracticeExplorer } from "@/components/sections/services/PracticeExplorer";
import { ImpactToggle } from "@/components/sections/services/ImpactToggle";
import { ProcessTimeline } from "@/components/sections/services/ProcessTimeline";
import { StackExplorer } from "@/components/sections/services/StackExplorer";
import { ProofCards } from "@/components/sections/services/ProofCards";
import { ServicesFaq } from "@/components/sections/services/ServicesFaq";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Software & AI Automation Services in India | Catalyst Labs",
  description:
    "Custom software, AI automation, web and mobile apps built in India for US, UK, EU and Indian businesses. Fixed-scope proposals, clear ownership.",
  path: "/services",
});

/**
 * SERVICES - the atelier world in liquid glass, built for density.
 *
 * Every section answers one question and lets the visitor act on it:
 *
 *  Hero      which practice is mine?        (service finder + terms band)
 *  --        where is everything?           (sticky section bar)
 *  01        what do you do, in full?       (bento explorer, expand in place)
 *  02        what changes for me?           (before / after switch)
 *  03        how does it get built?         (timeline + shared detail pane)
 *  04        on what technology?            (layer tabs, "used in" lookup)
 *  05        can you prove it?              (three real projects)
 *  06        what about cost, data, time?   (FAQ, FAQPage schema)
 *  Start     the shared CTA band, tightened on this page
 *
 * Sections use a compact rhythm (SVC_SECTION in SvcHeading.tsx) instead of
 * the site-wide 11rem section padding, and no section repeats another's
 * content. The glass layer and its accessibility/performance rules live in
 * components/glass/glass.css.
 */
export default function ServicesPage() {
  return (
    <World id="atelier" className="bg-transparent">
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <GlassAurora />
      <GlassField>
        <GlassHero />
        <ServicesSubnav />
        <PracticeExplorer />
        <ImpactToggle />
        <ProcessTimeline />
        <StackExplorer />
        <ProofCards />
        <ServicesFaq />
        <div id="start" className="scroll-mt-32">
          <CTABand
            title="Know which of these you need?"
            accent="Or want help deciding?"
            lead="Describe the problem in your own words. We will tell you which practice it belongs to, what it would take, and whether it is worth building at all."
            location="services"
          />
        </div>
      </GlassField>
    </World>
  );
}
