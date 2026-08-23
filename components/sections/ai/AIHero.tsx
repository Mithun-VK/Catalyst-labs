import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { AIIntelligenceCore } from "@/components/sections/ai/AIIntelligenceCore";

/**
 * AI HERO - system world, AI-agent command-centre register.
 *
 * The artifact (AIIntelligenceCore) is the focal point, not a decorative
 * background: it sits at equal visual weight to the statement, and its own
 * copy makes the visual story explicit (CRM/API/Docs flowing in, Action
 * flowing out) rather than leaving a stranger to guess what the shape means.
 *
 * ENTRANCE. Status line, heading, description and actions rise in with a
 * slight blur-to-sharp resolve (cl-fade-up-blur) and a staggered delay - a
 * SERVER-rendered, CSS-only sequence, the same `animationDelay` idiom every
 * other hero on the site uses. Only the artifact itself is a client
 * component; everything that is just text stays server-rendered, which
 * keeps this hero's headline and copy fully present in the initial HTML
 * regardless of whether the client bundle has finished loading.
 *
 * TRUST IS THE POINT. Anyone can render a glowing AI hero; the hard part is
 * being believed. The trust bar underneath states mechanisms that can be
 * checked in a technical call - grounded retrieval, an evaluation gate,
 * schema validation, human escalation - not adjectives and not invented
 * accuracy figures.
 */
export function AIHero() {
  return (
    <section
      aria-labelledby="ai-heading"
      className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40"
    >
      <div
        aria-hidden="true"
        className="system-grid pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="starfield pointer-events-none -z-10 opacity-60"
      />

      <div className="container-page">
        <div className="grid items-center gap-x-(--space-gutter) gap-y-20 lg:grid-cols-12">
          {/* ---------- statement ------------------------------------- */}
          <div className="lg:col-span-6">
            <p
              className="readout flex flex-wrap items-center gap-x-3 gap-y-2 opacity-0"
              style={{ animation: "cl-fade-up 700ms var(--ease-out-quart) both" }}
            >
              <span className="signal-dot" aria-hidden="true" />
              <span className="text-signal">System online</span>
              <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
              <span>AI agents for business</span>
            </p>

            <h1
              id="ai-heading"
              className="mt-8 font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-paper opacity-0"
              style={{
                fontSize: "clamp(2.25rem, 1rem + 4.4vw, 4.75rem)",
                animation: "cl-fade-up-blur 900ms var(--ease-out-quart) both",
                animationDelay: "90ms",
              }}
            >
              Intelligence that doesn&rsquo;t just{" "}
              <span className="accent-word text-signal">respond</span>
              {" "}&mdash; it executes.
            </h1>

            <p
              className="mt-9 max-w-(--measure-wide) text-lead text-mute opacity-0"
              style={{
                animation: "cl-fade-up 800ms var(--ease-out-quart) both",
                animationDelay: "260ms",
              }}
            >
              Build autonomous AI systems that reason over your data,
              orchestrate the workflow, and execute the action - not a chat
              window bolted onto the side of the company.
            </p>

            <div
              className="mt-10 flex flex-col gap-4 opacity-0 sm:flex-row sm:items-center"
              style={{
                animation: "cl-fade-up 800ms var(--ease-out-quart) both",
                animationDelay: "380ms",
              }}
            >
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  arrow
                  event="cta_click"
                  eventProps={{ location: "ai_hero", label: "build_ai_system" }}
                  className="w-full sm:w-auto"
                >
                  Build an AI System
                </ButtonLink>
              </Magnetic>
              <ButtonLink
                href="/services/ai-automation"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                event="nav_click"
                eventProps={{ label: "explore_ai_agents", location: "ai_hero" }}
              >
                Explore AI Agents
              </ButtonLink>
            </div>
          </div>

          {/* ---------- intelligence core -------------------------------- */}
          <div
            className="lg:col-span-6 opacity-0"
            style={{
              animation: "cl-fade-up 1000ms var(--ease-out-quart) both",
              animationDelay: "180ms",
            }}
          >
            <AIIntelligenceCore />
          </div>
        </div>

        {/* ---------- trust bar ---------------------------------------- */}
        <dl className="mt-24 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              k: "Grounding",
              v: "Answers retrieved from your own documents, with the source cited",
            },
            {
              k: "Evaluation",
              v: "A test set per task; a release has to beat the one before it",
            },
            {
              k: "Guardrails",
              v: "Outputs validated against a schema - it refuses rather than guesses",
            },
            {
              k: "Escalation",
              v: "Low confidence routes to a person, and every handoff is logged",
            },
          ].map((item) => (
            <div key={item.k} className="bg-ink px-5 py-6">
              <dt className="readout text-signal">{item.k}</dt>
              <dd className="mt-3 text-small text-paper-dim">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
