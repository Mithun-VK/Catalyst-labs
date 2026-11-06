import { site } from "./site";
import type { OgCard } from "./og";
import { services } from "@/content/services";
import { caseStudies } from "@/content/case-studies";
import { posts } from "@/content/posts";
import { locations } from "@/content/locations";

/**
 * Per-page share cards, keyed by route path.
 *
 * A link shared on LinkedIn or WhatsApp shows this card, so a case study or
 * an article should not arrive looking identical to the home page. Cards are
 * rendered at build time by app/og/[...path]/route.tsx, and that route only
 * renders paths listed here: it is not an open "text on our domain" endpoint.
 *
 * buildMetadata() picks the card up automatically from the page path, so a
 * new page gets its own card by adding one entry below.
 */

const pages: Record<string, OgCard> = {
  "/services": {
    eyebrow: "Services",
    title: "Software and AI automation services, scoped in writing first.",
    lead: "Custom software, websites, mobile apps and AI automation from Chennai.",
  },
  "/work": {
    eyebrow: "Work",
    title: "Systems we have built, with the engineering detail.",
    lead: "Live client sites, an e-commerce store with virtual try-on, a fraud-scoring API.",
  },
  "/ai": {
    eyebrow: "AI & Automation",
    title: "AI that does the work, not just the chat.",
    lead: "Agents wired into your CRM, WhatsApp and documents, with a person in the loop.",
  },
  "/process": {
    eyebrow: "Process",
    title: "Five stages. Working software every week. No reveal at the end.",
  },
  "/about": {
    eyebrow: "About",
    title: "A founder-led software and AI studio in Chennai.",
    lead: `Registered ${site.registration.scheme} ${site.registration.classification}, ${site.registration.number}.`,
  },
  "/contact": {
    eyebrow: "Contact",
    title: "Tell us what you want to build, automate or fix.",
    lead: "A reply within one working day, from the person who would run your project.",
  },
  "/blog": {
    eyebrow: "Insights",
    title: "Straight answers about building software and AI automation.",
  },
  "/linkedin": {
    eyebrow: "Free audit",
    title: "A free website and automation audit for your business.",
    lead: "Speed, search and enquiry flow checked, plus the first process we would automate.",
  },
};

for (const s of services) {
  pages[`/services/${s.id}`] = {
    eyebrow: "Service",
    title: s.h1 ?? s.title,
    lead: `${s.summary}.`,
  };
}

for (const c of caseStudies) {
  pages[`/work/${c.slug}`] = { eyebrow: "Case study", title: c.title };
}

for (const p of posts) {
  pages[`/blog/${p.slug}`] = {
    eyebrow: `Insights · ${p.tags[0]}`,
    title: p.title,
    lead: `${p.readMinutes} min read · By ${site.founder.name}, ${site.founder.jobTitle}`,
  };
}

for (const l of locations) {
  pages[`/${l.slug}`] = { eyebrow: l.eyebrow, title: l.h1.replace(/\.$/, "") };
}

export const ogCards: Readonly<Record<string, OgCard>> = pages;

/** Image path for a page's own card, or undefined to use the site default. */
export function ogImagePath(path: string): string | undefined {
  return ogCards[path] ? `/og${path}.png` : undefined;
}
