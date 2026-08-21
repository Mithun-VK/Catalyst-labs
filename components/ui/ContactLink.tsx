"use client";

import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * One row of the direct-contact list. The whole row is the target, so it
 * stays comfortably tappable on a phone.
 */
export function ContactLink({
  href,
  label,
  value,
  note,
  event,
  external,
}: {
  href: string;
  label: string;
  value: string;
  note: string;
  event: AnalyticsEvent;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={() => track(event, { location: "contact_section" })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-h-[4.5rem] cursor-pointer items-center gap-5 border-b border-line py-4 transition-colors duration-(--duration-base) hover:bg-paper/[0.03]"
    >
      <span className="label w-20 shrink-0 text-mute-deep transition-colors duration-(--duration-base) group-hover:text-ember">
        {label}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-body text-paper">{value}</span>
        <span className="mt-0.5 block text-[0.8125rem] text-mute-deep">{note}</span>
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-3.5 w-3.5 shrink-0 text-mute-deep transition-all duration-(--duration-base) ease-(--ease-out-quart) group-hover:translate-x-1 group-hover:text-ember"
      >
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </a>
  );
}
