/**
 * Location landing pages, served at /<slug>.
 *
 * Each page answers a different search intent with different copy - they are
 * NOT the same page with a city swapped in, which search engines treat as
 * doorway pages. Facts come from lib/site.ts and the project data; nothing is
 * invented (no office address, no client list, no headcount).
 */

export type LocationPage = {
  slug: string;
  /** <title>, max 60 characters. */
  seoTitle: string;
  /** <meta description>, max 155 characters. */
  seoDescription: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  /** Service ids to feature, in order. */
  services: string[];
  /** Why this location / audience, as short headed points. */
  reasons: { title: string; body: string }[];
  /** Project slugs to show as proof. */
  projectSlugs: string[];
  /** Cities or regions named for local relevance. */
  places?: string[];
  faqs: { q: string; a: string }[];
  /** Pages to link onward to. */
  related: string[];
};

export const locations: LocationPage[] = [
  {
    slug: "ai-automation-chennai",
    seoTitle: "AI Automation Company in Chennai, India | Catalyst Labs",
    seoDescription:
      "AI agents, RAG chatbots and workflow automation for businesses in Chennai and Tamil Nadu. Fixed-scope builds, human review built in, code you own.",
    eyebrow: "AI automation · Chennai",
    h1: "AI automation for businesses in Chennai and Tamil Nadu.",
    intro: [
      "Catalyst Labs is a Chennai software and AI studio. We build AI agents, retrieval over your own documents and workflow automation that does the repetitive work in your business, with a person kept in the loop wherever judgement matters.",
      "Most local businesses do not need a chat window bolted onto the side of the company. They need enquiries triaged, follow-ups sent, records updated and reports produced without anyone starting each step. That is what we scope and build.",
    ],
    services: ["ai-automation", "data-integrations", "custom-software"],
    reasons: [
      {
        title: "Built into your tools",
        body: "Agents connect to the systems you already use: email, WhatsApp, your CRM, spreadsheets and internal software, wherever an API exists.",
      },
      {
        title: "Honest about where AI does not belong",
        body: "If a form, a query or a scheduled job solves it more cheaply and reliably, we say so and build that instead.",
      },
      {
        title: "Evaluated before it goes live",
        body: "We test against real examples, set guardrails, and define what happens when the model is unsure or a dependency fails.",
      },
      {
        title: "Direct access to the builders",
        body: "You talk to the people building the system, in your time zone, in English or Tamil.",
      },
    ],
    projectSlugs: ["safemerchant", "inego", "ark-angel"],
    places: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    faqs: [
      {
        q: "What can AI automation do for a business in Chennai?",
        a: "Typical first projects are triaging and answering enquiries across email and WhatsApp, drafting and sending follow-ups, extracting data from documents into your systems, and producing recurring reports. The right first project is the most repetitive rule-based task your team does today.",
      },
      {
        q: "How much does an AI automation project cost?",
        a: "It depends on the workflow, the systems it connects to and how much review it needs. We agree a written scope and a fixed price after a short discovery, so the cost is known before building starts.",
      },
      {
        q: "Will the AI make things up?",
        a: "Answers are grounded in your own documents and data, the system is tested against real examples, and low-confidence cases go to a person. We design for what happens when the model is wrong, not only when it is right.",
      },
      {
        q: "Do you work with businesses outside Chennai?",
        a: "Yes. We work remotely with businesses across Tamil Nadu, India and overseas, with calls and delivery handled online.",
      },
    ],
    related: ["software-development-chennai", "software-development-india"],
  },
  {
    slug: "software-development-chennai",
    seoTitle: "Software Development Company in Chennai | Catalyst Labs",
    seoDescription:
      "Custom software, web and mobile apps and SaaS products built in Chennai for businesses in Tamil Nadu and India. Fixed scope, clear ownership.",
    eyebrow: "Software development · Chennai, Tamil Nadu",
    h1: "A software development company in Chennai that builds around how you work.",
    intro: [
      "Catalyst Labs is a small, founder-led software studio in Chennai. We build custom software, websites and web applications, mobile apps and SaaS products for businesses in Chennai, across Tamil Nadu and beyond.",
      "Every engagement starts by mapping how the work actually moves through your business. The architecture follows from that, not from a template, and nothing is scoped before it is understood.",
    ],
    services: ["custom-software", "web", "mobile", "saas-mvp"],
    reasons: [
      {
        title: "Fixed, written scope",
        body: "You receive a written scope and a fixed proposal before any code is written, so there are no open-ended invoices.",
      },
      {
        title: "Working software every week",
        body: "From the first build cycle you see the real product on a staging URL, and can redirect while redirecting is still cheap.",
      },
      {
        title: "Handed over, documented, yours",
        body: "Code ownership transfers to you once the project is in production and the bug-fix period is complete, with documentation throughout.",
      },
      {
        title: "A registered Chennai business",
        body: "Catalyst Labs is a Udyam-registered micro enterprise in Chennai. The registration number is published on the site and can be checked on the government portal.",
      },
    ],
    projectSlugs: ["inego", "fashion-profiles", "attram-ev"],
    places: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    faqs: [
      {
        q: "Which software development services do you offer in Chennai?",
        a: "Custom business software and internal tools, websites and web applications, mobile apps for iOS and Android, SaaS and MVP builds, and API and systems integration, plus AI automation where it earns its place.",
      },
      {
        q: "How long does a project take?",
        a: "A focused website or tool is typically weeks, an MVP a few months. We give a timeline in the written proposal after discovery, because it depends on scope.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Ownership transfers to you once the project is deployed to production and the bug-fix period is complete.",
      },
      {
        q: "Can you work with an existing website or system?",
        a: "Yes. We start by reviewing what exists, then decide with you whether to extend it, fix it or rebuild parts of it.",
      },
    ],
    related: ["ai-automation-chennai", "software-development-india"],
  },
  {
    slug: "software-development-india",
    seoTitle: "Software Development from India for US, UK & EU Clients",
    seoDescription:
      "Hire a small Indian studio for custom software, web apps and AI automation. Direct access to the builders, fixed-scope proposals and clear code ownership.",
    eyebrow: "Software development · India, for international clients",
    h1: "Software development from India, for teams in the US, UK and Europe.",
    intro: [
      "Catalyst Labs is a software and AI engineering studio in Chennai, India. We build custom software, web and mobile applications, SaaS products and AI automation for international clients, with a written scope and a fixed price before any work starts.",
      "Working with an overseas studio should not mean losing visibility. You talk directly to the engineers building your system, you see working software on a staging URL every week, and you own the code once it ships.",
    ],
    services: ["saas-mvp", "custom-software", "ai-automation", "web"],
    reasons: [
      {
        title: "Direct access, no account manager",
        body: "You speak to the people building the system. Calls run 10:00 AM to 10:00 PM IST every day, which overlaps with the UK, Europe and the US East Coast morning.",
      },
      {
        title: "Fixed scope, written first",
        body: "A discovery step produces a problem definition, scope, success criteria and a fixed proposal, so cost and timeline are agreed before building starts.",
      },
      {
        title: "Verifiable, not just claimed",
        body: "Live client sites, recorded engineering numbers on the Works page, and a government-registered business whose number you can check.",
      },
      {
        title: "Clear ownership and handover",
        body: "Code ownership transfers to you after production deployment and the bug-fix period, and the work is documented throughout so you or anyone you choose can maintain it.",
      },
    ],
    projectSlugs: ["safemerchant", "ark-angel", "inego"],
    faqs: [
      {
        q: "How do you work across time zones?",
        a: "Calls are available 10:00 AM to 10:00 PM IST every day, and you can book a 30-minute slot online. Day-to-day work happens in writing, with a working build to review every week.",
      },
      {
        q: "How is pricing set?",
        a: "Per project, against agreed deliverables, after discovery. We can quote in US dollars, pounds, euros or rupees. The price is fixed in the written proposal before building starts.",
      },
      {
        q: "Is my code and data safe?",
        a: "An NDA is available before you share detail. Ownership transfers to you after production deployment and the bug-fix period, and the work is documented throughout.",
      },
      {
        q: "What does a first project look like?",
        a: "Usually a discovery stage that produces a problem definition, scope and fixed proposal, followed by a build in stages with a working demo at each one.",
      },
      {
        q: "Do you work with early-stage startups?",
        a: "Yes. SaaS and MVP builds are one of our core practices, scoped so the first version is something real users can pay for.",
      },
    ],
    related: ["software-development-chennai", "ai-automation-chennai"],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
