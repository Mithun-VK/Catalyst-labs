import { Reveal } from "@/components/ui/Reveal";
import { Stagger } from "@/components/motion/TextReveal";

/**
 * RELIABILITY GRID - system world.
 *
 * The trust half of the page, built on a simple bet: for the person who signs
 * off on an AI project, the convincing thing is not a claim that the system
 * works. It is evidence that somebody has already thought about what happens
 * when it does not.
 *
 * So every entry is a failure mode stated plainly, paired with the mechanism
 * that handles it. No accuracy percentages, no uptime figures, no "99.9%" -
 * this studio has no audited numbers to publish, and a fabricated one is
 * exactly the claim a technical buyer checks first.
 *
 * Each panel carries a scanline that crosses it, which is the page's
 * "actively monitored" motif. Decorative, transform-only, and frozen under
 * reduced motion.
 */

const FAILURES = [
  {
    mode: "The model is not sure",
    response:
      "Confidence is scored before anything is written. Below the threshold the task routes to a person with the full context attached, rather than guessing and being wrong quietly.",
  },
  {
    mode: "The provider goes down",
    response:
      "The pipeline queues instead of dropping. Work retries with backoff and resumes where it stopped, so an outage delays the run - it does not lose it.",
  },
  {
    mode: "The output is malformed",
    response:
      "Every response is validated against a schema before it reaches a system of record. Invalid output is rejected and retried, never written through on the assumption it is fine.",
  },
  {
    mode: "The data shifts underneath it",
    response:
      "Each task carries its own evaluation set. It runs on every release, and a regression against the previous version blocks the deploy rather than shipping and being noticed later.",
  },
  {
    mode: "Somebody asks why it did that",
    response:
      "Each decision keeps its inputs, the prompt version that produced it, and the output. An answer six months later is a lookup, not an investigation.",
  },
  {
    mode: "You want to leave",
    response:
      "It runs in your cloud, on your keys, against your data. The pipeline and its prompts are yours at handover - there is no component that only we can operate.",
  },
] as const;

export function ReliabilityGrid() {
  return (
    <section
      aria-labelledby="reliability-heading"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <p className="readout text-signal">Failure modes</p>
          <h2
            id="reliability-heading"
            className="mt-6 max-w-[22ch] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-paper"
            style={{ fontSize: "clamp(1.875rem, 1rem + 3.4vw, 4rem)" }}
          >
            What happens when it goes wrong
          </h2>
          <p className="mt-7 max-w-(--measure-wide) text-lead text-mute">
            Anyone can demo an AI system on the path where everything works.
            These are the paths where it does not, and what the build does
            about each one.
          </p>
        </Reveal>

        <Stagger
          className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
          step={2}
        >
          {FAILURES.map((f, i) => (
            <article
              key={f.mode}
              className="relative overflow-hidden bg-ink p-7 transition-colors duration-(--duration-slow) hover:bg-ink-raised"
            >
              {/* Scanline. Offset per panel so the grid never pulses in
                  unison, which would read as a loading state. */}
              <span
                aria-hidden="true"
                className="sensor-scan top-0"
                style={{
                  ["--scan-distance" as string]: "230px",
                  animationDelay: `${i * 0.75}s`,
                }}
              />

              <p className="readout tabular text-mute-deep">
                {String(i + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-5 text-h3 text-paper">{f.mode}</h3>

              <p className="mt-4 text-small text-mute">{f.response}</p>
            </article>
          ))}
        </Stagger>

        <Reveal delay={80}>
          <p className="mt-12 max-w-(--measure-wide) text-body text-mute-deep">
            None of the above is a performance claim. They are properties of
            how the system is built, which is the part we can actually promise
            before a line of your data has been seen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
