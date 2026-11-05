import { services } from "@/content/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";

/**
 * FAQ - the first question from each practice's own FAQ, as native
 * <details> disclosures (keyboard and screen-reader friendly with no
 * JavaScript), mirrored into FAQPage JSON-LD from the same data.
 */
export function ServicesFaq() {
  const faqs = services
    .map((s) => (s.faqs[0] ? { ...s.faqs[0], practice: s.title } : null))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <section id="faq" aria-labelledby="faq-heading" className={SVC_SECTION}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="container-page">
        <SvcHeading id="faq-heading" index="06" eyebrow="FAQ" title="Straight answers." />

        <div className="mt-8 grid items-start gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <details key={f.q} className="glass group p-0 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-ember)]">
                <span>
                  <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                    {f.practice}
                  </span>
                  <span className="mt-1 block text-body font-medium text-paper">{f.q}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/60 text-paper transition-transform duration-300 group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </summary>
              <p className="px-5 pb-5 text-small text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
