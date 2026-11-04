import { Reveal } from "@/components/ui/Reveal";
import { PulseGrid } from "@/components/visuals/PulseGrid";
import { CtaBrief } from "@/components/cta/CtaBrief";
import { CtaPaths } from "@/components/cta/CtaPaths";
import { CtaNext } from "@/components/cta/CtaNext";
import { CtaProof } from "@/components/cta/CtaProof";
import { ProximityText } from "@/components/cta/ProximityText";
import { ctaFacts } from "@/lib/cta";
import { site } from "@/lib/site";
import "@/components/cta/cta.css";

/**
 * The closing conversion surface, shared by every page except Contact itself.
 * One headline, then three ways in, ordered by effort:
 *
 *   1. a one-sentence brief typed right here (CtaBrief) - the primary path,
 *      because it asks for a sentence and an email instead of a page change;
 *   2. three alternative tiles - book a call, WhatsApp, email (CtaPaths);
 *   3. what happens next (CtaNext) and real results (CtaProof), so the
 *      visitor knows what they are committing to before they commit.
 *
 * THEME. The band is built from tokens, so it re-themes itself in every
 * design world. On top of that, cta.css reads four variables per world
 * (duration, radius, lift) so its motion follows the page's own principles:
 * crisp on precision, soft on studio, slow and fine on atelier. The Works
 * page passes `variant="poster"`, which switches on the full comic treatment:
 * a marquee, colour-flood tiles with hard offset shadows, headline letters
 * that swell near the pointer, sticker proof and confetti.
 *
 * `animated` is opt-in and OFF by default - only Home passes it, to keep its
 * quiet pulsing grid.
 */
export function CTABand({
  title = "Have a problem worth solving?",
  accent = "Let's build it.",
  lead = "Tell us what you're trying to build, automate or improve. If we're not the right people for it, we'll say so - and point you at who is.",
  animated = false,
  variant = "standard",
  location = "cta_band",
}: {
  title?: string;
  accent?: string;
  lead?: string;
  animated?: boolean;
  variant?: "standard" | "poster";
  /** Analytics location tag. */
  location?: string;
}) {
  const poster = variant === "poster";

  return (
    <section
      aria-labelledby="cta-heading"
      data-variant={variant}
      className="cta-band relative isolate overflow-hidden border-t border-line pb-(--space-section)"
    >
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      {animated && !poster ? (
        <PulseGrid className="pointer-events-none absolute inset-0 -z-10" />
      ) : null}

      {poster ? (
        <div className="cta-marquee marquee overflow-hidden py-3" aria-hidden="true">
          <div className="marquee-track" data-run style={{ "--marquee-duration": "28s" } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-8 pr-8 text-[length:clamp(1.25rem,1rem+1.6vw,2.1rem)] font-semibold uppercase leading-none tracking-[-0.02em]"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-8">
                    Let&rsquo;s build
                    <span>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="container-page pt-(--space-section)">
        <div className="grid gap-x-(--space-gutter) gap-y-12 lg:grid-cols-12">
          {/* ---- left: the ask ---------------------------------------- */}
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <h2 id="cta-heading" className="text-h1 text-paper">
                {poster ? (
                  <>
                    <ProximityText text={title} />{" "}
                    <span className="accent-word text-ember">
                      <ProximityText text={accent} />
                    </span>
                  </>
                ) : (
                  <>
                    {title} <span className="accent-word text-ember">{accent}</span>
                  </>
                )}
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 max-w-xl text-lead text-mute">{lead}</p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-9">
                <CtaBrief variant={variant} location={location} />
              </div>
            </Reveal>
          </div>

          {/* ---- right: other ways in, what happens next, proof ---------- */}
          <div className="min-w-0 lg:col-span-5">
            <Reveal delay={100}>
              <p className="label mb-3 text-mute-deep">Or choose how to talk</p>
              <CtaPaths variant={variant} location={location} />
            </Reveal>

            <div className="mt-10">
              <CtaNext />
            </div>

            <div className="mt-10">
              <CtaProof facts={ctaFacts()} variant={variant} />
            </div>

            <p className="mt-8 text-[0.8125rem] leading-relaxed text-mute-deep">
              {site.contact.email} · {site.contact.phoneDisplay} ·{" "}
              {site.location.city}, {site.location.country}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
