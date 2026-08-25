import Link from "next/link";
import { processStages, SCHEDULE_SPAN } from "@/content/process";

/**
 * PROCESS SCHEDULE - studio world.
 *
 * How a project actually moves, drawn as the schedule it is rather than
 * described as a list of stages. Every stage in content/process.ts carries a
 * real time range in its copy - "Days 1-5", "Week 1-2", "Week 3 onward" - and
 * those ranges are the layout: each stage owns a bar on one shared week axis,
 * placed and sized by its own dates. Discover and Architect overlap because
 * they overlap in practice, and Build has no right edge because it has no
 * stated end. Five evenly spaced blocks would have been easier to draw and
 * would have pictured a process nobody here runs, which is the kind of detail
 * a client discovers in week two.
 *
 * The numbers are row keys, not decoration. 01 labels a track with a start, a
 * length and a neighbour it overlaps - which is more work than an oversized
 * numeral ghosted behind a title was doing.
 *
 * MOTION. One mechanism: scroll. A playhead crosses the sticky ruler as the
 * section is read, and each bar draws itself as its row arrives. Drawn bars
 * stay drawn, so the schedule accumulates behind the reader. All of it is
 * scroll-driven CSS on named view timelines (`.schedule`, `.sched-stage` in
 * globals.css), which is why this stays a server component with no
 * JavaScript, no IntersectionObserver and nothing to hydrate.
 *
 * The un-animated state is the FINISHED state - bars fully drawn, playhead
 * parked at the end - so reduced motion and browsers without
 * `animation-timeline` get a complete schedule rather than an empty grid.
 */

/* The axis legend. Four weeks and the open region, which is stage 05's own
   "Ongoing" rather than a word invented for the chart. */
const AXIS = ["Week 1", "Week 2", "Week 3", "Week 4", "Ongoing"];

export function ProcessSchedule() {
  return (
    <section
      aria-labelledby="schedule-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2
            id="schedule-heading"
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

        <div className="schedule mt-12 lg:mt-16">
          {/* THE RULER. Sticks under the condensed nav (h-16) so the axis is
              still on screen while any row is being read - a schedule you
              cannot see the dates of is just a list again.

              Decorative: every date in it is already carried in real text by
              the stage keys below, so hiding it costs a screen reader
              nothing. Dropped entirely below lg, where a five-column axis
              would be four illegible columns and a squeeze. */}
          <div
            aria-hidden="true"
            className="sticky top-16 z-(--z-raised) hidden bg-ink pt-4 pb-3 lg:block"
          >
            <div className="grid grid-cols-[var(--sched-gutter)_1fr] gap-x-6">
              <span />
              <div className="relative">
                <div className="grid grid-cols-5">
                  {AXIS.map((unit) => (
                    <span
                      key={unit}
                      className="label border-l border-line pb-2 pl-2 text-mute-deep"
                    >
                      {unit}
                    </span>
                  ))}
                </div>
                <div className="h-px w-full bg-line-strong" />
                <span className="sched-playhead" />
              </div>
            </div>
          </div>

          <ol className="mt-2">
            {processStages.map((stage) => {
              const left = (stage.start / SCHEDULE_SPAN) * 100;
              const width = ((stage.end - stage.start) / SCHEDULE_SPAN) * 100;

              return (
                <li
                  key={stage.index}
                  className="sched-stage border-t border-line py-9 lg:py-11"
                >
                  <div className="grid gap-x-6 gap-y-5 lg:grid-cols-[var(--sched-gutter)_1fr]">
                    {/* The row key. On desktop it sits in the gutter beside
                        the bar it labels; on mobile it collapses into one
                        line above the track, which is the same information
                        in the order a narrow column can carry it. */}
                    <div className="sched-key flex items-baseline gap-4 lg:block">
                      <p className="sched-num">{stage.index}</p>
                      <p className="label text-ember lg:mt-4">
                        {stage.duration}
                      </p>
                    </div>

                    <div className="sched-field">
                      {/* The bar. Below lg this is the whole axis: the week
                          gridlines come with the track, so it still reads as
                          a proportional range rather than a progress bar. */}
                      <div
                        aria-hidden="true"
                        className="sched-track relative h-2.5 w-full"
                      >
                        <span
                          className="sched-bar absolute inset-y-0"
                          data-open={stage.open ? "true" : undefined}
                          data-ticked={stage.ticked ? "true" : undefined}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        />
                      </div>

                      <div className="sched-detail mt-6">
                        <h3
                          className="uppercase text-paper"
                          style={{
                            fontSize: "clamp(1.5rem, 1rem + 2.2vw, 2.75rem)",
                            lineHeight: "1.05",
                            letterSpacing: "-0.03em",
                            fontWeight: 600,
                          }}
                        >
                          {stage.title}
                        </h3>

                        <div className="mt-5 grid gap-x-(--space-gutter) gap-y-7 lg:grid-cols-12">
                          <p className="max-w-(--measure-wide) text-body text-mute lg:col-span-7">
                            {stage.body}
                          </p>

                          <div className="lg:col-span-4 lg:col-start-9">
                            <p className="label text-mute-deep">Deliverables</p>
                            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
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
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
