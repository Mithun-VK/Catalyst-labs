import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { AtelierHero } from "@/components/sections/services/AtelierHero";
import { CatalystSystemMap } from "@/components/sections/services/CatalystSystemMap";
import { ServicesSection } from "@/components/sections/services/ServicesSection";
import { Impact } from "@/components/sections/Impact";
import { EngineeringProcess } from "@/components/sections/services/EngineeringProcess";
import { DeliverySignals } from "@/components/sections/services/DeliverySignals";
import { WorksTransition } from "@/components/sections/services/WorksTransition";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Software, AI & Automation Services | Catalyst Labs",
  description:
    "Custom software, AI and automation, web and mobile applications, SaaS builds and data integrations - scoped around how your business actually runs.",
  path: "/services",
});

/**
 * SERVICES - the atelier world, full narrative.
 *
 * Problem -> Engineering -> System -> Outcome, as eight sections rather than
 * a list of six practices:
 *
 *  01  Hero            - the claim
 *  02  System Map       - the practices, as one connected system
 *  03  Service Index     - each practice in full (ServicesSection - the
 *                         pinned, GSAP-driven experience built separately)
 *  --  Before -> After   - what changes (Impact, reused verbatim from /ai;
 *                         the same real state-change ledger, not a second
 *                         invented version of it)
 *  04  Process           - how it gets built (the real five stages from
 *                         content/process.ts)
 *  05  Delivery          - what can be checked (real facts only)
 *  06  Proof             - the bridge into /work
 *  --  Closing CTA        - the site's standard contact conversion, present
 *                         on every page
 *
 * Impact is reused rather than rebuilt: it is already exactly a real,
 * evidence-based "before/after" component, so a second one built for this
 * page would either duplicate it or invent a claim the first one does not
 * make.
 */
export default function ServicesPage() {
  return (
    <World id="atelier">
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <AtelierHero />
      <CatalystSystemMap />
      <ServicesSection />
      <Impact />
      <EngineeringProcess />
      <DeliverySignals />
      <WorksTransition />
      <CTABand
        title="Know which of these you need?"
        accent="Or want help deciding?"
        lead="Describe the problem in your own words. We will tell you which practice it belongs to, what it would take, and whether it is worth building at all."
      />
    </World>
  );
}
