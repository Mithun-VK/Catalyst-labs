import Link from "next/link";
import { processStages } from "@/content/process";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger } from "@/components/motion/TextReveal";

/**
 * ENGINEERING PROCESS - the real five stages from content/process.ts
 * (Discover, Architect, Design, Build, Launch & Improve), the same ones the
 * dedicated /process page walks through in full. This is the condensed,
 * services-page-appropriate read: index, title, duration and what is
 * actually handed over at the end of each stage - the trust-building detail
 * the brief calls for, without duplicating the full page.
 *
 * A single gold rule runs behind the numerals, standing in for the "moving
 * progress indicator" as a static line rather than a scroll-scrubbed one:
 * this section sits below the page's one pinned experience (ServicesSection)
 * already, and a second independent scroll mechanism this close to the
 * first would compete with it rather than read as part of the same system.
 */
export function EngineeringProcess() {
  return (
    <section
      aria-labelledby="process-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-mute-deep">
                Process / 03
              </p>
              <h2
                id="process-heading"
                className="mt-6 max-w-[18ch] text-paper"
                style={{
                  fontSize: "clamp(1.875rem, 1rem + 3.4vw, 3.75rem)",
                  lineHeight: "0.98",
                  letterSpacing: "-0.03em",
                  fontWeight: 500,
                }}
              >
                Systematic, not improvised.
              </h2>
            </div>
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
        </Reveal>

        <div className="relative mt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-line-strong lg:block"
          />

          <Stagger
            as="ol"
            step={4}
            className="grid gap-10 lg:grid-cols-5 lg:gap-x-6"
          >
            {processStages.map((stage) => (
              <li key={stage.index} className="relative">
                <span className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full bg-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                </span>
                <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute-deep">
                  {stage.index} · {stage.duration}
                </p>
                <p className="mt-2 text-h3 text-paper">{stage.title}</p>
                <p className="mt-3 text-small text-mute">{stage.body}</p>
                <ul className="mt-4 grid gap-1.5">
                  {stage.output.slice(0, 2).map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[0.625rem] uppercase tracking-wider text-mute-deep"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
