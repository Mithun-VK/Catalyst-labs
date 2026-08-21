import { alsoBuilt, projects, STATUS_LABEL, type Project } from "@/content/projects";
import { CompactHeading, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * SELECTED WORK.
 *
 * A SERVER component. The previous version was a client component purely to
 * hold accordion state; an index that is meant to be read and scanned does not
 * need to hide its own content behind a click, so the state - and the
 * JavaScript - is gone.
 *
 * Structure is carried by hairlines, a number rail and typographic scale
 * rather than by cards and panels. On a dark ground, boxes inside boxes read
 * as clutter; a ruled index reads as a specification.
 */
export function Work({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <Section
      id="work"
      labelledBy={showHeading ? "work-heading" : undefined}
      divider={showHeading}
    >
      {showHeading ? (
        <SectionHeading
          id="work-heading"
          index="01"
          eyebrow="Selected work"
          title={
            <>
              Systems in production, described as{" "}
              <span className="accent-word text-ember">engineering</span>.
            </>
          }
          lead="Fraud scoring in production, a quantitative trading stack, a tax compliance platform, and live client sites. Each one below states what it does, how it is built, and what can be verified."
          aside={
            <div className="border-l-2 border-ember/50 pl-5">
              <p className="label text-mute-deep">A note on the numbers</p>
              <p className="mt-3 text-small text-mute">
                Model scores and test counts are recorded results from the
                build, not estimates. Where an engagement is covered by an
                agreement, it is described without naming the client rather
                than dressed up or left out.
              </p>
            </div>
          }
        />
      ) : (
        <CompactHeading
          id="work-heading"
          eyebrow="Selected work"
          title="Production systems and live client sites."
          note={`${projects.length + alsoBuilt.length} projects`}
        />
      )}

      <div className={`container-page ${showHeading ? "mt-16" : "mt-10"}`}>
        <ul className="border-t border-line">
          {projects.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i + 1} />
          ))}
        </ul>

        <Reveal>
          <div className="mt-20">
            <p className="label text-mute-deep">Also in the studio</p>
            <ul className="mt-6 border-t border-line">
              {alsoBuilt.map((project) => (
                <CompactRow key={project.slug} project={project} />
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-16 flex flex-col items-start gap-5 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-body text-mute">
              If one of these resembles the problem you are carrying, the first
              conversation is about whether it is worth building at all.
            </p>
            <ButtonLink
              href="/contact"
              variant="secondary"
              arrow
              event="cta_click"
              eventProps={{ location: "work", label: "start_a_project" }}
              className="w-full sm:w-auto"
            >
              Start a Project
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Ember for shipped work, muted for in-flight, dim for a closed venture. */
function StatusMark({ status }: { status: Project["status"] }) {
  const tone =
    status === "live" || status === "production"
      ? "bg-ember"
      : status === "building"
        ? "bg-warn"
        : "bg-mute-deep";

  return (
    <span className="label inline-flex items-center gap-2 text-mute-deep">
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 ${tone}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** A lead project: full detail, on the same 12-column grid as everything else. */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <li className="border-b border-line">
      <Reveal>
        <article className="grid gap-x-(--space-gutter) gap-y-6 py-12 lg:grid-cols-12 lg:py-16">
          {/* Rail: index, domain, status. */}
          <div className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-3">
            <span className="label text-ember">
              {String(index).padStart(2, "0")}
            </span>
            <span className="label text-mute-deep">{project.domain}</span>
            <StatusMark status={project.status} />
          </div>

          <div className="lg:col-span-6">
            <h3 className="text-h3 text-paper">{project.name}</h3>
            <p className="mt-4 max-w-(--measure) text-lead text-paper-dim">
              {project.summary}
            </p>
            <p className="mt-5 max-w-(--measure) text-body text-mute">
              {project.detail}
            </p>

            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-small text-ember underline-offset-4 hover:underline"
              >
                {project.href.replace(/^https:\/\//, "")}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <p className="label text-mute-deep">Verified</p>
            <ul className="mt-4 grid gap-3">
              {project.proof.map((item) => (
                <li key={item} className="flex gap-3 text-small text-paper-dim">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1 w-1 shrink-0 bg-ember"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.technology.map((tech) => (
                <li
                  key={tech}
                  className="border border-line px-2 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-mute"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

/** Secondary work: one line each, so the lead set keeps the attention. */
function CompactRow({ project }: { project: Project }) {
  return (
    <li className="grid gap-x-(--space-gutter) gap-y-2 border-b border-line py-6 lg:grid-cols-12 lg:items-baseline">
      <div className="lg:col-span-3">
        <h3 className="text-body font-medium text-paper">{project.name}</h3>
        <p className="label mt-1.5 text-mute-deep">{project.domain}</p>
      </div>

      <p className="text-small text-mute lg:col-span-6">{project.summary}</p>

      <div className="lg:col-span-3 lg:text-right">
        <StatusMark status={project.status} />
      </div>
    </li>
  );
}
