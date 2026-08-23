import Link from "next/link";
import { services } from "@/content/services";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * CAPABILITIES - precision world.
 *
 * A typographic index rather than a grid of icon cards. Six equal boxes with
 * six pictograms says nothing about which of these the studio is strongest
 * at; a ruled list set in the page's own type scale lets the names carry the
 * weight and stays honest about the fact that they are all one practice.
 *
 * The entries are the real services from content/services.ts. No capability
 * is listed here that the studio does not actually sell - a portfolio that
 * advertises a discipline it has no offer for is the fastest way to fail the
 * first technical call.
 *
 * Server component, no JavaScript: the hover state is CSS only.
 */
export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-heading" divider>
      <SectionHeading
        id="capabilities-heading"
        index="02"
        eyebrow="Capabilities"
        title={
          <>
            Six practices, one{" "}
            <span className="accent-word text-ember">engineering</span> team.
          </>
        }
        lead="Most engagements draw on more than one of these. They are listed separately because the work is different, not because the teams are."
      />

      <div className="container-page mt-14">
        <Reveal>
          <ul className="border-t border-line">
            {services.map((service) => (
              <li key={service.id} className="border-b border-line">
                <Link
                  href={`/services/${service.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 py-7 sm:gap-x-10 lg:py-8"
                >
                  <span className="font-mono text-[0.75rem] tabular text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
                    {service.index}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-h2 text-paper transition-colors duration-(--duration-base) group-hover:text-ember">
                      {service.title}
                    </span>
                    <span className="mt-2 block max-w-(--measure) text-body text-mute">
                      {service.summary}
                    </span>
                  </span>

                  {/* Affordance only - the whole row is the target. */}
                  <span
                    aria-hidden="true"
                    className="translate-x-0 text-mute-deep transition-[transform,color] duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1 group-hover:text-ember"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
