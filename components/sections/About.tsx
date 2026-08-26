import { CompactHeading, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger } from "@/components/motion/TextReveal";
import { site } from "@/lib/site";

const beliefs = [
  {
    title: "Most software problems are process problems",
    body: "A tool that automates a broken process just produces the wrong answer faster. We map the work before we design the system.",
  },
  {
    title: "Software is only useful if it gets used",
    body: "Adoption is an engineering requirement, not a training problem. If the team routes around the system, the system was designed wrong.",
  },
  {
    title: "The second version should build on the first",
    body: "Typed code, real data models and written-down decisions cost a little more in week two and save the entire project in month eight.",
  },
  {
    title: "Say when technology is the wrong answer",
    body: "Some problems are solved by a policy change or a spreadsheet. Telling you that costs us a project and earns the next three.",
  },
];

export function About({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <Section
      id="about"
      labelledBy={showHeading ? "about-heading" : undefined}
      divider={showHeading}
      // Without a heading, this section sits directly under AboutHero on
      // /about, which already ends in its own full pb-(--space-section).
      // Section's default py-(--space-section) would stack a SECOND full
      // section gap on top of that with no divider rule to explain it (the
      // divider is off here too) - a large dead gap rather than a deliberate
      // break. Dropping this section's own top padding leaves exactly one
      // section-gap between them, same as everywhere else on the site.
      className={!showHeading ? "pt-0" : undefined}
    >
      {showHeading ? (
        <SectionHeading
          id="about-heading"
          index="09"
          eyebrow="About"
          title={
            <>
              An engineering studio, run like an engineering{" "}
              <span className="accent-word text-ember">team</span>.
            </>
          }
        />
      ) : (
        <CompactHeading
          id="about-heading"
          eyebrow="What we believe"
          title="Why the studio exists and how it approaches engineering."
          note="Company record →"
        />
      )}

      <div className={`container-page ${showHeading ? "mt-14" : "mt-10"}`}>
        <div className="grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
            <div className="max-w-2xl space-y-6 text-lead text-mute">
              <p>
                {site.name} builds custom software, AI systems and automation for
                businesses that have outgrown the tools they started with - the
                spreadsheet that became a database, the WhatsApp group that became
                a workflow, the manual step that now costs someone a day a week.
              </p>
              <p className="text-paper">
                We exist because the gap between &ldquo;we know what&rsquo;s broken&rdquo;
                and &ldquo;we have a system that fixes it&rdquo; is where most
                businesses get stuck - usually between an agency that can design and
                a developer who can code, with nobody accountable for whether the
                thing actually works.
              </p>
              <p>
                So we do the whole path: understand the operation, architect the
                system, design the interface, build it, ship it, and stay for the
                part where it gets better. Founder-led, deliberately small, and
                answerable for the result rather than for a deliverable.
              </p>
            </div>
            </Reveal>

            {/* The four beliefs cascade in one at a time rather than landing
                as a block - they are four separate claims and read better
                arriving as four. Each is its own card on hover, which is the
                only interactive affordance in this column. */}
            <Stagger
              as="ul"
              step={4}
              className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2"
            >
              {beliefs.map((belief) => (
                <li
                  key={belief.title}
                  className="belief-card bg-ink p-6 hover:bg-ink-raised"
                >
                  <h3 className="flex gap-3 text-body font-medium text-paper">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-4 shrink-0 bg-ember"
                    />
                    {belief.title}
                  </h3>
                  <p className="mt-3 pl-7 text-small text-mute">{belief.body}</p>
                </li>
              ))}
            </Stagger>
          </div>

          {/* Verifiable facts only. */}
          <Reveal delay={90} className="lg:col-span-5 lg:justify-self-end">
            <div className="w-full border border-line bg-ink-raised p-7 lg:max-w-sm">
              <p className="label text-mute-deep">Company record</p>

              <dl className="mt-6 divide-y divide-line">
                <Fact label="Entity" value={site.legalName} />
                <Fact
                  label="Registration"
                  value={site.registration.number}
                />
                <Fact label="Classification" value={site.registration.classification} />
                <Fact label="Activity" value="Computer programming & consultancy" />
                <Fact
                  label="Location"
                  value={`${site.location.city}, ${site.location.region}, ${site.location.country}`}
                />
                <Fact label="Established" value={site.founded} />
              </dl>

              <p className="mt-6 text-[0.8125rem] leading-relaxed text-mute-deep">
                Registered with the Ministry of MSME, Government of India. The
                registration number above can be verified on the public Udyam
                registry.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3.5">
      <dt className="label shrink-0 text-mute-deep">{label}</dt>
      <dd className="text-right text-small text-paper-dim">{value}</dd>
    </div>
  );
}
