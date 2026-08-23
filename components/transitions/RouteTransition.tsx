"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Route transition - enter only.
 *
 * Moving between worlds is the site's main structural idea, so the boundary
 * is marked rather than cut: a veil sweeps once and the incoming page rises
 * underneath it. Total ~510ms, inside the 400-800ms target.
 *
 * WHY ENTER-ONLY. Animating the outgoing page means intercepting every
 * navigation, holding the old tree while the new route loads, and restoring
 * it on back/forward. That delays the paint of the page the user asked for
 * and regresses browser history behaviour, to animate something they have
 * already decided to leave. Entering alone reads as a transition and can
 * never strand the user on a stale page.
 *
 * The veil is deliberately NOT shown on first load: a veil over the very
 * first paint is a loading screen, which is the one thing the brief rules
 * out. `navigated` only becomes true after a real route change.
 *
 * The veil paints in `var(--color-ink)`, which resolves to the world being
 * entered - so the sweep is already the colour of the destination.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navigated, setNavigated] = useState(false);
  /**
   * True while `.route-enter`'s CSS animation should be applied. Dropped
   * after it completes so the element's computed `transform` genuinely
   * returns to `none` - while a fill-mode:both animation is considered
   * "filling", Chromium keeps reporting an identity matrix instead, and ANY
   * non-none transform, even a visual no-op, makes this element the
   * containing block for `position: fixed` descendants instead of the
   * viewport. That silently breaks position:fixed anywhere in page content
   * (most visibly, a GSAP ScrollTrigger pin).
   *
   * A `setTimeout` matching the animation's own run time, not
   * `onAnimationEnd`: hydration can finish AFTER the (CSS-only, JS-free)
   * animation has already played out, in which case the event fires before
   * React ever attaches a listener for it and is missed entirely.
   */
  const [entering, setEntering] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    // The first effect run is the initial mount, not a navigation.
    if (!mounted.current) {
      mounted.current = true;
    } else {
      setNavigated(true);
    }

    setEntering(true);
    // cl-route-in: 90ms delay + 460ms duration, plus a small margin.
    const timer = setTimeout(() => setEntering(false), 620);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {navigated ? (
        <div key={pathname} className="route-veil" data-run aria-hidden="true" />
      ) : null}
      <div key={pathname} className={entering ? "route-enter" : undefined}>
        {children}
      </div>
    </>
  );
}
