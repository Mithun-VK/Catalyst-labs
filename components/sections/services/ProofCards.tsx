import Image from "next/image";
import Link from "next/link";
import { projects, STATUS_LABEL } from "@/content/projects";
import { PlanetBadge } from "@/components/projects/ProjectVisual";
import { SvcHeading, SVC_SECTION } from "@/components/sections/services/SvcHeading";

/**
 * WORK - proof beside the services instead of a paragraph pointing at it.
 * Three projects with recorded headline numbers, each linking to its case
 * study where one exists, otherwise to the Works page.
 */
const SLUGS = ["inego", "safemerchant", "ark-angel"];

export function ProofCards() {
  const picks = SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section id="work" aria-labelledby="work-heading" className={SVC_SECTION}>
      <div className="container-page">
        <SvcHeading
          id="work-heading"
          index="05"
          eyebrow="Work"
          title="Built, tested, in production."
          aside={
            <Link href="/work" className="text-small text-ember underline-offset-4 hover:underline">
              All work →
            </Link>
          }
        />

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {picks.map((p) => {
            const stat = p.stats?.[0];
            const href = p.caseStudy ? `/work/${p.caseStudy}` : "/work";
            return (
              <li key={p.slug}>
                <Link
                  href={href}
                  className="glass glass-lift group flex h-full cursor-pointer flex-col overflow-hidden p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1.1rem] bg-white/50">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={`${p.name} homepage`}
                        fill
                        sizes="(min-width: 768px) 30vw, 92vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4">
                        <div className="w-28">
                          <PlanetBadge project={p} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3 pt-4">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-deep">
                      {p.domain} · {STATUS_LABEL[p.status]}
                    </p>
                    <p className="mt-1 text-h3 text-paper">{p.name}</p>
                    {stat ? (
                      <p className="mt-3 text-small text-mute">
                        <span className="text-[1.375rem] font-medium leading-none tracking-[-0.02em] text-paper">
                          {stat.value}
                        </span>{" "}
                        {stat.label}
                      </p>
                    ) : null}
                    <span className="mt-auto pt-4 text-small text-ember">
                      {p.caseStudy ? "Read the case study" : "See it on Works"}{" "}
                      <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
