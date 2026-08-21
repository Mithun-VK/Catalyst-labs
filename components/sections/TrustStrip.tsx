import { capabilities } from "@/content/tech";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Credibility without invention. No borrowed logos and no vanity counters -
 * who the work is for, the capability set, and facts a visitor can check for
 * themselves: the registration number, and the count of client sites that are
 * actually live (each one linked by name on /work).
 */
export function TrustStrip() {
  const items = [...capabilities, ...capabilities]; // duplicated for the loop
  const liveSites = projects.filter((p) => p.href).length;

  return (
    <section aria-label="Capabilities" className="relative border-y border-line py-10">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-md text-small text-mute">
            <span className="text-paper">
              Built for ambitious businesses, founders and teams
            </span>{" "}
            - from a first product to the system a company runs on.
          </p>

          <dl className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-baseline gap-2.5">
              <dt className="label text-mute-deep">Registered</dt>
              <dd className="text-small text-paper-dim">
                MSME · {site.registration.number}
              </dd>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dt className="label text-mute-deep">Live sites</dt>
              <dd className="text-small text-paper-dim">
                {liveSites} in production
              </dd>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dt className="label text-mute-deep">Based in</dt>
              <dd className="text-small text-paper-dim">
                {site.location.city}, {site.location.country}
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>

      {/* Capability ticker. Slow, muted, and paused on hover or focus. */}
      <div
        className="group mt-9 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        aria-hidden="true"
      >
        <ul
          className="flex w-max items-center gap-3 group-hover:[animation-play-state:paused]"
          style={{ animation: "cl-marquee 46s linear infinite" }}
        >
          {items.map((cap, i) => (
            <li
              key={`${cap}-${i}`}
              className="label flex items-center gap-3 border border-line px-4 py-2.5 text-mute"
            >
              <span aria-hidden="true" className="h-1 w-1 bg-ember/70" />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {/* The same list, once, for assistive tech and for search engines. */}
      <p className="sr-only">
        Capabilities: {capabilities.join(", ")}.
      </p>
    </section>
  );
}
