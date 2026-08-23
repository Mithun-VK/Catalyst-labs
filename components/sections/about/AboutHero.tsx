import { site } from "@/lib/site";
import { StudioType } from "./StudioType";

/**
 * ABOUT HERO - studio world.
 *
 * One statement, set as large as the viewport allows, and nothing else
 * competing with it. The letters respond to the pointer, which makes the
 * headline the page's only interactive element and its entire identity.
 *
 * A conventional about page opens with a photograph of a team and a
 * paragraph about passion. This studio has neither a stock team photo worth
 * publishing nor anything to say in that register, so the page opens with the
 * one thing it can state without qualification: who it is.
 */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="pt-32 pb-(--space-section) sm:pt-44"
    >
      <div className="container-page">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-ember">
          About
        </p>

        <h1
          id="about-heading"
          className="mt-10 uppercase text-paper"
          aria-label={`We are ${site.name}.`}
        >
          {/* aria-label carries the clean string; the split letters below are
              decorative structure for the same words. */}
          <span aria-hidden="true">
            <StudioType lines={["We are", "Catalyst", "Labs."]} />
          </span>
        </h1>

        <div className="mt-16 grid gap-x-(--space-gutter) gap-y-8 border-t border-line pt-10 lg:grid-cols-12">
          <p className="text-lead text-paper-dim lg:col-span-5">
            A software and AI engineering studio in {site.location.city},
            building systems that businesses run on.
          </p>
          <p className="text-body text-mute lg:col-span-5 lg:col-start-8">
            Small on purpose. The people who scope the work are the people who
            build it, which is why the estimate and the system tend to agree
            with each other.
          </p>
        </div>
      </div>
    </section>
  );
}
