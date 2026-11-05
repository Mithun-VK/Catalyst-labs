"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

/**
 * Sticky section bar for the Services page. Highlights the section currently
 * under the bar and jumps on click. Sits in normal flow right after the hero
 * and sticks under the condensed navbar; scrolls sideways on narrow screens.
 */
const ITEMS = [
  { id: "practices", label: "Practices" },
  { id: "impact", label: "Impact" },
  { id: "process", label: "Process" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "faq", label: "FAQ" },
  { id: "start", label: "Start a project" },
] as const;

const OFFSET = 150;

export function ServicesSubnav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "";
      for (const item of ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= OFFSET) current = item.id;
      }
      setActive(current);
    };
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
  }, []);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 20,
      behavior: reduce ? "auto" : "smooth",
    });
    track("nav_click", { location: "services_subnav", label: id });
  }

  return (
    <nav aria-label="On this page" className="sticky top-[4.5rem] z-30">
      <div className="container-page">
        <ul className="glass-chip flex gap-1 overflow-x-auto !bg-white/85 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map((item) => {
            const on = active === item.id;
            const isCta = item.id === "start";
            return (
              <li key={item.id} className={cn("shrink-0", isCta && "ml-auto")}>
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(item.id);
                  }}
                  className={cn(
                    "flex min-h-10 cursor-pointer items-center rounded-full px-4 text-small transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]",
                    isCta
                      ? "bg-ember text-on-ember hover:bg-ember-soft"
                      : on
                        ? "bg-white text-paper shadow-[0_6px_16px_-10px_rgb(9_50_51/0.6)]"
                        : "text-mute hover:bg-white/60 hover:text-paper"
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
