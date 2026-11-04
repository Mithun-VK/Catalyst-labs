import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryInput } from "@/lib/enquiry";
import { site } from "@/lib/site";

/**
 * Project enquiry endpoint.
 *
 * Delivery is provider-agnostic and configured entirely through environment
 * variables - no key is ever referenced from client code:
 *
 *   RESEND_API_KEY        Send the enquiry as email via Resend.
 *   ENQUIRY_FROM_EMAIL    Verified sender on your Resend domain.
 *   ENQUIRY_TO_EMAIL      Where enquiries land (defaults to the site email).
 *   ENQUIRY_WEBHOOK_URL   Alternative/additional sink (CRM, Zapier, n8n…).
 *
 * With nothing configured the route returns 503 and the form falls back to
 * WhatsApp and email rather than silently swallowing a lead - a dropped
 * enquiry is worse than an honest error.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------
   Rate limiting.
   In-memory and therefore per-instance: it stops casual flooding, not a
   distributed attack. Move to Redis/Upstash or the platform WAF when traffic
   justifies it.
   ------------------------------------------------------------------------- */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string
  );

export async function POST(request: Request) {
  // Body size guard before parsing.
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 20_000) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let body: Partial<EnquiryInput>;
  try {
    body = (await request.json()) as Partial<EnquiryInput>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        error:
          "That's a few enquiries in a short window. Please email or message us directly instead.",
      },
      { status: 429 }
    );
  }

  const { ok, errors, suspectedBot } = validateEnquiry(body);

  // Accept-and-discard: a bot that gets a 200 doesn't retry with new tactics.
  if (suspectedBot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!ok) {
    return NextResponse.json(
      { error: "Some fields need attention.", errors },
      { status: 400 }
    );
  }

  const field = (value: unknown, max = 200) =>
    String(value ?? "").trim().slice(0, max);

  const enquiry = {
    name: String(body.name).trim(),
    company: String(body.company ?? "").trim(),
    email: String(body.email).trim(),
    phone: String(body.phone ?? "").trim(),
    projectType: String(body.projectType).trim(),
    budget: String(body.budget ?? "").trim(),
    currency: field(body.currency, 3),
    timeline: String(body.timeline ?? "").trim(),
    country: field(body.country, 60),
    timezone: field(body.timezone, 60),
    contactMethod: field(body.contactMethod, 20),
    brief: String(body.brief).trim(),
    currentProduct: String(body.currentProduct ?? "").trim(),
    notes: String(body.notes ?? "").trim(),
    source: field(body.source),
    utmSource: field(body.utmSource),
    utmMedium: field(body.utmMedium),
    utmCampaign: field(body.utmCampaign),
    referrer: field(body.referrer),
    landingPage: field(body.landingPage),
    receivedAt: new Date().toISOString(),
  };

  const results = await Promise.allSettled([
    sendEmail(enquiry),
    sendWebhook(enquiry),
  ]);

  // Acknowledge the enquirer only once the lead itself is safely delivered, and
  // never let a failed acknowledgement turn a delivered lead into an error.
  if (results.some((r) => r.status === "fulfilled" && r.value)) {
    await sendAutoReply(enquiry).catch((error) => {
      console.error("[enquiry] auto-reply failed:", error);
    });
  }

  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  const failed = results.find(
    (r): r is PromiseRejectedResult => r.status === "rejected"
  );

  if (!delivered) {
    if (failed) {
      // Log the failure, never the enquirer's details.
      console.error("[enquiry] delivery failed:", failed.reason);
    } else {
      console.error(
        "[enquiry] no delivery channel configured - set RESEND_API_KEY or ENQUIRY_WEBHOOK_URL"
      );
    }

    return NextResponse.json(
      {
        error: `We couldn't deliver that automatically. Please reach us on WhatsApp or at ${site.contact.email} - those go straight to us.`,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

type Enquiry = Record<string, string>;

/** Returns false when unconfigured; throws when configured and failing. */
async function sendEmail(enquiry: Enquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;
  if (!apiKey || !from) return false;

  const rows = Object.entries(enquiry)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(
          key
        )}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");

  // Explicit plain-text part: Resend would otherwise derive one from the
  // table HTML, which runs every label into its value.
  const text = [
    "NEW PROJECT ENQUIRY",
    "",
    ...Object.entries(enquiry)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`),
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `[Lead] ${enquiry.projectType} - ${enquiry.name}${
        enquiry.country ? `, ${enquiry.country}` : ""
      }`,
      html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6">
  <h2 style="margin:0 0 16px">New project enquiry</h2>
  <table style="border-collapse:collapse">${rows}</table>
</div>`,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }

  return true;
}

/**
 * Short acknowledgement to the enquirer, from the same verified domain.
 * Transactional only: no marketing, no tracking links. Replies go to the
 * studio inbox. Failures are logged by the caller and never surfaced.
 */
async function sendAutoReply(enquiry: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const replyTo = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;
  if (!apiKey || !from) return;

  const firstName = enquiry.name.split(/\s+/)[0];
  const processUrl = `${site.url}/process`;
  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for getting in touch with Catalyst Labs. We have your enquiry and will reply personally within one business day (we work on IST, UTC+5:30).",
    "",
    "What happens next:",
    "1. We read your brief and may come back with a question or two.",
    "2. If there looks to be a fit, we book a short call.",
    "3. After that you receive a written scope and a fixed proposal.",
    "",
    `How an engagement runs, stage by stage: ${processUrl}`,
    "",
    "If anything is urgent, just reply to this email.",
    "",
    `${site.founder.name}`,
    `${site.name}, ${site.location.city}`,
    site.url,
  ].join("\n");

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6">${text
    .split("\n")
    .map((line) => (line ? `<p style="margin:0 0 10px">${escapeHtml(line)}</p>` : ""))
    .join("")}</div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [enquiry.email],
      reply_to: replyTo,
      subject: "We received your enquiry - Catalyst Labs",
      html,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend auto-reply responded ${response.status}`);
  }
}

/** Returns false when unconfigured; throws when configured and failing. */
async function sendWebhook(enquiry: Enquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ENQUIRY_WEBHOOK_SECRET
        ? { "X-Webhook-Secret": process.env.ENQUIRY_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({ source: "catalystlabs.website", ...enquiry }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded ${response.status}`);
  }

  return true;
}
