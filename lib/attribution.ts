/**
 * First-touch attribution, kept in sessionStorage only (no cookies).
 *
 * `captureAttribution()` runs once per tab session from the layout and records
 * where the visitor came from. `readAttribution()` is called at form submit
 * and also picks up a `?source=` tag from the current URL, so links like
 * /contact?source=work-safemerchant are attributed even when that is not the
 * landing page. Every storage access is guarded: private windows and blocked
 * storage must never break the page or the form.
 */

const KEY = "cl_attribution";

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  /** Which post or link produced the visit, e.g. "2026-11-18-announce". */
  utmContent: string;
  referrer: string;
  landingPage: string;
  source: string;
};

const clip = (value: string | null | undefined, max = 200) =>
  (value ?? "").slice(0, max);

function stored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

export function captureAttribution(): void {
  if (typeof window === "undefined" || stored()) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    const external =
      referrer && !referrer.startsWith(window.location.origin) ? referrer : "";

    const attribution: Attribution = {
      utmSource: clip(params.get("utm_source")),
      utmMedium: clip(params.get("utm_medium")),
      utmCampaign: clip(params.get("utm_campaign")),
      utmContent: clip(params.get("utm_content")),
      referrer: clip(external),
      landingPage: clip(window.location.pathname),
      source: clip(params.get("source")),
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is best-effort.
  }
}

export function readAttribution(): Attribution {
  const empty: Attribution = {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    referrer: "",
    landingPage: "",
    source: "",
  };
  if (typeof window === "undefined") return empty;

  const base = stored() ?? empty;
  try {
    const source = new URLSearchParams(window.location.search).get("source");
    return source ? { ...base, source: clip(source) } : base;
  } catch {
    return base;
  }
}
