/**
 * Full case studies, served at /work/[slug]. Every figure here was supplied by
 * the client or read from a dashboard, and is labelled with its source. Add a
 * case study only with the client's permission to be named.
 */

export type CaseStudy = {
  slug: string;
  /** Slug of the matching entry in content/projects.ts. */
  projectSlug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  client: string;
  sector: string;
  published: string;
  /** Who did what - kept explicit so credit is never overstated. */
  roles: { party: string; role: string }[];
  summary: string;
  /** Short sections of prose. */
  sections: { heading: string; body: string[] }[];
  /** Headline numbers with their source. */
  results: { value: string; label: string; source: string }[];
  trafficSources: { source: string; visitors: string }[];
  /** Stated openly, so the page claims no more than the data supports. */
  notes: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "inego",
    projectSlug: "inego",
    title: "INEGO: a clothing brand's storefront, built to convert paid-social traffic",
    seoTitle: "INEGO Case Study: Fashion Storefront | Catalyst Labs",
    seoDescription:
      "How Catalyst Labs supported the launch of INEGO, a clothing brand by TAIG Fashion Profiles: 16,080 visitors in 30 days and over ₹4 lakh revenue in 10 days.",
    client: "INEGO (owned by TAIG Fashion Profiles)",
    sector: "Fashion e-commerce",
    published: "November 2026",
    roles: [
      { party: "TAIG Fashion Profiles", role: "Brand owner" },
      { party: "ScaleUp Marketing Agency", role: "Marketing and paid campaigns" },
      { party: "Catalyst Labs", role: "Built the website and the virtual try-on feature, and provided technical support" },
    ],
    summary:
      "INEGO is a clothing brand owned by TAIG Fashion Profiles. Catalyst Labs built inego.in, including a virtual try-on feature, and supported it technically while ScaleUp Marketing Agency drove traffic to it. The brand reported more than ₹4 lakh in revenue within ten days.",
    sections: [
      {
        heading: "The brief",
        body: [
          "A consumer clothing brand sells on attention. Campaigns on Instagram and Facebook send visitors in bursts, so the site behind them has to load quickly, present the range clearly and make the offer easy to find.",
          "The storefront was built for that: an offers page with a sale countdown and promo code, category pages for shirts, polos and T-shirts, shop-by-colour browsing, best sellers with colour and size options, and a contact page, so a visitor arriving from an ad reaches products in a click or two.",
        ],
      },
      {
        heading: "Virtual try-on",
        body: [
          "Catalyst Labs also built a virtual try-on feature into the store, so shoppers can try products on before they buy. Product cards offer a \"Try it on\" action alongside colour and size selection.",
        ],
      },
      {
        heading: "Who did what",
        body: [
          "The revenue figure belongs to the brand and to the marketing that drove it. Catalyst Labs' part was the website and the technical support around it, which is what let the campaigns land on a site that held up under the traffic.",
        ],
      },
      {
        heading: "What the traffic looked like",
        body: [
          "Traffic arrived in a sharp spike around the main campaign days and then settled to a steady base. Social platforms were the largest sources, with Google search a clear second.",
        ],
      },
    ],
    results: [
      {
        value: "₹4 lakh+",
        label: "Revenue in 10 days",
        source: "Reported by the brand, November 2026",
      },
      {
        value: "16,080",
        label: "Visitors in 30 days",
        source: "Vercel Analytics, production, to early November 2026",
      },
      {
        value: "51,194",
        label: "Page views in 30 days",
        source: "Vercel Analytics, production, to early November 2026",
      },
    ],
    trafficSources: [
      { source: "Instagram (l.instagram.com and instagram.com)", visitors: "about 9.1K" },
      { source: "Google", visitors: "about 2.5K" },
      { source: "Facebook (m.facebook.com and facebook.com)", visitors: "about 2.4K" },
    ],
    notes: [
      "Revenue is client-reported and has not been audited by Catalyst Labs.",
      "Traffic figures are from the production deployment's analytics over the 30 days to early November 2026.",
      "Marketing results are ScaleUp Marketing Agency's work; Catalyst Labs provided the website and technical support.",
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
