import Image from "next/image";
import type { Project } from "@/content/projects";
import { PlanetBadge } from "@/components/projects/ProjectVisual";

/**
 * The visual half of a poster.
 *
 *  - A project with a real screenshot gets it in a browser frame. When more
 *    real screenshots exist (`gallery`), two of them fan out behind the main
 *    one like printed proofs.
 *  - Everything else (an API, a research stack) keeps the generated mark,
 *    scaled up. A screenshot of something nobody can visit would not be
 *    evidence, so none is faked.
 */

function Frame({
  src,
  alt,
  host,
  className = "",
  aspect = "aspect-[16/10]",
  priority = false,
  position = "object-top",
}: {
  src: string;
  alt: string;
  host?: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <div
      className={`comic-panel relative overflow-hidden bg-ink-raised ${className}`}
      style={{ "--comic-offset": "7px" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 border-b-2 border-paper/70 bg-ink px-3 py-2">
        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        {host ? (
          <span className="flex-1 truncate rounded-full border border-paper/25 bg-ink-raised/60 px-3 py-0.5 text-center font-mono text-[0.625rem] text-mute">
            {host}
          </span>
        ) : null}
      </div>
      <div className={`relative w-full ${aspect}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 40vw, 92vw"
          priority={priority}
          className={`object-cover ${position}`}
        />
      </div>
    </div>
  );
}

export function DeckVisual({
  project,
  priority,
}: {
  project: Project;
  priority: boolean;
}) {
  const host = project.href?.replace(/^https?:\/\//, "");

  if (!project.image) {
    return (
      <div className="mx-auto w-full max-w-[17rem] md:max-w-[20rem]">
        <div className="origin-center scale-110 md:scale-125">
          <PlanetBadge project={project} />
        </div>
      </div>
    );
  }

  const fan = project.gallery?.slice(0, 2) ?? [];
  const hasFan = fan.length > 0;
  const mainPosition = hasFan ? "object-center" : "object-top";

  return (
    <div className={`relative mx-auto w-full max-w-[34rem] ${hasFan ? "pb-14 sm:pb-16" : ""}`}>
      <Frame
        src={project.image}
        alt={`${project.name} homepage`}
        host={host}
        priority={priority}
        position={mainPosition}
        className="relative z-10 rotate-[-1deg]"
      />

      {fan[0] ? (
        <div className="deck-fan-a absolute -bottom-1 -left-3 z-20 w-[52%] sm:-left-6">
          <Frame
            src={fan[0].src}
            alt={fan[0].alt}
            aspect="aspect-[2/1]"
            position="object-top"
          />
        </div>
      ) : null}
      {fan[1] ? (
        <div className="deck-fan-b absolute -bottom-4 -right-3 z-20 w-[48%] sm:-right-6">
          <Frame
            src={fan[1].src}
            alt={fan[1].alt}
            aspect="aspect-[2/1]"
            position="object-top"
          />
        </div>
      ) : null}
    </div>
  );
}
