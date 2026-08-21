import { ButtonLink } from "@/components/ui/Button";
import { AnimatedLines } from "@/components/ui/AnimatedText";
import { ReactionField } from "@/components/visuals/ReactionField";
import { ChainStrip } from "@/components/visuals/ChainStrip";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-32 pb-(--space-section) sm:pt-40"
    >
      {/* Signature background: a reactive lattice. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_92%_75%_at_50%_28%,#000_35%,transparent_80%)]"
      >
        <ReactionField className="h-full w-full" />
      </div>

      {/* A single soft ember bloom anchoring the headline.
          The gradient is its own blur - a 110px `filter: blur()` over an
          element this large was costing more rasterisation time than the
          entire rest of the page, for a result the eye cannot distinguish
          from softer colour stops. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[36rem] w-[52rem] -translate-x-1/2 rounded-full opacity-[0.16]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-ember) 0%, rgb(255 91 40 / 0.55) 34%, rgb(255 91 40 / 0.16) 62%, transparent 100%)",
        }}
      />

      <div className="container-page">
        {/* Status line - every claim here is verifiable. */}
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
          {/* Dividers only appear where the row actually stays on one line -
              otherwise they dangle at the end of a wrapped line. */}
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-line-strong sm:block"
          />
          <span>
            {site.location.city}, {site.location.country}
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-line-strong sm:block" />
          <span className="hidden sm:inline">
            Udyam {site.registration.number.replace("UDYAM-", "")}
          </span>
        </div>

        <h1
          id="hero-heading"
          className="mt-8 max-w-[19ch] text-display text-paper sm:mt-10"
        >
          <AnimatedLines
            lines={[
              <>We build the</>,
              <>
                software that <span className="accent-word text-ember">moves</span>
              </>,
              <>businesses forward.</>,
            ]}
          />
        </h1>

        <div className="mt-9 grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          <p
            className="max-w-2xl text-lead text-mute opacity-0 lg:col-span-7"
            style={{
              animation: "cl-fade-up 800ms var(--ease-out-quart) both",
              animationDelay: "420ms",
            }}
          >
            {site.name} is a software and AI engineering studio. We turn
            operational problems into custom software, AI systems and automation
            -{" "}
            <span className="text-paper">
              engineered around the way your business actually works
            </span>
            , not around a template.
          </p>

          <div
            className="flex flex-col gap-4 opacity-0 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end"
            style={{
              animation: "cl-fade-up 800ms var(--ease-out-quart) both",
              animationDelay: "540ms",
            }}
          >
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

        <div
          className="mt-16 opacity-0 sm:mt-20"
          style={{
            animation: "cl-fade-up 900ms var(--ease-out-quart) both",
            animationDelay: "660ms",
          }}
        >
          <ChainStrip />
        </div>
      </div>
    </section>
  );
}
