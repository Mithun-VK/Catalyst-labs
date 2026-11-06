import type { Metadata } from "next";
import Link from "next/link";
import { World } from "@/components/worlds/World";
import { LogoMark } from "@/components/ui/Logo";
import { AuditForm } from "@/components/forms/AuditForm";
import { ButtonLink } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

/**
 * /linkedin - campaign landing page for LinkedIn traffic.
 *
 * One offer, one action, no site navigation (the page opts out of the nav and
 * footer with [data-chromeless]; see globals.css). Kept out of search with
 * noindex and out of the sitemap: it exists for links shared on LinkedIn,
 * tagged with UTM parameters so its leads are attributed separately.
 *
 * Link to it as:
 *   /linkedin?utm_source=linkedin&utm_medium=social&utm_campaign=free_audit&utm_content=<post-id>
 *
 * Change the offer terms here only, and only to something that can be
 * delivered every time.
 */
const OFFER = {
  turnaround: "2 working days",
  location: "linkedin_lp",
};

export const metadata: Metadata = buildMetadata({
  title: "Free Website & Automation Audit | Catalyst Labs",
  description:
    "Send your website. In 2 working days you get a written list of fixes for speed, Google visibility and enquiries, plus one process to automate.",
  path: "/linkedin",
  index: false,
});

const CHECKS = [
  {
    title: "Speed on a real phone",
    body: "Core Web Vitals on a mid-range Android over 4G, the way your customers actually load the site, with the two or three changes that would move the score most.",
  },
  {
    title: "Google and local search",
    body: "Titles, indexing, structured data and Google Business Profile basics, checked against the searches your customers in your city type.",
  },
  {
    title: "Enquiry flow",
    body: "How a visitor becomes a lead: the first call to action, forms, WhatsApp, and whether you can see which channel each enquiry came from.",
  },
  {
    title: "One process to automate",
    body: "From what you tell us, the one repetitive job (follow-ups, order updates, data entry) we would automate first, and roughly what it would take.",
  },
];

const STEPS = [
  ["Send your website", "The form takes under a minute. No call, no logins."],
  ["We review it", `The founder reviews it personally. You get the written audit within ${OFFER.turnaround}.`],
  ["You decide", "Fix it yourself, with your current team, or with us. No follow-up pressure."],
];

const FAQS = [
  {
    q: "Is it actually free?",
    a: "Yes. It is how we start conversations with businesses we might work with later. There is nothing to pay and no obligation to hire us.",
  },
  {
    q: "Do you need access to my website or accounts?",
    a: "No. The audit uses only what is publicly visible. If you want us to look at Search Console or analytics later, that is your choice.",
  },
  {
    q: "What if I do not have a website yet?",
    a: "Write \"no website yet\" and tell us what the business does. You will get a short plan for what the first version should include instead.",
  },
  {
    q: "Who is behind this?",
    a: `${site.name} is a ${site.registration.scheme}-registered software and AI studio in ${site.location.city}, led by ${site.founder.name}. Registration ${site.registration.number}.`,
  },
];

