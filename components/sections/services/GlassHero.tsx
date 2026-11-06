import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { TextReveal } from "@/components/motion/TextReveal";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceFinder } from "@/components/sections/services/ServiceFinder";

/**
 * SERVICES HERO - compact, and useful above the fold.
 *
 * Left: the claim and two actions. Right: the service finder, so the first
 * screen already answers "which of these is mine?". Below: one dark glass
 * band carrying the engagement terms and the credentials that used to live in
 * a separate Delivery section further down.
 */
export function GlassHero() {
  const count = String(services.length).padStart(2, "0");
  const liveSites = projects.filter((p) => p.href).length;

  const facts = [
    ["Scope", "Fixed and written before any code"],
    ["Access", "Direct to the people building it"],
    ["Delivery", "Handed over, documented, yours"],
    ["Record", `${site.registration.scheme} registered · ${liveSites} live client sites`],
  ];

  return (
    <section aria-labelledby="services-heading" className="relative pt-28 pb-10 sm:pt-36 lg:pb-12">
      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="glass-chip inline-flex items-center gap-2.5 px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-paper">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
              Services · {count} practices
            </p>

            <h1
              id="services-heading"
              className="mt-7 max-w-[15ch] text-paper"
              style={{
                fontSize: "clamp(2.5rem, 1rem + 4.8vw, 5rem)",
                lineHeight: "0.98",
                letterSpacing: "-0.035em",
                fontWeight: 500,
              }}
            >
              <TextReveal lines={["Software & AI", "services, built", "deliberately."]} />
            </h1>

            <p className="mt-6 max-w-[52ch] text-lead text-mute">
              Custom software, AI automation and products, scoped around how your
              business actually runs. Nothing sold from a template, nothing scoped
              before it is understood.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href="/contact"
                size="lg"
                arrow
                event="cta_click"
                eventProps={{ location: "services_hero", label: "start_a_project" }}
                className="w-full sm:w-auto"
              >
                Start a project
              </ButtonLink>
              <ButtonLink
                href="#practices"
                size="lg"
                variant="secondary"
                event="cta_click"
                eventProps={{ location: "services_hero", label: "see_practices" }}
                className="glass-chip w-full !border-white/70 !bg-white/60 sm:w-auto"
              >
                See all practices
              </ButtonLink>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <ServiceFinder />
          </div>
        </div>

        <dl className="glass-dark mt-10 grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2 sm:p-6 lg:mt-12 lg:grid-cols-4">
          {facts.map(([term, detail]) => (
            <div key={term} className="min-w-0">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ember">{term}</dt>
              <dd className="mt-1 text-small text-paper">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
