import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { World } from "@/components/worlds/World";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassField } from "@/components/glass/GlassField";
import { GlassAurora } from "@/components/glass/GlassAurora";
import { CTABand } from "@/components/sections/CTABand";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { ButtonLink } from "@/components/ui/Button";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";
import { locations, getLocation } from "@/content/locations";
import { services } from "@/content/services";
import { projects, STATUS_LABEL } from "@/content/projects";
import { site } from "@/lib/site";
import { abs, breadcrumbSchema, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return locations.map((l) => ({ slug: l.slug }));
}

/** Anything that is not a declared location page is a 404, not a render. */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocation(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/${page.slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getLocation(slug);
  if (!page) notFound();

  const featured = page.services
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const proof = page.projectSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = page.related
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": abs(`/${page.slug}#service`),
        name: page.h1.replace(/\.$/, ""),
        description: page.seoDescription,
        url: abs(`/${page.slug}`),
        provider: { "@id": abs("/#organization") },
        areaServed: [
          ...(page.places ?? []).map((name) => ({ "@type": "City", name })),
          { "@type": "State", name: site.location.region },
          { "@type": "Country", name: "India" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: featured.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, url: abs(`/services/${s.id}`) },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <World id="atelier" className="bg-transparent">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema([{ name: page.eyebrow.split(" · ")[0], path: `/${page.slug}` }])} />
      <GlassAurora />
      <GlassField>
        {/* ---- hero ---------------------------------------------------- */}
        <section aria-labelledby="loc-heading" className="relative pt-28 pb-10 sm:pt-36 lg:pb-14">
          <div className="container-page">
            <p className="glass-chip inline-flex items-center gap-2.5 px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-paper">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
              {page.eyebrow}
            </p>

            <div className="mt-7 grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h1
                  id="loc-heading"
                  className="text-paper"
                  style={{
                    fontSize: "clamp(2.25rem, 1rem + 4vw, 4.25rem)",
                    lineHeight: "1.02",
                    letterSpacing: "-0.03em",
                    fontWeight: 500,
                  }}
                >
                  {page.h1}
                </h1>
                {page.intro.map((p) => (
                  <p key={p} className="mt-6 max-w-[62ch] text-lead text-mute">
                    {p}
                  </p>
                ))}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href="/contact"
                    size="lg"
                    arrow
                    event="cta_click"
                    eventProps={{ location: `landing_${page.slug}`, label: "start_a_project" }}
                    className="w-full sm:w-auto"
                  >
                    Start a project
                  </ButtonLink>
                  <ButtonLink
                    href="/services"
                    size="lg"
                    variant="secondary"
                    className="glass-chip w-full !border-white/70 !bg-white/60 sm:w-auto"
                  >
                    All services
                  </ButtonLink>
                </div>
              </div>

              <dl className="glass-dark grid gap-4 p-6 lg:col-span-4">
                {[
                  ["Based in", `${site.location.city}, ${site.location.region}, ${site.location.country}`],
                  ["Registered", `${site.registration.classification}, ${site.registration.scheme}`],
                  ["Scope", "Fixed and written before any code"],
                  ["Reply", "Within one working day"],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ember">{t}</dt>
                    <dd className="mt-1 text-small text-paper">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---- what we build ------------------------------------------- */}
        <section aria-labelledby="loc-build" className={SVC_SECTION}>
          <div className="container-page">
            <SvcHeading id="loc-build" index="01" eyebrow="What we build" title="Practices most relevant here." />
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.id}`}
                    className="glass glass-lift flex h-full cursor-pointer flex-col p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
                  >
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                      {s.index}
                    </span>
                    <span className="mt-1.5 text-h3 text-paper">{s.title}</span>
                    <span className="mt-2 text-small text-mute">{s.summary}.</span>
                    <ul className="mt-4 grid gap-1.5">
                      {s.deliverables.slice(0, 3).map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-small text-paper-dim">
                          <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-5 text-small text-ember">Explore {s.title} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- how we work --------------------------------------------- */}
        <HowWeWork commitments={page.reasons} />

        {page.places ? (
          <div className="container-page">
            <p className="glass-chip rounded-2xl px-5 py-4 text-small text-mute">
              Working with businesses in{" "}
              <span className="text-paper">{page.places.join(", ")}</span> and across{" "}
              {site.location.region}, remote-first, with calls and delivery handled online.
            </p>
          </div>
        ) : null}

        {/* ---- proof --------------------------------------------------- */}
        <section aria-labelledby="loc-proof" className={SVC_SECTION}>
          <div className="container-page">
            <SvcHeading
              id="loc-proof"
              index="03"
              eyebrow="Work"
              title="Built and in production."
              aside={
                <Link href="/work" className="text-small text-ember underline-offset-4 hover:underline">
                  All work →
                </Link>
              }
            />
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {proof.map((p) => {
                const stat = p.stats?.[0];
                return (
                  <li key={p.slug}>
                    <Link
                      href={p.caseStudy ? `/work/${p.caseStudy}` : "/work"}
                      className="glass glass-lift flex h-full cursor-pointer flex-col overflow-hidden p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
                    >
                      {p.image ? (
                        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.1rem] bg-white/50">
                          <Image
                            src={p.image}
                            alt={`${p.name} homepage`}
                            fill
                            sizes="(min-width: 768px) 30vw, 92vw"
                            className="object-cover object-top"
                          />
                        </div>
                      ) : null}
                      <div className="p-3 pt-4">
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                          {p.domain} · {STATUS_LABEL[p.status]}
                        </p>
                        <p className="mt-1 text-h3 text-paper">{p.name}</p>
                        <p className="mt-2 text-small text-mute">{p.summary}</p>
                        {stat ? (
                          <p className="mt-3 text-small text-mute">
                            <span className="text-[1.25rem] font-medium text-paper">{stat.value}</span> {stat.label}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- FAQ ----------------------------------------------------- */}
        <section aria-labelledby="loc-faq" className={SVC_SECTION}>
          <div className="container-page">
            <SvcHeading id="loc-faq" index="04" eyebrow="FAQ" title="Straight answers." />
            <div className="mt-8 grid items-start gap-3 md:grid-cols-2">
              {page.faqs.map((f) => (
                <details key={f.q} className="glass group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-ember)]">
                    <span className="text-body font-medium text-paper">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/60 text-paper transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-small text-mute">{f.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-8 text-small text-mute">
              Also see:{" "}
              {related.map((r, i) => (
                <span key={r.slug}>
                  {i > 0 ? " · " : ""}
                  <Link href={`/${r.slug}`} className="text-ember underline-offset-4 hover:underline">
                    {r.seoTitle.split(" | ")[0]}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </section>

        <CTABand
          title="Have a project in mind?"
          accent="Tell us about it."
          lead="Describe what you are trying to build, automate or improve. We will tell you what it would take, and whether we are the right team."
          location={`landing_${page.slug}`}
        />
      </GlassField>
    </World>
  );
}
