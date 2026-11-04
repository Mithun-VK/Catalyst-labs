"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { slug: string; name: string };

/**
 * Number rail for the works deck: a horizontal bar under the navbar on
 * phones, tablets and laptops, and a fixed vertical strip from 1280px up.
 * Highlights the project currently at the top of the screen and jumps to any
 * project on click. Positions are computed from layout rather than with an
 * IntersectionObserver, because stacked posters overlap while stuck and every
 * poster stays "intersecting" underneath the others.
 */
export function WorksRail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = document.getElementById("works-deck");
    const bar = barRef.current;
    const found = items.map((i) => document.getElementById(`deck-card-${i.slug}`));
    if (!section || !bar || found.some((c) => !c)) return;
    const els = found as HTMLElement[];

    /** Page-Y of each poster's natural (un-stuck) top, plus the stick offset. */
    function layout() {
      const stuck = getComputedStyle(els[0]).position === "sticky";
      const barH = getComputedStyle(bar!).position !== "fixed" ? bar!.offsetHeight : 0;

      if (stuck) {
        let y = section!.getBoundingClientRect().top + window.scrollY + barH;
        const tops = els.map((el) => {
          const top = y;
          y += el.offsetHeight;
          return top;
        });
        return { tops, offset: parseFloat(getComputedStyle(els[0]).top) || 64 };
      }
      return {
        tops: els.map((el) => el.getBoundingClientRect().top + window.scrollY),
        offset: 64 + barH,
      };
    }

    let frame = 0;
    function update() {
      frame = 0;
      const { tops, offset } = layout();
      const line = window.scrollY + offset + 8;
      let current = 0;
      tops.forEach((t, i) => {
        if (t <= line) current = i;
      });
      setActive(current);

      const rect = section!.getBoundingClientRect();
      setVisible(
        rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5
      );
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  function jump(index: number) {
    const section = document.getElementById("works-deck");
    const bar = barRef.current;
    const found = items.map((i) => document.getElementById(`deck-card-${i.slug}`));
    if (!section || !bar || found.some((c) => !c)) return;
    const cards = found as HTMLElement[];

    const stuck = getComputedStyle(cards[0]).position === "sticky";
    const barH = getComputedStyle(bar).position !== "fixed" ? bar.offsetHeight : 0;
    let target: number;
    let offset: number;

    if (stuck) {
      let y = section.getBoundingClientRect().top + window.scrollY + barH;
      for (let i = 0; i < index; i++) y += cards[i].offsetHeight;
      target = y;
      offset = parseFloat(getComputedStyle(cards[0]).top) || 64;
    } else {
      target = cards[index].getBoundingClientRect().top + window.scrollY;
      offset = 64 + barH;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target - offset + 2, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <nav
      ref={barRef}
      aria-label="Jump to a project"
      data-hidden={!visible}
      className={cn(
        // Below xl: a sticky bar under the navbar, scrolling sideways if needed.
        "sticky top-16 z-30 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b-2 border-paper bg-ink px-4 py-2 sm:px-6",
        // xl and up: a fixed vertical strip at the left edge.
        "xl:fixed xl:left-5 xl:top-1/2 xl:-translate-y-1/2 xl:flex-col xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0",
        "xl:transition-opacity xl:duration-300",
        "xl:data-[hidden=true]:pointer-events-none xl:data-[hidden=true]:opacity-0"
      )}
    >
      {items.map((item, i) => (
        <button
          key={item.slug}
          type="button"
          onClick={() => jump(i)}
          aria-current={active === i ? "true" : undefined}
          aria-label={`Go to ${item.name}`}
          className={cn(
            "group relative flex h-9 shrink-0 cursor-pointer items-center gap-2 border-2 border-paper px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200",
            "xl:h-10 xl:w-10 xl:justify-center xl:px-0",
            active === i
              ? "bg-ember text-on-ember"
              : "bg-ink text-paper hover:bg-paper hover:text-ink"
          )}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
          <span className="max-w-[7rem] truncate xl:hidden">{item.name}</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap border-2 border-paper bg-ink px-2 py-1 text-paper opacity-0 transition-opacity group-hover:opacity-100 xl:block"
          >
            {item.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
