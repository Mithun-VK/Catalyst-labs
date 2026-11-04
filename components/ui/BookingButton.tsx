"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * "Book a call" CTA that opens the Cal.com scheduler as an in-page dialog, so
 * the visitor never leaves the site. Renders nothing unless
 * NEXT_PUBLIC_BOOKING_URL is set.
 *
 * The embed script loads after hydration. Until it has (or if it is blocked by
 * an ad blocker or network), a click opens the plain booking page in a new tab,
 * so the button always does something useful.
 */

/** "https://cal.com/catalyst-labs/30min" -> "catalyst-labs/30min" */
function calLinkFrom(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return "";
  }
}

export function BookingButton({
  location,
  variant = "secondary",
  size = "lg",
  className,
}: {
  location: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}) {
  const url = site.booking.url;
  const calLink = calLinkFrom(url);
  const ready = useRef(false);

  useEffect(() => {
    if (!calLink) return;
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        if (!cancelled) ready.current = true;
      } catch {
        // Blocked or offline: the click fallback below still works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [calLink]);

  if (!url || !calLink) return null;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      event="booking_click"
      eventProps={{ location }}
      className={className}
      data-cal-namespace="30min"
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      onClick={() => {
        if (!ready.current) window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      Book a {site.booking.minutes}-minute call
    </Button>
  );
}
