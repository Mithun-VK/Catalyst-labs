import type { Metadata } from "next";
import Link from "next/link";
import { World } from "@/components/worlds/World";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassField } from "@/components/glass/GlassField";
import { GlassAurora } from "@/components/glass/GlassAurora";
import { CTABand } from "@/components/sections/CTABand";
import { posts } from "@/content/posts";
import { abs, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights on Software & AI Automation | Catalyst Labs",
  description:
    "Plain answers to the questions buyers ask about custom software, AI automation, pricing and choosing a development partner in Chennai and India.",
  path: "/blog",
});

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <World id="atelier" className="bg-transparent">
      <JsonLd data={breadcrumbSchema([{ name: "Insights", path: "/blog" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": abs("/blog#blog"),
          name: "Catalyst Labs Insights",
          url: abs("/blog"),
          publisher: { "@id": abs("/#organization") },
          blogPost: sorted.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: abs(`/blog/${p.slug}`),
            datePublished: p.date,
          })),
        }}
      />
      <GlassAurora />
      <GlassField>
        <section aria-labelledby="blog-heading" className="relative pt-28 pb-8 sm:pt-36">
          <div className="container-page">
            <p className="glass-chip inline-flex items-center gap-2.5 px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-paper">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember" />
              Insights
            </p>
            <h1
              id="blog-heading"
              className="mt-7 max-w-[20ch] text-paper"
              style={{ fontSize: "clamp(2.25rem, 1rem + 4vw, 4.25rem)", lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: 500 }}
            >
              Straight answers about building software.
            </h1>
            <p className="mt-6 max-w-[58ch] text-lead text-mute">
              The questions people ask before they commission software or AI
              automation, answered plainly. No invented numbers.
            </p>
          </div>
        </section>

        <section aria-label="Articles" className="relative pb-16 sm:pb-20">
          <div className="container-page">
            <ul className="grid gap-4 md:grid-cols-2">
              {sorted.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="glass glass-lift flex h-full cursor-pointer flex-col p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)] sm:p-7"
                  >
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                      {p.tags.join(" · ")} · {p.readMinutes} min read
                    </p>
                    <h2 className="mt-2 text-h3 text-paper">{p.title}</h2>
                    <p className="mt-2 text-small text-mute">{p.description}</p>
                    <p className="mt-auto pt-5 text-small text-ember">
                      Read the article <span aria-hidden="true">→</span>
                    </p>
                    <p className="mt-1 text-[0.75rem] text-mute-deep">
                      <time dateTime={p.date}>{fmt(p.date)}</time>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CTABand
          title="Have a question we have not answered?"
          accent="Ask us directly."
          lead="Describe what you are trying to build, automate or improve. We will tell you what it would take, and whether we are the right team."
          location="blog"
        />
      </GlassField>
    </World>
  );
}
