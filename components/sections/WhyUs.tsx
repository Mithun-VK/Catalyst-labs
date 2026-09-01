import { differentiators } from "@/content/impact";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WhyUsRows } from "./home/WhyUsRows";

/**
 * Why Catalyst Labs. Outline numerals now charge with ember as the row
 * crosses the reading band - scroll-scrubbed (see WhyUsRows), not a hover
 * effect a touch visitor would never trigger. Same "inert until energised"
 * idea as the hero field, at typographic scale, now actually reachable by
 * every visitor rather than only a mouse user who happens to hover a digit.
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
        <WhyUsRows items={differentiators} />
      </div>
    </Section>
  );
}
