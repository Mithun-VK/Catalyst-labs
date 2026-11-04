"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

/** "https://cal.com/catalyst-labs/30min" -> "catalyst-labs/30min" */
export function calLinkFrom(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return "";
  }
}

/**
 * Loads the Cal.com embed once the component mounts, so any element carrying
 * `data-cal-link` opens the scheduler as an in-page dialog. `ready` flips true
 * when the script is usable; until then (or if it is blocked) callers should
 * fall back to opening `url` in a new tab.
 */
export function useCalPopup(url: string) {
  const calLink = calLinkFrom(url);
  const ready = useRef(false);

  useEffect(() => {
    if (!calLink) return;
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", { theme: "dark", hideEventTypeDetails: false, layout: "month_view" });
        if (!cancelled) ready.current = true;
      } catch {
        // Blocked or offline: callers fall back to the plain booking page.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [calLink]);

  return { calLink, ready };
}
