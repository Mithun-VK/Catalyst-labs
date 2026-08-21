import { techGroups } from "@/content/tech";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The stack, drawn as a stack: five layers, top to bottom, each with the
 * reason it is there. Deliberately not a logo wall - the names are set as
 * type, because the choice matters more than the branding.
 */
export function TechStack() {
  return (
    <Section id="technology" labelledBy="tech-heading">
      <SectionHeading
        id="tech-heading"
        eyebrow="Technology"
        title={
          <>
            A stack chosen for what it has to{" "}
            <span className="accent-word text-ember">survive</span>.
          </>
        }
        lead="Boring where boring is correct, current where current earns something. Every layer here is one we build on, not one we have heard of."
      />

      <div className="container-page mt-14">
        <Reveal>
          <ol className="border-t border-line">
            {techGroups.map((group, i) => (
              <li
                key={group.id}
                className="group grid grid-cols-1 items-baseline gap-y-4 border-b border-line py-7 transition-colors duration-(--duration-slow) hover:bg-ink-raised md:grid-cols-12 md:gap-x-(--space-gutter)"
              >
                <div className="flex items-baseline gap-4 md:col-span-3">
                  <span className="label text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
                    L{i + 1}
                  </span>
                  <h3 className="text-h3 text-paper">{group.layer}</h3>
                </div>

                <p className="text-small text-mute md:col-span-4">{group.note}</p>

                <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-5 md:justify-end">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[0.8125rem] text-paper-dim transition-colors duration-(--duration-fast) hover:text-paper"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
