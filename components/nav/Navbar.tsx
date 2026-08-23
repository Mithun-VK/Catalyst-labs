"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, navShortLabels } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { worldForPath } from "@/lib/worlds";

/**
 * Sticky navigation.
 *
 * Active state comes from the route, not from a scroll spy - on a multi-page
 * site the current page is a fact, not a guess. Two other pieces of state,
 * both cheap: condensed (past the fold) and read progress on the bottom edge.
 * Scroll work is rAF-coalesced and only touches transform and opacity.
 *
 * WORLD-AWARE. The bar takes its colour from tokens alone, so it re-themes
 * itself on every world without a single conditional - on the ivory Services
 * page `bg-ink` paints ivory and `text-paper` prints near-black. Only the
 * TYPOGRAPHY is switched per world, because that is the part tokens cannot
 * carry: the poster world sets its links in uppercase mono, the atelier world
 * opens the tracking, the system world reads as instrumentation.
 *
 * Structure, order, hit areas and keyboard behaviour never change. The look
 * adapts; the way it works does not.
 */
export function Navbar() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setCondensed(y > 16);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  // Close the panel on navigation and when the viewport reaches desktop.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const world = worldForPath(pathname);

  /* Type treatment per world. Everything else about the link - size, hit
     area, focus ring, underline - is shared, so only the voice changes. */
  const linkType =
    world.id === "poster"
      ? "font-mono text-[0.8125rem] uppercase tracking-[0.12em]"
      : world.id === "atelier"
        ? "text-small tracking-[0.06em]"
        : world.id === "system"
          ? "font-mono text-[0.8125rem] tracking-[0.08em]"
          : "text-small";

  return (
    <>
      {/* The scrolled bar sits at 95% rather than a glassier value on purpose:
          backdrop-blur is an enhancement, not a guarantee. Where the filter is
          unsupported, disabled for reduced transparency, or simply not painted,
          a low-opacity bar leaves page text legible THROUGH the nav and
          colliding with the links. 95% keeps the depth cue and stays clean
          without depending on the filter landing. */}
      <header
        className={`fixed inset-x-0 top-0 z-(--z-nav) transition-[background-color,border-color,backdrop-filter] duration-(--duration-slow) ease-(--ease-out-soft) ${
          condensed
            ? "border-b border-line bg-ink/95 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`container-page flex items-center justify-between transition-[height] duration-(--duration-slow) ease-(--ease-out-soft) ${
            condensed ? "h-16" : "h-20 sm:h-24"
          }`}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(item.href);
                /* Five items, a logo and a CTA share one row from 1024px up,
                   so the desktop bar uses the compact label where one exists.
                   The accessible name keeps the full route title, so nothing
                   is lost to a screen reader or to the browser's find. */
                const short = navShortLabels[item.href];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() =>
                        track("nav_click", { label: item.label, device: "desktop" })
                      }
                      aria-current={active ? "page" : undefined}
                      aria-label={short ? item.label : undefined}
                      title={short ? item.label : undefined}
                      className={`group relative inline-flex h-11 items-center px-2.5 transition-colors duration-(--duration-base) xl:px-3.5 ${linkType} ${
                        active ? "text-paper" : "text-mute hover:text-paper"
                      }`}
                    >
                      {short ?? item.label}
                      {/* Underline: grows from the left on hover, held while active. */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-2.5 bottom-2.5 h-px origin-left bg-ember transition-transform duration-(--duration-base) ease-(--ease-out-quart) xl:inset-x-3.5 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* World readout. The through-line that makes the five
                environments read as one deliberate system rather than five
                unrelated pages. Decorative, so it is hidden from assistive
                tech - the route name is already announced by the link. */}
            <p
              aria-hidden="true"
              className="mr-3 hidden items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute-deep xl:flex"
            >
              <span className="h-1 w-1 bg-ember" />
              {world.label}
            </p>

            <Link
              href="/contact"
              onClick={() =>
                track("cta_click", { location: "navbar", label: "start_a_project" })
              }
              className="hidden h-10 cursor-pointer items-center gap-2 rounded-xs bg-paper px-4 text-small font-medium text-ink transition-colors duration-(--duration-base) hover:bg-ember sm:inline-flex"
            >
              Start a Project
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center text-paper lg:hidden"
            >
              {/* Two rules, not three - matches the hairline language. */}
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Read progress. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ember transition-opacity duration-(--duration-base) ${
            condensed ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
