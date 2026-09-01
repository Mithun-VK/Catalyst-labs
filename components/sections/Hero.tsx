import { ButtonLink } from "@/components/ui/Button";
import { AnimatedLines } from "@/components/ui/AnimatedText";
import { ReactionField } from "@/components/visuals/ReactionField";
import { SystemCore } from "@/components/visuals/SystemCore";
import { ChainStrip } from "@/components/visuals/ChainStrip";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/site";

/**
 * HERO - precision world.
 *
 * A split composition rather than a centred stack: statement on the left, the
 * system object on the right. The asymmetry is the point. A centred hero is
 * the default every agency template ships with; an off-balance split reads as
 * a document, which is what this page is trying to say about the company.
 *
 * The soft ember bloom that used to sit behind the headline is gone. A large
 * radial glow is the visual signature of the generic "AI startup" page this
 * site is trying not to be, and it was doing nothing the lattice does not do
 * more precisely.
 *
 * TWO VISUALS, ONE BEHIND THE OTHER, and deliberately different in kind: the
 * ReactionField is an ambient FIELD (a medium, reacting), the SystemCore is a
 * discrete OBJECT (a structure, holding). Stacking two of the same thing
 * would read as noise; a field behind an object reads as depth. The field is
 * masked away from the object's corner so the two never compete for the same
 * pixels.
 *
 * WHERE THE SPEC PANEL WENT. A four-row panel of studio facts used to occupy
 * this column, and three of its rows (registry number, city, and the studio's
 * open status) were already being stated again in TrustStrip immediately
 * below - the same facts, twice, a screen apart. Its genuinely unique content
 * now lives in exactly one place each: the response-time promise stayed here,
 * beside the CTA it qualifies, and the classification and discipline list
 * moved down into TrustStrip. Nothing was dropped.
 *
 * ENTRANCE. Still the site's zero-JS CSS entrance, not the anime.js timeline
 * used inside SystemCore. This subtree contains the LCP element: a
 * JS-gated entrance would both delay it and make the headline depend on
 * hydration to become visible at all. The 3D object can afford that
 * dependency because it is decorative; the headline cannot.
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
      {/* Weighted toward the statement side and falling off well before the
          object's column, so the field reads as atmosphere behind the text
          rather than as texture competing with the core's linework. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_62%_58%_at_30%_32%,#000_22%,transparent_74%)]"
      >
        <ReactionField className="h-full w-full" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12">
          {/* ---------- Statement ------------------------------------- */}
          <div className="lg:col-span-6">
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

            {/* Qualifies the CTA directly above it, which is the only place
                this promise does any work. */}
            <p
              className="label mt-6 flex items-center gap-2.5 text-mute-deep opacity-0"
              style={{
                animation: "cl-fade-up 800ms var(--ease-out-quart) both",
                animationDelay: "660ms",
              }}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-positive" />
              Replies within one business day
            </p>
          </div>

          {/* ---------- System object --------------------------------- */}
          {/* Decorative, and last in the DOM: nothing here is content, so it
              sits after the statement for both reading and tab order. */}
          <div
            className="opacity-0 lg:col-span-5 lg:col-start-8"
            style={{
              animation: "cl-fade-up 900ms var(--ease-out-quart) both",
              animationDelay: "300ms",
            }}
          >
            <SystemCore className="w-full" />
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

