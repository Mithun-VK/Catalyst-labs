import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { BuildMatrix } from "@/components/sections/BuildMatrix";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/content/services";

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Custom Software Services | Catalyst Labs",
  description:
    "Websites, custom software, mobile apps, AI automation and integrations. Six capabilities, each scoped around the business problem it solves.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <PageHeader
        index="02"
        eyebrow="Services"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title={
          <>
            Six ways we take <span className="accent-word text-ember">work</span>{" "}
            off your team.
          </>
        }
        lead="Every capability answers the same three questions before a line of code is written: what is broken, what gets built, and what changes once it exists."
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "services_header", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Start a Project
            </ButtonLink>
            <ButtonLink
              href="/work"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "work", location: "services_header" }}
            >
              See how we build
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Capabilities", value: `${services.length} services` },
              { label: "Engagement", value: "Fixed scope, weekly builds" },
              { label: "Delivery", value: "Design + engineering in-house" },
              { label: "Working with", value: "Founders, SMEs, product teams" },
            ]}
          />
        }
      />

      <Services showHeading={false} />
      <BuildMatrix />
      <CTABand
        title="Not sure which one you need?"
        accent="Describe the problem."
        lead="Most projects change shape once we understand the operation. Tell us what is going wrong and we will tell you what it would take to fix - including when the answer is not software."
      />
    </>
  );
}
