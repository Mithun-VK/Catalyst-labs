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
    <LegalPage title="Privacy Policy" updated="August 2026">
      <LegalSection title="What this covers">
        <p>
          This policy explains what happens to information you share with{" "}
          {site.legalName} through this website. It applies to this site only,
          not to any product we build for a client.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>
          Only what you type into the enquiry form: your name, company, email,
          phone number, and the details of the project you describe. Nothing is
          collected from you passively beyond the standard request data your
          browser sends to our hosting provider (IP address, user agent,
          timestamp), which is used to keep the site available and to rate-limit
          form abuse.
        </p>
        <p>
          We do not use advertising cookies or cross-site trackers. If we add
          privacy-respecting analytics in future, this section will say so
          before it goes live.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          To reply to your enquiry and to have the conversation that follows.
          That is the only purpose. We do not sell, rent or share your details
          with third parties for marketing, and we do not add you to a mailing
          list you did not ask for.
        </p>
      </LegalSection>

      <LegalSection title="Where it goes">
        <p>
          Enquiries are delivered to our own email inbox, and may pass through
          the email delivery provider and hosting platform that run this site.
          Those providers process the data on our behalf, under their own
          security obligations.
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
          to ask what we hold about you, to correct it, or to have it deleted.
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
