import { processStages } from "@/content/process";
import { SVC_SECTION } from "@/components/sections/services/SvcHeading";

/**
 * HOW WE WORK - the engagement told in full, on the glass pages.
 *
 * Left (sticky on desktop): the promise and the four commitments a buyer is
 * actually weighing - written scope, weekly working builds, ownership, direct
 * access - in readable type. Right: the five real stages from
 * content/process.ts, each with what happens, how long it takes and what the
 * client receives, joined by a line so the sequence reads as a path.
 *
 * Server component, no client JavaScript. Every sentence is either from the
 * process data or already stated on the site.
 */
export function HowWeWork({
  commitments,
}: {
  commitments: { title: string; body: string }[];
}) {
  return (
    <section id="how-we-work" aria-labelledby="how-heading" className={SVC_SECTION}>
      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          {/* ---- the promise -------------------------------------------- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.26em] text-mute-deep">
                02 · How we work
              </p>
              <h2
                id="how-heading"
                className="mt-3 text-paper"
                style={{
                  fontSize: "clamp(1.875rem, 1rem + 2.8vw, 3.25rem)",
                  lineHeight: "1.02",
                  letterSpacing: "-0.03em",
                  fontWeight: 500,
                }}
              >
                No surprises between the proposal and the product.
              </h2>
              <p className="mt-5 max-w-[46ch] text-lead text-mute">
                You agree a fixed scope in writing, see the real product every
                week, and own it when it ships. Here is how a project runs from
                first conversation to launch.
              </p>

              <ul className="mt-8 grid gap-3">
                {commitments.map((c) => (
                  <li key={c.title} className="glass flex gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember text-on-ember"
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M3 8.5l3 3 7-7" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-body font-medium text-paper">{c.title}</h3>
                      <p className="mt-1 text-small text-mute">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- the five stages ---------------------------------------- */}
          <ol className="relative grid gap-4 lg:col-span-7">
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-[1.65rem] top-10 hidden w-px bg-[var(--color-line-strong)] sm:block"
            />
            {processStages.map((stage) => (
              <li key={stage.index} className="glass relative p-5 sm:p-7 sm:pl-[4.75rem]">
                <span
                  aria-hidden="true"
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-ember font-mono text-small text-on-ember shadow-[0_10px_22px_-10px_rgb(140_106_36/0.7)] sm:absolute sm:left-[0.45rem] sm:top-6 sm:mb-0"
                >
                  {stage.index}
                </span>

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-h3 text-paper">{stage.title}</h3>
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ember">
                    {stage.duration}
                  </p>
                </div>

                <p className="mt-3 max-w-[62ch] text-body text-mute">{stage.body}</p>

                <div className="glass-inset mt-5 p-4">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute-deep">
                    You receive
                  </p>
                  <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {stage.output.map((o) => (
                      <li key={o} className="flex items-start gap-2.5 text-small text-paper-dim">
                        <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
