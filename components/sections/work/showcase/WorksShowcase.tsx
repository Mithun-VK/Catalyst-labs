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
 * DEPLOYED./LIVE. sequence plays, before the next panel's turn begins.
 *
 * ARCHITECTURE. React only ever renders the markup (ProjectPanel,
 * ProjectNumberNav) - see those files for the `data-role` / `data-gsap`
 * contract. This file's job is purely to read the current scroll progress
 * and WRITE values onto that markup every frame.
 *
 * PERFORMANCE. The per-frame path (applyProgress -> setPanelActive ->
 * applyEnter/applyVisual/applyExit) writes DIRECTLY to `element.style`
 * instead of calling `gsap.set()`. This is deliberate, not a style
 * preference: every value here is already hand-computed from scroll
 * progress, so gsap.set()'s job on each call - parsing the vars object,
 * resolving each property through GSAP's CSS plugin, normalizing units - is
 * pure overhead with nothing behind it to justify the cost, multiplied by
 * every property on every element, every frame. `gsap` itself is still used
 * for what it is actually good at: ScrollTrigger's pin/scroll-distance
 * math, and the couple of one-time setup calls below that never run in the
 * hot path. Two more choices follow from the same goal:
 *   - `clip-path` reveals (the colour-field mask, the screenshot wipe) are
 *     `transform: translate3d()` curtains instead - clip-path forces a
 *     repaint of the clipped region on every change; translate3d is
 *     compositor-only.
 *   - Panels and number-rail items that are NOT the active one are only
 *     touched on the FRAME THE ACTIVE INDEX CHANGES (see `activeState`
 *     below), not every frame - there is no reason to re-write "opacity: 0"
 *     to five idle panels sixty times a second.
 * Together these are what keep a fast scroll flick from dropping frames:
 * the earlier version measurably fell behind (visible stutter) once the
 * catch-up loop below was running continuously during a flick, which is
 * exactly the condition that turns per-frame cost from "fine" into "lag".
 *
 * GATING. `gsap.matchMedia` runs this ENTIRE setup only under
 * `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`. Outside
 * that - on a narrower viewport (this component is hidden there anyway, see
 * app/work/page.tsx) or with reduced motion requested - none of this ever
 * executes, and the panels stay in their default server-rendered state:
 * ordinary block-level sections, fully visible, in document order.
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

    // Queried once, unconditionally - both the pinned setup below AND the
    // number-rail click handling need these regardless of which matchMedia
    // branch is currently active (or whether either is: a click still has to
    // work under reduced motion, where the pin never engages).
    const panelEls = gsap.utils.toArray<HTMLElement>("[data-panel]", section);
    const numberItems = gsap.utils.toArray<HTMLElement>("[data-number-item]", section);

    /* ---- number-rail navigation --------------------------------------
       `pinState.trigger` is only non-null while the pinned ScrollTrigger
       below is alive, so a click always knows which scroll math applies:
       pinned (jump within the pin's own scroll track, computed the same
       way the track itself was built) or plain document flow (reduced
       motion / narrower than 1024px, where each panel just sits in normal
       flow and a native scroll-into-view is correct). Both branches use an
       INSTANT jump, not a smooth one: within the pin, the section's own
       position never moves (that is what pinning means) - only which
       project is active changes, and the render loop's own catch-up easing
       (below) already animates that landing exactly as it would for a fast
       manual scroll. A native smooth-scroll running at the same time would
       just be a second, competing easing curve on top of that. */
    const pinState: { trigger: ScrollTrigger | null } = { trigger: null };

    const scrollToProject = (index: number) => {
      const trigger = pinState.trigger;
      if (trigger) {
        const segment = (trigger.end - trigger.start) / panelEls.length;
        // Lands mid-hold (see the SEGMENT BUDGET note below) rather than
        // exactly at the project's first frame, so it opens already settled
        // and readable instead of mid-entrance.
        const target = trigger.start + index * segment + segment * 0.32;
        window.scrollTo(0, target);
      } else {
        panelEls[index]?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    };

    const numberClickHandlers = numberItems.map((el, i) => {
      const handler = () => scrollToProject(i);
      el.addEventListener("click", handler);
      return handler;
    });

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const panels = panelEls.map(buildPanelRefs);
        const progressLine = section.querySelector<HTMLElement>(
          "[data-progress-line]"
        );
        const activeState = { index: -1 };

        // One-time setup only - none of this runs again in the hot path.
        gsap.set(pin, { position: "relative", height: "100vh", overflow: "hidden" });

        panels.forEach((p) => {
          gsap.set(p.root, {
            position: "absolute",
            inset: 0,
            opacity: 0,
            pointerEvents: "none",
          });
          if (p.contentWrap) p.contentWrap.style.transformOrigin = "top center";
          // Opaque only here - see the opacity-0 default on the curtain
          // itself in ProjectVisual.tsx for why that default exists.
          if (p.imageCurtain) p.imageCurtain.style.opacity = "1";
          p.glyphPoints.forEach((pt) => {
            pt.style.transformOrigin = "50% 50%";
            pt.style.transformBox = "fill-box";
          });
        });

        /* ---- catch-up smoothing -------------------------------------
           `applyProgress` is driven by a progress value that EASES toward
           the scroll position instead of equalling it, so a fast flick
           plays through the intermediate states on its way rather than
           teleporting past them. This is what makes the transition words
           survive a quick scroll: they are positioned in scroll space, and
           without this, a 1000px gesture crosses all four of them inside a
           single frame.

           It has to be done by hand. `scrub` does NOT do this here: scrub
           smooths the playhead of an ATTACHED animation, and this component
           has none - it reads `self.progress` and writes styles directly.
           `self.progress` is the raw scroll position and is never scrubbed.

           Lag is proportional to scroll velocity, which is the point: at a
           normal reading pace the rendered value sits right on the scroll
           position and nothing feels delayed, while a flick gets ~0.8s of
           playthrough. */
        const SMOOTH = 0.085; // per frame; ~0.5s to cover 95% of a small jump
        /* Ceiling on how much progress a single frame may advance.
           A plain exponential lerp front-loads badly: it covers most of a
           big jump in the first few frames and then crawls into the target,
           so the words at the START of a flick flash past in ~2 frames while
           the LAST one sits on screen for three seconds. Capping the rate
           makes a long traversal play at a roughly even speed, giving every
           word a comparable turn, and the exponential above still takes over
           for the final soft landing. */
        const MAX_STEP = 0.002;
        let targetP = 0;
        let renderP = 0;
        let raf = 0;

        const render = () => {
          const delta = targetP - renderP;
          /* Settle threshold, in progress units. ~0.0001 is under two pixels
             of scroll across the whole section - far below anything visible.
             It has to be this loose: an exponential tail chasing a much
             tighter target spends over a second crawling through changes
             nobody can see, which delays the settle and burns frames for
             nothing. */
          if (Math.abs(delta) < 0.0001) {
            renderP = targetP;
            applyProgress(renderP, panels, numberItems, progressLine, activeState);
            raf = 0;
            return;
          }
          const step = delta * SMOOTH;
          renderP += Math.max(-MAX_STEP, Math.min(MAX_STEP, step));
          applyProgress(renderP, panels, numberItems, progressLine, activeState);
          raf = requestAnimationFrame(render);
        };
        const kick = () => {
          if (!raf) raf = requestAnimationFrame(render);
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // 3.2x viewport height per project. The figure is set by the
          // narrowest thing on the track rather than by feel: each transition
          // word has to stay legible for longer than one wheel tick (~100px),
          // or a single ordinary scroll gesture steps straight over one and
          // the visitor never sees it. See the budget note above EXIT_START
          // for how a segment is divided.
          end: () => "+=" + panels.length * window.innerHeight * 3.2,
          pin,
          /* Deliberately NO `scrub`. It smooths an attached animation's
             playhead; with a direct-write implementation like this one it
             changes nothing except which tick onUpdate fires on. The
             catch-up easing this section needs is the `render` loop above,
             which is real and measurable. */
          anticipatePin: 1,
          onUpdate: (self) => {
            targetP = self.progress;
            kick();
          },
        });

        // First paint lands on the current scroll position exactly, with no
        // ease-in from zero.
        targetP = trigger.progress;
        renderP = trigger.progress;
        applyProgress(renderP, panels, numberItems, progressLine, activeState);

        pinState.trigger = trigger;

        return () => {
          pinState.trigger = null;
          if (raf) cancelAnimationFrame(raf);
          trigger.kill();
        };
      }
    );

    return () => {
      mm.revert();
      numberItems.forEach((el, i) => el.removeEventListener("click", numberClickHandlers[i]));
    };
  }, [projects]);

  return (
    <section ref={sectionRef} aria-labelledby="works-showcase-heading" className="relative">
      <h2 id="works-showcase-heading" className="sr-only">
        Selected projects
      </h2>
      <div ref={pinRef} className="relative min-h-screen">
        <ProjectNumberNav projects={projects} />
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
  /** Last string written - skips the DOM write (and text reflow) on frames
      where the rounded display value hasn't actually changed. */
  lastText: string;
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
  imageCurtain: HTMLElement | null;
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
        lastText: valueEl?.textContent ?? "",
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
    imageCurtain: root.querySelector('[data-gsap="image-curtain"]'),
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
   --------------------------------------------------------------------------
   Every function below writes to `element.style` directly - see the
   PERFORMANCE note on WorksShowcase for why. None of it uses gsap.set().
   ========================================================================== */

/*
 * SEGMENT BUDGET (local progress 0-1 within one project's turn).
 *
 *   0            .15                      .50                        1
 *   |--- enter ---|--------- hold ---------|--------- exit ----------|
 *
 * The split is weighted toward the exit for a specific reason: the HOLD is
 * static. Nothing moves during it, so scrolling through it quickly costs the
 * visitor nothing - the panel is fully readable at every position. The exit
 * is the opposite: it is entirely transient, and anything missed there is
 * missed for good. So the exit gets the larger share even though the hold is
 * what "feels" like the important part.
 *
 * At 3.2x viewport per segment (2880px at a 900px viewport) that is roughly
 * 430px entering, 1010px settled and readable, and 1440px of exit - of which
 * the four words get 1008px, about 250px each.
 */
const ENTER_END = 0.15;
const EXIT_START = 0.5;
/**
 * Where, WITHIN the exit window (x, 0-1), the content has fully compressed
 * and faded - and where the impact-word sequence is allowed to start. These
 * are deliberately non-overlapping: content must be fully gone (opacity 0)
 * before the first word is allowed to appear.
 */
const CONTENT_CLEAR = 0.22;
const WORDS_START = 0.3;

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
  progressLine: HTMLElement | null,
  activeState: { index: number }
) {
  const N = panels.length;
  if (N === 0) return;

  const overall = clamp01(progress);
  const floatIndex = overall * N;
  const active = Math.min(N - 1, Math.floor(floatIndex));
  const t = clamp01(floatIndex - active);

  // The active panel's own content changes every frame - that part always
  // runs. Everyone else only needs a write on the frame `active` actually
  // changes; re-setting "opacity: 0" on five idle panels sixty times a
  // second is pure waste once this loop is running continuously (see the
  // catch-up loop in WorksShowcase).
  const indexChanged = active !== activeState.index;

  panels.forEach((p, i) => {
    if (i === active) {
      setPanelActive(p, t);
    } else if (indexChanged) {
      p.root.style.opacity = "0";
      p.root.style.pointerEvents = "none";
    }
  });

  if (indexChanged) {
    numberItems.forEach((el, i) => {
      const isActive = i === active;
      el.style.opacity = isActive ? "1" : "0.4";
      el.style.transform = `scale(${isActive ? 1.35 : 1})`;
    });
    activeState.index = active;
  }

  if (progressLine) progressLine.style.transform = `scaleY(${overall})`;
}

