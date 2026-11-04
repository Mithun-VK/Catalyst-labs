import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { World } from "@/components/worlds/World";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { projects, alsoBuilt } from "@/content/projects";
import { abs, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata({
    title: study.seoTitle,
    description: study.seoDescription,
    path: `/work/${study.slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const project = [...projects, ...alsoBuilt].find(
    (p) => p.slug === study.projectSlug
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: study.title,
        description: study.seoDescription,
        url: abs(`/work/${study.slug}`),
        datePublished: "2026-11-05",
        author: { "@id": abs("/#organization") },
        publisher: { "@id": abs("/#organization") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs() },
          { "@type": "ListItem", position: 2, name: "Works", item: abs("/work") },
          {
            "@type": "ListItem",
            position: 3,
            name: study.client,
            item: abs(`/work/${study.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <World id="poster">
      <JsonLd data={jsonLd} />

      <PageHeader
        eyebrow="Case study"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Works", href: "/work" },
          { label: study.client },
        ]}
        title={study.title}
        lead={study.summary}
        meta={
          <MetaList
            items={[
              { label: "Client", value: study.client },
              { label: "Sector", value: study.sector },
              { label: "Published", value: study.published },
              ...(project?.href
                ? [
                    {
                      label: "Live site",
                      value: (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ember underline underline-offset-4"
                        >
                          {project.href.replace("https://", "")}
                        </a>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        }
      />

      <Section>
        <div className="container-page">
          <Reveal>
            <h2 className="text-h2 text-paper">The numbers</h2>
          </Reveal>
          <dl className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
            {study.results.map((r) => (
              <div key={r.label} className="bg-ink p-6 sm:p-8">
                <dd className="text-h1 text-paper">{r.value}</dd>
                <dt className="mt-2 text-body text-paper-dim">{r.label}</dt>
                <p className="mt-3 text-[0.8125rem] text-mute-deep">{r.source}</p>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section>
        <div className="container-page grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {study.sections.map((section) => (
              <Reveal key={section.heading}>
                <h2 className="mt-10 text-h3 text-paper first:mt-0">
                  {section.heading}
                </h2>
                {section.body.map((p) => (
                  <p key={p} className="mt-4 text-body text-mute">
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <p className="label text-mute-deep">Who did what</p>
              <ul className="mt-4 border-t border-line">
                {study.roles.map((r) => (
                  <li key={r.party} className="border-b border-line py-3.5">
                    <span className="block text-body text-paper">{r.party}</span>
                    <span className="block text-small text-mute">{r.role}</span>
                  </li>
                ))}
              </ul>

              <p className="label mt-10 text-mute-deep">Traffic sources (30 days)</p>
              <ul className="mt-4 border-t border-line">
                {study.trafficSources.map((t) => (
                  <li
                    key={t.source}
                    className="flex justify-between gap-4 border-b border-line py-3.5 text-small"
                  >
                    <span className="text-paper-dim">{t.source}</span>
                    <span className="shrink-0 text-mute">{t.visitors}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <Reveal>
            <p className="label text-mute-deep">About these figures</p>
            <ul className="mt-4 max-w-2xl list-disc pl-5 text-small text-mute">
              {study.notes.map((n) => (
                <li key={n} className="mt-2">
                  {n}
                </li>
              ))}
            </ul>
            <Link
              href="/work"
              className="mt-8 inline-block text-small text-paper underline underline-offset-4 hover:text-ember"
            >
              All work
            </Link>
          </Reveal>
        </div>
      </Section>

      <CTABand
        variant="poster"
        location="case_study"
        title="Want a launch that holds up under traffic?"
        accent="Tell us about it."
        lead="Describe what you are launching and when. We will tell you what it takes, and whether we are the right team."
      />
    </World>
  );
}
