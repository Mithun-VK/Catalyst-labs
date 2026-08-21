import type { Metadata } from "next";
import { site } from "./site";

/**
 * SEO metadata builder.
 *
 * Every route builds its metadata through this function, for one reason:
 * Next.js *replaces* an inherited `openGraph` object when a child route
 * declares its own, rather than merging it. Declaring `openGraph.url` on a
 * page therefore silently drops the file-based `opengraph-image` - which is
 * exactly what happened on 14 of 15 routes. Centralising the construction
 * makes that impossible to reintroduce.
 *
 * Budgets are enforced in development so an over-long tag fails loudly at the
 * point it is written, not months later in Search Console.
 */

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

export const OG_IMAGE = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${site.name} - software, AI and automation engineering`,
};

export type PageSeo = {
  /** Full <title>. Front-load the primary keyword; keep it under 60 chars. */
  title: string;
  /** Under 155 chars, written to earn the click rather than describe. */
  description: string;
  /** Route path with leading slash, e.g. "/services". "" for home. */
  path: string;
  /** Set false on legal/utility pages that need not rank. */
  index?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  index = true,
  type = "website",
}: PageSeo): Metadata {
  if (process.env.NODE_ENV !== "production") {
    if (title.length > TITLE_MAX) {
      console.warn(`[seo] title ${title.length}/${TITLE_MAX} chars - "${title}"`);
    }
    if (description.length > DESCRIPTION_MAX) {
      console.warn(
        `[seo] description ${description.length}/${DESCRIPTION_MAX} chars on "${path || "/"}"`
      );
    }
  }

  const url = `${site.url}${path}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path || "/" },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: true },
    openGraph: {
      type,
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/** Absolute URL helper for structured data. */
export const abs = (path = "") => `${site.url}${path}`;

/**
 * BreadcrumbList for any route below the root. Emitted as its own JSON-LD
 * block so it stays valid independently of the site-wide graph.
 */
export function breadcrumbSchema(
  trail: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "" },
      ...trail,
    ].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}
