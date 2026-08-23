import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { About } from "@/components/sections/About";
import { ProcessSpine } from "@/components/sections/about/ProcessSpine";
import { TechStack } from "@/components/sections/TechStack";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "About Catalyst Labs: A Software & AI Studio in Chennai",
  description:
    "A small software and AI engineering studio in Chennai. How we work, what we believe about building systems, and the company record - verifiable.",
  path: "/about",
});

/**
 * ABOUT - the studio world.
 *
 * Warm ground, cream type, and one interactive headline. The register here is
 * human without being soft: the page still leads with a verifiable company
 * record rather than a mission statement.
 *
 * The shared PageHeader is gone from this route. The interactive headline IS
 * the header, and running both would have meant two competing titles at the
 * top of the same page.
 */
export default function AboutPage() {
  return (
    <World id="studio">
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <AboutHero />
      <About showHeading={false} />
      <ProcessSpine />
      <TechStack />
      <CTABand
        title="Want to work with a team this size?"
        accent="That is the point."
        lead="You will talk to the people building the system, not to an account manager relaying it. Tell us what you are trying to build."
      />
    </World>
  );
}
