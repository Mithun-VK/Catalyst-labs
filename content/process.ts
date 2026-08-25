export type ProcessStage = {
  index: string;
  title: string;
  duration: string;
  body: string;
  /** What you actually receive at the end of the stage. */
  output: string[];
  /**
   * Where the stage sits on the shared week axis used by the about page's
   * schedule: 0 is day one, 1 is the end of week one, and SCHEDULE_SPAN is
   * the open right edge. These are read off the `duration` strings above -
   * they are layout, not copy - and they OVERLAP on purpose, because the
   * stages do. Architect starts while Discover is still closing.
   */
  start: number;
  end: number;
  /**
   * No stated end date. Drawn running past the edge of the axis rather than
   * being given a finish line the engagement does not actually have.
   */
  open?: boolean;
  /** Ongoing is a rhythm rather than a duration: ticked, not filled. */
  ticked?: boolean;
};

/** The full width of the week axis, in the same units as start/end. */
export const SCHEDULE_SPAN = 5;

export const processStages: ProcessStage[] = [
  {
    index: "01",
    start: 0,
    end: 1,
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
    start: 0.75,
    end: 2,
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
    start: 1.75,
    end: 3,
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
    start: 2.75,
    end: 5,
    open: true,
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
    start: 4,
    end: 5,
    open: true,
    ticked: true,
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
