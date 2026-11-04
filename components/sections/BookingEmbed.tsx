"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { site } from "@/lib/site";

/** "https://cal.com/catalyst-labs/30min" -> "catalyst-labs/30min" */
function calLinkFrom(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return "";
  }
}

/**
 * Inline Cal.com scheduler for /contact. Renders nothing unless
 * NEXT_PUBLIC_BOOKING_URL is set. The heading and a plain link stay in the
 * HTML so the section still works if the embed script is blocked.
 */
export function BookingEmbed() {
  const url = site.booking.url;
  const calLink = calLinkFrom(url);

  useEffect(() => {
    if (!calLink) return;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        // Embed blocked: the fallback link below remains.
      }
    })();
  }, [calLink]);

  if (!url || !calLink) return null;

  return (
    <section
      aria-labelledby="booking-heading"
      className="pb-(--space-section)"
    >
      <div className="container-page">
        <div className="border border-line p-6 sm:p-8">
          <p className="label text-mute-deep">Book a call</p>
          <h2 id="booking-heading" className="mt-3 text-h2 text-paper">
            Pick a time that suits{" "}
            <span className="accent-word text-ember">you</span>.
          </h2>
          <p className="mt-3 max-w-xl text-body text-mute">
            A {site.booking.minutes}-minute call to understand what you want to
            build. Times show in your own time zone. Prefer a new tab?{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember underline underline-offset-4"
            >
              Open the booking page
            </a>
            .
          </p>

          <div className="mt-8 min-h-[640px]">
            <Cal
              namespace="30min"
              calLink={calLink}
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
