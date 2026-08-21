/**
 * Analytics shim.
 *
 * No vendor script is bundled with this site. `track` forwards events to
 * whichever provider is present on the page (GTM dataLayer, Plausible, or
 * gtag) and is a no-op otherwise, so adding a provider later is a change to
 * the layout's script tags - not to any component.
 *
 * No keys or IDs live in this file.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "nav_click"
  | "whatsapp_click"
  | "email_click"
  | "service_opened"
  | "case_study_opened"
  | "blueprint_opened"
  | "ai_scenario_viewed"
  | "form_started"
  | "form_submitted"
  | "form_error";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (command: string, event: string, params?: Props) => void;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer?.push({ event, ...props });
    window.plausible?.(event, { props });
    window.gtag?.("event", event, props);
  } catch {
    // Analytics must never break an interaction.
  }
}
