import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * APPROACH - precision world.
 *
 * Replaces the project index that used to sit here. Showing the same six
 * projects on Home and on /work was redundant - a visitor who wants the
 * evidence has a whole page built for exactly that - and it meant Home spent
 * its first real section proving specific claims instead of stating what the
 * studio is actually optimising for across every one of them.
 *
 * This section is that statement: scalable and efficient are not adjectives
 * here, they are the two constraints every system is checked against, and
 * each row names the concrete engineering practice that constraint turns
 * into for a given kind of build. Nothing here is a number that could be
 * disproven - it is a description of a discipline, which is the part that
 * can honestly be promised before a line of a client's code has been
 * written.
 */
export function Approach() {
  return (
    <Section id="approach" labelledBy="approach-heading" divider>
      <SectionHeading
        id="approach-heading"
        index="01"
        eyebrow="Method"
        title={
          <>
            Scalable by design.{" "}
            <span className="accent-word text-ember">Efficient</span> by
            discipline.
          </>
        }
        lead="Every system we build - a web product, an internal platform, an AI pipeline, a SaaS build - is checked against the same two constraints: it has to hold more than it does on day one, and it has to do that without carrying anything it doesn't need."
      />

      <div className="container-page mt-14">
        <Reveal>
          <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {DOMAINS.map((d) => (
              <div key={d.name} className="bg-ink px-7 py-9 sm:px-8 sm:py-10">
                <dt className="label flex items-center gap-3 text-mute-deep">
                  <span className="text-ember">{d.index}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                  {d.name}
                </dt>
                <dd className="mt-5 text-h3 text-paper">{d.claim}</dd>
                <dd className="mt-4 max-w-(--measure) text-body text-mute">
                  {d.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

const DOMAINS = [
  {
    index: "01",
    name: "Web development",
    claim: "Fast on the phone your customer actually has.",
    body: "Rendering decided per route, not by default. Performance and accessibility are budgets set at architecture time and checked before release, so a product built for a hundred visitors doesn't need a rewrite to hold ten thousand.",
  },
  {
    index: "02",
    name: "Software development",
    claim: "One system that holds the operation, not six that argue.",
    body: "Real data models and real permissions, modelled on the process as it actually runs - exceptions included - so the schema doesn't have to be re-thought every time the business adds a new case.",
  },
  {
    index: "03",
    name: "AI automation",
    claim: "Agents wired in, with a defined failure path.",
    body: "Every pipeline carries retries, logging and an evaluation gate, and routes to a person when it's unsure rather than guessing. And where a query or a scheduled job is the cheaper, more reliable answer, that's what gets built instead.",
  },
  {
    index: "04",
    name: "Other software products",
    claim: "A backend built to hold what comes after launch.",
    body: "SaaS builds, mobile apps and data integrations start from the same discipline: typed, tested, and handed over in a state someone else could maintain without us on call.",
  },
] as const;
