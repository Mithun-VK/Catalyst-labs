import type { Metadata } from "next";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader, MetaList } from "@/components/ui/PageHeader";
import { ContactBody } from "@/components/sections/Contact";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project | Catalyst Labs, Chennai",
  description:
    "Tell us what you want built, automated or improved. Read by the person who would run your project, with a reply within one working day.",
  path: "/contact",
});

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${site.name}`,
    url: `${site.url}/contact`,
    mainEntity: { "@id": `${site.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        index="06"
        eyebrow="Start a project"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title={
          <>
            Have a problem worth{" "}
            <span className="accent-word text-ember">solving</span>? Let&rsquo;s
            build it.
          </>
        }
        lead="Tell us what you're trying to build, automate or improve. If we're not the right people for it, we'll say so - and point you at who is."
        meta={
          <MetaList
            items={[
              { label: "Response", value: "Within one working day" },
              { label: "Read by", value: "The person running your project" },
              { label: "Hours", value: "Mon–Sat · IST (UTC+5:30)" },
              { label: "NDA", value: "On request, before detail" },
            ]}
          />
        }
      />

      <ContactBody />
    </>
  );
}
