"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/projects";
import { ProjectPanel } from "@/components/sections/work/showcase/ProjectPanel";
import { ProjectNumberNav } from "@/components/sections/work/showcase/ProjectNumberNav";

/**
 * WORKS SHOWCASE - the desktop (>=1024px) pinned case-study cinema.
 *
 * Pins the viewport for one scroll pass across every project: each panel
 * enters (colour field wipes clear, then number/meta/title/visual/proof/tech
 * cascade in), holds, then compresses while a brief BUILT./TESTED./
 * DEPLOYED./LIVE. sequence plays, before the next panel's turn begins. The
 * whole thing is driven by ONE ScrollTrigger with `scrub`, so it is scroll
 * POSITION, not time - the visitor sets the pace by how fast they scroll,
 * and scrolling back up runs every stage in exact reverse.
 *
 * ARCHITECTURE. React only ever renders the markup (ProjectPanel,
 * ProjectNumberNav) - see those files for the `data-role` / `data-gsap`
 * contract. This file's job is purely to read the current scroll progress
 * and WRITE values onto that markup with gsap.set(); nothing here is a
 * timeline or a tween, so a rapid scroll flick never leaves an animation
 * "still catching up" - every frame is computed fresh from
 * `ScrollTrigger`'s own progress, which is what makes fast/slow/reverse
 * scrolling all correct for free.
 *
 * GATING. `ScrollTrigger.matchMedia` runs this ENTIRE setup only under
 * `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`. Outside
 * that - on a narrower viewport (this component is hidden there anyway, see
 * app/work/page.tsx) or with reduced motion requested - none of this ever
 * executes, and the panels stay in their default server-rendered state:
 * ordinary block-level sections, fully visible, in document order. matchMedia
 * also handles the live case of the query starting or stopping matching
 * (a resize crossing 1024px, or the OS reduced-motion toggle changing) by
 * automatically reverting everything this function sets up.
 */
