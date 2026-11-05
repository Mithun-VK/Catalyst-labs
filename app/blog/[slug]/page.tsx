import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { World } from "@/components/worlds/World";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassField } from "@/components/glass/GlassField";
import { GlassAurora } from "@/components/glass/GlassAurora";
import { CTABand } from "@/components/sections/CTABand";
import { InlineText } from "@/components/blog/InlineText";
import { posts, getPost, type Block } from "@/content/posts";
import { site } from "@/lib/site";
import { abs, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "h2":
      return (
        <h2 className="mt-11 text-[length:clamp(1.375rem,1rem+1.2vw,1.875rem)] font-medium leading-tight tracking-[-0.02em] text-paper">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mt-5 text-body leading-relaxed text-paper-dim">
          <InlineText text={block.text} />
        </p>
      );
    case "ul":
    case "ol": {
      const Tag = block.t;
      return (
        <Tag className="mt-5 grid gap-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-body leading-relaxed text-paper-dim">
              <span
                aria-hidden="true"
                className={
                  block.t === "ol"
                    ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember font-mono text-[0.6875rem] text-on-ember"
                    : "mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember"
                }
              >
                {block.t === "ol" ? i + 1 : null}
              </span>
              <span>
                <InlineText text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case "note":
      return (
        <aside className="glass-dark mt-8 p-6">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ember">{block.title}</p>
          <p className="mt-2 text-body text-paper">
            <InlineText text={block.text} />
          </p>
        </aside>
      );
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": abs(`/blog/${post.slug}#article`),
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        url: abs(`/blog/${post.slug}`),
        mainEntityOfPage: abs(`/blog/${post.slug}`),
        keywords: post.tags.join(", "),
        author: { "@id": abs("/#founder") },
        publisher: { "@id": abs("/#organization") },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs() },
          { "@type": "ListItem", position: 2, name: "Insights", item: abs("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: abs(`/blog/${post.slug}`) },
        ],
      },
    ],
  };

  return (
    <World id="atelier" className="bg-transparent">
      <JsonLd data={jsonLd} />
      <GlassAurora />
      <GlassField>
        <article aria-labelledby="post-title" className="relative pt-28 pb-16 sm:pt-36 sm:pb-20">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="text-small text-mute">
              <Link href="/blog" className="hover:text-ember">
                Insights
              </Link>{" "}
              <span aria-hidden="true">/</span> <span className="text-paper">{post.tags[0]}</span>
            </nav>

            <div className="glass mx-auto mt-6 max-w-3xl p-6 sm:p-10 lg:p-12">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                {post.tags.join(" · ")} · {post.readMinutes} min read
              </p>
              <h1
                id="post-title"
                className="mt-3 text-paper"
                style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.25rem)", lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: 500 }}
              >
                {post.title}
              </h1>
              <p className="mt-4 text-small text-mute">
                By {site.founder.name}, {site.founder.jobTitle}, {site.name} ·{" "}
                <time dateTime={post.date}>{fmt(post.date)}</time>
              </p>

              <div className="mt-6 border-t border-white/70 pt-2">
                {post.body.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </div>

              {post.related.length ? (
                <div className="glass-inset mt-10 p-5">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep">Related</p>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                    {post.related.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} className="text-small text-ember underline-offset-4 hover:underline">
                          {r.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {others.length ? (
              <div className="mx-auto mt-10 max-w-3xl">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-mute-deep">More insights</p>
                <ul className="mt-4 grid gap-3">
                  {others.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="glass glass-lift flex cursor-pointer items-center justify-between gap-4 p-5"
                      >
                        <span className="text-body font-medium text-paper">{p.title}</span>
                        <span aria-hidden="true" className="text-ember">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </article>

        <CTABand
          title="Want this applied to your business?"
          accent="Tell us about it."
          lead="Describe what you are trying to build, automate or improve. We will tell you what it would take, and whether we are the right team."
          location={`blog_${post.slug}`}
        />
      </GlassField>
    </World>
  );
}
