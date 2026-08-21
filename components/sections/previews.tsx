import Link from "next/link";
import { services } from "@/content/services";
import { projects, STATUS_LABEL } from "@/content/projects";
import { processStages } from "@/content/process";
import { scenarios } from "@/content/ai-scenarios";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Home-page previews.
 *
 * The home page's job is to establish what Catalyst Labs does and route the
 * visitor to the page that answers their question - not to be the whole site
 * stacked into one scroll. Each preview shows the shape of the full section
 * and hands off.
 *
 * All four share one layout contract: heading block, content, a single
 * trailing link. Repetition here is the point - it is what makes the page
 * feel systematic rather than assembled.
 */

/* -------------------------------------------------------------------------- */

export function ServicesPreview() {
  return (
    <Section id="services-preview" labelledBy="services-preview-heading">
      <SectionHeading
        id="services-preview-heading"
        index="02"
        eyebrow="Services"
        title={
          <>
            Six ways we take <span className="accent-word text-ember">work</span>{" "}
            off your team.
          </>
        }
        lead="Every capability answers the same three questions before a line of code is written: what is broken, what gets built, and what changes once it exists."
      />

      <div className="container-page mt-14">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.id} className="bg-ink">
              <Reveal delay={i * 50} className="h-full">
                <Link
                  href={`/services/${service.id}`}
                  className="group flex h-full cursor-pointer flex-col justify-between gap-10 p-7 transition-colors duration-(--duration-slow) hover:bg-ink-raised lg:p-8"
                >
                  <div>
                    <p className="label text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
                      {service.index}
                    </p>
                    <h3 className="mt-5 text-h3 text-paper">{service.title}</h3>
                    <p className="mt-3 text-small text-mute">{service.summary}</p>
                  </div>

                  <span className="inline-flex items-center gap-2.5 text-small text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
                    <span
                      aria-hidden="true"
                      className="h-px w-5 bg-current transition-all duration-(--duration-base) ease-(--ease-out-quart) group-hover:w-8"
                    />
                    View service
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={80}>
          <div className="mt-10">
            <ButtonLink
              href="/services"
              variant="secondary"
              arrow
              event="nav_click"
              eventProps={{ label: "all_services", location: "home_preview" }}
            >
              All services
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

export function WorkPreview() {
  /* Lead with the work that carries the most weight: shipped systems with a
     result you can check, and live sites a visitor can open. */
  const featured = projects.slice(0, 4);

  return (
    <Section id="work-preview" labelledBy="work-preview-heading">
      <SectionHeading
        id="work-preview-heading"
        index="01"
        eyebrow="Selected work"
        title={
          <>
            Systems in production, described as{" "}
            <span className="accent-word text-ember">engineering</span>.
          </>
        }
        lead="Fraud scoring serving live inference, a quantitative trading stack, a tax compliance platform, and client sites you can open right now."
      />

      <div className="container-page mt-14">
        <ul className="border-t border-line">
          {featured.map((project, i) => (
            <li key={project.slug} className="border-b border-line">
              <Reveal delay={i * 40}>
                <Link
                  href="/work"
                  className="group grid cursor-pointer gap-x-(--space-gutter) gap-y-3 py-7 lg:grid-cols-12 lg:items-baseline"
                >
                  <span className="label flex items-center gap-3 text-mute-deep lg:col-span-3">
                    <span className="text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {project.domain}
                  </span>

                  <span className="min-w-0 lg:col-span-6">
                    <span className="block text-h3 text-paper transition-colors duration-(--duration-base) group-hover:text-ember">
                      {project.name}
                    </span>
                    <span className="mt-1.5 block text-small text-mute">
                      {project.summary}
                    </span>
                  </span>

                  <span className="label flex items-center gap-2 text-mute-deep lg:col-span-3 lg:justify-end">
                    <span
                      aria-hidden="true"
                      className={
                        project.status === "building"
                          ? "h-1.5 w-1.5 shrink-0 bg-warn"
                          : "h-1.5 w-1.5 shrink-0 bg-ember"
                      }
                    />
                    {STATUS_LABEL[project.status]}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={80}>
          <div className="mt-10">
            <ButtonLink
              href="/work"
              variant="secondary"
              arrow
              event="nav_click"
              eventProps={{ label: "all_work", location: "home_preview" }}
            >
              See all work
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

export function AIPreview() {
  const stages = scenarios[0].stages;

  return (
    <Section id="ai-preview" labelledBy="ai-preview-heading">
      <SectionHeading
        id="ai-preview-heading"
        index="03"
        eyebrow="Artificial intelligence"
        title={
          <>
            Don&rsquo;t just add AI. Build it into the way your business{" "}
            <span className="accent-word text-ember">works</span>.
          </>
        }
        lead="A model that can only talk is a demo. A model wired into your systems - able to read your data, decide, and write back - is an employee that never sleeps."
      />

      <div className="container-page mt-14">
        <Reveal>
          <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, i) => (
              <li key={stage.key} className="flex flex-col gap-4 bg-ink p-6 lg:p-7">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 ${
                      i === 1 ? "bg-ember" : "bg-mute-deep"
                    }`}
                  />
                  <span className="label text-mute">{stage.label}</span>
                </div>
                <p className="font-mono text-[0.75rem] leading-relaxed text-paper-dim">
                  {stage.detail}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-body text-mute">
              Four scenarios, each walked through end to end - lead qualification,
              support, document processing and internal knowledge.
            </p>
            <ButtonLink
              href="/ai"
              variant="secondary"
              arrow
              className="w-full sm:w-auto"
              event="nav_click"
              eventProps={{ label: "ai_page", location: "home_preview" }}
            >
              See AI in practice
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

export function ProcessPreview() {
  return (
    <Section id="process-preview" labelledBy="process-preview-heading">
      <SectionHeading
        id="process-preview-heading"
        index="04"
        eyebrow="Process"
        title={
          <>
            Five stages. No <span className="accent-word text-ember">reveal</span>{" "}
            at the end.
          </>
        }
        lead="You see working software from the first build cycle, on a staging URL, every week. Nothing is held back for a presentation."
      />

      <div className="container-page mt-14">
        <Reveal>
          <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {processStages.map((stage) => (
              <li
                key={stage.index}
                className="flex flex-col gap-3 bg-ink p-6 transition-colors duration-(--duration-slow) hover:bg-ink-raised"
              >
                <span className="label text-ember">{stage.index}</span>
                <h3 className="text-h3 text-paper">{stage.title}</h3>
                <p className="label mt-auto pt-4 text-mute-deep">{stage.duration}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <ButtonLink
              href="/process"
              variant="secondary"
              arrow
              event="nav_click"
              eventProps={{ label: "process_page", location: "home_preview" }}
            >
              How we work
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
