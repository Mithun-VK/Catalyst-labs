import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use | Catalyst Labs",
  description:
    "The terms that apply to using the Catalyst Labs website, and how they relate to a signed client agreement.",
  path: "/terms",
  index: false,
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="August 2026">
      <LegalSection title="These terms">
        <p>
          By using this website you accept the terms below. They govern the
          website only. Client engagements are governed by a separate signed
          agreement, which takes precedence over anything on this page.
        </p>
      </LegalSection>

      <LegalSection title="What the site is">
        <p>
          Information about {site.legalName} and the work we do. Nothing on this
          site is a binding offer, a quotation, or professional advice for your
          specific situation. Scope, price and timelines are agreed in writing
          for each project.
        </p>
        <p>
          The reference architectures shown under Selected Builds describe
          systems we build. They are illustrative engineering, explicitly
          labelled as such, and are not descriptions of past client
          engagements.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The content, design, code and marks on this site belong to{" "}
          {site.legalName} unless stated otherwise. You may read, share and link
          to it. You may not republish it as your own or use our name and mark
          to represent your own services.
        </p>
      </LegalSection>

      <LegalSection title="Enquiries you send us">
        <p>
          Send only what you are comfortable sharing before an agreement is in
          place. We treat project details as confidential and do not pass them
          on, but a form submission is not a substitute for an NDA. If your
          project needs one, say so and we will sign one before you share
          detail.
        </p>
      </LegalSection>

      <LegalSection title="Availability and liability">
        <p>
          We aim to keep the site available and accurate, but provide it as-is.
          To the extent permitted by law, {site.legalName} is not liable for
          loss arising from use of this website or from reliance on its general
          information.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of India, with jurisdiction in
          the courts of {site.location.city}, {site.location.region}.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms:{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-ember underline underline-offset-4"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
