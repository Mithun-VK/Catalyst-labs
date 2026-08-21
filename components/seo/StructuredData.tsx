import { site } from "@/lib/site";
import { abs } from "@/lib/seo";
import { services } from "@/content/services";
import { JsonLd } from "./JsonLd";

/**
 * Site-wide structured data.
 *
 * Every statement here is one the site can stand behind - no aggregateRating,
 * no review markup, no employee counts, no invented awards.
 *
 * `ProfessionalService` (a subtype of LocalBusiness) is used rather than plain
 * Organization so the Chennai service area is expressed properly, but with no
 * `address.streetAddress`: the registered address is a private residence, and
 * publishing a street address we would not want visitors turning up at would
 * be worse than omitting it. City, region and country are accurate.
 */
export function StructuredData() {
  const organization = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": abs("/#organization"),
    name: site.name,
    legalName: site.legalName,
    url: abs(),
    description: site.description,
    slogan: site.tagline,
    foundingDate: site.founded,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    priceRange: "$$",
    logo: {
      "@type": "ImageObject",
      url: abs("/logo.png"),
      width: 512,
      height: 512,
      caption: site.name,
    },
    image: abs("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.countryCode,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Udyam Registration Number",
      value: site.registration.number,
    },
    areaServed: [
      { "@type": "City", name: site.location.city },
      { "@type": "State", name: site.location.region },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Website design and development",
      "Custom software development",
      "Artificial intelligence",
      "Business process automation",
      "Web application development",
      "Mobile application development",
      "SaaS product development",
      "API and systems integration",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.contact.email,
      telephone: site.contact.phoneE164,
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
    ...(Object.values(site.social).some(Boolean)
      ? { sameAs: Object.values(site.social).filter(Boolean) }
      : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: abs(),
    name: site.name,
    description: site.shortDescription,
    publisher: { "@id": abs("/#organization") },
    inLanguage: "en-IN",
    // No SearchAction: the site has no internal search, and declaring one
    // that does not exist is a malformed-markup penalty waiting to happen.
  };

  const serviceEntities = services.map((service) => ({
    "@type": "Service",
    "@id": abs(`/services/${service.id}#service`),
    name: service.title,
    description: service.seoDescription,
    serviceType: service.title,
    url: abs(`/services/${service.id}`),
    provider: { "@id": abs("/#organization") },
    areaServed: [
      { "@type": "City", name: site.location.city },
      { "@type": "Country", name: "India" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} deliverables`,
      itemListElement: service.deliverables.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  }));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [organization, website, ...serviceEntities],
      }}
    />
  );
}
