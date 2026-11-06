import type { Block, Post } from "./posts";

/**
 * Website Clinic: published teardown posts of real D2C sites.
 *
 * `clinics` is empty on purpose. Nothing here is published until an issue is
 * added below, and within an issue a review is only published once the site
 * owner has approved it (`approvedOn`). A review without that date is dropped
 * by `buildClinicPost`, so a draft cannot go live by accident.
 *
 * To publish an issue:
 *   1. Copy the example at the bottom of this file into `clinics` and fill
 *      every field with what you actually measured. Delete lines you did not test.
 *   2. Set `approvedOn` on each review only after the owner has read their
 *      section and said yes in writing. Anonymous reviews still need approval.
 *   3. Commit. The post, its share card, the sitemap and the blog index all
 *      pick it up from `posts` in content/posts.ts.
 *
 * Rules for every review: say what works first, never name a developer, read
 * numbers off a tool and name the tool and date, claim no ranking, traffic or
 * revenue result, and use only public pages.
 */

export type ClinicReview = {
  /** Brand name if the owner agreed to be named, else an anonymous label such as "A Chennai skincare brand". */
  label: string;
  /** Show the domain only for named reviews. */
  domain?: string;
  /** One line on what the brand sells. */
  sells: string;
  /** ISO date the site was reviewed. Sites change, so it is printed. */
  reviewedOn: string;
  /** ISO date the owner approved this section in writing. No date, not published. */
  approvedOn?: string;
  /** Something the site genuinely does well. Always first. */
  worksWell: string;
  /** Phone speed. Each line cites the tool and number, e.g. "LCP 4.8 s (PageSpeed Insights, mobile, 20 Nov)". */
  speed: string[];
  /** What Google shows and what is missing. */
  google: string[];
  /** Taps and screens from landing to "Buy now". */
  path: string[];
  /** Exactly three fixes, highest impact first. */
  fixes: [string, string, string];
};

export type ClinicIssue = {
  /** Clinic number, used in the title and slug. */
  number: number;
  /** ISO publish date. */
  date: string;
  /** Set true to publish. */
  publish: boolean;
  /** Patterns across the sites, as counts you can verify, e.g. "4 of 5 served the product image uncompressed". */
  patterns: string[];
  reviews: ClinicReview[];
};

export const clinics: ClinicIssue[] = [];

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const SUBMIT = "/linkedin?utm_source=site&utm_medium=blog&utm_campaign=website_clinic&utm_content=clinic_post";

function reviewBlocks(r: ClinicReview, i: number): Block[] {
  const heading = r.domain ? `${i + 1}. ${r.label} (${r.domain})` : `${i + 1}. ${r.label}`;
  return [
    { t: "h2", text: heading },
    {
      t: "p",
      text: `${r.sells} Reviewed on ${fmt(r.reviewedOn)}, public pages only. The owner read this section before it went live.`,
    },
    { t: "note", title: "What works", text: r.worksWell },
    { t: "p", text: "Speed on a phone" },
    { t: "ul", items: r.speed },
    { t: "p", text: "Google" },
    { t: "ul", items: r.google },
    { t: "p", text: "From landing to checkout" },
    { t: "ul", items: r.path },
    { t: "p", text: "Three fixes, in order of impact" },
    { t: "ol", items: r.fixes },
  ];
}

/** Returns the post for an issue, or undefined when it should not be published. */
export function buildClinicPost(issue: ClinicIssue): Post | undefined {
  const approved = issue.reviews.filter((r) => r.approvedOn);
  if (!issue.publish || approved.length === 0) return undefined;

  const n = approved.length;
  const sites = n === 1 ? "website" : "websites";
  return {
    slug: `website-clinic-${issue.number}`,
    title: `Website Clinic #${issue.number}: ${n} Indian D2C ${sites} reviewed`,
    seoTitle: `Website Clinic #${issue.number}: ${n} D2C ${n === 1 ? "Site" : "Sites"} Reviewed`,
    description: `${n} real Indian D2C ${sites} reviewed for phone speed, Google visibility and the path to checkout, with three fixes for each.`,
    date: issue.date,
    readMinutes: Math.max(4, Math.round(n * 1.5)),
    tags: ["Website Clinic", "D2C"],
    related: [
      { label: "Website and web app development", href: "/services" },
      { label: "How a project runs", href: "/process" },
    ],
    body: [
      {
        t: "p",
        text: `Each clinic, we review real Indian D2C websites with the owners' permission and say plainly what we would fix first. ${n === 1 ? "This one was" : `These ${n} were`} reviewed on public pages only, and the owner approved ${n === 1 ? "the" : "each"} section before publishing.`,
      },
      {
        t: "note",
        title: "How we checked",
        text: "The same three checks on every site: how fast it loads on an ordinary phone, what Google shows for the brand, and how many taps lie between landing and paying. Every number names its tool and date. We make no promise about rankings, traffic or sales.",
      },
      ...approved.flatMap(reviewBlocks),
      { t: "h2", text: "What the sites had in common" },
      { t: "ul", items: issue.patterns },
      { t: "h2", text: "Want your own review?" },
      {
        t: "p",
        text: `It is free and written by the founder. [Send us your site](${SUBMIT}) and you get the audit within 2 working days, whether or not it is ever published. If you would rather talk first, [get in touch](/contact).`,
      },
    ],
  };
}

export const clinicPosts: Post[] = clinics
  .map(buildClinicPost)
  .filter((p): p is Post => Boolean(p));

/*
 * Example issue. Copy into `clinics`, replace every value with real data.
 * Kept as a comment so it can never be published as is.
 *
 * {
 *   number: 1,
 *   date: "2026-11-26",
 *   publish: true,
 *   patterns: ["[n] of [N] sites ... (a count you can show)"],
 *   reviews: [
 *     {
 *       label: "[Brand, or 'A Chennai skincare brand']",
 *       domain: "[brand.in, only if named]",
 *       sells: "[One line on what they sell.]",
 *       reviewedOn: "2026-11-21",
 *       approvedOn: "2026-11-24",
 *       worksWell: "[One genuine strength.]",
 *       speed: ["LCP [x] s (PageSpeed Insights, mobile, [date])"],
 *       google: ["[What the search result shows, and what is missing.]"],
 *       path: ["[n] taps from landing to Buy now."],
 *       fixes: ["[Fix 1]", "[Fix 2]", "[Fix 3]"],
 *     },
 *   ],
 * },
 */
