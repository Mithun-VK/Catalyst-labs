"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { services, type Service } from "@/content/services";
import { ServiceMark, type ServiceMarkKind } from "@/components/services/ServiceMark";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";
import { SELECT_PRACTICE } from "@/components/sections/services/ServiceFinder";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * PRACTICE EXPLORER - the six practices as a bento grid that expands in place.
 *
 * Replaces both the hub-and-spoke system map and the tabbed practices pane,
 * which listed the same six practices twice. Every practice is visible at
 * once as a compact card; opening one grows it into an 8-column, two-row
 * card holding the full detail while the others reflow around it (Motion
 * layout animation, dense grid flow). One card is open at a time; opening a
 * different one closes the previous.
 *
 * Accessibility: each card header is a disclosure button (aria-expanded /
 * aria-controls). Native scroll only. Reduced motion turns the reflow into an
 * instant change (MotionConfig reducedMotion="user").
 */

const MARK: Record<string, ServiceMarkKind> = {
  "ai-automation": "ai-automation",
  "custom-software": "custom-software",
  web: "web",
  mobile: "mobile",
  "saas-mvp": "saas-mvp",
  "data-integrations": "data-integrations",
};
const markFor = (s: Service): ServiceMarkKind => MARK[s.id] ?? "custom-software";

const SPRING = { type: "spring", stiffness: 320, damping: 36 } as const;

export function PracticeExplorer() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);

  // The hero's service finder asks for a practice by id. Scrolling waits for
  // the reflow to settle: measuring mid-animation would read a transformed,
  // stale position and overshoot.
  const pendingScroll = useRef<string | null>(null);

  const scrollToCard = (id: string) => {
    if (pendingScroll.current !== id) return;
    pendingScroll.current = null;
    const el = document.getElementById(`practice-${id}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 150,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!services.some((s) => s.id === id)) return;
      pendingScroll.current = id;
      setOpenId(id);
      // Fallback for when no layout animation runs (already open, reduced motion).
      setTimeout(() => scrollToCard(id), 700);
    };
    window.addEventListener(SELECT_PRACTICE, onSelect);
    return () => window.removeEventListener(SELECT_PRACTICE, onSelect);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section id="practices" aria-labelledby="practices-heading" className={SVC_SECTION}>
        <div className="container-page">
          <SvcHeading
            id="practices-heading"
            index="01"
            eyebrow="Practices"
            title="Six practices, built as one system."
            aside="Most engagements draw on more than one. Open any practice to see what it covers, hands over and changes."
          />

          <LayoutGroup>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-12">
              {services.map((s) => {
                const open = s.id === openId;
                return (
                  <motion.li
                    layout
                    key={s.id}
                    id={`practice-${s.id}`}
                    transition={SPRING}
                    onLayoutAnimationComplete={() => scrollToCard(s.id)}
                    style={{ borderRadius: 24 }}
                    className={cn(
                      "glass overflow-hidden",
                      open ? "md:col-span-2 lg:col-span-8 lg:row-span-2" : "lg:col-span-4"
                    )}
                  >
                    <motion.button
                      layout="position"
                      type="button"
                      aria-expanded={open}
                      aria-controls={`practice-detail-${s.id}`}
                      onClick={() => {
                        setOpenId(open ? null : s.id);
                        if (!open) track("service_opened", { service: s.id, location: "services_explorer" });
                      }}
                      className="group flex w-full cursor-pointer items-start gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-ember)] sm:p-6"
                    >
                      <span className="luxury-mark-ring h-11 w-11 shrink-0 bg-white/55 text-ember">
                        <ServiceMark kind={markFor(s)} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                          {s.index} · {s.deliverables.length} deliverables
                        </span>
                        <span
                          className={cn(
                            "mt-1.5 block font-medium uppercase tracking-[-0.01em] text-paper",
                            open ? "text-[length:clamp(1.5rem,1rem+1.5vw,2.25rem)] leading-[1.05]" : "text-body"
                          )}
                        >
                          {s.title}
                        </span>
                        <span className="mt-1 block text-small text-mute">{s.summary}.</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/60 text-paper transition-transform duration-300",
                          open ? "rotate-45" : "group-hover:rotate-90"
                        )}
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M8 2v12M2 8h12" />
                        </svg>
                      </span>
                    </motion.button>

                    {/* Closed cards preview what they hand over, so a card
                        stretched beside the open one carries content, not air. */}
                    {!open ? (
                      <motion.ul
                        layout="position"
                        className="grid gap-1.5 px-5 pb-5 sm:px-6 sm:pb-6"
                        aria-label={`${s.title} deliverables preview`}
                      >
                        {s.deliverables.slice(0, 3).map((d) => (
                          <li key={d} className="flex items-start gap-2.5 text-[0.8125rem] text-mute">
                            <span aria-hidden="true" className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-ember" />
                            {d}
                          </li>
                        ))}
                        {s.deliverables.length > 3 ? (
                          <li className="pl-3.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute-deep">
                            +{s.deliverables.length - 3} more
                          </li>
                        ) : null}
                      </motion.ul>
                    ) : null}

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key="detail"
                          id={`practice-detail-${s.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.16, duration: 0.35 } }}
                          exit={{ opacity: 0, transition: { duration: 0.1 } }}
                          className="grid gap-5 border-t border-white/60 p-5 sm:p-6 lg:grid-cols-2"
                        >
                          <div>
                            <p className="text-body text-mute">{s.problem}</p>
                            <p className="mt-3 text-body text-paper-dim">{s.solution}</p>
                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                              <Link
                                href={`/services/${s.id}`}
                                className="glass-chip inline-flex min-h-10 items-center gap-2 px-4 text-small text-paper hover:text-ember"
                              >
                                Explore {s.title} <span aria-hidden="true">→</span>
                              </Link>
                              <Link
                                href={`/contact?source=services-${s.id}`}
                                className="text-small text-ember underline-offset-4 hover:underline"
                              >
                                Start this
                              </Link>
                            </div>
                          </div>

                          <div>
                            <div className="glass-inset p-4">
                              <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep">
                                Handed over
                              </p>
                              <ul className="mt-3 grid gap-1.5">
                                {s.deliverables.map((d) => (
                                  <li key={d} className="flex items-start gap-2.5 text-small text-paper-dim">
                                    <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built on">
                              {s.stack.slice(0, 6).map((t) => (
                                <li
                                  key={t}
                                  className="rounded-full border border-white/70 bg-white/55 px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-mute"
                                >
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="glass-dark p-4 sm:p-5 lg:col-span-2">
                            <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-ember">
                              What changes
                            </p>
                            <p className="mt-1.5 text-body text-paper">{s.outcome}</p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>
      </section>
    </MotionConfig>
  );
}
