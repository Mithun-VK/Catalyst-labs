"use client";

import { useRef, useState } from "react";
import { services, type Service } from "@/content/services";
import { CompactHeading, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

/**
 * CAPABILITY INDEX - signature interaction.
 *
 * Not a grid of cards. An editorial index on the left, a live specimen panel
 * on the right. Pointing at a row selects it; so does focusing it; so do the
 * arrow keys. The panel always answers the same three questions in the same
 * order - problem, solution, outcome - so services can be compared rather
 * than just read.
 *
 * Below the large breakpoint the same data renders as a disclosure list,
 * because a hover-driven split view has no meaning on a touch screen.
 */
export function Services({ showHeading = true }: { showHeading?: boolean }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const listRef = useRef<HTMLUListElement>(null);

  const select = (index: number, method: "pointer" | "key" | "click") => {
    if (index === active) return;
    setActive(index);
    if (method !== "pointer") {
      track("service_opened", { service: services[index].id, method });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : services.length - 1;
      select(next, "key");
      focusRow(next);
      return;
    }
    const dir = keys[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + services.length) % services.length;
    select(next, "key");
    focusRow(next);
  };

  const focusRow = (index: number) => {
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>("[data-row]")
      [index]?.focus();
  };

  const current = services[active];

  return (
    <Section
      id="services"
      labelledBy={showHeading ? "services-heading" : undefined}
      divider={showHeading}
    >
      {showHeading ? (
        <SectionHeading
          id="services-heading"
          index="02"
          eyebrow="Services"
          title={
            <>
              Six ways we take{" "}
              <span className="accent-word text-ember">work</span> off your team.
            </>
          }
          lead="Each capability answers the same three questions before a line of code is written: what is broken, what gets built, and what changes once it exists."
        />
      ) : (
        <CompactHeading
          id="services-heading"
          eyebrow="Capability index"
          title="Select a service to read its specification."
          note="Six capabilities"
        />
      )}

      {/* ---------------- desktop: index + specimen ---------------- */}
      <div
        className={`container-page hidden lg:block ${showHeading ? "mt-16" : "mt-8"}`}
      >
        <div className="grid grid-cols-12 gap-x-(--space-gutter)">
          <Reveal className="col-span-5">
            <ul
              ref={listRef}
              onKeyDown={onKeyDown}
              className={showHeading ? "border-t border-line" : undefined}
              // Roving tabindex: the list is one tab stop, arrows move within.
              role="tablist"
              aria-label="Services"
              aria-orientation="vertical"
            >
              {services.map((service, i) => {
                const isActive = i === active;
                return (
                  <li key={service.id} className="border-b border-line">
                    <button
                      data-row
                      type="button"
                      role="tab"
                      id={`service-tab-${service.id}`}
                      aria-selected={isActive}
                      aria-controls="service-panel"
                      tabIndex={isActive ? 0 : -1}
                      onPointerEnter={() => select(i, "pointer")}
                      onFocus={() => select(i, "key")}
                      onClick={() => select(i, "click")}
                      className="group relative flex w-full cursor-pointer items-baseline gap-5 py-6 text-left"
                    >
                      {/* Selection rail. */}
                      <span
                        aria-hidden="true"
                        className={`absolute -left-(--space-gutter) top-0 h-full w-px origin-top bg-ember transition-transform duration-(--duration-base) ease-(--ease-out-quart) ${
                          isActive ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <span
                        className={`label transition-colors duration-(--duration-base) ${
                          isActive ? "text-ember" : "text-mute-deep"
                        }`}
                      >
                        {service.index}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block text-h3 transition-colors duration-(--duration-base) ${
                            isActive ? "text-paper" : "text-mute"
                          }`}
                        >
                          {service.title}
                        </span>
                        <span
                          className={`mt-1.5 block text-small transition-colors duration-(--duration-base) ${
                            isActive ? "text-mute" : "text-mute-deep"
                          }`}
                        >
                          {service.summary}
                        </span>
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`h-3.5 w-3.5 self-center transition-all duration-(--duration-base) ease-(--ease-out-quart) ${
                          isActive
                            ? "translate-x-0 text-ember opacity-100"
                            : "-translate-x-2 text-mute-deep opacity-0"
                        }`}
                      >
                        <path d="M2 8h11M9 4l4 4-4 4" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={90} className="col-span-7">
            <ServicePanel service={current} />
          </Reveal>
        </div>
      </div>

      {/* ---------------- mobile: disclosure list ---------------- */}
      <div
        className={`container-page lg:hidden ${showHeading ? "mt-12" : "mt-8"}`}
      >
        <ul className={showHeading ? "border-t border-line" : undefined}>
          {services.map((service, i) => {
            const isOpen = openMobile === i;
            return (
              <li key={service.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`service-disclosure-${service.id}`}
                    onClick={() => {
                      setOpenMobile(isOpen ? null : i);
                      if (!isOpen) {
                        track("service_opened", {
                          service: service.id,
                          method: "disclosure",
                        });
                      }
                    }}
                    className="flex w-full cursor-pointer items-center gap-4 py-5 text-left"
                  >
                    <span
                      className={`label ${isOpen ? "text-ember" : "text-mute-deep"}`}
                    >
                      {service.index}
                    </span>
                    <span className="flex-1 text-h3 text-paper">{service.title}</span>
                    <span
                      aria-hidden="true"
                      className={`relative h-4 w-4 shrink-0 transition-transform duration-(--duration-base) ease-(--ease-out-quart) ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-mute" />
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-mute" />
                    </span>
                  </button>
                </h3>

                <div
                  id={`service-disclosure-${service.id}`}
                  hidden={!isOpen}
                  className="pb-7"
                >
                  <ServiceBody service={service} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

function ServicePanel({ service }: { service: Service }) {
  return (
    <div
      id="service-panel"
      role="tabpanel"
      aria-labelledby={`service-tab-${service.id}`}
      tabIndex={-1}
      className="spotlight relative h-full border border-line bg-ink-raised p-8 xl:p-10"
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      {/* Corner ticks - a drawing-sheet detail, not a rounded card. */}
      <Corner className="left-[-1px] top-[-1px]" />
      <Corner className="right-[-1px] top-[-1px] rotate-90" />
      <Corner className="bottom-[-1px] right-[-1px] rotate-180" />
      <Corner className="bottom-[-1px] left-[-1px] -rotate-90" />

      <div
        // Re-keying on the service id replays the entrance on every change.
        key={service.id}
        style={{ animation: "cl-fade-up 400ms var(--ease-out-quart) both" }}
      >
        <p className="label flex items-center gap-3 text-mute-deep">
          <span className="text-ember">{service.index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          Service specification
        </p>
        <h3 className="mt-5 text-h2 text-paper">{service.title}</h3>
        <div className="mt-8">
          <ServiceBody service={service} />
        </div>
      </div>
    </div>
  );
}

/** Problem → Solution → Outcome, shared by both layouts. */
function ServiceBody({ service }: { service: Service }) {
  const rows = [
    { label: "Problem", value: service.problem },
    { label: "Solution", value: service.solution },
    { label: "Outcome", value: service.outcome, accent: true },
  ];

  return (
    <div>
      <dl className="grid gap-6">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:gap-5">
            <dt
              className={`label pt-1 ${row.accent ? "text-ember" : "text-mute-deep"}`}
            >
              {row.label}
            </dt>
            <dd
              className={`text-body ${
                row.accent ? "text-paper" : "text-mute"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 border-t border-line pt-6">
        <p className="label text-mute-deep">Included</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {service.deliverables.map((item) => (
            <li
              key={item}
              className="border border-line px-3 py-1.5 text-[0.8125rem] text-paper-dim transition-colors duration-(--duration-fast) hover:border-line-ember hover:text-paper"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-2.5 w-2.5 border-l border-t border-ember/50 ${className}`}
    />
  );
}
