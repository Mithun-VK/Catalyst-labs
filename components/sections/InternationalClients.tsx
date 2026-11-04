import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * "Working with international clients". Every line is either already stated
 * elsewhere on the site (written proposals, code ownership) or gated behind a
 * flag in site.internationalClients that the owner must set. Unconfirmed
 * claims are never rendered.
 */
export function InternationalClients() {
  const { overlapHours, milestonePayments } = site.internationalClients;

  const points = [
    "Based in Chennai (IST, UTC+5:30), working with clients in the US, UK, Europe, the Gulf and Australia.",
    overlapHours ? `Call hours: ${overlapHours}.` : null,
    "Email, video call or WhatsApp - whichever you prefer.",
    "A written scope and fixed proposal before any build begins.",
    milestonePayments ? "Milestone-based payments against agreed deliverables." : null,
    "Code ownership transfers to you once the project is deployed to production and the bug-fix period is complete.",
  ].filter((p): p is string => Boolean(p));

  return (
    <section aria-label="Working with international clients" className="pb-(--space-section)">
      <div className="container-page">
        <Reveal>
          <div className="border border-line p-6 sm:p-8">
            <p className="label text-mute-deep">Working with international clients</p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-small text-mute">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-ember" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
