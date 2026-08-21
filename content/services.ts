export type Service = {
  id: string;
  index: string;
  title: string;
  /** One line that appears next to the title in the index. */
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  /** Concrete deliverables - what actually gets handed over. */
  deliverables: string[];

  /* ---- detail page ---------------------------------------------------- */
  /** Sub-line under the H1 on the service page. */
  tagline: string;
  /** Two or three paragraphs. No hype, no invented results. */
  detail: string[];
  /** Observable symptoms that indicate this service is the right one. */
  signals: string[];
  /** What the engagement typically includes, as phases of work. */
  scope: { title: string; body: string }[];
  /** Technologies genuinely used for this service. */
  stack: string[];
  /** Questions clients actually ask, answered straight. */
  faqs: { q: string; a: string }[];

  /* ---- search ---------------------------------------------------------
     Written for the SERP, not for the page. Kept separate from `title` and
     `tagline` so marketing copy and search copy can differ without either
     being compromised. Budgets: title <=60, description <=155. */
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    id: "ai-automation",
    index: "01",
    title: "AI & Automation",
    summary: "Agents and workflows that do the repetitive work",
    problem:
      "Work that follows a rule still gets done by a person - triaging enquiries, chasing follow-ups, re-keying data between systems.",
    solution:
      "AI agents and automated workflows wired into the tools a team already uses, with human review kept at the points where judgement actually matters.",
    outcome:
      "Repetitive operational work runs without anyone starting it, and the team spends its hours on the decisions instead.",
    deliverables: [
      "AI agents with tool access",
      "Retrieval over your own documents",
      "Workflow + trigger automation",
      "Human-in-the-loop review steps",
      "Evaluation and guardrails",
    ],
    tagline:
      "Put a model where the repetition is - and keep a person where the judgement is.",
    detail: [
      "Most businesses meet AI as a chat window bolted onto the side of the company. It answers questions, impresses everyone for a fortnight, and changes nothing, because it cannot see your data and cannot act on your systems.",
      "We build the other kind. An agent that reads the enquiry, checks the CRM, applies your qualification rules, writes the record, sends the reply and escalates the ones it should not have touched. The model is one component in a system that has permissions, logging, retries and a defined failure path.",
      "We are equally direct about where AI does not belong. If a database query, a form or a scheduled job solves the problem more cheaply and more reliably, we will tell you - and then build that instead.",
    ],
    signals: [
      "Someone spends hours a week moving data between two systems",
      "Enquiries go cold because nobody saw them in time",
      "The same customer questions are answered from scratch every day",
      "Documents arrive as PDFs and leave as manual data entry",
      "A process is documented, followed exactly, and still done by hand",
    ],
    scope: [
      {
        title: "Process audit",
        body: "We map the workflow as it actually runs and mark every step by whether it needs judgement. That map decides what gets automated and what deliberately does not.",
      },
      {
        title: "Agent and workflow design",
        body: "Tools, permissions and escalation paths defined before any prompt is written - including what the system must never do without a human.",
      },
      {
        title: "Grounding in your data",
        body: "Retrieval over your own documents, records and history, with answers that cite their source so they can be checked rather than trusted blindly.",
      },
      {
        title: "Evaluation and guardrails",
        body: "A test set drawn from your real cases, run before every change, so quality is measured rather than assumed.",
      },
      {
        title: "Deployment and monitoring",
        body: "Shipped into the channels your team and customers already use, with logging, cost tracking and alerts on anything that starts drifting.",
      },
    ],
    stack: ["LLMs", "AI Agents", "RAG", "Vector DB", "Python", "Node.js", "Webhooks"],
    faqs: [
      {
        q: "Will it make things up?",
        a: "Ungrounded models do. We ground answers in your own data, require citations, and set a confidence threshold below which the system escalates to a person instead of guessing. The escalation path is part of the build, not an afterthought.",
      },
      {
        q: "Does our data go into a public model?",
        a: "Not for training. We use providers under terms that exclude API data from training, and where data cannot leave your environment at all, we architect for that from the start.",
      },
      {
        q: "What does it cost to run?",
        a: "Model usage is metered, so we design for it - smaller models on the easy paths, caching, and retrieval instead of stuffing context. Running cost is estimated during architecture and tracked in production, not discovered on the first invoice.",
      },
    ],
    seoTitle:
      "AI Automation & AI Agents for Business | Catalyst Labs",
    seoDescription:
      "AI agents wired into your CRM, WhatsApp and documents, so enquiries, support and data entry run without anyone starting them.",
  },
  {
    id: "custom-software",
    index: "02",
    title: "Custom Software",
    summary: "Systems shaped to how the business actually runs",
    problem:
      "Off-the-shelf tools force a business to work the way the tool works. The gaps get filled with spreadsheets and WhatsApp threads.",
    solution:
      "Internal platforms, dashboards and operational tools modelled on the real process - including the exceptions that generic software refuses to handle.",
    outcome:
      "One system holds the operation instead of six disconnected ones, and the process stops living in someone's head.",
    deliverables: [
      "Internal operations platforms",
      "Admin and back-office tools",
      "Role-based access control",
      "Reporting and audit trails",
      "Migration from spreadsheets",
    ],
    tagline:
      "Software that matches the operation, instead of an operation bent to fit the software.",
    detail: [
      "Every growing business reaches the point where the tools stop fitting. The CRM does not know about your approval step. The inventory system cannot express your pricing. So the gaps get filled with a shared spreadsheet, a chat group and one person who remembers how it all works.",
      "Custom software is worth building at exactly that point - where the process is a real competitive advantage, or where the workaround has started costing more than the system would. We model the operation as it is, exceptions included, and build the system that holds it.",
      "That means real data models, real permissions and a real audit trail. It also means designing the states people actually hit: the half-finished record, the rejected approval, the item that belongs to nobody.",
    ],
    signals: [
      "The real process lives in a spreadsheet nobody is allowed to touch",
      "Two systems disagree and a person decides which is right",
      "Onboarding a new team member means teaching them the workarounds",
      "Reporting means exporting and re-joining data by hand",
      "Your process is a genuine advantage and no product supports it",
    ],
    scope: [
      {
        title: "Operational mapping",
        body: "The workflow as it runs today, including the exception paths that generic tools pretend do not exist.",
      },
      {
        title: "Data model and permissions",
        body: "What a record is, who may see it, who may change it, and what history has to be kept for audit.",
      },
      {
        title: "Interface design",
        body: "Screens designed around the task, with the empty, loading, error and denied states designed rather than discovered.",
      },
      {
        title: "Build and migration",
        body: "Engineering in weekly cycles, with a migration path off the spreadsheets that does not require a shutdown.",
      },
      {
        title: "Handover",
        body: "Documentation, admin training and access, so the system belongs to you rather than to whoever built it.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
    faqs: [
      {
        q: "Is custom always better than off-the-shelf?",
        a: "No, and we will say so. Accounting, payroll and email are solved problems - buy them. Custom earns its cost where the process is specific to you, or where the workaround has become more expensive than the build.",
      },
      {
        q: "What happens to our existing data?",
        a: "Migration is part of the project, not a separate surprise. We map the existing records, clean what needs cleaning, and run a parallel period so nothing is lost in the switch.",
      },
      {
        q: "Can our own developers take it over later?",
        a: "Yes, and it is built on that assumption: standard technology, typed code, documented decisions and access to the repository from day one. You are not renting your own system back from us.",
      },
    ],
    seoTitle:
      "Custom Software Development in Chennai | Catalyst Labs",
    seoDescription:
      "Internal platforms, dashboards and operational tools built around how your business actually runs, not around what an off-the-shelf tool allows.",
  },
  {
    id: "web",
    index: "03",
    title: "Web Applications",
    summary: "Fast, accessible products people can actually use",
    problem:
      "A slow, generic web product loses users before it gets a chance to be useful - and quietly costs conversion on every visit.",
    solution:
      "Web applications engineered for performance and clarity: server-rendered where it helps, measured against real device budgets, accessible by default.",
    outcome:
      "Pages load fast on a mid-range phone, the interface holds up under real use, and the product is usable by everyone you're selling to.",
    deliverables: [
      "Product and marketing front-ends",
      "Dashboards and customer portals",
      "Design systems and components",
      "Core Web Vitals budgets",
      "WCAG 2.2 AA accessibility",
    ],
    tagline:
      "Measured against a mid-range phone on a mediocre connection - because that is what your customers have.",
    detail: [
      "Web performance is not a vanity metric. Every second of load time is a share of your visitors leaving, and most sites are tested on fast laptops on office broadband by the people who built them.",
      "We build against explicit budgets on real hardware profiles: what renders on the server, what ships as JavaScript, how large the fonts and images are allowed to be. Those budgets are set during architecture and checked before each release, so performance is a requirement rather than a cleanup task.",
      "Accessibility is handled the same way. Semantic structure, keyboard paths, visible focus and sufficient contrast are part of the component work, not an audit at the end - which is both the right thing to do and the cheapest time to do it.",
    ],
    signals: [
      "The site is slow on a phone and nobody has been able to fix it",
      "Conversion drops between landing and the first real step",
      "Every new page is rebuilt from scratch with slightly different styling",
      "The product is unusable with a keyboard or a screen reader",
      "The marketing site and the product look like different companies",
    ],
    scope: [
      {
        title: "Architecture and rendering",
        body: "What is static, what is server-rendered, what is client-side - decided per route against how the page is actually used.",
      },
      {
        title: "Design system",
        body: "Tokens, components and states, so the tenth page costs a fraction of the first and looks like it belongs.",
      },
      {
        title: "Performance budgets",
        body: "Explicit limits on bundle size, image weight and Core Web Vitals, verified before release rather than after complaints.",
      },
      {
        title: "Accessibility",
        body: "WCAG 2.2 AA as a build standard: semantics, keyboard operation, focus management and contrast.",
      },
      {
        title: "Analytics and iteration",
        body: "Instrumentation on the paths that matter, so the next round of changes is decided from behaviour rather than opinion.",
      },
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    faqs: [
      {
        q: "Can you work with our existing design?",
        a: "Yes. If you have brand guidelines or a design system we build to them. If you have a design that is causing the problem, we will say which parts and why before changing anything.",
      },
      {
        q: "Do you hand over the code?",
        a: "Always. The repository is yours throughout, hosted where you choose, with deployment documented so you are never locked to us.",
      },
      {
        q: "How fast is fast enough?",
        a: "We target Core Web Vitals in the 'good' band on a mid-range Android over 4G, not on a developer laptop. The specific budget is agreed during architecture and it is testable.",
      },
    ],
    seoTitle:
      "High-Quality Website Design & Development | Catalyst Labs",
    seoDescription:
      "Fast, accessible websites and web apps built to convert, measured on a real mid-range phone. Custom-built for your brand, never templated.",
  },
  {
    id: "mobile",
    index: "04",
    title: "Mobile Applications",
    summary: "iOS and Android on a backend built to hold",
    problem:
      "A mobile app is easy to ship and hard to keep - offline states, push, releases and backend load all arrive after launch.",
    solution:
      "Cross-platform or native applications built alongside the API and infrastructure that support them, with release and update paths planned from the start.",
    outcome:
      "An app that survives contact with real usage instead of one that needs rebuilding at the first scale problem.",
    deliverables: [
      "iOS and Android applications",
      "Offline and sync behaviour",
      "Push notifications",
      "Backend APIs and auth",
      "Store release pipeline",
    ],
    tagline:
      "The app is the easy half. We build the half that has to still work in a year.",
    detail: [
      "Shipping a mobile app to a store is a solved problem. Keeping one alive is not. Connectivity drops mid-action, two devices edit the same record, the OS deprecates an API, and the store rejects a build the week of launch.",
      "We design for those from the beginning: what happens offline, how conflicts resolve, how sessions expire, how an old version behaves when the API moves on. The backend is built alongside the app rather than assumed.",
      "Cross-platform or native is a decision we make with you based on what the app has to do, not on what we prefer to write. Most business applications are well served by one cross-platform codebase; some genuinely are not, and we will say which yours is.",
    ],
    signals: [
      "Field staff need to work where there is no signal",
      "Your customers are on their phones and your product is not",
      "An existing app is unmaintained and nobody can build it any more",
      "Push notifications are the difference between use and abandonment",
      "The app works but the backend falls over when it gets busy",
    ],
    scope: [
      {
        title: "Platform decision",
        body: "Cross-platform or native, argued from the app's actual requirements - hardware access, performance profile, team and budget.",
      },
      {
        title: "Offline and sync",
        body: "What is available without a connection, how changes queue, and how conflicts resolve when two devices disagree.",
      },
      {
        title: "Backend and authentication",
        body: "The API, data model, sessions and permissions the app depends on, built to carry the load the app will create.",
      },
      {
        title: "Release pipeline",
        body: "Store accounts, signing, build automation and staged rollout, so shipping an update is routine rather than an event.",
      },
      {
        title: "Post-launch",
        body: "Crash reporting, usage analytics and a maintenance path for OS updates that arrive whether you planned for them or not.",
      },
    ],
    stack: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "Push APIs", "CI/CD"],
    faqs: [
      {
        q: "Native or cross-platform?",
        a: "Cross-platform for most business applications - one codebase, two platforms, materially lower cost to maintain. Native when the app depends on heavy device capability or sustained high performance. We make the case either way rather than defaulting.",
      },
      {
        q: "Do you handle the App Store and Play Store?",
        a: "Yes, including account setup, signing, store listings, review submissions and the rejections that occasionally come back. The accounts are registered to you, not to us.",
      },
      {
        q: "What about an app we already have?",
        a: "We audit it first: what is salvageable, what is holding it back, and whether extending it is cheaper than replacing it. Sometimes the honest answer is that a rebuild costs less than another year of patches.",
      },
    ],
    seoTitle:
      "Mobile App Development, iOS & Android | Catalyst Labs",
    seoDescription:
      "iOS and Android apps built with the backend, offline handling and release pipeline that keep them working a year after launch.",
  },
  {
    id: "saas-mvp",
    index: "05",
    title: "SaaS & MVP Development",
    summary: "From a concept to something real users can pay for",
    problem:
      "Most first versions either take too long to reach anyone or get built so thin they can't be extended once they work.",
    solution:
      "A scoped MVP that ships the core loop first - auth, billing, tenancy and the one workflow that proves the idea - on an architecture that can carry v2.",
    outcome:
      "A product in front of real users early, with the foundations to keep building on it rather than around it.",
    deliverables: [
      "Product scoping and architecture",
      "Multi-tenant foundations",
      "Subscriptions and billing",
      "Onboarding and analytics",
      "Iteration after launch",
    ],
    tagline:
      "Small enough to ship this quarter. Built well enough to still be there next year.",
    detail: [
      "There are two ways to get a first version wrong. Build everything, and it reaches users a year late with half the features unused. Build a throwaway prototype, and the moment it works you have to rebuild it before you can grow.",
      "We scope to the core loop: the single workflow that proves someone will pay, plus the unglamorous foundations that are painful to retrofit - authentication, tenancy, billing and a data model that expects more than one customer.",
      "Everything else waits for evidence. What gets built after launch is decided by what users actually do, which is why instrumentation ships with the first version rather than after it.",
    ],
    signals: [
      "You have a product idea and need it in front of real users",
      "A prototype proved the concept and now needs to become real",
      "You are raising and need something working, not slides",
      "An internal tool works well enough that other companies want it",
      "Your first version cannot support a second customer",
    ],
    scope: [
      {
        title: "Scoping",
        body: "The core loop identified and everything else explicitly deferred, with the cut list written down so it is a decision rather than a drift.",
      },
      {
        title: "Foundations",
        body: "Authentication, multi-tenancy, roles and billing - the parts that are cheap now and expensive to add later.",
      },
      {
        title: "The product",
        body: "The workflow that proves the idea, designed and built properly rather than mocked.",
      },
      {
        title: "Launch instrumentation",
        body: "Onboarding, activation tracking and the events that tell you whether it is working, live from day one.",
      },
      {
        title: "Iteration",
        body: "Weekly cycles after launch driven by usage, so the roadmap is evidence rather than opinion.",
      },
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Redis", "Cloud", "CI/CD"],
    faqs: [
      {
        q: "How long does an MVP take?",
        a: "It depends entirely on the core loop, which is why scoping comes first and is charged separately if you want it standalone. What we will not do is quote a timeline before we understand what has to be true for the product to work.",
      },
      {
        q: "Do you take equity instead of fees?",
        a: "No. We work on fixed, agreed scopes so that our incentive is a product that ships rather than a stake in one that might.",
      },
      {
        q: "What if the idea does not work?",
        a: "That is what shipping early and instrumenting it is for. Finding out in month three costs a great deal less than finding out in month twelve, and we would rather you learned it cheaply.",
      },
    ],
    seoTitle:
      "SaaS & MVP Product Development Studio | Catalyst Labs",
    seoDescription:
      "Get your product in front of paying users this quarter. Auth, billing and tenancy done properly, so version two builds on version one.",
  },
  {
    id: "data-integrations",
    index: "06",
    title: "Data & Integrations",
    summary: "Making systems that ignore each other talk",
    problem:
      "The CRM, the billing tool, the spreadsheet and the messaging app each hold part of the truth, and no one can see the whole picture.",
    solution:
      "APIs, integrations and data pipelines that move information between systems reliably, with schemas, retries and failure handling designed in.",
    outcome:
      "One reliable view of the business, and reporting that doesn't depend on someone exporting a CSV every Monday.",
    deliverables: [
      "REST and webhook APIs",
      "Third-party integrations",
      "Data pipelines and sync jobs",
      "Schema and database design",
      "Reporting layers",
    ],
    tagline:
      "Integrations that keep working on the day the other system is having a bad one.",
    detail: [
      "Connecting two systems is easy for about a week. Then an API rate-limits, a webhook is delivered twice, a field arrives null that never used to, and the sync quietly stops without anyone noticing until the numbers look wrong.",
      "We build integrations that expect this. Explicit schemas at every boundary, idempotent writes so a duplicate delivery is harmless, retries with backoff, dead-letter handling for what cannot be processed, and alerting when a pipeline stalls - because silent failure is the expensive kind.",
      "The result is one place where the business is true, and reporting built on the same records rather than on a monthly export that someone has to remember to run.",
    ],
    signals: [
      "The same customer exists three times with three different spellings",
      "Reporting means exporting from four tools and joining them by hand",
      "A sync broke weeks ago and nobody noticed until the numbers were wrong",
      "A vendor has an API and nobody has had time to use it",
      "Two departments quote different figures for the same month",
    ],
    scope: [
      {
        title: "Systems audit",
        body: "What holds which data today, which system is authoritative for each field, and where the duplicates come from.",
      },
      {
        title: "Schema and contracts",
        body: "Explicit shapes at every boundary, versioned, so a change on their side surfaces as an error rather than as bad data.",
      },
      {
        title: "Pipelines",
        body: "Sync jobs and webhook handlers with idempotency, retries, backoff and dead-letter queues for anything unprocessable.",
      },
      {
        title: "Observability",
        body: "Monitoring and alerting on every pipeline, because an integration that fails silently is worse than one that never existed.",
      },
      {
        title: "Reporting layer",
        body: "Dashboards built on the consolidated data, so the numbers come from the system rather than from a spreadsheet.",
      },
    ],
    stack: ["Node.js", "Python", "PostgreSQL", "Redis", "REST", "Webhooks", "Docker"],
    faqs: [
      {
        q: "What if a tool has no API?",
        a: "There is usually a path - an export, a database connection, a partner endpoint. Where there genuinely is not one, we will tell you plainly rather than building something fragile that breaks on their next update.",
      },
      {
        q: "How do you handle the systems disagreeing?",
        a: "By deciding in advance which system is authoritative for each field, and making that rule explicit in the pipeline. Most data conflicts are unmade decisions rather than technical problems.",
      },
      {
        q: "Will this break when a vendor changes their API?",
        a: "Sometimes - that is outside anyone's control. What we control is that it fails loudly and immediately, with an alert and a clear error, rather than quietly writing wrong data for a month.",
      },
    ],
    seoTitle:
      "API, Data & Systems Integration Services | Catalyst Labs",
    seoDescription:
      "Connect the CRM, billing and spreadsheets that ignore each other, with retries and alerting, so one dashboard shows the real numbers.",
  },
];

export function getService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
