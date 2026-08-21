"use client";

import { useEffect, useRef, useState } from "react";
import { scenarios } from "@/content/ai-scenarios";
import { CompactHeading, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { track } from "@/lib/analytics";

/**
 * SIGNAL PATH - signature interaction.
 *
 * The same four-stage pipeline every time - customer, AI layer, business
 * system, action - replayed under a different real scenario. A charge walks
 * the rail and lights each stage in turn, which is the entire argument of
 * this section: a model on its own does nothing, a model wired into a system
 * that can act does the work.
 *
 * The walk only runs while the diagram is on screen; under reduced motion the
 * whole pipeline renders resolved, with no charge.
 */

const STAGE_MS = 1700;

export function AISection({ showHeading = true }: { showHeading?: boolean }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>("-10% 0px");
  const reduced = usePrefersReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = scenarios[scenarioIndex];

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (!inView || reduced) return;

    setStage(0);
    timer.current = setInterval(() => {
      // Hold briefly on the resolved pipeline before replaying.
      setStage((s) => (s >= scenario.stages.length ? 0 : s + 1));
    }, STAGE_MS);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [inView, reduced, scenarioIndex, scenario.stages.length]);

  const selectScenario = (i: number) => {
    setScenarioIndex(i);
    setStage(0);
    track("ai_scenario_viewed", { scenario: scenarios[i].id });
  };

  // Reduced motion resolves everything at once.
  const reachedStage = (i: number) => reduced || stage >= i + 1;

  return (
    <Section
      id="ai"
      labelledBy={showHeading ? "ai-heading" : undefined}
      divider={showHeading}
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      {showHeading ? (
        <SectionHeading
          id="ai-heading"
          index="05"
          eyebrow="Artificial intelligence"
          title={
            <>
              Don&rsquo;t just add AI. Build it into the way your business{" "}
              <span className="accent-word text-ember">works</span>.
            </>
          }
          lead="A model that can only talk is a demo. A model wired into your systems - able to read your data, decide, and write back - is an employee that never sleeps. Pick a scenario and watch the path."
        />
      ) : (
        <CompactHeading
          id="ai-heading"
          eyebrow="Signal path"
          title="Pick a scenario and follow the charge along the pipeline."
          note={`${scenarios.length} scenarios`}
        />
      )}

      <div
        ref={ref}
        className={`container-page ${showHeading ? "mt-14" : "mt-8"}`}
      >
        {/* Scenario selector */}
        <Reveal>
          <div
            role="tablist"
            aria-label="AI scenarios"
            className="flex flex-wrap gap-2"
          >
            {scenarios.map((s, i) => {
              const isActive = i === scenarioIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="signal-path"
                  onClick={() => selectScenario(i)}
                  className={`inline-flex h-10 cursor-pointer items-center gap-2.5 border px-4 text-small transition-colors duration-(--duration-base) ${
                    isActive
                      ? "border-line-ember bg-ember/10 text-paper"
                      : "border-line text-mute hover:border-line-strong hover:text-paper"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 transition-colors duration-(--duration-base) ${
                      isActive ? "bg-ember" : "bg-mute-deep"
                    }`}
                  />
                  {s.tab}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Diagram */}
        <Reveal delay={80}>
          <div
            id="signal-path"
            role="tabpanel"
            aria-label={scenario.title}
            className="spotlight mt-6 border border-line bg-ink-raised/70 p-6 backdrop-blur-sm sm:p-8"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            <div key={scenario.id} style={{ animation: "cl-fade-up 400ms var(--ease-out-quart) both" }}>
              <div className="flex flex-col gap-2 border-b border-line pb-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <h3 className="text-h3 text-paper">{scenario.title}</h3>
                <p className="max-w-md text-small text-mute">{scenario.summary}</p>
              </div>

              <ol className="mt-8 grid gap-4 lg:grid-cols-4 lg:gap-0">
                {scenario.stages.map((node, i) => {
                  const on = reachedStage(i);
                  const isLast = i === scenario.stages.length - 1;
                  return (
                    <li key={node.key} className="relative lg:pr-6">
                      {/* Rail to the next node: vertical on mobile, horizontal
                          from the large breakpoint. Separate elements so each
                          scales on its own axis. */}
                      {!isLast ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-full h-4 w-0.5 bg-line-strong lg:hidden"
                          >
                            <span
                              className="absolute inset-0 origin-top bg-ember transition-transform duration-[600ms] ease-(--ease-out-quart)"
                              style={{
                                transform: `scaleY(${reachedStage(i + 1) ? 1 : 0})`,
                              }}
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="absolute right-0 top-0 hidden h-0.5 w-6 bg-line-strong lg:block"
                          >
                            <span
                              className="absolute inset-0 origin-left bg-ember transition-transform duration-[600ms] ease-(--ease-out-quart)"
                              style={{
                                transform: `scaleX(${reachedStage(i + 1) ? 1 : 0})`,
                              }}
                            />
                          </span>
                        </>
                      ) : null}

                      <div
                        className={`flex h-full flex-col gap-3 border-l-2 py-1 pl-5 transition-colors duration-(--duration-slow) lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-4 ${
                          on ? "border-ember" : "border-line-strong"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 transition-colors duration-(--duration-slow) ${
                              on ? "bg-ember" : "bg-mute-deep"
                            }`}
                          />
                          <span
                            className={`label transition-colors duration-(--duration-slow) ${
                              on ? "text-paper" : "text-mute-deep"
                            }`}
                          >
                            {node.label}
                          </span>
                        </div>

                        <p
                          className={`font-mono text-[0.75rem] leading-relaxed transition-colors duration-(--duration-slow) ${
                            on ? "text-paper-dim" : "text-mute-deep"
                          }`}
                        >
                          {node.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p
                className={`mt-8 flex items-start gap-3 border-t border-line pt-6 text-body transition-colors duration-(--duration-slow) ${
                  reachedStage(3) ? "text-paper" : "text-mute-deep"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-2.5 h-px w-6 shrink-0 transition-colors duration-(--duration-slow) ${
                    reachedStage(3) ? "bg-ember" : "bg-line-strong"
                  }`}
                />
                {scenario.removes}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Applications + CTA */}
        <div className="mt-12 grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label text-mute-deep">Where this usually lands first</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                "AI customer support",
                "Lead qualification",
                "AI sales assistants",
                "Document processing",
                "Internal knowledge search",
                "Automated reporting",
                "Workflow automation",
                "AI-powered internal tools",
              ].map((item) => (
                <li
                  key={item}
                  className="border border-line px-3.5 py-2 text-small text-paper-dim transition-colors duration-(--duration-fast) hover:border-line-ember hover:text-paper"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-5 lg:justify-self-end">
            <div className="border border-line p-6">
              <p className="text-body text-mute">
                Not sure whether AI is the right tool for your problem? We&rsquo;ll
                tell you when it isn&rsquo;t - a query, a form or a scheduled job is
                often cheaper and more reliable.
              </p>
              <ButtonLink
                href="/contact"
                variant="secondary"
                arrow
                className="mt-6 w-full sm:w-auto"
                event="cta_click"
                eventProps={{ location: "ai_section", label: "discuss_ai" }}
              >
                Discuss your use case
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