function setPanelActive(p: PanelRefs, t: number) {
  p.root.style.opacity = "1";
  p.root.style.pointerEvents = "auto";

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
  if (p.mask) p.mask.style.transform = `translate3d(${e * 100}%, 0, 0)`;

  if (p.number) {
    const eNum = sub(e, 0.05, 0.55);
    p.number.style.opacity = String(eNum);
    p.number.style.transform = `translate3d(${-40 * (1 - eNum)}px, 0, 0) scale(${1.15 - 0.15 * eNum})`;
  }

  if (p.meta) {
    const eMeta = sub(e, 0.15, 0.65);
    p.meta.style.opacity = String(eMeta);
    p.meta.style.transform = `translate3d(0, ${12 * (1 - eMeta)}px, 0)`;
  }

  const eTitle = sub(e, 0.2, 0.85);
  if (p.titleInner) p.titleInner.style.transform = `translate3d(0, ${(1 - eTitle) * 100}%, 0)`;
  if (p.titleGhost) {
    const eGhost = sub(e, 0.75, 1);
    const gate = clamp01(eTitle * 8);
    p.titleGhost.style.opacity = String((1 - eGhost) * 0.5 * gate);
    p.titleGhost.style.transform = `translate3d(${(1 - eGhost) * -2}px, ${(1 - eGhost) * 2}px, 0)`;
  }

  applyVisual(p, sub(e, 0.3, 1));

  if (p.description) {
    const eDesc = sub(e, 0.4, 0.9);
    p.description.style.opacity = String(eDesc);
    p.description.style.transform = `translate3d(0, ${20 * (1 - eDesc)}px, 0)`;
  }

  p.metricRows.forEach((row, i) => {
    const eRow = sub(e, 0.45 + i * 0.08, 0.85 + i * 0.08);
    row.el.style.opacity = String(eRow);
    row.el.style.transform = `translate3d(0, ${10 * (1 - eRow)}px, 0)`;
    if (row.valueEl) {
      const text = (row.target * eRow).toFixed(row.decimals);
      if (text !== row.lastText) {
        row.valueEl.textContent = text;
        row.lastText = text;
      }
    }
  });

  p.techPills.forEach((el, i) => {
    const eP = sub(e, 0.55 + i * 0.04, 0.85 + i * 0.04);
    el.style.opacity = String(eP);
    el.style.transform = `translate3d(0, ${6 * (1 - eP)}px, 0)`;
  });

  if (p.cta) {
    const eCta = sub(e, 0.8, 1);
    p.cta.style.opacity = String(eCta);
    p.cta.style.transform = `translate3d(0, ${10 * (1 - eCta)}px, 0)`;
  }

  if (p.liveStamp) {
    const eStamp = sub(e, 0.82, 1);
    p.liveStamp.style.opacity = String(eStamp);
    p.liveStamp.style.transform = `scale(${1.15 - 0.15 * eStamp}) rotate(${-3 + 3 * eStamp}deg)`;
  }
}

