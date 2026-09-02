import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { World } from "@/components/worlds/World";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Approach } from "@/components/sections/home/Approach";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";
import { ChainStrip } from "@/components/visuals/ChainStrip";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Website & Software Development in Chennai | Catalyst Labs",
  description:
    "Scalable, efficient web development, custom software and AI automation. A Chennai studio engineering systems built to grow without a rewrite.",
  path: "",
});

/**
 * HOME - the precision world.
 *
 * Its job is still to make a stranger believe this company can build their
 * system - answered by evidence and structure, not by decoration for its own
 * sake. What changed is HOW that structure moves: every section below now
 * carries real, purposeful motion (GSAP scroll-scrubbed reveals in Approach
 * and WhyUs, Motion-driven interaction in Capabilities, anime.js timelines in
 * the hero and closing CTA) instead of the page being the one deliberately
 * quiet stop between more expressive pages. The restraint moved from
 * "how much moves" to "why it moves" - nothing here animates without a scroll
 * position, a hover, or an entrance driving it.
 *
 * The four preview sections that originally sat here (work, services, AI,
 * process) were replaced by two real indexes early in this redesign; the
 * project index was then removed a step further, once /work existed as its
 * own fully-built page - showing the same six projects on both routes was
 * duplication, not evidence. Home now opens with the studio's method
 * (Approach) rather than its portfolio, and hands the portfolio question
 * entirely to /work.
 */
export default function HomePage() {
  return (
    <World id="precision">
      <Hero />
      <TrustStrip />
      <section aria-label="How the work moves" className="border-b border-line py-10">
        <div className="container-page">
          <Reveal>
            <ChainStrip />
          </Reveal>
        </div>
      </section>
      <Approach />
      <Capabilities />
      <WhyUs />
      <CTABand
        title="Have a system worth building?"
        accent="Let's scope it."
        lead="Tell us what you're trying to build, automate or improve. If we're not the right people for it, we'll say so - and point you at who is."
        animated
      />
    </World>
  );
}
