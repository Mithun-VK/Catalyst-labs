import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/content/testimonials";

/** Renders nothing until real, approved testimonials exist. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section
      aria-label="Client testimonials"
      className="border-t border-line py-(--space-section)"
    >
      <div className="container-page">
        <Reveal>
          <p className="label text-mute-deep">In their words</p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.projectSlug}-${t.name}`} delay={i * 60}>
              <figure className="h-full border border-line p-6 sm:p-8">
                <blockquote className="text-lead text-paper">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-small text-mute">
                  <span className="text-paper">{t.name}</span>, {t.role}, {t.company}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
