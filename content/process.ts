export type ProcessStage = {
  index: string;
  title: string;
  duration: string;
  body: string;
  /** What you actually receive at the end of the stage. */
  output: string[];
};

export const processStages: ProcessStage[] = [
  {
    index: "01",
    title: "Discover",
    duration: "Days 1–5",
    body:
      "We sit with the business before we open an editor: how work moves today, where it stalls, who touches it, and what a fix is actually worth. Most projects change shape here - usually getting smaller and sharper.",
    output: [
      "Problem definition",
      "Workflow map",
      "Scope and success criteria",
      "Fixed proposal",
    ],
  },
  {
    index: "02",
    title: "Architect",
    duration: "Week 1–2",
    body:
      "The system gets designed before it gets built: data model, integrations, where AI genuinely earns its place, and what happens when a dependency fails. Decisions are written down with their trade-offs.",
    output: [
      "System architecture",
      "Data model",
      "Integration plan",
      "Technical decisions log",
    ],
  },
  {
    index: "03",
    title: "Design",
    duration: "Week 2–3",
    body:
      "Interface design driven by the workflow, not by a template. We design the states people actually hit - empty, loading, error, permission-denied - because that's where software is won or lost.",
    output: [
      "Design system",
      "Key screen flows",
      "Interactive prototype",
      "Accessibility standard",
    ],
  },
  {
    index: "04",
    title: "Build",
    duration: "Week 3 onward",
    body:
      "Engineering in short cycles against a working deployment. You see the real product every week, on a staging URL, and can redirect while redirecting is still cheap.",
    output: [
      "Weekly working builds",
      "Staging environment",
      "Test coverage",
      "Documentation",
    ],
  },
  {
    index: "05",
    title: "Launch & Improve",
    duration: "Ongoing",
    body:
      "Launch is a checkpoint, not the finish. Instrumentation goes in with the release, so the next iteration is decided from usage rather than opinion - and someone is on the other end when something breaks.",
    output: [
      "Production deployment",
      "Monitoring and alerting",
      "Handover and training",
      "Iteration roadmap",
    ],
  },
];