/** e: 0 = not yet visible, 1 = fully revealed - shared by every visual type. */
function applyVisual(p: PanelRefs, e: number) {
  if (p.visualRoot) {
    p.visualRoot.style.opacity = String(e);
    p.visualRoot.style.transform = `scale(${0.94 + 0.06 * e})`;
  }

  // Browser-frame projects: a solid curtain slides clear left-to-right,
  // revealing the (always fully rendered, never clipped) screenshot beneath.
  if (p.imageCurtain) p.imageCurtain.style.transform = `translate3d(${e * 100}%, 0, 0)`;

  // Planet-badge projects: outer ring, sweep, grid, then the signature path.
  if (p.ringOuter) p.ringOuter.style.opacity = String(0.15 * clamp01(e * 1.4));
  if (p.ringSweep) p.ringSweep.style.opacity = String(0.28 * sub(e, 0.2, 1));
  if (p.glyphGrid) p.glyphGrid.style.opacity = String(0.18 * sub(e, 0.15, 0.65));

  if (p.glyphPaths.length) {
    const eDraw = sub(e, 0.35, 1);
    const n = p.glyphPaths.length;
    p.glyphPaths.forEach((path, i) => {
      const local = clamp01(eDraw * n - i);
      path.style.strokeDasharray = "1";
      path.style.strokeDashoffset = String(1 - local);
    });
  }

  if (p.glyphPoints.length) {
    const ePoint = sub(e, 0.85, 1);
    p.glyphPoints.forEach((pt) => {
      pt.style.opacity = String(ePoint);
      pt.style.transform = `scale(${0.4 + 0.6 * ePoint})`;
    });
  }
}

