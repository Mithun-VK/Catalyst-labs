import { buildGroups } from "@/content/build-matrix";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * What we build, as a systems matrix rather than a feature list. The four
 * columns are the four layers of a working business: what runs it, what the
 * customer touches, what thinks, and what removes the repetition. Grid lines
 * are real hairlines (gap-px over a line-coloured ground), so the section
 * reads as a schematic.
 */
export function BuildMatrix() {
  return (
    <Section id="build" labelledBy="build-heading">
      <SectionHeading
        id="build-heading"
        eyebrow="What we build"
        title={
          <>
            Four layers that make up a{" "}
            <span className="accent-word text-ember">working</span> business.
          </>
        }
        lead="Most engagements start in one column and grow into the next. They are built to connect, because a system that can't talk to the others just becomes another silo."
      />

      <div className="container-page mt-14">
        <Reveal>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {buildGroups.map((group, gi) => (
              <div
                key={group.id}
                className="group/col flex flex-col bg-ink transition-colors duration-(--duration-slow) hover:bg-ink-raised"
              >
                <div className="border-b border-line px-5 py-6">
                  <p className="label text-mute-deep">
                    <span className="text-ember">L{gi + 1}</span>
                    <span aria-hidden="true" className="px-2 opacity-40">
                      /
                    </span>
                    Layer
                  </p>
                  <h3 className="mt-4 text-h3 text-paper">{group.title}</h3>
                  <p className="mt-2.5 text-small text-mute">{group.note}</p>
                </div>

                <ul className="flex flex-col">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="group/item flex cursor-default items-center gap-3 border-b border-line px-5 py-3 text-small text-mute transition-colors duration-(--duration-fast) last:border-b-0 hover:bg-ember/[0.06] hover:text-paper">
                        {/* Crosshair appears in place - no layout shift. */}
                        <span
                          aria-hidden="true"
                          className="relative h-2 w-2 shrink-0 opacity-40 transition-opacity duration-(--duration-fast) group-hover/item:opacity-100"
                        >
                          <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-current transition-colors group-hover/item:bg-ember" />
                          <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-current transition-colors group-hover/item:bg-ember" />
                        </span>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
