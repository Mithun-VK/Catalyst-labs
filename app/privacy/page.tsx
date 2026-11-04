import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Catalyst Labs",
  description:
    "What Catalyst Labs collects through this website, why, how long it is kept, and how to have it deleted.",
  path: "/privacy",
  index: false,
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <LegalSection title="What this covers">
        <p>
          This policy explains what happens to information you share with{" "}
          {site.legalName} through this website. It applies to this site only,
          not to any product we build for a client.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>
          What you type into the enquiry form: your name, company, email, phone
          number, country, time zone, preferred way to talk, budget band and
          currency, and the details of the project you describe. With the form
          we also record where you came from: the page you landed on, the
          referring site, and any utm_ or source tag in the link. This is kept
          in your browser&rsquo;s session storage for the visit and is not a
          cookie.
        </p>
        <p>
          Your hosting provider also receives standard request data (IP
          address, user agent, timestamp), which we use to keep the site
          available and to rate-limit form abuse.
        </p>
        <p>
          We do not use advertising cookies or cross-site trackers. Where
          configured, we use Plausible Analytics, a cookieless service that
          counts visits and button clicks without identifying individuals.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          To reply to your enquiry and to have the conversation that follows,
          including a short automatic acknowledgement email when you submit the
          form. The attribution details help us understand which channels bring
          useful enquiries. We do not sell, rent or share your details with
          third parties for marketing, and we do not add you to a mailing list
          you did not ask for.
        </p>
        <p>
          Our legal basis (GDPR and UK GDPR) is our legitimate interest in
          responding to enquiries you send us, and steps taken at your request
          before a contract. For India, we process this data with your consent
          given by submitting the form, under the Digital Personal Data
          Protection Act, 2023.
        </p>
      </LegalSection>

      <LegalSection title="Where it goes">
        <p>
          Enquiries are delivered to our own email inbox and processed on our
          behalf by Resend (email delivery), Vercel (hosting) and, where
          enabled, Plausible (analytics). Some of these providers operate
          outside India and outside your country, so your information may be
          transferred internationally. They process it under their own
          security and data-protection commitments.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          Enquiries are kept for as long as the conversation is active, and for
          up to 24 months afterwards so we can pick up where we left off. You
          can ask us to delete yours sooner at any time.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          Write to{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-ember underline underline-offset-4"
          >
            {site.contact.email}
          </a>{" "}
          to ask what we hold about you, to correct it, to object to its use, or to have it deleted.
          We will action the request within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          The site is served over HTTPS, form submissions are validated and
          rate-limited on the server, and no credentials or API keys are
          exposed to the browser. No system is perfectly secure, so please
          don&rsquo;t send passwords, card details or confidential documents
          through the enquiry form - we will arrange a secure channel when
          that&rsquo;s needed.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          {site.legalName}, {site.location.city}, {site.location.region},{" "}
          {site.location.country}. {site.registration.scheme} registration{" "}
          {site.registration.number}. Questions about this policy go to{" "}
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
