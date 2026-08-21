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

  const enquiry = {
    name: String(body.name).trim(),
    company: String(body.company ?? "").trim(),
    email: String(body.email).trim(),
    phone: String(body.phone ?? "").trim(),
    projectType: String(body.projectType).trim(),
    budget: String(body.budget ?? "").trim(),
    timeline: String(body.timeline ?? "").trim(),
    brief: String(body.brief).trim(),
    currentProduct: String(body.currentProduct ?? "").trim(),
    notes: String(body.notes ?? "").trim(),
    receivedAt: new Date().toISOString(),
  };

  const results = await Promise.allSettled([
    sendEmail(enquiry),
    sendWebhook(enquiry),
  ]);

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
      subject: `Enquiry - ${enquiry.name}${
        enquiry.company ? ` (${enquiry.company})` : ""
      } · ${enquiry.projectType}`,
      html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6">
  <h2 style="margin:0 0 16px">New project enquiry</h2>
  <table style="border-collapse:collapse">${rows}</table>
</div>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }

  return true;
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
