import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Our Software Studio in Chennai | Catalyst Labs",
  description:
    "A founder-led software and AI engineering studio in Chennai, India. MSME registered, deliberately small, answerable for the result.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHeader
        index="05"
        eyebrow="About"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={
          <>
            An engineering studio, run like an engineering{" "}
            <span className="accent-word text-ember">team</span>.
          </>
        }
        lead={`${site.name} builds custom software, AI systems and automation for businesses that have outgrown the tools they started with. Founder-led, deliberately small, and answerable for the result rather than for a deliverable.`}
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "about_header", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Start a Project
            </ButtonLink>
            <ButtonLink
              href="/work"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "work", location: "about_header" }}
            >
              Selected builds
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Entity", value: site.legalName },
              { label: "Registration", value: site.registration.number },
              {
                label: "Based in",
                value: `${site.location.city}, ${site.location.region}`,
              },
              { label: "Established", value: site.founded },
            ]}
          />
        }
      />

      <About showHeading={false} />
      <TechStack />

      <CTABand />
    </>
  );
}
