import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site, whatsappLink } from "@/lib/site";

/**
 * The closing conversion surface, shared by every page except Contact itself.
 * One headline, one primary action, one zero-friction alternative - the same
 * three every time, so the way out is never something a visitor has to look
 * for.
 */
export function CTABand({
  title = "Have a problem worth solving?",
  accent = "Let's build it.",
  lead = "Tell us what you're trying to build, automate or improve. If we're not the right people for it, we'll say so - and point you at who is.",
}: {
  title?: string;
  accent?: string;
  lead?: string;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden border-t border-line py-(--space-section)"
    >
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      {/* Gradient stops rather than a blur filter - see the note in Hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-ember) 0%, rgb(255 91 40 / 0.55) 34%, rgb(255 91 40 / 0.16) 62%, transparent 100%)",
        }}
      />

      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="cta-heading" className="text-h1 text-paper">
                {title}{" "}
                <span className="accent-word text-ember">{accent}</span>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 max-w-xl text-lead text-mute">{lead}</p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  arrow
                  event="cta_click"
                  eventProps={{ location: "cta_band", label: "start_a_project" }}
                  className="w-full sm:w-auto"
                >
                  Start a Project
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink()}
                  size="lg"
                  variant="secondary"
                  event="whatsapp_click"
                  eventProps={{ location: "cta_band" }}
                  className="w-full sm:w-auto"
                >
                  Message on WhatsApp
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <div className="border-t border-line">
              <Row label="Email" value={site.contact.email} />
              <Row label="Phone" value={site.contact.phoneDisplay} />
              <Row
                label="Based in"
                value={`${site.location.city}, ${site.location.country}`}
              />
              <Row label="Hours" value="Mon–Sat · IST (UTC+5:30)" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
      <span className="label shrink-0 text-mute-deep">{label}</span>
      <span className="text-right text-small text-paper-dim">{value}</span>
    </div>
  );
}
