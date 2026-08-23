import { projects, alsoBuilt } from "@/content/projects";
import { TextReveal } from "@/components/motion/TextReveal";
import { Marquee } from "@/components/motion/Marquee";

/**
 * WORKS HERO - poster world, comic register.
 *
 * The hard cut away from the home page, and now a further cut from a flat
 * fluorescent editorial page into something closer to the reference brief:
 * thick outlines, hard offset shadows, a scattered dot field and stroked
 * display type - the visual language of a studio proving it can also build
 * something unmistakably playful, not only a clean SaaS page.
 *
 * The dots and orbs are a CSS texture and two gradient circles, not an
 * illustration - there is no character to draw and animate here, and a
 * generated wordmark that looks hand-drawn does more work than a mascot
 * borrowed from a template.
 *
 * IDLE MOTION. Everything above the fold now moves a little even before the
 * visitor scrolls: the two orbs drift on independent, asynchronous paths
 * (`.orb-float-a` / `-b`, different durations so they never sync up), the
 * "Works" pill idles on a small wobble, and the headline enters with an
 * overshoot-and-settle bounce (`TextReveal variant="pop"`) rather than a
 * plain rise. All of it is `transform`-only, all of it is driven by CSS
 * keyframes with no JS, and all of it collapses under
 * `prefers-reduced-motion: reduce` via the site's blanket reduce rule.
 */
export function WorksHero() {
  const total = projects.length + alsoBuilt.length;
  const live = projects.filter((p) => p.href).length;

  return (
    <section
      aria-labelledby="works-heading"
      className="relative overflow-hidden pt-32 sm:pt-40"
    >
      {/* Scattered dot field, low-key on the bright paper ground. */}
      <div className="starfield" aria-hidden="true" />

      {/* Two floating orbs, echoing the reference's planets - pure CSS,
          no image request. Colours are literal, matching the SURFACES
          palette in globals.css, rather than a token: these two dots are a
          fixed decorative accent independent of whichever project surface
          the viewport happens to be scrolled past. */}
      <span
        aria-hidden="true"
        className="orb-float-a pointer-events-none absolute -left-10 top-24 hidden h-28 w-28 rounded-full opacity-70 sm:block"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #ffe500, #ff5b28 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="orb-float-b pointer-events-none absolute right-6 top-44 hidden h-16 w-16 rounded-full opacity-70 md:block"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #5ce4b0, #2b3aff 75%)",
        }}
      />

      <div className="container-page relative">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p className="comic-tag comic-wiggle font-mono">Works</p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-mute">
            {total} projects · {live} live sites
          </p>
        </div>

        <h1
          id="works-heading"
          className="text-comic mt-8 font-semibold uppercase leading-[0.8] tracking-[-0.055em]"
          style={{ fontSize: "clamp(3rem, 0.25rem + 13.5vw, 12rem)" }}
        >
          <TextReveal
            lines={["We build", "things", "that move."]}
            variant="pop"
          />
        </h1>
      </div>

      {/* Full-bleed fluorescent band, now framed like a comic panel edge
          with a thick paper-coloured rule on both sides instead of a plain
          hairline. */}
      <Marquee
        data-surface="acid"
        text="SHIPPED · IN PRODUCTION · MEASURED · "
        duration={44}
        className="relative z-10 mt-14 border-y-4 border-paper py-4"
        itemClassName="font-mono text-[0.9375rem] uppercase tracking-[0.28em]"
      />

      <div className="container-page relative mt-14">
        <div className="grid gap-x-(--space-gutter) gap-y-6 lg:grid-cols-12">
          <p
            className="lg:col-span-7"
            style={{
              fontSize: "clamp(1.375rem, 1rem + 1.6vw, 2.25rem)",
              lineHeight: "1.24",
              letterSpacing: "-0.02em",
            }}
          >
            Fraud scoring in production. A quantitative trading stack. A tax
            compliance platform. Three live client sites.
          </p>
          <p className="text-body text-mute lg:col-span-4 lg:col-start-9">
            Every entry below is real and shipped. The numbers are recorded
            results from the build, never estimates - and where an engagement
            is covered by an agreement, it is described without naming the
            client rather than dressed up.
          </p>
        </div>
      </div>
    </section>
  );
}
