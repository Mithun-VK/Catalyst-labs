import { services } from "@/content/services";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CapabilitiesList } from "./CapabilitiesList";

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
 * The list itself (hover sweep, entrance stagger) lives in CapabilitiesList,
 * a client component - this one stays server-rendered.
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
        <CapabilitiesList services={services} />
      </div>
    </Section>
  );
}
