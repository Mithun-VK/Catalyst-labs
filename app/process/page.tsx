import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { World } from "@/components/worlds/World";

export const metadata: Metadata = buildMetadata({
  title: "How We Build: Our 5-Stage Process | Catalyst Labs",
  description:
    "Working software on a staging URL every week from the first build cycle. Fixed scope agreed in writing, and no big reveal at the end.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <World id="atelier">
      <JsonLd data={breadcrumbSchema([{ name: "Process", path: "/process" }])} />
      <PageHeader
        index="04"
        eyebrow="Process"
        crumbs={[{ label: "Home", href: "/" }, { label: "Process" }]}
        title={
          <>
            Five stages. No <span className="accent-word text-ember">reveal</span>{" "}
            at the end.
          </>
        }
        lead="You see working software from the first build cycle, on a staging URL, every week. Nothing is held back for a presentation, because a surprise at the end is how projects go wrong."
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "process_header", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Start a Project
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "services", location: "process_header" }}
            >
              What we build
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Stages", value: "5" },
              { label: "Cadence", value: "Weekly working builds" },
              { label: "Visibility", value: "Staging URL from week 3" },
              { label: "Scope", value: "Fixed and written before build" },
            ]}
          />
        }
      />

      <Process showHeading={false} />
      <WhyUs />

      <CTABand
        title="Ready to start at stage one?"
        accent="Discovery."
        lead="The first conversation costs you nothing and usually makes the project smaller and sharper than it started."
      />
    </World>
  );
}
