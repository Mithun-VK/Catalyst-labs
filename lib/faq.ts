import { site } from "@/lib/site";

/**
 * Site-level questions, answered once and used twice: rendered on the home
 * page and emitted as FAQPage JSON-LD. Schema text must match visible text,
 * so both read from this one array. Answers state only facts the site already
 * publishes - no prices, no client counts, no guarantees.
 */
export const siteFaqs: { q: string; a: string }[] = [
  {
    q: "What does Catalyst Labs build?",
    a: `${site.name} is a Chennai-based software and AI engineering studio. It builds custom software, web and mobile applications, SaaS products, AI agents and automation, and systems integrations - engineered around how a business actually works rather than from a template.`,
  },
  {
    q: "Where is Catalyst Labs based?",
    a: `${site.name} is based in ${site.location.city}, ${site.location.region}, ${site.location.country}, and was established in ${site.founded}. The studio is a registered ${site.registration.classification} under India's ${site.registration.scheme} scheme (${site.registration.number}), which can be checked on the government portal.`,
  },
  {
    q: "How does a project with Catalyst Labs start?",
    a: "Every engagement starts with discovery: mapping how the work moves through the business, where it stalls, and what a fix is worth. That produces a problem definition, scope and success criteria, and a fixed proposal before any build begins. If Catalyst Labs is not the right fit, it says so.",
  },
  {
    q: "How much does a project cost?",
    a: "Cost depends on the complexity of the project and the development time it needs. There is no published rate card. After discovery you receive a written, fixed proposal against agreed deliverables, so the price is known before building starts. Describe what you want to build on the contact page to get a scoped answer.",
  },
  {
    q: "Who will I work with?",
    a: "Catalyst Labs is deliberately a small studio. You work directly with the team that builds your system, not an account manager relaying requirements, and the work is documented as it is built so that it can be handed over and maintained.",
  },
  {
    q: "Who owns the code?",
    a: "You do. Ownership of the code is transferred to the client once the project is deployed to production and the bug-fix period is complete. Until then Catalyst Labs maintains the codebase and fixes defects, and the work is documented throughout so the handover is clean.",
  },
  {
    q: "Which technologies does Catalyst Labs use?",
    a: "Typical work uses TypeScript, Next.js, React, Node.js and Python with PostgreSQL, deployed on cloud infrastructure, plus retrieval-augmented generation and agent tooling for AI systems. The stack is chosen per problem; a plain query or scheduled job is used instead of AI where it works better.",
  },
];
