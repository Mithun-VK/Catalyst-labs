import Link from "next/link";
import { processStages } from "@/content/process";
import { Reveal } from "@/components/ui/Reveal";

/**
 * PROCESS SPINE - studio world.
 *
 * How a project actually moves, drawn as a spine rather than described in a
 * paragraph. The connecting rule is a real element between the stage markers,
 * so the sequence reads as one continuous run instead of five unrelated
 * blocks that happen to be stacked.
 *
 * These are the studio's REAL five stages from content/process.ts - Discover,
 * Architect, Design, Build, Launch. A tidier six-step alliterative version
 * would have been easy to write and would have described a process nobody
 * here runs, which is the kind of detail a client discovers in week two.
 *
 * Server component. The stagger comes from the scroll-driven reveal, so the
 * whole sequence animates with no JavaScript.
 */
export function ProcessSpine() {
  return (
    <section
      aria-labelledby="spine-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2
            id="spine-heading"
            className="text-paper"
            style={{
              fontSize: "clamp(2rem, 1rem + 3.6vw, 4rem)",
              lineHeight: "1.02",
              letterSpacing: "-0.035em",
              fontWeight: 600,
            }}
          >
            How a project moves
          </h2>
          <Link
            href="/process"
            className="group inline-flex items-center gap-2 text-small text-ember underline-offset-4 hover:underline"
          >
            The process in full
            <span
              aria-hidden="true"
              className="transition-transform duration-(--duration-base) group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <ol className="mt-16">
          {processStages.map((stage, i) => {
            const last = i === processStages.length - 1;
            return (
              <li key={stage.index} className="relative">
                <Reveal>
                  <div className="grid gap-x-(--space-gutter) gap-y-5 pb-14 lg:grid-cols-12">
                    {/* Spine: marker plus the rule running to the next one. */}
                    <div
                      aria-hidden="true"
                      className="relative flex items-start lg:col-span-1"
                    >
                      <span className="relative z-10 mt-1.5 block h-2.5 w-2.5 shrink-0 bg-ember" />
                      {!last ? (
                        <span className="absolute left-[4.5px] top-4 h-[calc(100%+2rem)] w-px bg-line-strong" />
                      ) : null}
                    </div>

                    <div className="lg:col-span-6">
                      <p className="flex items-baseline gap-4">
                        <span className="font-mono text-[0.75rem] tabular text-mute-deep">
                          {stage.index}
                        </span>
                        <span
                          className="uppercase text-paper"
                          style={{
                            fontSize: "clamp(1.5rem, 1rem + 2.2vw, 2.75rem)",
                            lineHeight: "1.05",
                            letterSpacing: "-0.03em",
                            fontWeight: 600,
                          }}
                        >
                          {stage.title}
                        </span>
                      </p>
                      <p className="mt-4 max-w-(--measure-wide) text-body text-mute">
                        {stage.body}
                      </p>
                    </div>

                    <div className="lg:col-span-4 lg:col-start-9">
                      <p className="label text-mute-deep">{stage.duration}</p>
                      <ul className="mt-4 grid gap-2">
                        {stage.output.map((out) => (
                          <li
                            key={out}
                            className="flex items-start gap-3 text-small text-paper-dim"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.6em] h-px w-3 shrink-0 bg-line-strong"
                            />
                            {out}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
