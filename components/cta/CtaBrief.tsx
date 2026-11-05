"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookingButton } from "@/components/ui/BookingButton";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { BRIEF_CHIPS, BRIEF_EXAMPLES } from "@/lib/cta";
import { emptyEnquiry, guessLocale, validateField, LIMITS } from "@/lib/enquiry";
import { burst } from "@/components/cta/confetti";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The call to action's primary path: a one-sentence brief that goes straight
 * to the studio inbox. Asking for a sentence and an email, not a whole form,
 * is the point - the full form on /contact stays for people who want it.
 *
 * Uses the same /api/enquiry endpoint (and so the same validation, honeypot,
 * timing check, rate limit, auto-reply and attribution) as the main form.
 */
export function CtaBrief({
  variant,
  location,
}: {
  variant: "standard" | "poster";
  location: string;
}) {
  const poster = variant === "poster";
  const reduced = usePrefersReducedMotion();

  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [chip, setChip] = useState<string>("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<{ brief?: string; name?: string; email?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceholder] = useState(`I want to build ${BRIEF_EXAMPLES[0]}`);

  const started = useRef(false);
  const mountedAt = useRef(0);
  const focused = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Typewriter placeholder: cycles real examples while the box is untouched.
  useEffect(() => {
    if (reduced || brief || focused.current) return;
    let example = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (focused.current) return;
      const target = BRIEF_EXAMPLES[example];
      char += deleting ? -1 : 1;
      setPlaceholder(`I want to build ${target.slice(0, Math.max(char, 0))}`);

      let delay = deleting ? 22 : 48;
      if (!deleting && char === target.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && char === 0) {
        deleting = false;
        example = (example + 1) % BRIEF_EXAMPLES.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [reduced, brief]);

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

    const next = {
      brief: validateField("brief", brief),
      name: validateField("name", name),
      email: validateField("email", email),
    };
    if (next.brief || next.name || next.email) {
      setErrors(next);
      track("form_error", { location, reason: "validation" });
      const first = next.brief ? "cta-brief" : next.name ? "cta-name" : "cta-email";
      document.getElementById(first)?.focus();
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
      projectType: chip || "Not sure yet",
      brief: brief.trim(),
      notes: `Quick brief from the call-to-action band (${window.location.pathname}).`,
      currency: locale.currency,
      country: locale.country,
      timezone,
      ...attribution,
      source: attribution.source || `cta-band${location ? `-${location}` : ""}`,
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
        if (poster && submitRef.current) burst(submitRef.current);
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(
        data.error ?? "We couldn't send that just now. Please use WhatsApp or email instead."
      );
      track("form_error", { location, reason: `http_${res.status}` });
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection, or use WhatsApp or email.");
      track("form_error", { location, reason: "network" });
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "cta-panel cta-success p-6 sm:p-7",
          poster ? "comic-panel" : "border border-line-ember bg-ember/[0.05]"
        )}
      >
        <span
          aria-hidden="true"
          className="cta-check flex h-11 w-11 items-center justify-center border-2 border-ember text-ember"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M4 12.5l5.5 5.5L20 7" pathLength={1} className="cta-check-path" />
          </svg>
        </span>
        <h3 className="mt-5 text-h3 text-paper">Got it. Thank you.</h3>
        <p className="mt-2 max-w-md text-body text-mute">
          A person reads every brief. Expect a reply within one working day, and a short
          confirmation email is on its way to {email.trim()}.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <BookingButton location="cta_success" variant="primary" size="md" />
          <Link
            href="/contact"
            className="text-small text-paper underline underline-offset-4 hover:text-ember"
          >
            Add more detail
          </Link>
        </div>
      </div>
    );
  }

  const field =
    "w-full border bg-ink px-4 py-3 text-paper placeholder:text-mute-deep transition-colors duration-(--cta-dur) hover:border-line-strong focus:border-ember focus:outline-none";

  const form = (
    <form onSubmit={onSubmit} noValidate aria-label="Quick project brief" className="grid gap-4">
      <div>
        <label htmlFor="cta-brief" className="label text-mute">
          What are you trying to build, automate or improve?
        </label>
        <textarea
          id="cta-brief"
          rows={3}
          value={brief}
          maxLength={LIMITS.brief}
          placeholder={placeholder}
          aria-invalid={Boolean(errors.brief)}
          aria-describedby={errors.brief ? "cta-brief-error" : undefined}
          onFocus={() => {
            focused.current = true;
            begin();
          }}
          onChange={(e) => {
            setBrief(e.target.value);
            if (errors.brief) setErrors((x) => ({ ...x, brief: validateField("brief", e.target.value) }));
          }}
          className={cn(field, "mt-2 resize-y", errors.brief ? "border-warn/60" : "border-line")}
        />
        {errors.brief ? (
          <p id="cta-brief-error" className="mt-1.5 text-[0.8125rem] text-warn">
            {errors.brief}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="label text-mute">Closest match (optional)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {BRIEF_CHIPS.map((option) => {
            const on = chip === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  begin();
                  setChip(on ? "" : option);
                  if (!on) track("cta_chip_select", { location, option });
                }}
                className={cn("cta-chip", on && "is-on")}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta-name" className="label text-mute">
            Name
          </label>
          <input
            id="cta-name"
            value={name}
            autoComplete="name"
            maxLength={LIMITS.name}
            aria-invalid={Boolean(errors.name)}
            onFocus={begin}
            onChange={(e) => setName(e.target.value)}
            className={cn(field, "mt-2", errors.name ? "border-warn/60" : "border-line")}
          />
          {errors.name ? <p className="mt-1.5 text-[0.8125rem] text-warn">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="cta-email" className="label text-mute">
            Email
          </label>
          <input
            id="cta-email"
            type="email"
            inputMode="email"
            value={email}
            autoComplete="email"
            maxLength={LIMITS.email}
            aria-invalid={Boolean(errors.email)}
            onFocus={begin}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(field, "mt-2", errors.email ? "border-warn/60" : "border-line")}
          />
          {errors.email ? <p className="mt-1.5 text-[0.8125rem] text-warn">{errors.email}</p> : null}
        </div>
      </div>

      {/* Honeypot: hidden from sight, assistive tech and the tab order. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="cta-website">Website (leave blank)</label>
        <input
          id="cta-website"
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          ref={submitRef}
          type="submit"
          size="lg"
          arrow
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? "Sending" : "Send my brief"}
        </Button>
        <p className="text-[0.8125rem] leading-snug text-mute-deep">
          No obligation. Reply within one working day. NDA on request.{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-paper">
            Privacy
          </Link>
        </p>
      </div>
    </form>
  );

  if (poster) {
    return (
      <div className="comic-panel overflow-hidden">
        <div data-surface="ink" className="p-5 sm:p-7">
          {form}
        </div>
      </div>
    );
  }
  return <div className="cta-panel border border-line bg-ink-raised/40 p-5 sm:p-7">{form}</div>;
}
