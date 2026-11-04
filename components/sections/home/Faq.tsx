import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteFaqs } from "@/lib/faq";

/**
 * Plain-HTML answers to the questions a buyer (or an AI assistant answering
 * for one) asks first. Server-rendered, no client JS, and mirrored 1:1 into
 * FAQPage JSON-LD.
 */
export function Faq() {
  return (
    <Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: siteFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <div className="container-page">
        <div className="grid gap-x-(--space-gutter) gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="label text-mute-deep">FAQ</p>
            <h2 className="mt-4 text-h2 text-paper">
              Straight <span className="accent-word text-ember">answers</span>.
            </h2>
          </Reveal>
          <dl className="border-t border-line lg:col-span-7 lg:col-start-6">
            {siteFaqs.map((faq, i) => (
              <div key={faq.q} className="border-b border-line py-6">
                <Reveal delay={i * 40}>
                  <dt className="text-h3 text-paper">{faq.q}</dt>
                  <dd className="mt-3 max-w-2xl text-body text-mute">{faq.a}</dd>
                </Reveal>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
