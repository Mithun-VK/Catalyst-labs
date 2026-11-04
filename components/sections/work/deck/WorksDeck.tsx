import type { Project } from "@/content/projects";
import { PosterCard } from "@/components/sections/work/deck/PosterCard";
import { WorksRail } from "@/components/sections/work/deck/WorksRail";
import "@/components/sections/work/deck/deck.css";

/**
 * WORKS DECK - the lead projects as a stack of full-colour posters.
 *
 * One responsive component for every screen size. Scrolling is native: on a
 * wide, tall viewport each poster sticks and the next slides over it (pure
 * CSS, see deck.css); on phones, tablets and short windows the posters are
 * ordinary stacked blocks. The number rail jumps between projects at every
 * size. Nothing here pins or hijacks the scroll.
 */
export function WorksDeck({ projects }: { projects: Project[] }) {
  return (
    <section id="works-deck" aria-labelledby="deck-heading" className="deck relative">
      <h2 id="deck-heading" className="sr-only">
        Selected projects
      </h2>

      <WorksRail items={projects.map((p) => ({ slug: p.slug, name: p.name }))} />

      {projects.map((project, i) => (
        <PosterCard key={project.slug} project={project} index={i} />
      ))}
    </section>
  );
}
