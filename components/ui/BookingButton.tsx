"use client";

import { Button } from "@/components/ui/Button";
import { useCalPopup } from "@/components/ui/useCalPopup";
import { site } from "@/lib/site";

/**
 * "Book a call" CTA that opens the Cal.com scheduler as an in-page dialog, so
 * the visitor never leaves the site. Renders nothing unless
 * NEXT_PUBLIC_BOOKING_URL is set.
 *
 * Until the embed script has loaded (or if it is blocked by an ad blocker or
 * the network), a click opens the plain booking page in a new tab, so the
 * button always does something useful.
 */
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
  const { calLink, ready } = useCalPopup(url);

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
