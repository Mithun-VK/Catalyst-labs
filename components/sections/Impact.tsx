import { impacts } from "@/content/impact";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Business impact as a ledger of state changes rather than invented
 * percentages. Each row states what the situation is today and what it
 * becomes - claims about mechanism, which are true by construction, instead
 * of statistics we have no right to publish.
 *
 * LAYOUT: deliberately asymmetric. Five items in three equal columns forces a
 * dead sixth cell and produces the most recognisable AI-template shape there
 * is. Instead the items run 7/5, 5/7, 12 across a twelve-column grid, so the
 * eye zig-zags down the section and the last item earns a full-width band.
 * The lead item also gets more air and a larger heading, because a grid where
 * everything is equally important reads as a grid where nothing is.
 */

/** [column span, is the lead item] per index, from the large breakpoint up. */
const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-12",
] as const;

export function Impact() {
  return (
    <Section id="impact" labelledBy="impact-heading">
      <SectionHeading
        id="impact-heading"
        eyebrow="Business impact"
        title={
          <>
            What actually{" "}
            <span className="accent-word text-ember">changes</span> once it ships.
          </>
        }
        lead="No invented percentages. These are the state changes software produces when it is built around the real process."
      />

      <div className="container-page mt-14">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-12">
          {impacts.map((item, i) => {
            const isLead = i === 0;
            const isBand = i === impacts.length - 1;

            return (
              <li
                key={item.id}
                className={`bg-ink ${SPANS[i] ?? "lg:col-span-6"} ${
                  isBand ? "sm:col-span-2" : ""
                }`}
              >
                <Reveal delay={i * 60} className="h-full">
                  <div
                    className={`group/cell flex h-full flex-col justify-between gap-8 p-7 transition-colors duration-(--duration-slow) hover:bg-ink-raised lg:p-9 ${
                      isBand ? "lg:flex-row lg:items-end lg:gap-16" : ""
                    }`}
                  >
                    <div className={isBand ? "lg:max-w-xl" : ""}>
                      <h3
                        className={`text-paper ${isLead ? "text-h2" : "text-h3"}`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`mt-3.5 text-mute ${
                          isLead ? "max-w-md text-lead" : "text-small"
                        }`}
                      >
                        {item.body}
                      </p>
                    </div>

                    {/* The state change, drawn. */}
                    <div
                      className={`flex items-center gap-3 border-t border-line pt-5 ${
                        isBand ? "lg:shrink-0 lg:border-t-0 lg:pt-0" : ""
                      }`}
                    >
                      <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-mute-deep line-through decoration-mute-deep/60">
                        {item.before}
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 8"
                        className="h-2 w-4 shrink-0 text-ember transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover/cell:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <path d="M0 4h14M11 1l3 3-3 3" />
                      </svg>
                      <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-paper">
                        {item.after}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
