"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { site, whatsappLink, mailtoLink } from "@/lib/site";
import { useCalPopup } from "@/components/ui/useCalPopup";
import { burst } from "@/components/cta/confetti";

/**
 * The alternative ways in: book a call, WhatsApp, email. Each tile states its
 * effort and response time up front, so the choice is easy, and the whole tile
 * is the click target. The booking tile is hidden unless a booking link is
 * configured.
 */

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="cta-arrow h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}

const icons = {
  book: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
};

function TileBody({
  icon,
  title,
  note,
  tag,
  highlight,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  tag: string;
  highlight?: boolean;
}) {
  return (
    <>
      <span className="cta-tile-icon flex h-10 w-10 shrink-0 items-center justify-center border border-line-strong">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-body font-medium text-paper">{title}</span>
          <span className={cn("cta-tag", highlight && "is-hot")}>{tag}</span>
        </span>
        <span className="mt-0.5 block truncate text-small text-mute">{note}</span>
      </span>
      <Arrow />
    </>
  );
}

export function CtaPaths({
  variant,
  location,
}: {
  variant: "standard" | "poster";
  location: string;
}) {
  const poster = variant === "poster";
  const { calLink, ready } = useCalPopup(site.booking.url);
  const canBook = Boolean(site.booking.url && calLink);

  // Poster tiles each take a colour flood and a small tilt, like pinned flyers.
  const surfaces = ["yellow", "mint", "pink"] as const;
  const tilts = ["-1deg", "0.8deg", "-0.6deg"];
  const wrap = (i: number): { "data-surface"?: string; style?: CSSProperties } =>
    poster
      ? { "data-surface": surfaces[i], style: { "--tilt": tilts[i] } as CSSProperties }
      : {};

  let n = 0;
  return (
    <ul className="grid gap-3">
      {canBook ? (
        <li>
          <button
            type="button"
            className="cta-tile"
            {...wrap(n++)}
            data-cal-namespace="30min"
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            onClick={(e) => {
              track("booking_click", { location });
              if (poster) burst(e.currentTarget, 14);
              if (!ready.current) window.open(site.booking.url, "_blank", "noopener,noreferrer");
            }}
          >
            <TileBody
              icon={icons.book}
              title={`Book a ${site.booking.minutes}-minute call`}
              note="Pick a time. Opens right here."
              tag="Fastest"
              highlight
            />
          </button>
        </li>
      ) : null}
      <li>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-tile"
          {...wrap(n++)}
          onClick={() => track("whatsapp_click", { location })}
        >
          <TileBody icon={icons.chat} title="Message on WhatsApp" note={site.contact.phoneDisplay} tag="Same day" />
        </a>
      </li>
      <li>
        <a
          href={mailtoLink()}
          className="cta-tile"
          {...wrap(n++)}
          onClick={() => track("email_click", { location })}
        >
          <TileBody icon={icons.mail} title="Email a brief" note={site.contact.email} tag="Docs & specs" />
        </a>
      </li>
    </ul>
  );
}
