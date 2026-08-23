import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { World } from "@/components/worlds/World";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Approach } from "@/components/sections/home/Approach";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { WhyUs } from "@/components/sections/WhyUs";
import { CTABand } from "@/components/sections/CTABand";

export const metadata: Metadata = buildMetadata({
  title: "Website & Software Development in Chennai | Catalyst Labs",
  description:
    "Scalable, efficient web development, custom software and AI automation. A Chennai studio engineering systems built to grow without a rewrite.",
  path: "",
});

/**
 * HOME - the precision world.
 *
 * The most restrained page on the site, and deliberately the least
 * decorated. Its only job is to make a stranger believe this company can
 * build their system, which is a question answered by evidence and structure
 * rather than by motion. The experimental pages earn their licence precisely
 * because this one does not spend it.
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
      <Approach />
      <Capabilities />
      <WhyUs />
      <CTABand
        title="Have a system worth building?"
        accent="Let's scope it."
        lead="Tell us what you're trying to build, automate or improve. If we're not the right people for it, we'll say so - and point you at who is."
      />
    </World>
  );
}
