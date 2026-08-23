import { services } from "@/content/services";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * SERVICES HERO - atelier world, luxury register.
 *
 * The inversion. This is the only light page on the site, and arriving here
 * from the near-black home page or the poster Works page is meant to feel
 * like walking from a workshop into a showroom - now with the material to
 * back that up: an ivory ground, a deep-teal credential plate, and gold
 * treated as metal (a foil gradient with a highlight, not a flat swatch)
 * rather than as a colour choice.
 *
 * Every colour still comes from the world's token overrides - nothing is
 * declared here directly - which is what lets this exact markup render
 * correctly on a dark ground too. The credential panel is the one
 * deliberate exception: `.luxury-panel-dark` locally re-points the role
 * tokens to an inverted teal register (see globals.css), so the same
 * `text-paper` / `text-mute` / `text-ember` utilities used everywhere else
 * on the page automatically resolve to ivory-on-teal and gold-on-teal
 * inside it, with no separate colour ever named in this file.
 */
export function AtelierHero() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden pt-32 pb-(--space-section) sm:pt-44"
    >
      {/* Atmospheric wash - a single soft teal bloom bleeding from the upper
          corner, the one texture this restrained a page can carry without
          it reading as decoration for its own sake. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -top-[20%] -z-10 h-[42rem] w-[42rem] rounded-full opacity-[0.09]"
        style={{
          background:
            "radial-gradient(circle, var(--color-teal) 0%, transparent 68%)",
        }}
      />

      <div className="container-page">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-mute-deep">
            Services
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-mute-deep">
            {String(services.length).padStart(2, "0")} practices
          </p>
        </div>

        <hr className="editorial-rule mt-6" />

        <div className="mt-16 grid gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1
              id="services-heading"
              className="max-w-[15ch] text-paper"
              style={{
                fontSize: "clamp(2.75rem, 1rem + 6.4vw, 6.5rem)",
                lineHeight: "0.98",
                letterSpacing: "-0.035em",
                fontWeight: 500,
              }}
            >
              <TextReveal
                lines={["Engineering,", "commissioned", "deliberately."]}
              />
            </h1>

            <p className="mt-10 max-w-(--measure-wide) text-lead text-mute">
              Every engagement begins with the same question: what does the
              work actually look like today? The architecture follows from
              the answer. Nothing here is sold from a template, and nothing
              is scoped before it is understood.
            </p>
          </div>

          {/* Credential plate - the inverted teal register, the page's one
              deliberate object of weight. Real facts only, in the same
              disciplined register the rest of the site holds to. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="luxury-panel-dark rounded-sm p-8 sm:p-10">
              <span
                aria-hidden="true"
                className="luxury-corner left-0 top-0 border-l border-t"
              />
              <span
                aria-hidden="true"
                className="luxury-corner bottom-0 right-0 border-b border-r"
              />

              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-ember">
                The engagement
              </p>

              <dl className="mt-7 grid gap-5">
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">
                    Scope
                  </dt>
                  <dd className="mt-1.5 text-body text-paper">
                    Fixed, written, before any code
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">
                    Access
                  </dt>
                  <dd className="mt-1.5 text-body text-paper">
                    Direct to the people building it
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">
                    Delivery
                  </dt>
                  <dd className="mt-1.5 text-body text-paper">
                    Handed over, documented, yours
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
