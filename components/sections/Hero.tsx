import { ButtonLink } from "@/components/ui/Button";
import { AnimatedLines } from "@/components/ui/AnimatedText";
import { ReactionField } from "@/components/visuals/ReactionField";
import { ChainStrip } from "@/components/visuals/ChainStrip";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/site";

/**
 * HERO - precision world.
 *
 * A split composition rather than a centred stack: statement on the left, a
 * specification panel on the right. The asymmetry is the point. A centred
 * hero is the default every agency template ships with; a 7/4 split reads as
 * a document, which is what this page is trying to say about the company.
 *
 * The soft ember bloom that used to sit behind the headline is gone. A large
 * radial glow is the visual signature of the generic "AI startup" page this
 * site is trying not to be, and it was doing nothing the lattice does not do
 * more precisely.
 *
 * Every value in the right-hand panel is verifiable - registry number, city,
 * founding year. Nothing there is a claim about outcomes.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-32 pb-(--space-section) sm:pt-40"
    >
      {/* Signature background: a lattice that reacts to the pointer.
          Decorative, hidden from assistive tech, one static frame under
          reduced motion, and suspended entirely once scrolled past. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_78%_62%_at_38%_30%,#000_28%,transparent_78%)]"
      >
        <ReactionField className="h-full w-full" />
      </div>

      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12">
          {/* ---------- Statement ------------------------------------- */}
          <div className="lg:col-span-7">
            <div
              className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-mute opacity-0"
              style={{ animation: "cl-fade-up 700ms var(--ease-out-quart) both" }}
            >
              <span className="inline-flex items-center gap-2 text-paper">
                <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full bg-ember"
                    style={{ animation: "cl-pulse 2.4s ease-in-out infinite" }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-ember" />
                </span>
                Taking project enquiries
              </span>
              <span
                aria-hidden="true"
                className="hidden h-3 w-px bg-line-strong sm:block"
              />
              <span>Est. {site.founded}</span>
            </div>

            {/* The wordmark is large and present, but it is not the H1: the
                heading search engines and screen readers lead with should say
                what the company does, not repeat its name. */}
            <p
              className="mt-9 font-mono text-[0.8125rem] uppercase tracking-[0.34em] text-paper-dim opacity-0"
              style={{
                animation: "cl-fade-up 700ms var(--ease-out-quart) both",
                animationDelay: "120ms",
              }}
            >
              {site.name}
            </p>

            {/* Sized for the 7-column measure, not for a full-bleed hero.
                The global `text-display` step tops out at 8rem, which pushed
                "businesses forward." onto its own two lines here and drove
                the panel and CTAs below the fold. */}
            <h1
              id="hero-heading"
              className="mt-5 text-paper"
              style={{
                fontSize: "clamp(2.5rem, 1rem + 4.4vw, 5rem)",
                lineHeight: "0.98",
                letterSpacing: "-0.038em",
                fontWeight: 600,
              }}
            >
              <AnimatedLines
                lines={[
                  <>Software. AI.</>,
                  <>
                    Systems that{" "}
                    <span className="accent-word text-ember">move</span>
                  </>,
                  <>businesses forward.</>,
                ]}
              />
            </h1>

            <p
              className="mt-8 max-w-(--measure-wide) text-lead text-mute opacity-0"
              style={{
                animation: "cl-fade-up 800ms var(--ease-out-quart) both",
                animationDelay: "420ms",
              }}
            >
              {site.name} builds software products, AI systems, automation
              platforms and digital infrastructure -{" "}
              <span className="text-paper">
                engineered around the way your business actually works
              </span>
              , not around a template.
            </p>

            <div
              className="mt-10 flex flex-col gap-4 opacity-0 sm:flex-row sm:items-center"
              style={{
                animation: "cl-fade-up 800ms var(--ease-out-quart) both",
                animationDelay: "540ms",
              }}
            >
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  arrow
                  event="cta_click"
                  eventProps={{ location: "hero", label: "start_a_project" }}
                  className="w-full sm:w-auto"
                >
                  Start a Project
                </ButtonLink>
              </Magnetic>
              <ButtonLink
                href="/work"
                size="lg"
                variant="secondary"
                event="cta_click"
                eventProps={{ location: "hero", label: "explore_work" }}
                className="w-full sm:w-auto"
              >
                Explore Our Work
              </ButtonLink>
            </div>
          </div>

          {/* ---------- Specification panel --------------------------- */}
          <div
            className="opacity-0 lg:col-span-4 lg:col-start-9"
            style={{
              animation: "cl-fade-up 800ms var(--ease-out-quart) both",
              animationDelay: "660ms",
            }}
          >
            <div className="spotlight border border-line bg-ink-raised/70 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <p className="label text-mute-deep">Studio</p>
                <p className="label inline-flex items-center gap-2 text-paper">
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-positive" />
                  Open
                </p>
              </div>

              <dl className="grid">
                <PanelRow label="Location">
                  {site.location.city}, {site.location.country}
                </PanelRow>
                <PanelRow label="Registry">{site.registration.number}</PanelRow>
                <PanelRow label="Class">
                  {site.registration.classification}
                </PanelRow>
                <PanelRow label="Response">Within one business day</PanelRow>
              </dl>

              <div className="border-t border-line px-5 py-4">
                <p className="label text-mute-deep">Disciplines</p>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                  {[
                    "AI",
                    "Software",
                    "Automation",
                    "Data",
                    "Security",
                    "Products",
                  ].map((d) => (
                    <li
                      key={d}
                      className="font-mono text-[0.6875rem] uppercase tracking-wider text-paper-dim"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-20 opacity-0"
          style={{
            animation: "cl-fade-up 900ms var(--ease-out-quart) both",
            animationDelay: "780ms",
          }}
        >
          <ChainStrip />
        </div>
      </div>
    </section>
  );
}

function PanelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <dt className="label shrink-0 text-mute-deep">{label}</dt>
      <dd className="text-right font-mono text-[0.75rem] text-paper-dim">
        {children}
      </dd>
    </div>
  );
}
