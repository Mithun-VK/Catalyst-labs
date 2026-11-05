"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { techGroups } from "@/content/tech";
import { services } from "@/content/services";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";
import { cn } from "@/lib/cn";

/**
 * STACK - the five layers as tabs inside one glass panel. Hovering or focusing
 * a technology shows which practices actually list it, derived from each
 * service's own `stack` field rather than a hand-kept mapping.
 */
function usedIn(tech: string) {
  const t = tech.toLowerCase();
  return services.filter((s) => s.stack.some((x) => x.toLowerCase() === t)).map((s) => s.title);
}

export function StackExplorer() {
  const [tab, setTab] = useState(techGroups[0].id);
  const [tech, setTech] = useState<string | null>(null);
  const group = techGroups.find((g) => g.id === tab) ?? techGroups[0];
  const practices = tech ? usedIn(tech) : [];

  return (
    <section id="stack" aria-labelledby="stack-heading" className={SVC_SECTION}>
      <div className="container-page">
        <SvcHeading
          id="stack-heading"
          index="04"
          eyebrow="Stack"
          title="The stack, layer by layer."
          aside="Chosen per problem. Hover or focus a technology to see which practices use it."
        />

        <div className="glass mt-8 p-5 sm:p-7">
          <div role="tablist" aria-label="Stack layers" className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {techGroups.map((g) => {
              const on = g.id === tab;
              return (
                <button
                  key={g.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="stack-panel"
                  onClick={() => {
                    setTab(g.id);
                    setTech(null);
                  }}
                  className={cn(
                    "relative min-h-10 shrink-0 cursor-pointer rounded-full px-4 text-small transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]",
                    on ? "text-paper" : "text-mute hover:text-paper"
                  )}
                >
                  {on ? (
                    <motion.span
                      layoutId="stack-pill"
                      className="glass-lens !rounded-full"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{g.layer}</span>
                </button>
              );
            })}
          </div>

          <div id="stack-panel" role="tabpanel" className="mt-5 grid gap-5 lg:grid-cols-12">
            <p className="text-body text-mute lg:col-span-4">{group.note}</p>
            <div className="lg:col-span-8">
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onMouseEnter={() => setTech(item)}
                      onFocus={() => setTech(item)}
                      onClick={() => setTech(item)}
                      className={cn(
                        "min-h-10 cursor-pointer rounded-full border px-3.5 font-mono text-[0.6875rem] uppercase tracking-wider transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]",
                        tech === item
                          ? "border-[var(--color-ember)] bg-white/90 text-paper"
                          : "border-white/70 bg-white/50 text-mute hover:text-paper"
                      )}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 min-h-[1.5rem] text-small text-mute" aria-live="polite">
                {tech ? (
                  practices.length ? (
                    <>
                      <span className="text-paper">{tech}</span> is used in {practices.join(", ")}.
                    </>
                  ) : (
                    <>
                      <span className="text-paper">{tech}</span> is used across projects as needed.
                    </>
                  )
                ) : (
                  "Select a technology to see where it is used."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
