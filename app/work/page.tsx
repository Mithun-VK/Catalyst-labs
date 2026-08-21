import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { Work } from "@/components/sections/Work";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { alsoBuilt, projects } from "@/content/projects";

export const metadata: Metadata = buildMetadata({
  title: "Our Work: Production Systems & Client Sites | Catalyst Labs",
  description:
    "Fraud scoring in production, a quantitative trading stack, a tax compliance platform and live client sites. Real engineering detail, verifiable results.",
  path: "/work",
});

export default function WorkPage() {
  const liveSites = projects.filter((p) => p.href).length;
  const total = projects.length + alsoBuilt.length;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Work", path: "/work" }])} />
      <PageHeader
        index="01"
        eyebrow="Selected work"
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        title={
          <>
            Systems in production, described as{" "}
            <span className="accent-word text-ember">engineering</span>.
          </>
        }
        lead="A fraud scoring API serving live inference, a statistical arbitrage stack, a tax compliance platform, and client sites you can open right now. Each entry states what it does, how it is built, and what can be checked."
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "work_header", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Start a Project
            </ButtonLink>
            <ButtonLink
              href="/process"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "process", location: "work_header" }}
            >
              How we work
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Projects", value: `${total} documented` },
              { label: "Live sites", value: `${liveSites} you can visit` },
              { label: "Invented claims", value: "None" },
            ]}
          />
        }
      />

      <Work showHeading={false} />

      <CTABand
        title="Want one of these against your process?"
        accent="Not a generic one."
        lead="Every build starts by mapping how the work actually moves through your business. The architecture follows from that, not from a template."
      />
    </>
  );
}
