import { projects } from "@/content/projects";

export type CtaFact = { value: string; label: string; source: string };

/** Slugs whose first headline stat is worth showing next to the ask. */
const FACT_SLUGS = ["inego", "safemerchant", "ark-angel", "taxvault"] as const;

/**
 * Proof shown beside the call to action. Built from the same recorded stats as
 * the Works posters, so nothing here can drift from, or invent beyond, the
 * project data.
 */
export function ctaFacts(): CtaFact[] {
  const facts: CtaFact[] = [];
  for (const slug of FACT_SLUGS) {
    const project = projects.find((p) => p.slug === slug);
    const stat = project?.stats?.[0];
    if (!project || !stat) continue;
    facts.push({
      value: stat.value,
      label: stat.label,
      source: project.status === "building" ? `${project.name} (in development)` : project.name,
    });
  }
  return facts;
}

/** Illustrative examples the brief box types through. */
export const BRIEF_EXAMPLES = [
  "an AI agent that triages our incoming enquiries",
  "a storefront that holds up under campaign traffic",
  "an internal tool to replace three spreadsheets",
  "a fraud-scoring API for merchant onboarding",
] as const;

export const BRIEF_CHIPS = [
  "AI & automation",
  "Web application",
  "SaaS / MVP",
  "Custom software",
  "Not sure yet",
] as const;
