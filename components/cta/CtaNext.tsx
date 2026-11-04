import { InViewGroup } from "@/components/cta/InViewGroup";

/**
 * "What happens after you hit send": the three steps already stated on the
 * Contact page, drawn as a timeline that fills in as it scrolls into view.
 * Server markup; the staged entrance is CSS keyed on InViewGroup's
 * `data-inview` attribute (see cta.css), and everything is visible without
 * JavaScript or under reduced motion.
 */
const STEPS = [
  {
    title: "We read it",
    body: "A person reads every enquiry. There is no filter in front of it.",
  },
  {
    title: "A reply in one working day",
    body: "Usually with a question or two about the problem, before anything else.",
  },
  {
    title: "A call, then a written proposal",
    body: "If there is a project here: a written scope, a fixed proposal and a start date.",
  },
] as const;

export function CtaNext() {
  return (
    <InViewGroup className="cta-next">
      <p className="label text-mute-deep">After you send</p>
      <ol className="cta-steps mt-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="cta-step" style={{ "--i": i } as React.CSSProperties}>
            <span aria-hidden="true" className="cta-step-dot">
              {i + 1}
            </span>
            <span className="block text-body font-medium text-paper">{step.title}</span>
            <span className="mt-0.5 block text-small text-mute">{step.body}</span>
          </li>
        ))}
      </ol>
    </InViewGroup>
  );
}
