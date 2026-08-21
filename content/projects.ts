/**
 * SELECTED WORK - real, shipped projects.
 *
 * Every entry here is work that exists. Live sites carry their URL so a
 * prospect can check them in one click. Engineering figures (model AUC, test
 * counts, validation results) are recorded facts from the build, never
 * estimates and never rounded up.
 *
 * Deliberately NOT published here:
 *  - Internal delivery status: blockers, dependency gates, self-assessed
 *    readiness grades. Those belong in project tracking, not on a site a
 *    prospect reads.
 *  - Engagements still in commercial negotiation, until signed.
 *  - Client names where publication has not been agreed.
 */

export type ProjectStatus = "live" | "production" | "building" | "concluded";

export type Project = {
  slug: string;
  name: string;
  /** Sector or problem domain, used as the eyebrow. */
  domain: string;
  status: ProjectStatus;
  /** One sentence: what it is. */
  summary: string;
  /** How it is built, in the detail an engineer would ask for. */
  detail: string;
  /** Verifiable facts only. Empty is better than padded. */
  proof: string[];
  technology: string[];
  /** Public URL, only for sites anyone can visit. */
  href?: string;
  year: string;
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  production: "Production",
  building: "In development",
  concluded: "Concluded",
};

/** The lead set - strongest proof first. These carry the section. */
export const projects: Project[] = [
  {
    slug: "safemerchant",
    name: "SafeMerchant",
    domain: "Payments risk",
    status: "production",
    summary:
      "A fraud scoring API for UPI merchant onboarding, serving live model inference from Mumbai.",
    detail:
      "Merchant applications are scored against a gradient-boosted model exported to ONNX for fast, dependency-light inference. The service runs behind a versioned API so scoring logic can change without breaking callers, and the full pipeline - feature construction, inference, thresholding - is covered by an automated test suite.",
    proof: [
      "ROC AUC 0.908 on held-out evaluation",
      "ONNX runtime inference, no Python dependency at serve time",
      "Deployed on AWS EC2, ap-south-1 (Mumbai)",
      "Full test suite passing",
    ],
    technology: ["Python", "ONNX", "FastAPI", "AWS EC2", "PostgreSQL"],
    year: "2026",
  },
  {
    slug: "ark-angel",
    name: "Ark Angel",
    domain: "Quantitative trading",
    status: "production",
    summary:
      "A statistical arbitrage research and execution stack, from signal research through to order routing.",
    detail:
      "Cointegration-based pair research, backtesting with realistic cost and slippage assumptions, and a promotion gate that only advances a strategy once it clears out-of-sample criteria. Two strategies have passed that gate. The execution layer is built and tested against a broker adapter interface.",
    proof: [
      "102 automated tests passing",
      "Two strategies validated through the promotion gate",
      "Backtests model transaction cost and slippage explicitly",
    ],
    technology: ["Python", "pandas", "NumPy", "PostgreSQL", "Backtesting"],
    year: "2026",
  },
  {
    slug: "taxvault",
    name: "TaxVault v3",
    domain: "Financial compliance",
    status: "production",
    summary:
      "The core platform for a tax and compliance product - schema, data layer and domain logic.",
    detail:
      "Built through a full production cycle: versioned migrations, deterministic seeding for reproducible environments, and a code review pass across the domain layer before sign-off. The test suite covers the tax computation paths where correctness is not negotiable.",
    proof: [
      "289 automated tests passing",
      "Versioned migrations with deterministic seed data",
      "Reviewed through a full production cycle",
    ],
    technology: ["TypeScript", "Node.js", "PostgreSQL", "Prisma"],
    year: "2026",
  },
  {
    slug: "fashion-profiles",
    name: "TAIG Fashion Profiles",
    domain: "Apparel sourcing",
    status: "live",
    summary:
      "A B2B site for an apparel sourcing and buying house, built to convert overseas buyer enquiries.",
    detail:
      "Presents sourcing capability, product categories and compliance credentials to international buyers, with enquiry capture as the primary action. Built for search visibility in a category where buyers research thoroughly before they make contact.",
    proof: ["Live in production", "Structured for B2B buyer enquiry capture"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    href: "https://fashionprofiles.in",
    year: "2026",
  },
  {
    slug: "attram-ev",
    name: "Attram Technologies",
    domain: "EV infrastructure",
    status: "live",
    summary:
      "The marketing site for an EV charging installation company operating across South India.",
    detail:
      "Communicates installation capability and service coverage to commercial and residential customers, with regional search visibility as a primary goal and enquiry routing built in.",
    proof: ["Live in production", "Built for regional search visibility"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    href: "https://attramevtech.com",
    year: "2026",
  },
  {
    slug: "quin-elements",
    name: "Quin Elements",
    domain: "EV infrastructure",
    status: "live",
    summary:
      "A site for an EV charging installer and white-label OEM charger supplier.",
    detail:
      "Covers two distinct audiences from one site: installation customers, and OEM buyers sourcing white-label charging hardware - each with its own path through the page and its own enquiry route.",
    proof: ["Live in production", "Dual audience: installation and OEM supply"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    href: "https://quinelements.com",
    year: "2026",
  },
];

/**
 * Secondary set - real work, shown compactly so it does not compete with the
 * lead projects for attention.
 */
export const alsoBuilt: Project[] = [
  {
    slug: "project-dynamo",
    name: "Project Dynamo",
    domain: "Cryptography",
    status: "production",
    summary: "A cryptographic implementation validated against a reference oracle.",
    detail:
      "Implemented to specification and checked against an independent reference implementation across the full test vector set.",
    proof: ["Validated 15/15 against the reference oracle"],
    technology: ["Python", "Cryptography"],
    year: "2026",
  },
  {
    slug: "client-docs-system",
    name: "Client Documentation System",
    domain: "Delivery tooling",
    status: "production",
    summary:
      "The document system behind every Catalyst Labs engagement - scopes, contracts and compliance.",
    detail:
      "A standard template set covering proposal, scope, contract and handover, with compliance frameworks built in so every engagement starts from the same reviewed baseline rather than a fresh document.",
    proof: ["12 templates across 16 documents", "Compliance frameworks built in"],
    technology: ["Documentation", "Compliance"],
    year: "2026",
  },
  {
    slug: "asre",
    name: "ASRE",
    domain: "Quantitative research",
    status: "building",
    summary:
      "A market regime research engine, delivered across a structured sprint roadmap.",
    detail:
      "Regime labelling and detection over market data, built out across six delivered sprints with research phases gated on validation rather than on schedule.",
    proof: ["Six sprints delivered", "Validation-gated phase progression"],
    technology: ["Python", "pandas", "Machine learning"],
    year: "2026",
  },
  {
    slug: "datasense",
    name: "Datasense",
    domain: "Data platform",
    status: "building",
    summary: "A data platform with subscription billing and analytics.",
    detail:
      "Application, billing integration and analytics layer, moving through the final phase of production hardening.",
    proof: ["Core platform built", "Payment integration in progress"],
    technology: ["TypeScript", "Next.js", "PostgreSQL", "Razorpay"],
    year: "2026",
  },
  {
    slug: "sentrylayer",
    name: "SentryLayer",
    domain: "Security tooling",
    status: "building",
    summary: "A security layer product, in active development.",
    detail:
      "Core capability is built and running internally; the product is being hardened before external release.",
    proof: ["Core capability built", "In internal testing"],
    technology: ["TypeScript", "Node.js"],
    year: "2026",
  },
  {
    slug: "cni-site",
    name: "CNI Public Website",
    domain: "Public sector",
    status: "building",
    summary: "A bilingual public-facing website, English and Tamil.",
    detail:
      "Built for a bilingual audience, with the Tamil content set reviewed by native speakers before launch rather than machine-translated.",
    proof: ["Bilingual: English and Tamil", "Native-speaker content review"],
    technology: ["Next.js", "TypeScript", "i18n"],
    year: "2026",
  },
  {
    slug: "attram-csms",
    name: "Attram Charging Platform",
    domain: "EV infrastructure",
    status: "building",
    summary: "A charge point management platform for EV charging infrastructure.",
    detail:
      "Management and monitoring for deployed charging hardware - a separate engagement from the Attram marketing site, working against charger firmware interfaces.",
    proof: ["Platform architecture defined"],
    technology: ["TypeScript", "Embedded", "OCPP"],
    year: "2026",
  },
  {
    slug: "crypto-arbitrage",
    name: "Crypto Arbitrage Research",
    domain: "Quantitative research",
    status: "concluded",
    summary: "A cross-exchange arbitrage venture, measured properly and then closed.",
    detail:
      "Built and instrumented to test whether the opportunity survived real execution costs and latency. It did not, at the size available to us, and the venture was closed on the evidence rather than kept alive on hope. The measurement infrastructure and the decision record both stand.",
    proof: ["Closed on measured evidence, not sunk cost"],
    technology: ["Python", "Exchange APIs"],
    year: "2026",
  },
];
