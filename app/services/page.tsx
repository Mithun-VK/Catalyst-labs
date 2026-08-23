import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { AtelierHero } from "@/components/sections/services/AtelierHero";
import { ServicesSection } from "@/components/sections/services/ServicesSection";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Software, AI & Automation Services | Catalyst Labs",
  description:
    "Custom software, AI and automation, web and mobile applications, SaaS builds and data integrations - scoped around how your business actually runs.",
  path: "/services",
});

/**
 * SERVICES - the atelier world.
 *
 * The only light page on the site. Services is where the reader is closest to
 * spending money, and the register shifts accordingly: ivory, quiet, slow,
 * mostly empty. Where Works shouts to be remembered, this page lowers its
 * voice to be believed.
 *
 * The old BuildMatrix table has been dropped from this route. A dense
 * comparison grid is a decision-support tool, and it fought the sequence
 * directly above it for the same job - the service detail pages carry that
 * detail properly, one practice at a time.
 */
export default function ServicesPage() {
  return (
    <World id="atelier">
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <AtelierHero />
      <ServicesSection />
      <CTABand
        title="Know which of these you need?"
        accent="Or want help deciding?"
        lead="Describe the problem in your own words. We will tell you which practice it belongs to, what it would take, and whether it is worth building at all."
      />
    </World>
  );
}
