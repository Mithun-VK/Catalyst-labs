import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { AISection } from "@/components/sections/AISection";
import { Impact } from "@/components/sections/Impact";
import { CTABand } from "@/components/sections/CTABand";
import { ButtonLink } from "@/components/ui/Button";
import { scenarios } from "@/content/ai-scenarios";

export const metadata: Metadata = buildMetadata({
  title: "AI Automation for Business Operations | Catalyst Labs",
  description:
    "Watch four real AI workflows end to end, from customer message to business action. Built into your systems so the model can act, not just chat.",
  path: "/ai",
});

export default function AIPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "AI & Automation", path: "/ai" }])} />
      <PageHeader
        index="03"
        eyebrow="Artificial intelligence"
        crumbs={[{ label: "Home", href: "/" }, { label: "AI & Automation" }]}
        title={
          <>
            Don&rsquo;t just add AI. Build it into the way your business{" "}
            <span className="accent-word text-ember">works</span>.
          </>
        }
        lead="A model that can only talk is a demo. A model wired into your systems - able to read your data, decide, and write back - does the work. Pick a scenario below and watch the path."
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "ai_header", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Discuss your use case
            </ButtonLink>
            <ButtonLink
              href="/services/ai-automation"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "ai_service", location: "ai_header" }}
            >
              AI &amp; Automation service
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Scenarios", value: `${scenarios.length} walked through` },
              { label: "Grounding", value: "Your data, with citations" },
              { label: "Guardrails", value: "Evaluated before release" },
              { label: "Escalation", value: "Human review by design" },
            ]}
          />
        }
      />

      <AISection showHeading={false} />
      <Impact />

      <CTABand
        title="Not sure AI is the right tool?"
        accent="We'll tell you."
        lead="Plenty of problems are solved better by a query, a form or a scheduled job. We would rather build you the cheaper thing that works than the impressive thing that doesn't."
      />
    </>
  );
}
