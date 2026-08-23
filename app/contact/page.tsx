import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { World } from "@/components/worlds/World";
import { SystemHero } from "@/components/sections/contact/SystemHero";
import { ContactBody } from "@/components/sections/Contact";

export const metadata: Metadata = buildMetadata({
  title: "Contact Catalyst Labs: Start a Software or AI Project",
  description:
    "Tell us what you are trying to build, automate or improve. WhatsApp, email or a full brief - answered by the person who would run your project.",
  path: "/contact",
});

/**
 * CONTACT - the system world.
 *
 * The coldest, most technical page on the site, and the last of the five
 * worlds. Contact is where momentum either converts or is lost, so the page
 * is built as an interface: instrumentation at the top, three direct
 * channels, and the full brief for anyone who would rather write it once.
 *
 * The enquiry form itself is untouched. It already carries the validation,
 * the honeypot, the timing check and every field this page needs - rebuilding
 * it to match a visual idea would have risked the one flow on the site that
 * actually earns money.
 */
export default function ContactPage() {
  return (
    <World id="system">
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <SystemHero />
      <ContactBody />
    </World>
  );
}
