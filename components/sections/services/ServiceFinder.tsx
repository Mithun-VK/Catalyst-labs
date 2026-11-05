"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * "What do you need?" - turns the hero's empty right side into a decision
 * tool. A visitor picks the situation they are in, in their own words, and
 * the panel names the practice to start with plus what it hands over. "See
 * this practice" opens that practice in the explorer below (via a window
 * event, so the two components stay decoupled).
 */
const NEEDS = [
  { id: "automate", label: "Automate repetitive work", services: ["ai-automation", "data-integrations"] },
  { id: "product", label: "Launch a product or MVP", services: ["saas-mvp", "custom-software"] },
  { id: "website", label: "Build or fix a website", services: ["web"] },
  { id: "app", label: "Build a mobile app", services: ["mobile"] },
  { id: "connect", label: "Connect my systems", services: ["data-integrations", "custom-software"] },
] as const;

export const SELECT_PRACTICE = "svc:select";

export function ServiceFinder() {
  const [needId, setNeedId] = useState<string>(NEEDS[0].id);
  const need = NEEDS.find((n) => n.id === needId) ?? NEEDS[0];
  const primary = services.find((s) => s.id === need.services[0]);
  const also = need.services
    .slice(1)
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);

  if (!primary) return null;

  return (
    <div className="glass p-5 sm:p-7">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-mute-deep">
        What do you need?
      </p>

      <div role="radiogroup" aria-label="What do you need?" className="mt-4 flex flex-wrap gap-2">
        {NEEDS.map((n) => {
          const on = n.id === needId;
          return (
            <button
              key={n.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setNeedId(n.id);
                track("cta_chip_select", { location: "services_finder", option: n.id });
              }}
              className={cn(
                "min-h-10 cursor-pointer rounded-full border px-3.5 text-small transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]",
                on
                  ? "border-[var(--color-ember)] bg-white/90 text-paper shadow-[0_8px_20px_-12px_rgb(9_50_51/0.5)]"
                  : "border-white/70 bg-white/45 text-mute hover:bg-white/70 hover:text-paper"
              )}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={need.id}
            className="glass-inset p-4 sm:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ember">
              Start with
            </p>
            <p className="mt-1.5 text-h3 text-paper">{primary.title}</p>
            <p className="mt-1 text-small text-mute">{primary.tagline}</p>

            <ul className="mt-3 grid gap-1.5">
              {primary.deliverables.slice(0, 3).map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-small text-paper-dim">
                  <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {d}
                </li>
              ))}
            </ul>

            {also.length ? (
              <p className="mt-3 text-[0.8125rem] text-mute-deep">
                Often paired with {also.map((s) => s!.title).join(", ")}.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(SELECT_PRACTICE, { detail: primary.id }));
                  track("service_opened", { service: primary.id, location: "services_finder" });
                }}
                className="cursor-pointer text-small font-medium text-paper underline decoration-[var(--color-ember)] underline-offset-4 hover:text-ember"
              >
                See this practice
              </button>
              <Link
                href={`/contact?source=services-finder-${need.id}`}
                onClick={() => track("cta_click", { location: "services_finder", label: need.id })}
                className="text-small text-ember underline-offset-4 hover:underline"
              >
                Start this project →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
