import Link from "next/link";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";

/**
 * WORKS TRANSITION - capability to proof. Names two real, verifiable
 * systems already documented in full on /work (SafeMerchant, Ark Angel)
 * rather than gesturing at "our work" in the abstract - the whole point of
 * this bridge is that the claim on this page can be checked on the next
 * one.
 */
export function WorksTransition() {
  const featured = projects.filter((p) => p.featured).slice(0, 2);

  return (
    <section
      aria-labelledby="works-transition-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-mute-deep">
            Proof / 05
          </p>
          <h2
            id="works-transition-heading"
            className="mt-6 max-w-[22ch] text-paper"
            style={{
              fontSize: "clamp(2rem, 1rem + 4vw, 4.25rem)",
              lineHeight: "0.98",
              letterSpacing: "-0.035em",
              fontWeight: 500,
            }}
          >
            We build systems. Then we put them into production.
          </h2>

          {featured.length ? (
            <p className="mt-8 max-w-(--measure-wide) text-lead text-mute">
              {featured.map((p, i) => (
                <span key={p.slug}>
                  <span className="text-paper">{p.name}</span>
                  {i < featured.length - 1 ? " and " : " - "}
                </span>
              ))}
              documented in full, with what was actually built and what can
              be verified.
            </p>
          ) : null}

          <Link
            href="/work"
            className="group mt-10 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-small tracking-[0.04em] text-paper transition-colors duration-(--duration-base) hover:border-ember hover:text-ember"
          >
            See what we built
            <span
              aria-hidden="true"
              className="transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
