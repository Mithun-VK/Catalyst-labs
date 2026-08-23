import Link from "next/link";
import { alsoBuilt, STATUS_LABEL, type Project } from "@/content/projects";
import { Stagger } from "@/components/motion/TextReveal";

/**
 * ALSO BUILT - poster world, comic register.
 *
 * The secondary index. These are real projects, but putting eight more
 * full-bleed posters below the lead set would flatten the hierarchy that the
 * page just spent six compositions establishing - if everything is a poster,
 * nothing is.
 *
 * So they are set as a dense grid of pastel "candy" cards instead - the
 * quieter half of the reference brief's palette, thick-outlined and
 * hard-shadowed like everything else on this page, cycling through four
 * tints so no two neighbours in the grid share a colour.
 *
 * The section itself stays on the dark ink surface with a scattered dot
 * field behind the cards - the studio's own reading of the reference's
 * starfield, sized down to a texture rather than a full illustrated sky.
 *
 * ONE OPEN SLOT. The grid always ends with one dashed, unfilled card rather
 * than a hard stop, because the honest answer to "is this the whole list" is
 * no - a client's project becomes an entry here the moment it ships and they
 * approve naming it. That is a standing invitation, not filler copy, so it
 * is built to survive the list growing: it is simply always the last card.
 */

const CANDY: NonNullable<Project["accent"]>[] | string[] = [
  "candy-yellow",
  "candy-mint",
  "candy-lavender",
  "candy-pink",
];

export function AlsoBuilt() {
  return (
    <section
      data-surface="ink"
      aria-labelledby="also-built-heading"
      className="relative overflow-hidden py-(--space-section)"
    >
      <div className="starfield" aria-hidden="true" />

      <div className="container-page relative">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2
            id="also-built-heading"
            className="text-comic font-semibold uppercase leading-none tracking-[-0.03em] text-paper"
            style={{ fontSize: "clamp(1.75rem, 1rem + 2.6vw, 3rem)" }}
          >
            Also built
          </h2>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-mute-deep">
            {alsoBuilt.length} projects · always room for one more
          </p>
        </div>

        <Stagger
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          step={2}
        >
          {alsoBuilt.map((project, i) => (
            <article
              key={project.slug}
              data-surface={CANDY[i % CANDY.length]}
              className="comic-panel comic-panel-hover flex flex-col p-6"
              style={{ "--comic-offset": "5px" } as React.CSSProperties}
            >
              <p className="flex items-center justify-between gap-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
                <span>{project.domain}</span>
                <span>{STATUS_LABEL[project.status]}</span>
              </p>

              <h3 className="mt-4 text-h3 text-paper">{project.name}</h3>
              <p className="mt-3 flex-1 text-small text-mute">
                {project.summary}
              </p>

              <ul className="mt-5 grid gap-1.5">
                {project.proof.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-small text-paper"
                  >
                    <span aria-hidden="true" className="hex-bullet mt-[0.3em]" />
                    {item}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.technology.map((tech) => (
                  <li
                    key={tech}
                    className="comic-tag"
                    style={{ padding: "0.2rem 0.6rem", fontSize: "0.625rem" }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* The open slot. Always last, always the same shape as the cards
              beside it, but dashed rather than solid so it reads as space
              held open rather than one more finished project. */}
          <div>
            <Link
              href="/contact"
              className="group flex h-full min-h-[15rem] flex-col items-start justify-center gap-3 rounded-[26px] border-[3px] border-dashed border-line-strong p-7 text-paper transition-colors duration-(--duration-base) hover:border-paper"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-current text-lg leading-none"
              >
                +
              </span>
              <span className="text-h3 text-paper">Add your works here</span>
              <span className="max-w-[26ch] text-small text-mute">
                Propose a project. Once it ships and you approve publishing
                it, it goes on this list.
              </span>
              <span className="mt-2 inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ember">
                Start a conversation
                <span
                  aria-hidden="true"
                  className="transition-transform duration-(--duration-base) group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
