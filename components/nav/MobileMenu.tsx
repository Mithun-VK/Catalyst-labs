"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { nav, site, whatsappLink } from "@/lib/site";
import { useScrollLock } from "@/lib/hooks";
import { track } from "@/lib/analytics";
import { Logo } from "@/components/ui/Logo";

/**
 * Full-surface mobile navigation. Not a dropdown list: the links are set at
 * headline scale with an index against each one, so the menu reads as part of
 * the same editorial system as the page behind it.
 *
 * Focus is trapped while open, Escape closes, and the trigger is restored on
 * close.
 */
export function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      // Kept mounted so the transition can play both ways; fully removed from
      // the a11y tree and the tab order when closed.
      {...(open ? {} : { inert: "" as unknown as boolean })}
      aria-hidden={!open}
      className={`fixed inset-0 z-(--z-overlay) lg:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink/85 backdrop-blur-md transition-opacity duration-(--duration-base) ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        className={`absolute inset-x-0 top-0 flex max-h-dvh flex-col overflow-y-auto border-b border-line bg-ink transition-[transform,opacity] duration-(--duration-slow) ease-(--ease-out-quart) ${
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between">
          <Logo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center text-mute transition-colors duration-(--duration-fast) hover:text-paper"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav className="container-page pb-6" aria-label="Primary">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item, i) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      track("nav_click", { label: item.label, device: "mobile" });
                      onClose();
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-4 py-4 text-h3 transition-colors duration-(--duration-fast) ${
                      active ? "text-ember" : "text-paper hover:text-ember"
                    }`}
                    style={{
                      animation: open
                        ? "cl-fade-up 500ms var(--ease-out-quart) both"
                        : undefined,
                      animationDelay: `${60 + i * 45}ms`,
                    }}
                  >
                    <span
                      className={`label w-7 transition-colors ${
                        active ? "text-ember" : "text-mute-deep group-hover:text-ember"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {active ? (
                      <span aria-hidden="true" className="h-1.5 w-1.5 bg-ember" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="container-page grid gap-3 pb-8">
          <Link
            href="/contact"
            onClick={() => {
              track("cta_click", { location: "mobile_menu", label: "start_a_project" });
              onClose();
            }}
            className="flex h-[3.25rem] cursor-pointer items-center justify-center gap-2 rounded-xs bg-ember font-medium text-ink transition-colors duration-(--duration-base) hover:bg-ember-soft"
          >
            Start a Project
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "mobile_menu" })}
              className="flex h-12 cursor-pointer items-center justify-center rounded-xs border border-line-strong text-small text-paper transition-colors duration-(--duration-base) hover:border-paper/40"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              onClick={() => track("email_click", { location: "mobile_menu" })}
              className="flex h-12 cursor-pointer items-center justify-center rounded-xs border border-line-strong text-small text-paper transition-colors duration-(--duration-base) hover:border-paper/40"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
