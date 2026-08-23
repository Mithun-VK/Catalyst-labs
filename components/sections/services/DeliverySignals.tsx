import { techGroups } from "@/content/tech";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger } from "@/components/motion/TextReveal";

/**
 * DELIVERY SIGNALS - credibility from facts a reader can check, not from
 * invented statistics. Every number here is real and derived from the data
 * that already exists elsewhere on the site: the count of live client
 * sites comes straight from content/projects.ts (so it can never drift out
 * of sync with what /work actually shows), and the registration number is
 * the same Udyam credential the footer and Home's trust strip use.
 *
 * Deliberately absent: uptime percentages, client counts, satisfaction
 * scores - nothing here would survive being asked "where does that number
 * come from", so none of it is published.
 */
export function DeliverySignals() {
  const liveSites = projects.filter((p) => p.href).length;

  return (
    <section
      aria-labelledby="delivery-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-mute-deep">
            Delivery / 04
          </p>
          <h2
            id="delivery-heading"
            className="mt-6 max-w-[20ch] text-paper"
            style={{
              fontSize: "clamp(1.875rem, 1rem + 3.4vw, 3.75rem)",
              lineHeight: "0.98",
              letterSpacing: "-0.03em",
              fontWeight: 500,
            }}
          >
            What can actually be checked.
          </h2>
        </Reveal>

        <Reveal delay={70}>
          <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
            <div className="luxury-panel-dark p-7">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ember">
                Registration
              </dt>
              <dd className="mt-2 text-body text-paper">
                {site.registration.number}
              </dd>
              <dd className="mt-1 text-small text-mute">
                {site.registration.classification}
              </dd>
            </div>
            <div className="bg-ink-raised p-7">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                Live in production
              </dt>
              <dd className="mt-2 text-body text-paper">
                {liveSites} client sites
              </dd>
              <dd className="mt-1 text-small text-mute">Linked from /work</dd>
            </div>
            <div className="bg-ink-raised p-7">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                Based in
              </dt>
              <dd className="mt-2 text-body text-paper">
                {site.location.city}, {site.location.country}
              </dd>
              <dd className="mt-1 text-small text-mute">
                {site.location.region}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={110}>
          <p className="mt-16 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep">
            The stack, layer by layer
          </p>
        </Reveal>

        <Stagger
          as="ul"
          step={3}
          className="mt-6 grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-5"
        >
          {techGroups.map((group) => (
            <li key={group.id} className="border-b border-line py-6 pr-4">
              <p className="text-small font-medium uppercase tracking-[0.02em] text-paper">
                {group.layer}
              </p>
              <p className="mt-2 max-w-[22ch] text-[0.8125rem] leading-relaxed text-mute">
                {group.note}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[0.625rem] uppercase tracking-wider text-mute-deep"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
