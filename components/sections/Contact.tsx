import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { mailtoLink, site, whatsappLink } from "@/lib/site";
import { ContactLink } from "@/components/ui/ContactLink";

/**
 * The conversion surface. Three direct channels ordered by how much friction
 * each carries, with the lowest-friction option available without filling in
 * anything at all - then the full enquiry form for people who would rather
 * write it down once.
 *
 * Alignment follows the same contract as every other page: content in
 * columns 1–5, the form in 7–12.
 */
export function ContactBody() {
  return (
    <section
      aria-label="Contact"
      className="pt-16 pb-(--space-section) sm:pt-20"
    >
      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-h3 text-paper">Reach us directly</h2>
              <p className="mt-3 text-body text-mute">
                No sales desk in between. These go to the person who would run
                your project.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-8 border-t border-line">
                <ContactLink
                  href={whatsappLink()}
                  label="WhatsApp"
                  value={site.contact.phoneDisplay}
                  note="Fastest - usually answered same day"
                  event="whatsapp_click"
                  external
                />
                <ContactLink
                  href={mailtoLink()}
                  label="Email"
                  value={site.contact.email}
                  note="For briefs, documents and specs"
                  event="email_click"
                />
                <ContactLink
                  href={`tel:${site.contact.phoneE164}`}
                  label="Phone"
                  value={site.contact.phoneDisplay}
                  note={`${site.location.city} · IST (UTC+5:30)`}
                  event="cta_click"
                />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-10 border border-line p-6">
                <p className="label text-mute-deep">What happens next</p>
                <ol className="mt-5 grid gap-4">
                  {[
                    "We read it - every enquiry, not a filter.",
                    "A reply within one working day, usually with questions about the problem.",
                    "A 30-minute call to work out whether there is a project here.",
                    "If there is: a written scope, a fixed proposal, and a start date.",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-4 text-small text-mute">
                      <span className="label shrink-0 pt-0.5 text-ember">
                        0{i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-8 text-[0.8125rem] leading-relaxed text-mute-deep">
                Prefer to keep it confidential? Say so in the brief and we will
                sign an NDA before you share detail.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <EnquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
