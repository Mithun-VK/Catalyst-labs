"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookingButton } from "@/components/ui/BookingButton";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { emptyEnquiry, guessLocale, validateField, LIMITS } from "@/lib/enquiry";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = { url?: string; name?: string; email?: string; phone?: string };

/**
 * Free-audit request for campaign landing pages (/linkedin).
 *
 * Deliberately short: a website, a name and a way to reply. It posts to the
 * same /api/enquiry endpoint as every other form, so validation, honeypot,
 * timing check, rate limit, auto-reply and attribution all apply, and the
 * lead lands in the inbox as "[Lead] Free audit - Name".
 */
export function AuditForm({ location, turnaround }: { location: string; turnaround: string }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const started = useRef(false);
  const mountedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const begin = () => {
    if (!started.current) {
      started.current = true;
      track("form_started", { location });
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const site = url.trim();
    const next: Errors = {
      url: !site
        ? "Add your website, or write \"no website yet\"."
        : site.length > LIMITS.currentProduct
          ? "That address is too long."
          : undefined,
      name: validateField("name", name),
      email: validateField("email", email),
      phone: validateField("phone", phone),
    };
    const first = (["url", "name", "email", "phone"] as const).find((k) => next[k]);
    if (first) {
      setErrors(next);
      track("form_error", { location, reason: "validation" });
      document.getElementById(`audit-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");

    let timezone = "";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    } catch {
      // Leave blank.
    }
    const locale = guessLocale(timezone);
    const attribution = readAttribution();

    const payload = {
      ...emptyEnquiry(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      projectType: "Free audit",
      currentProduct: site,
      brief: `Free audit request for ${site}.${problem.trim() ? `\n\nWhat they want looked at: ${problem.trim()}` : ""}`,
      notes: `Free audit offer (${window.location.pathname}). Promised turnaround: ${turnaround}.`,
      contactMethod: phone.trim() ? "WhatsApp" : "Email",
      currency: locale.currency,
      country: locale.country,
      timezone,
      ...attribution,
      source: attribution.source || location,
      website: trap,
      elapsedMs: Date.now() - mountedAt.current,
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        track("form_submitted", { location, projectType: payload.projectType });
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(data.error ?? "We couldn't send that just now. Please use WhatsApp instead.");
      track("form_error", { location, reason: `http_${res.status}` });
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection, or use WhatsApp instead.");
      track("form_error", { location, reason: "network" });
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-line-ember bg-ember/[0.05] p-6 sm:p-7"
      >
        <h3 className="text-h3 text-paper">Request received. Thank you.</h3>
        <p className="mt-2 text-body text-mute">
          Your audit arrives within {turnaround} at {email.trim()}. A confirmation email is on
          its way now.
        </p>
        <div className="mt-5">
          <BookingButton location={`${location}_success`} variant="primary" size="md" />
        </div>
      </div>
    );
  }

  const field =
    "mt-2 w-full border bg-ink px-4 py-3 text-paper placeholder:text-mute-deep transition-colors duration-(--duration-base) hover:border-line-strong focus:border-ember focus:outline-none";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`audit-${k}-error`} className="mt-1.5 text-[0.8125rem] text-warn">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Errors) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `audit-${k}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Request a free audit" className="grid gap-4">
      <div>
        <label htmlFor="audit-url" className="label text-mute">
          Your website
        </label>
        <input
          id="audit-url"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbrand.in"
          value={url}
          maxLength={LIMITS.currentProduct}
          onFocus={begin}
          onChange={(e) => setUrl(e.target.value)}
          className={cn(field, errors.url ? "border-warn/60" : "border-line")}
          {...a11y("url")}
        />
        {err("url")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-name" className="label text-mute">
            Name
          </label>
          <input
            id="audit-name"
            autoComplete="name"
            value={name}
            maxLength={LIMITS.name}
            onFocus={begin}
            onChange={(e) => setName(e.target.value)}
            className={cn(field, errors.name ? "border-warn/60" : "border-line")}
            {...a11y("name")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="audit-email" className="label text-mute">
            Email
          </label>
          <input
            id="audit-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            maxLength={LIMITS.email}
            onFocus={begin}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(field, errors.email ? "border-warn/60" : "border-line")}
            {...a11y("email")}
          />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="audit-phone" className="label text-mute">
          WhatsApp number (optional)
        </label>
        <input
          id="audit-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91"
          value={phone}
          maxLength={LIMITS.phone}
          onFocus={begin}
          onChange={(e) => setPhone(e.target.value)}
          className={cn(field, errors.phone ? "border-warn/60" : "border-line")}
          {...a11y("phone")}
        />
        {err("phone")}
      </div>

      <div>
        <label htmlFor="audit-problem" className="label text-mute">
          Anything specific to look at? (optional)
        </label>
        <textarea
          id="audit-problem"
          rows={2}
          value={problem}
          maxLength={600}
          placeholder="Few enquiries, slow on mobile, not on Google, too much manual work..."
          onFocus={begin}
          onChange={(e) => setProblem(e.target.value)}
          className={cn(field, "resize-y border-line")}
        />
      </div>

      {/* Honeypot: hidden from sight, assistive tech and the tab order. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="audit-website">Website (leave blank)</label>
        <input
          id="audit-website"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="border border-warn/40 bg-warn/[0.06] px-4 py-3 text-small text-paper">
          {message}
        </p>
      ) : null}

      <Button type="submit" size="lg" arrow disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? "Sending" : "Get my free audit"}
      </Button>
      <p className="text-[0.8125rem] leading-snug text-mute-deep">
        Free, no obligation, no logins needed: we only look at what is public.{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-paper">
          Privacy
        </Link>
      </p>
    </form>
  );
}
