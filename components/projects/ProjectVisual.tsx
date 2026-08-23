import Image from "next/image";
import { type Project } from "@/content/projects";
import { ProjectGlyph, glyphForDomain } from "@/components/projects/ProjectGlyph";

/**
 * The two project mark treatments, shared between PosterIndex (the
 * mobile/tablet presentation) and the desktop WorksShowcase - extracted from
 * PosterIndex so the pinned scroll experience animates the exact same
 * markup and real assets rather than a re-creation of them.
 *
 * See PosterIndex.tsx for the reasoning behind the split: a project with a
 * real public site (`project.image`) gets BrowserFrame; anything else keeps
 * the circular PlanetBadge and its generated glyph.
 *
 * `data-gsap` attributes are inert without JavaScript (no matching CSS rule)
 * and are only ever queried by the desktop showcase controller - they add no
 * behaviour here and cost nothing on the zero-JS mobile path.
 */

export function PlanetBadge({ project }: { project: Project }) {
  return (
    <div
      data-bob
      className="planet-badge mx-auto aspect-square w-full max-w-[15rem] bg-ink-raised/40 p-8 transition-transform duration-(--duration-slow) ease-(--ease-out-quart) group-hover:-rotate-3 sm:p-10"
    >
      <div data-gsap="ring-outer" className="planet-badge-glow" aria-hidden="true" />
      <span data-gsap="ring-sweep" className="badge-sweep" aria-hidden="true" />

      <div data-gsap="glyph" className="h-full w-full">
        <ProjectGlyph kind={glyphForDomain(project.domain)} />
      </div>

      <span aria-hidden="true" className="orbit-dot -right-1.5 top-6 h-3.5 w-3.5" />
      <span
        aria-hidden="true"
        className="orbit-dot -left-2 bottom-9 h-2 w-2 opacity-70"
      />
      <span
        aria-hidden="true"
        className="orbit-dot right-3 -bottom-1 h-1.5 w-1.5 opacity-50"
      />
    </div>
  );
}

export function BrowserFrame({ project }: { project: Project }) {
  const host = project.href?.replace(/^https?:\/\//, "") ?? "";

  return (
    <div className="relative mx-auto w-full max-w-[20rem]">
      <div data-gsap="ring-outer" className="browser-frame-glow" aria-hidden="true" />

      <div
        data-gsap="frame"
        className="comic-panel comic-panel-hover relative overflow-hidden bg-ink-raised transition-transform duration-(--duration-slow) ease-(--ease-out-quart) group-hover:-rotate-1"
        style={{ "--comic-offset": "6px" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2 border-b-2 border-paper/70 bg-ink px-3.5 py-2.5">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex-1 truncate rounded-full border border-paper/25 bg-ink-raised/60 px-3 py-1 text-center font-mono text-[0.625rem] text-mute">
            {host}
          </span>
        </div>

        <div data-gsap="image" className="relative aspect-[16/10] w-full">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} homepage`}
              fill
              sizes="(min-width: 1024px) 33vw, 90vw"
              className="object-cover object-top"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
