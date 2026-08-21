export type TechGroup = {
  id: string;
  layer: string;
  note: string;
  items: string[];
};

/** Technologies genuinely used in Catalyst Labs builds. No logo wall. */
export const techGroups: TechGroup[] = [
  {
    id: "interface",
    layer: "Interface",
    note: "Rendered fast, typed end to end, accessible by default.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "services",
    layer: "Services",
    note: "APIs and business logic, with failure paths designed in.",
    items: ["Node.js", "Python", "FastAPI", "REST + Webhooks"],
  },
  {
    id: "data",
    layer: "Data",
    note: "Relational where it matters, cached where it counts.",
    items: ["PostgreSQL", "MongoDB", "Redis", "Vector DB"],
  },
  {
    id: "intelligence",
    layer: "Intelligence",
    note: "Grounded in your own data, evaluated before it ships.",
    items: ["LLMs", "AI Agents", "RAG", "Evaluations"],
  },
  {
    id: "platform",
    layer: "Platform",
    note: "Reproducible builds, observable deployments.",
    items: ["Docker", "Cloud", "CI/CD", "Monitoring"],
  },
];

/** Capability chips for the trust strip. Categories, not client logos. */
export const capabilities = [
  "AI",
  "Automation",
  "Web",
  "Mobile",
  "SaaS",
  "Data",
  "APIs",
  "Integrations",
  "Dashboards",
  "MVPs",
] as const;
