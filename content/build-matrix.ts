export type BuildGroup = {
  id: string;
  title: string;
  /** Short framing of what this class of system is for. */
  note: string;
  items: string[];
};

/** Categories of system Catalyst Labs builds. Capability, not client work. */
export const buildGroups: BuildGroup[] = [
  {
    id: "business-systems",
    title: "Business Systems",
    note: "The internal machinery - where the operation is actually run from.",
    items: [
      "CRM",
      "ERP modules",
      "Operations dashboards",
      "Internal tools",
      "Inventory systems",
      "Approval workflows",
      "Role-based admin",
      "Reporting suites",
    ],
  },
  {
    id: "customer-systems",
    title: "Customer Systems",
    note: "Everything a customer touches, from first visit to repeat order.",
    items: [
      "Marketing sites",
      "Customer portals",
      "Booking systems",
      "Ordering systems",
      "Payment flows",
      "Onboarding journeys",
      "Support surfaces",
      "Account areas",
    ],
  },
  {
    id: "ai-systems",
    title: "AI Systems",
    note: "Models put to work inside a process, not bolted on beside it.",
    items: [
      "AI assistants",
      "Autonomous agents",
      "Support automation",
      "Document intelligence",
      "Retrieval (RAG)",
      "Lead qualification",
      "Knowledge search",
      "Content pipelines",
    ],
  },
  {
    id: "automation",
    title: "Automation",
    note: "The work nobody should be doing by hand twice.",
    items: [
      "WhatsApp automation",
      "Lead routing",
      "Follow-up sequences",
      "Data sync jobs",
      "Scheduled reports",
      "Alerting",
      "Invoice processing",
      "Ops workflows",
    ],
  },
];