/**
 * x: 0 = holding, 1 = fully compressed and handed off to the next project.
 *
 * Strictly sequential, not simultaneous: the content compresses and fades
 * COMPLETELY (through CONTENT_CLEAR) before the blueprint pulse plays, and
 * the blueprint is completely gone before the first impact word is allowed
 * to appear (WORDS_START). Each stage owns its own slice of `x` with no
 * overlap, so a word like "TESTED." always lands on the clean, settled flood
 * colour - never on top of half-faded description text and tech pills.
 *
 * Compresses `contentWrap` only, NOT `p.root` - the impact words and the
 * blueprint overlay are siblings of contentWrap (see ProjectPanel.tsx), so
 * they stay at their own full, independent opacity instead of compounding
 * with a fading ancestor.
 */
function applyExit(p: PanelRefs, x: number) {
  const eContent = easeOut(sub(x, 0, CONTENT_CLEAR));
  if (p.contentWrap) {
    p.contentWrap.style.opacity = String(1 - eContent);
    p.contentWrap.style.transform = `scaleY(${1 - 0.92 * eContent})`;
  }

  // A brief engineering pulse while the content is compressing away - fully
  // faded out again before WORDS_START, never sharing the stage with a word.
  if (p.blueprint) {
    const bpWindow = sub(x, 0, WORDS_START * 0.85);
    const bpOp = bpWindow < 0.5 ? bpWindow / 0.5 : 1 - (bpWindow - 0.5) / 0.5;
    p.blueprint.style.opacity = String(bpOp * 0.85);
    if (p.blueprintPath) {
      p.blueprintPath.style.strokeDasharray = "1";
      p.blueprintPath.style.strokeDashoffset = String(1 - sub(x, 0, WORDS_START * 0.7));
    }
    p.blueprintLabels.forEach((el, i) => {
      el.style.opacity = String(sub(x, i * 0.04, i * 0.04 + 0.2) * bpOp);
    });
  }

  // The word sequence gets the remainder of the exit window entirely to
  // itself - a generous, evenly-paced turn each, landing on a clean surface.
  const n = p.impactWords.length;
  const wx = sub(x, WORDS_START, 1);
  p.impactWords.forEach((el, i) => {
    if (n === 0) return;
    const start = i / n;
    const end = (i + 1) / n;
    const local = sub(wx, start, end);
    /* Fade in fast, hold long, fade out fast. The plateau is deliberately
       the bulk of each word's turn (0.20 -> 0.82): time spent mid-fade is
       time the word is present but not yet properly readable, so widening
       the fully-opaque middle buys real legibility without needing more
       scroll distance on top. */
    let op: number;
    if (local <= 0.2) op = local / 0.2;
    else if (local < 0.82) op = 1;
    else op = 1 - (local - 0.82) / 0.18;
    const within = wx > start && wx < end ? op : 0;
    el.style.opacity = String(within);
    el.style.transform = `scale(${0.94 + 0.06 * Math.min(1, within * 1.3)})`;
  });
}
