"use client";

import { useEffect, useRef, useState } from "react";
import { processStages } from "@/content/process";
import { CompactHeading, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * How an engagement runs, as a scroll-driven instrument.
 *
 * A sticky spine on the left tracks which stage the reader is in and fills a
 * progress rail as they move down. No scroll-jacking: the page scrolls
 * normally and the panel only reflects position. On narrow screens the spine
 * is dropped entirely and the stages read as a plain numbered sequence.
 */
export function Process({ showHeading = true }: { showHeading?: boolean }) {
  const [active, setActive] = useState(0);
  const stageRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const els = stageRefs.current.filter(Boolean) as HTMLLIElement[];
    if (els.length === 0 || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the reading line.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const index = els.indexOf(visible.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const progress = (active + 1) / processStages.length;

  return (
    <Section
      id="process"
      labelledBy={showHeading ? "process-heading" : undefined}
      divider={showHeading}
    >
      {showHeading ? (
        <SectionHeading
          id="process-heading"
          index="04"
          eyebrow="Process"
          title={
            <>
              Five stages. No{" "}
              <span className="accent-word text-ember">reveal</span> at the end.
            </>
          }
          lead="You see working software from the first build cycle, on a staging URL, every week. Nothing is held back for a presentation."
        />
      ) : (
        <CompactHeading
          id="process-heading"
          eyebrow="The five stages"
          title="What happens, in what order, and what you get at each step."
          note={`${processStages.length} stages`}
        />
      )}

      <div className={`container-page ${showHeading ? "mt-16" : "mt-10"}`}>
        <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          {/* Sticky spine - desktop only. */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <p className="label text-mute-deep">Stage</p>

              <p
                className="mt-4 font-display text-[5.5rem] leading-none tracking-[-0.05em] text-paper"
                aria-live="polite"
              >
                {processStages[active].index}
              </p>
              <p className="mt-2 text-h3 text-ember">
                {processStages[active].title}
              </p>

              <div className="mt-8 flex gap-4">
                {/* Progress rail. */}
                <div className="relative h-48 w-px bg-line-strong">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 origin-top bg-ember transition-transform duration-(--duration-slow) ease-(--ease-out-quart)"
                    style={{ height: "100%", transform: `scaleY(${progress})` }}
                  />
                </div>

                <ol className="flex h-48 flex-col justify-between">
                  {processStages.map((stage, i) => (
                    <li
                      key={stage.index}
                      className={`text-small transition-colors duration-(--duration-base) ${
                        i <= active ? "text-paper-dim" : "text-mute-deep"
                      }`}
                    >
                      {stage.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-8">
            {processStages.map((stage, i) => (
              <li
                key={stage.index}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:py-12"
              >
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <span
                      className={`label transition-colors duration-(--duration-base) ${
                        i === active ? "text-ember" : "text-mute-deep"
                      }`}
                    >
                      {stage.index}
                    </span>
                    <h3 className="text-h2 text-paper">{stage.title}</h3>
                    <span className="label ml-auto text-mute-deep">
                      {stage.duration}
                    </span>
                  </div>

                  <p className="mt-5 max-w-2xl text-lead text-mute">{stage.body}</p>

                  <div className="mt-7">
                    <p className="label text-mute-deep">You receive</p>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {stage.output.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-small text-paper-dim"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 shrink-0 bg-ember/70"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
