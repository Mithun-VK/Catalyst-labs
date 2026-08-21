import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] =
    [
      { path: "", priority: 1, freq: "monthly" },
      { path: "/services", priority: 0.9, freq: "monthly" },
      { path: "/work", priority: 0.9, freq: "monthly" },
      { path: "/ai", priority: 0.8, freq: "monthly" },
      { path: "/process", priority: 0.7, freq: "monthly" },
      { path: "/about", priority: 0.6, freq: "yearly" },
      { path: "/contact", priority: 0.9, freq: "yearly" },
      // /privacy and /terms are deliberately absent: both are served with
      // `noindex`, and submitting a noindex URL in a sitemap is reported by
      // Search Console as "Submitted URL marked 'noindex'" - an error, not a
      // warning. They stay crawlable and linked from the footer.
    ];

  const servicePages = services.map((service) => ({
    path: `/services/${service.id}`,
    priority: 0.8,
    freq: "monthly" as const,
  }));

  return [...routes, ...servicePages].map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
  }));
}