export function WorksShowcase({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const panelEls = gsap.utils.toArray<HTMLElement>("[data-panel]", section);
        const panels = panelEls.map(buildPanelRefs);
        const numberItems = gsap.utils.toArray<HTMLElement>(
          "[data-number-item]",
          section
        );
        const progressLine = section.querySelector<HTMLElement>(
          "[data-progress-line]"
        );

        gsap.set(pin, { position: "relative", height: "100vh", overflow: "hidden" });

        panels.forEach((p) => {
          gsap.set(p.root, {
            position: "absolute",
            inset: 0,
            opacity: 0,
            pointerEvents: "none",
          });
          p.glyphPoints.forEach((pt) =>
            gsap.set(pt, { transformOrigin: "50% 50%", transformBox: "fill-box" })
          );
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // More scroll distance per project than it first reads as too little
          // (2.2x viewport height): the same physical scroll gesture now
          // covers less of the total reveal, which is what actually reads as
          // "smoother" - scrub alone can't fix a track that's simply too
          // short for how much is happening on it.
          end: () => "+=" + panels.length * window.innerHeight * 2.2,
          pin,
          // A number, not `true`: the animation state chases the scroll
          // position with this many seconds of catch-up easing instead of
          // snapping to it every frame - the difference between a scrubber
          // that feels driven and one that feels directly grabbed.
          scrub: 1.4,
          anticipatePin: 1,
          onUpdate: (self) =>
            applyProgress(self.progress, panels, numberItems, progressLine),
        });

        applyProgress(trigger.progress, panels, numberItems, progressLine);

        return () => trigger.kill();
      }
    );

    return () => mm.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} aria-labelledby="works-showcase-heading" className="relative">
      <h2 id="works-showcase-heading" className="sr-only">
        Selected projects
      </h2>
      <div ref={pinRef} className="relative min-h-screen">
        <ProjectNumberNav count={projects.length} />
        {projects.map((project, i) => (
          <ProjectPanel key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   Element cache
   ========================================================================== */

type MetricRowRef = {
  el: HTMLElement;
  valueEl: HTMLElement | null;
  target: number;
  decimals: number;
};

type PanelRefs = {
  root: HTMLElement;
  contentWrap: HTMLElement | null;
  mask: HTMLElement | null;
  number: HTMLElement | null;
  meta: HTMLElement | null;
  titleInner: HTMLElement | null;
  titleGhost: HTMLElement | null;
  visualRoot: HTMLElement | null;
  frame: HTMLElement | null;
  image: HTMLElement | null;
  ringOuter: HTMLElement | null;
  ringSweep: HTMLElement | null;
  glyphGrid: HTMLElement | null;
  glyphPaths: HTMLElement[];
  glyphPoints: HTMLElement[];
  liveStamp: HTMLElement | null;
  description: HTMLElement | null;
  metricRows: MetricRowRef[];
  techPills: HTMLElement[];
  cta: HTMLElement | null;
  impactWords: HTMLElement[];
  blueprint: HTMLElement | null;
  blueprintPath: HTMLElement | null;
  blueprintLabels: HTMLElement[];
};

function buildPanelRefs(root: HTMLElement): PanelRefs {
  const metricRows: MetricRowRef[] = gsap
    .utils.toArray<HTMLElement>("[data-metric-row]", root)
    .map((row) => {
      const valueEl = row.querySelector<HTMLElement>("[data-metric-value]");
      return {
        el: row,
        valueEl,
        target: valueEl ? Number(valueEl.dataset.target) : 0,
        decimals: valueEl ? Number(valueEl.dataset.decimals) : 0,
      };
    });

  return {
    root,
    contentWrap: root.querySelector('[data-gsap="content-wrap"]'),
    mask: root.querySelector('[data-gsap="field-mask"]'),
    number: root.querySelector('[data-role="number"]'),
    meta: root.querySelector('[data-role="meta"]'),
    titleInner: root.querySelector('[data-gsap="title-inner"]'),
    titleGhost: root.querySelector('[data-gsap="title-ghost"]'),
    visualRoot: root.querySelector('[data-role="visual"]'),
    frame: root.querySelector('[data-gsap="frame"]'),
    image: root.querySelector('[data-gsap="image"]'),
    ringOuter: root.querySelector('[data-gsap="ring-outer"]'),
    ringSweep: root.querySelector('[data-gsap="ring-sweep"]'),
    glyphGrid: root.querySelector('[data-gsap="glyph-grid"]'),
    glyphPaths: gsap.utils.toArray('[data-gsap="glyph-path"]', root),
    glyphPoints: gsap.utils.toArray('[data-gsap="glyph-point"]', root),
    liveStamp: root.querySelector('[data-gsap="live-stamp"]'),
    description: root.querySelector('[data-role="description"]'),
    metricRows,
    techPills: gsap.utils.toArray('[data-role="tech"] > li', root),
    cta: root.querySelector('[data-role="cta"]'),
    impactWords: gsap.utils.toArray("[data-impact-word]", root),
    blueprint: root.querySelector("[data-blueprint]"),
    blueprintPath: root.querySelector("[data-blueprint-path]"),
    blueprintLabels: gsap.utils.toArray("[data-blueprint-label]", root),
  };
}

/* ==========================================================================
   Frame-by-frame progress application
   ========================================================================== */

/** Local progress spent entering, before the long hold. */
const ENTER_END = 0.12;
/**
 * Local progress where the hold ends and the exit/impact sequence begins.
 * Combined with the wider per-project scroll track above, this gives the
 * hold roughly 2.5x the scroll distance it had before - the metrics, tech
 * stack and CTA now sit fully settled and readable for a real stretch of
 * scrolling instead of arriving just in time to compress away again.
 */
const EXIT_START = 0.8;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Remaps `t` from the window [a, b] to [0, 1], clamped. */
function sub(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function applyProgress(
  progress: number,
  panels: PanelRefs[],
  numberItems: HTMLElement[],
  progressLine: HTMLElement | null
) {
  const N = panels.length;
  if (N === 0) return;

  const overall = clamp01(progress);
  const floatIndex = overall * N;
  const active = Math.min(N - 1, Math.floor(floatIndex));
  const t = clamp01(floatIndex - active);

  panels.forEach((p, i) => {
    if (i === active) {
      setPanelActive(p, t);
    } else {
      gsap.set(p.root, { opacity: 0, pointerEvents: "none" });
    }
  });

  numberItems.forEach((el, i) => {
    const isActive = i === active;
    gsap.set(el, { opacity: isActive ? 1 : 0.4, scale: isActive ? 1.35 : 1 });
  });

  if (progressLine) gsap.set(progressLine, { height: `${overall * 100}%` });
}

function setPanelActive(p: PanelRefs, t: number) {
  gsap.set(p.root, { opacity: 1, pointerEvents: "auto" });

  if (t <= ENTER_END) {
    applyEnter(p, easeOut(sub(t, 0, ENTER_END)));
    applyExit(p, 0);
  } else if (t < EXIT_START) {
    applyEnter(p, 1);
    applyExit(p, 0);
  } else {
    applyEnter(p, 1);
    applyExit(p, sub(t, EXIT_START, 1));
  }
}

/** e: 0 = not yet entered, 1 = fully settled. */
function applyEnter(p: PanelRefs, e: number) {
  if (p.mask) gsap.set(p.mask, { clipPath: `inset(0 ${e * 100}% 0 0)` });

  if (p.number) {
    const eNum = sub(e, 0.05, 0.55);
    gsap.set(p.number, { opacity: eNum, x: -40 * (1 - eNum), scale: 1.15 - 0.15 * eNum });
  }

  if (p.meta) {
    const eMeta = sub(e, 0.15, 0.65);
    gsap.set(p.meta, { opacity: eMeta, y: 12 * (1 - eMeta) });
  }

  const eTitle = sub(e, 0.2, 0.85);
  if (p.titleInner) gsap.set(p.titleInner, { y: `${(1 - eTitle) * 100}%` });
  if (p.titleGhost) {
    const eGhost = sub(e, 0.75, 1);
    const gate = clamp01(eTitle * 8);
    gsap.set(p.titleGhost, {
      opacity: (1 - eGhost) * 0.5 * gate,
      x: (1 - eGhost) * -2,
      y: (1 - eGhost) * 2,
    });
  }

  applyVisual(p, sub(e, 0.3, 1));

  if (p.description) {
    const eDesc = sub(e, 0.4, 0.9);
    gsap.set(p.description, { opacity: eDesc, y: 20 * (1 - eDesc) });
  }

  p.metricRows.forEach((row, i) => {
    const eRow = sub(e, 0.45 + i * 0.08, 0.85 + i * 0.08);
    gsap.set(row.el, { opacity: eRow, y: 10 * (1 - eRow) });
    if (row.valueEl) row.valueEl.textContent = (row.target * eRow).toFixed(row.decimals);
  });

  p.techPills.forEach((el, i) => {
    const eP = sub(e, 0.55 + i * 0.04, 0.85 + i * 0.04);
    gsap.set(el, { opacity: eP, y: 6 * (1 - eP) });
  });

  if (p.cta) {
    const eCta = sub(e, 0.8, 1);
    gsap.set(p.cta, { opacity: eCta, y: 10 * (1 - eCta) });
  }

  if (p.liveStamp) {
    const eStamp = sub(e, 0.82, 1);
    gsap.set(p.liveStamp, {
      opacity: eStamp,
      scale: 1.15 - 0.15 * eStamp,
      rotate: -3 + 3 * eStamp,
    });
  }
}

/** e: 0 = not yet visible, 1 = fully revealed - shared by every visual type. */
function applyVisual(p: PanelRefs, e: number) {
  if (p.visualRoot) gsap.set(p.visualRoot, { opacity: e, scale: 0.94 + 0.06 * e });

  // Browser-frame projects: the screenshot wipes in left-to-right.
  if (p.image) gsap.set(p.image, { clipPath: `inset(0 0 0 ${(1 - e) * 100}%)` });

  // Planet-badge projects: outer ring, sweep, grid, then the signature path.
  if (p.ringOuter) gsap.set(p.ringOuter, { opacity: 0.15 * clamp01(e * 1.4) });
  if (p.ringSweep) gsap.set(p.ringSweep, { opacity: 0.28 * sub(e, 0.2, 1) });
  if (p.glyphGrid) gsap.set(p.glyphGrid, { opacity: 0.18 * sub(e, 0.15, 0.65) });

  if (p.glyphPaths.length) {
    const eDraw = sub(e, 0.35, 1);
    const n = p.glyphPaths.length;
    p.glyphPaths.forEach((path, i) => {
      const local = clamp01(eDraw * n - i);
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 - local });
    });
  }

  if (p.glyphPoints.length) {
    const ePoint = sub(e, 0.85, 1);
    p.glyphPoints.forEach((pt) => gsap.set(pt, { opacity: ePoint, scale: 0.4 + 0.6 * ePoint }));
  }
}

/**
 * x: 0 = holding, 1 = fully compressed and handed off to the next project.
 * Compresses `contentWrap` only, NOT `p.root` - the impact words and the
 * blueprint overlay are siblings of contentWrap (see ProjectPanel.tsx), so
 * they stay at their own full, independent opacity instead of compounding
 * with a fading ancestor. Without this split, "DEPLOYED." read as a faint
 * grey ghost right when it should be the boldest thing on screen.
 */
function applyExit(p: PanelRefs, x: number) {
  if (p.contentWrap)
    gsap.set(p.contentWrap, {
      scaleY: 1 - 0.9 * x,
      opacity: 1 - x,
      transformOrigin: "top center",
    });

  const n = p.impactWords.length;
  p.impactWords.forEach((el, i) => {
    if (n === 0) return;
    const start = i / n;
    const end = (i + 1) / n;
    const local = sub(x, start, end);
    let op: number;
    if (local <= 0.35) op = local / 0.35;
    else if (local < 0.65) op = 1;
    else op = 1 - (local - 0.65) / 0.35;
    const within = x > start && x < end ? op : 0;
    gsap.set(el, { opacity: within, scale: 0.92 + 0.08 * Math.min(1, within * 1.3) });
  });

  if (p.blueprint) {
    const bpOp = x < 0.5 ? sub(x, 0.02, 0.32) : 1 - sub(x, 0.65, 1);
    gsap.set(p.blueprint, { opacity: bpOp * 0.9 });
    if (p.blueprintPath)
      gsap.set(p.blueprintPath, { strokeDasharray: 1, strokeDashoffset: 1 - sub(x, 0, 0.6) });
    p.blueprintLabels.forEach((el, i) => {
      gsap.set(el, { opacity: sub(x, i * 0.08, i * 0.08 + 0.35) });
    });
  }
}
