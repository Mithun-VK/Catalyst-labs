/**
 * Scenarios driving the interactive Signal Path diagram in the AI section.
 * Each is a plausible, concrete pipeline - described as mechanism only.
 * Four stages, always: Customer -> AI -> Business System -> Action.
 */

export type FlowStage = {
  key: "input" | "ai" | "system" | "action";
  label: string;
  /** Rendered as a terminal-style line inside the node while active. */
  detail: string;
};

export type Scenario = {
  id: string;
  tab: string;
  title: string;
  summary: string;
  stages: [FlowStage, FlowStage, FlowStage, FlowStage];
  /** What no longer requires a person. Not a statistic. */
  removes: string;
};

export const scenarios: Scenario[] = [
  {
    id: "lead",
    tab: "Lead qualification",
    title: "An enquiry arrives at 11:40pm",
    summary:
      "A prospect messages on WhatsApp outside working hours. Nobody is watching the inbox.",
    stages: [
      {
        key: "input",
        label: "Customer",
        detail: "WhatsApp: “Do you build booking systems? What's the cost?”",
      },
      {
        key: "ai",
        label: "AI layer",
        detail: "Classify intent · extract budget, timeline, service · score fit",
      },
      {
        key: "system",
        label: "Business system",
        detail: "Create CRM lead · assign owner · start SLA timer",
      },
      {
        key: "action",
        label: "Action",
        detail: "Reply in 8s with scope questions · brief in owner's inbox by 7am",
      },
    ],
    removes: "No enquiry waits for office hours to be acknowledged.",
  },
  {
    id: "support",
    tab: "Customer support",
    title: "The same question, for the four-hundredth time",
    summary:
      "A customer asks something the documentation already answers, in a channel the documentation isn't in.",
    stages: [
      {
        key: "input",
        label: "Customer",
        detail: "“My order shipped three days ago - where is it?”",
      },
      {
        key: "ai",
        label: "AI layer",
        detail: "Retrieve policy + order record · ground answer · check confidence",
      },
      {
        key: "system",
        label: "Business system",
        detail: "Read order status from ERP · log the interaction",
      },
      {
        key: "action",
        label: "Action",
        detail: "Resolve with a cited answer, or escalate with full context",
      },
    ],
    removes: "Answered-before questions stop reaching a person at all.",
  },
  {
    id: "documents",
    tab: "Document processing",
    title: "Forty invoices, one keyboard",
    summary:
      "Supplier invoices arrive as PDFs and phone photos, and someone retypes them into the accounting system.",
    stages: [
      {
        key: "input",
        label: "Input",
        detail: "Invoice PDF received at accounts@",
      },
      {
        key: "ai",
        label: "AI layer",
        detail: "Extract line items, tax, totals · confidence per field",
      },
      {
        key: "system",
        label: "Business system",
        detail: "Match to purchase order · validate against rules",
      },
      {
        key: "action",
        label: "Action",
        detail: "Post clean invoices · queue only the uncertain ones for review",
      },
    ],
    removes: "Data entry becomes exception handling.",
  },
  {
    id: "internal",
    tab: "Internal knowledge",
    title: "The answer exists. Somewhere.",
    summary:
      "A team member needs a spec, a policy or a past decision that is buried across drives, threads and documents.",
    stages: [
      {
        key: "input",
        label: "Team",
        detail: "“What did we agree on returns for wholesale orders?”",
      },
      {
        key: "ai",
        label: "AI layer",
        detail: "Search indexed docs, threads and tickets · rank by recency",
      },
      {
        key: "system",
        label: "Business system",
        detail: "Apply access permissions · resolve conflicting versions",
      },
      {
        key: "action",
        label: "Action",
        detail: "Answer with the source document and the date it was decided",
      },
    ],
    removes: "Institutional knowledge stops depending on who is still employed.",
  },
];
