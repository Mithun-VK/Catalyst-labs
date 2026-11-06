"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { site, whatsappLink } from "@/lib/site";

/** Routes that carry their own primary action, where a second bar competes. */
const HIDDEN_ON = ["/contact", "/linkedin"];

/**
 * Sticky call to action for phones only.
 *
 * Stays out of the way on purpose: it appears once the hero (and its own CTAs)
 * has scrolled away, disappears when the footer arrives so it never covers the
 * last links, and steps aside while any field has focus, because a fixed bar
 * sitting over an on-screen keyboard is worse than no bar.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [typing, setTyping] = useState(false);

  const hiddenRoute = HIDDEN_ON.includes(pathname);

  useEffect(() => {
    if (hiddenRoute) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.getElementById("site-footer");
    const io = footer
      ? new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting))
      : null;
    if (footer && io) io.observe(footer);

    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable]");
    const onFocusIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [hiddenRoute, pathname]);

  if (hiddenRoute) return null;
  const show = pastHero && !footerInView && !typing;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-line bg-ink/90 px-4 pt-3 backdrop-blur-md md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "transition-[transform,opacity] duration-(--duration-base) ease-(--ease-out-soft) motion-reduce:transition-none",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          href="/contact"
          onClick={() => track("cta_click", { location: "mobile_sticky", label: "start_a_project" })}
          className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xs bg-ember px-5 text-[0.9375rem] font-medium text-on-ember"
        >
          Start a project
        </Link>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { location: "mobile_sticky" })}
          aria-label={`Message ${site.name} on WhatsApp`}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xs border border-line-strong px-4 text-[0.9375rem] font-medium text-paper"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19l-4 1z" strokeLinejoin="round" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