export default function LinkedInLandingPage() {
  const founderLinkedIn = site.founder.sameAs.find((u) => u.includes("linkedin.com"));

  return (
    <World id="precision">
      <div data-chromeless className="min-h-screen">
        {/* Header: identity only. Nothing here leads away from the offer. */}
        <div className="border-b border-line">
          <div className="container-page flex h-16 items-center justify-between">
            <span className="inline-flex items-center gap-2.5 text-paper">
              <LogoMark />
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">{site.name}</span>
            </span>
            <span className="text-[0.8125rem] text-mute">
              {site.location.city} · Reply in 1 working day
            </span>
          </div>
        </div>

        {/* Hero and form */}
        <section aria-labelledby="lp-heading" className="py-12 sm:py-16 lg:py-20">
          <div className="container-page grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12 lg:items-start">
            <div className="min-w-0 lg:col-span-6">
              <p className="label text-ember">For D2C brands, startups and local businesses in India</p>
              <h1
                id="lp-heading"
                className="mt-5 text-paper"
                style={{
                  fontSize: "clamp(2.25rem, 1rem + 3.6vw, 4rem)",
                  lineHeight: "1.02",
                  letterSpacing: "-0.035em",
                  fontWeight: 600,
                }}
              >
                A free audit of your website, search and enquiry flow.
              </h1>
              <p className="mt-6 max-w-[54ch] text-lead text-mute">
                Send us your website. Within {OFFER.turnaround} you get a written list of the
                fixes that matter most for speed, Google visibility and enquiries, plus the one
                process in your business we would automate first.
              </p>

              <ul className="mt-8 grid gap-3">
                {[
                  "Written and specific to your site, not a generic report",
                  "Reviewed by the founder, not a tool's auto-export",
                  "No call needed, no logins, no obligation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body text-paper-dim">
                    <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div id="audit" className="min-w-0 scroll-mt-6 border border-line bg-ink p-5 sm:p-7 lg:col-span-6">
              <h2 className="text-h3 text-paper">Request your audit</h2>
              <p className="mt-1.5 mb-5 text-small text-mute">Takes under a minute.</p>
              <AuditForm location={OFFER.location} turnaround={OFFER.turnaround} />
            </div>
          </div>
        </section>

        {/* What gets checked */}
        <section aria-labelledby="lp-checks" className="border-t border-line py-12 sm:py-16">
          <div className="container-page">
            <h2 id="lp-checks" className="text-h2 text-paper">What the audit covers</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {CHECKS.map((c, i) => (
                <li key={c.title} className="border border-line p-6">
                  <p className="font-mono text-[0.6875rem] text-ember">0{i + 1}</p>
                  <h3 className="mt-2 text-h3 text-paper">{c.title}</h3>
                  <p className="mt-2 text-body text-mute">{c.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Proof, with its source stated */}
        <section aria-labelledby="lp-proof" className="border-t border-line py-12 sm:py-16">
          <div className="container-page grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label text-mute">Recent work</p>
              <h2 id="lp-proof" className="mt-3 text-h2 text-paper">INEGO, a clothing brand&apos;s online store</h2>
              <p className="mt-4 text-body text-mute">
                We built the store and its virtual try-on, and supported the launch. Paid campaigns
                were run by a separate marketing partner, ScaleUp Marketing Agency.
              </p>
              <Link
                href="/work/inego"
                className="mt-5 inline-block text-small text-ember underline-offset-4 hover:underline"
              >
                Read the case study →
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {[
                ["16,080", "visitors in 30 days", "production analytics"],
                ["51,194", "page views in 30 days", "production analytics"],
                ["₹4 lakh+", "revenue in 10 days", "brand-reported"],
              ].map(([value, label, source]) => (
                <li key={label} className="border border-line p-5">
                  <p className="text-[2rem] font-medium leading-none tracking-[-0.03em] text-paper">{value}</p>
                  <p className="mt-2 text-small text-mute">{label}</p>
                  <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute-deep">{source}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="lp-steps" className="border-t border-line py-12 sm:py-16">
          <div className="container-page">
            <h2 id="lp-steps" className="text-h2 text-paper">How it works</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="border border-line p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-ember font-mono text-small text-on-ember"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-h3 text-paper">{title}</h3>
                  <p className="mt-2 text-body text-mute">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="lp-faq" className="border-t border-line py-12 sm:py-16">
          <div className="container-page max-w-3xl">
            <h2 id="lp-faq" className="text-h2 text-paper">Questions</h2>
            <div className="mt-8 grid gap-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group border border-line [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-5 text-body font-medium text-paper focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-ember)]">
                    {f.q}
                    <span aria-hidden="true" className="text-ember transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-body text-mute">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing action: the same offer, with WhatsApp as the alternative */}
        <section className="border-t border-line py-12 sm:py-16">
          <div className="container-page flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-h3 text-paper">Ready when you are.</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink
                href="#audit"
                size="lg"
                arrow
                event="cta_click"
                eventProps={{ location: OFFER.location, label: "closing_audit" }}
              >
                Get my free audit
              </ButtonLink>
              <ButtonLink
                href={whatsappLink("Hi Catalyst Labs, I saw your post on LinkedIn and would like the free audit for my website: ")}
                size="lg"
                variant="secondary"
                event="whatsapp_click"
                eventProps={{ location: OFFER.location }}
              >
                Ask on WhatsApp
              </ButtonLink>
            </div>
          </div>
          <div className="container-page mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-mute-deep">
            <span>
              {site.name} · {site.location.city}, {site.location.region}
            </span>
            <span>
              {site.registration.scheme} {site.registration.number}
            </span>
            {founderLinkedIn ? (
              <a href={founderLinkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                {site.founder.name} on LinkedIn
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </World>
  );
}
