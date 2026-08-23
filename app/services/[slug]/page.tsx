import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CTABand } from "@/components/sections/CTABand";
import { getService, services } from "@/content/services";
import { site } from "@/lib/site";
import { abs, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.id }));
}

/** Unknown slugs 404 statically rather than being server-rendered on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.id}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.id !== service.id);

  /* Schema for this specific service, plus the trail that leads to it. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": abs(`/services/${service.id}#service`),
        name: service.title,
        description: service.seoDescription,
        serviceType: service.title,
        url: abs(`/services/${service.id}`),
        provider: { "@id": abs("/#organization") },
        areaServed: [
          { "@type": "City", name: site.location.city },
          { "@type": "Country", name: "India" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs() },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: abs("/services"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: abs(`/services/${service.id}`),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <World id="atelier">
      <JsonLd data={jsonLd} />

      <PageHeader
        index={service.index}
        eyebrow="Service"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        title={service.title}
        lead={service.tagline}
        actions={
          <>
            <ButtonLink
              href="/contact"
              arrow
              event="cta_click"
              eventProps={{ location: "service_header", label: service.id }}
              className="w-full sm:w-auto"
            >
              Discuss this
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="secondary"
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "all_services", location: "service_header" }}
            >
              All services
            </ButtonLink>
          </>
        }
        meta={
          <MetaList
            items={[
              { label: "Service", value: `${service.index} / 06` },
              { label: "Outcome", value: service.summary },
              { label: "Core stack", value: service.stack.slice(0, 3).join(" · ") },
            ]}
          />
        }
      />

      {/* --- The argument ------------------------------------------------- */}
      <Section divider={false} className="pb-0">
        <div className="container-page">
          <div className="grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-col gap-6 text-lead text-mute">
                  {service.detail.map((paragraph, i) => (
                    <p key={i} className={i === 1 ? "text-paper" : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={90} className="lg:col-span-4 lg:col-start-9">
              <div className="border-l-2 border-ember/50 pl-6">
                <p className="label text-mute-deep">Signs you need this</p>
                <ul className="mt-5 grid gap-3.5">
                  {service.signals.map((signal) => (
                    <li key={signal} className="flex gap-3 text-small text-paper-dim">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-3 shrink-0 bg-ember"
                      />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --- Problem / solution / outcome --------------------------------- */}
      <Section divider={false}>
        <div className="container-page">
          <Reveal>
            <dl className="grid gap-px border border-line bg-line lg:grid-cols-3">
              {[
                { label: "Problem", value: service.problem },
                { label: "Solution", value: service.solution },
                { label: "Outcome", value: service.outcome, accent: true },
              ].map((row) => (
                <div key={row.label} className="bg-ink p-7 lg:p-8">
                  <dt
                    className={`label ${row.accent ? "text-ember" : "text-mute-deep"}`}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className={`mt-4 text-body ${
                      row.accent ? "text-paper" : "text-mute"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* --- Scope -------------------------------------------------------- */}
      <Section>
        <div className="container-page">
          <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="label flex items-center gap-3 text-mute">
                <span className="text-ember">/</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                What the work includes
              </p>
              <h2 className="mt-6 text-h2 text-paper">
                How the work actually{" "}
                <span className="accent-word text-ember">runs</span>.
              </h2>
              <p className="mt-5 text-body text-mute">
                Scope is agreed in writing before the build starts, and every
                stage produces something you can inspect.
              </p>
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              <ol className="border-t border-line">
                {service.scope.map((phase, i) => (
                  <li key={phase.title} className="border-b border-line">
                    <Reveal delay={i * 50}>
                      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-6 sm:gap-x-8">
                        <span className="label pt-1.5 text-mute-deep">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-h3 text-paper">{phase.title}</h3>
                          <p className="mt-2.5 text-body text-mute">{phase.body}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <Reveal delay={80}>
                <div className="mt-10">
                  <p className="label text-mute-deep">Typical stack</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {service.stack.map((tech) => (
                      <li
                        key={tech}
                        className="border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-paper-dim transition-colors duration-(--duration-fast) hover:border-line-ember hover:text-paper"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* --- Deliverables + FAQ ------------------------------------------- */}
      <Section>
        <div className="container-page">
          <div className="grid gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="text-h2 text-paper">
                What you <span className="accent-word text-ember">receive</span>.
              </h2>
              <ul className="mt-8 border-t border-line">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3.5 border-b border-line py-3.5 text-body text-paper-dim"
                  >
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-ember" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <h2 className="text-h2 text-paper">
                  Straight <span className="accent-word text-ember">answers</span>.
                </h2>
              </Reveal>

              <dl className="mt-8 border-t border-line">
                {service.faqs.map((faq, i) => (
                  <div key={faq.q} className="border-b border-line py-6">
                    <Reveal delay={i * 50}>
                      <dt className="text-h3 text-paper">{faq.q}</dt>
                      <dd className="mt-3 max-w-2xl text-body text-mute">{faq.a}</dd>
                    </Reveal>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* --- Sibling services --------------------------------------------- */}
      <Section>
        <div className="container-page">
          <Reveal>
            <p className="label text-mute-deep">Other services</p>
          </Reveal>

          <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other, i) => (
              <li key={other.id} className="bg-ink">
                <Reveal delay={i * 40} className="h-full">
                  <Link
                    href={`/services/${other.id}`}
                    className="group flex h-full cursor-pointer flex-col justify-between gap-8 p-6 transition-colors duration-(--duration-slow) hover:bg-ink-raised"
                  >
                    <span className="label text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
                      {other.index}
                    </span>
                    <span>
                      <span className="block text-body font-medium text-paper">
                        {other.title}
                      </span>
                      <span className="mt-2 block text-small text-mute">
                        {other.summary}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTABand
        title={`Need ${service.title}?`}
        accent="Tell us the problem."
        lead="The first conversation is about your operation, not our stack. If a smaller fix would do the job, we will say so before quoting a larger one."
      />
    </World>
  );
}
