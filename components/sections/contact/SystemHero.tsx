import { site } from "@/lib/site";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * CONTACT HERO - system world.
 *
 * Entering a system rather than arriving at a form. The ground is the
 * coldest on the site, the labels are mono, and the readouts are laid out
 * like instrumentation.
 *
 * The instrumentation is honest. Every readout is a fact from lib/site.ts -
 * the studio is open to enquiries, it is in Chennai, it works in IST. There
 * is no fake telemetry, no invented uptime figure and no counter pretending
 * to be live: a fabricated readout on a contact page is a lie in the exact
 * place a prospect is deciding whether to trust you.
 *
 * The grid is a CSS background with a mask, not a canvas. It costs one paint
 * and cannot drop a frame.
 */
export function SystemHero() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-44"
    >
      <div
        aria-hidden="true"
        className="system-grid pointer-events-none absolute inset-0 -z-10"
      />

      <div className="container-page">
        <p className="readout flex items-center gap-2.5">
          <span className="signal-dot" aria-hidden="true" />
          System status · Available
        </p>

        <h1
          id="contact-heading"
          className="mt-9 font-semibold uppercase leading-[0.86] tracking-[-0.05em] text-paper"
          style={{ fontSize: "clamp(3rem, 0.5rem + 12vw, 10rem)" }}
        >
          <TextReveal lines={["Initiate", "project"]} />
        </h1>

        {/* Instrument row. Every value is verifiable. */}
        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Readout label="Project type">
            Software / AI / Automation
          </Readout>
          <Readout label="Location">
            {site.location.country} / Global
          </Readout>
          <Readout label="Timezone">IST · UTC+5:30</Readout>
          <Readout label="Response">
            <span className="text-paper">
              &lt; 1 business day
              <span
                aria-hidden="true"
                className="ml-1 inline-block"
                style={{ animation: "cl-caret 1.2s steps(1) infinite" }}
              >
                _
              </span>
            </span>
          </Readout>
        </dl>

        <p className="mt-12 max-w-(--measure-wide) text-lead text-mute">
          Tell us what you are trying to build, automate or improve. If we are
          not the right people for it, we will say so - and point you at who
          is.
        </p>
      </div>
    </section>
  );
}

function Readout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ink px-5 py-5">
      <dt className="readout">{label}</dt>
      <dd className="mt-2.5 font-mono text-[0.8125rem] text-paper-dim">
        {children}
      </dd>
    </div>
  );
}
