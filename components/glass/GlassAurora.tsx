/**
 * The colour field that glass panes refract. Four large radial gradients (no
 * filter blur - a gradient already fades to nothing) drifting on slow,
 * transform-only loops. Fixed to the viewport so panes slide over it as the
 * page scrolls. Decorative: hidden from assistive tech, never receives
 * pointer events, and static under reduced motion (see glass.css).
 */
export function GlassAurora() {
  return (
    <div aria-hidden="true" className="glass-aurora">
      <span className="glass-blob b-teal" />
      <span className="glass-blob b-gold" />
      <span className="glass-blob b-lilac" />
      <span className="glass-blob b-blush" />
    </div>
  );
}
