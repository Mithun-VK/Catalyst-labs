import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { WorksHero } from "@/components/sections/work/WorksHero";
import { WorksDeck } from "@/components/sections/work/deck/WorksDeck";
import { Testimonials } from "@/components/sections/work/Testimonials";
import { AlsoBuilt } from "@/components/sections/work/AlsoBuilt";
import { CTABand } from "@/components/sections/CTABand";
import { projects } from "@/content/projects";

export const metadata: Metadata = buildMetadata({
  title: "Our Work: Systems We Build & How | Catalyst Labs",
  description:
    "E-commerce with virtual try-on, a fraud-scoring API and live client sites. Case studies with real engineering detail and sourced numbers, from Chennai.",
  path: "/work",
});

/**
 * WORKS - the poster world.
 *
 * The loudest page on the site, and the reason the home page is the quietest.
 * Work is the one section where a prospect is browsing rather than
 * evaluating, so it is allowed to be an experience: oversized type, a colour
 * field per project, a marquee, alternating compositions.
 *
 * The shared PageHeader is deliberately NOT used here. It is the component
 * that made every page look identical, and this page's whole job is to prove
 * that it is not.
 */
export default function WorkPage() {
  return (
    <World id="poster">
      <JsonLd data={breadcrumbSchema([{ name: "Works", path: "/work" }])} />
      <WorksHero />

      <WorksDeck projects={projects} />

      <AlsoBuilt />
      <Testimonials />
      <CTABand
        variant="poster"
        location="works"
        title="Want one of these against your process?"
        accent="Not a generic one."
        lead="Every build starts by mapping how the work actually moves through your business. The architecture follows from that, not from a template."
      />
    </World>
  );
}
