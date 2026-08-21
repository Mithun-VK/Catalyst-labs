import { differentiators } from "@/content/impact";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Why Catalyst Labs. Outline numerals fill with ember on hover - the same
 * "inert until energised" idea as the hero field, at typographic scale.
 */
export function WhyUs() {
  return (
    <Section id="why" labelledBy="why-heading">
      <SectionHeading
        id="why-heading"
        eyebrow="Why Catalyst Labs"
        title={
          <>
            Five things that change how the project actually{" "}
            <span className="accent-word text-ember">goes</span>.
          </>
        }
      />

      <div className="container-page mt-14">
        <ul className="border-t border-line">
          {differentiators.map((item, i) => (
            <li key={item.id} className="border-b border-line">
              <Reveal delay={i * 50}>
                <div className="group grid grid-cols-1 items-start gap-4 py-8 md:grid-cols-12 md:gap-x-(--space-gutter) md:py-10">
                  <div className="md:col-span-3">
                    <span
                      aria-hidden="true"
                      className="block font-display text-[3.5rem] leading-[0.8] tracking-[-0.05em] text-transparent transition-colors duration-(--duration-slow) group-hover:text-ember/25 md:text-[4.5rem]"
                      style={{
                        WebkitTextStroke: "1px var(--color-line-strong)",
                      }}
                    >
                      {item.index}
                    </span>
                  </div>

                  <h3 className="text-h3 text-paper md:col-span-4">{item.title}</h3>

                  <p className="text-body text-mute md:col-span-5">{item.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
